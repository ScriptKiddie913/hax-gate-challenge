-- Ensure pgcrypto is installed and available
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Recreate sync trigger function with fully-qualified pgcrypto calls
CREATE OR REPLACE FUNCTION public.sync_flag_on_challenges()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.flag IS NOT NULL AND btrim(NEW.flag) <> '' THEN
    INSERT INTO public.flags AS fl (challenge_id, hash, created_at)
    VALUES (COALESCE(NEW.id, OLD.id), public.crypt(NEW.flag, public.gen_salt('bf'::text)), now())
    ON CONFLICT (challenge_id) DO UPDATE
      SET hash = EXCLUDED.hash,
          created_at = now();
    -- Remove plaintext from challenges to avoid leaks
    NEW.flag := NULL;
  END IF;
  RETURN NEW;
END;
$$;

-- Recreate set_flag with qualified pgcrypto
CREATE OR REPLACE FUNCTION public.set_flag(challenge_id uuid, flag text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;

  IF challenge_id IS NULL OR flag IS NULL OR length(flag) = 0 THEN
    RAISE EXCEPTION 'Missing required fields';
  END IF;

  -- Ensure challenge exists
  PERFORM 1 FROM public.challenges WHERE id = set_flag.challenge_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Challenge not found';
  END IF;

  -- Upsert bcrypt-hashed flag (server-side)
  IF EXISTS (SELECT 1 FROM public.flags WHERE challenge_id = set_flag.challenge_id) THEN
    UPDATE public.flags
    SET hash = public.crypt(flag, public.gen_salt('bf'::text)),
        created_at = now()
    WHERE challenge_id = set_flag.challenge_id;
  ELSE
    INSERT INTO public.flags (challenge_id, hash)
    VALUES (set_flag.challenge_id, public.crypt(flag, public.gen_salt('bf'::text)));
  END IF;

  -- Audit
  INSERT INTO public.audit_logs (actor_id, action, meta)
  VALUES (auth.uid(), 'SET_FLAG', jsonb_build_object('challenge_id', challenge_id));
END;
$$;

-- Recreate secure_set_flag with qualified pgcrypto
CREATE OR REPLACE FUNCTION public.secure_set_flag(challenge_id uuid, flag text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  hashed_flag text;
BEGIN
  hashed_flag := public.crypt(flag, public.gen_salt('bf'::text));
  IF EXISTS (SELECT 1 FROM public.flags WHERE challenge_id = secure_set_flag.challenge_id) THEN
    UPDATE public.flags
    SET hash = hashed_flag, created_at = now()
    WHERE challenge_id = secure_set_flag.challenge_id;
  ELSE
    INSERT INTO public.flags (challenge_id, hash)
    VALUES (secure_set_flag.challenge_id, hashed_flag);
  END IF;
END;
$$;

-- Recreate verify_flag with qualified pgcrypto
CREATE OR REPLACE FUNCTION public.verify_flag(challenge_id uuid, submitted text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  stored_hash text;
BEGIN
  SELECT hash INTO stored_hash FROM public.flags WHERE challenge_id = verify_flag.challenge_id;
  IF stored_hash IS NULL THEN
    RETURN false;
  END IF;
  RETURN stored_hash = public.crypt(submitted, stored_hash);
END;
$$;

-- Recreate submit_flag to qualify pgcrypto as well (no logic changes)
CREATE OR REPLACE FUNCTION public.submit_flag(challenge_id uuid, submitted_flag text)
RETURNS TABLE(result text, points integer, message text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid := auth.uid();
  v_points integer;
  v_hash text;
  v_is_published boolean;
  v_already boolean;
  v_correct boolean;
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Banned check
  IF EXISTS (SELECT 1 FROM public.profiles AS p WHERE p.id = v_user AND p.is_banned = true) THEN
    RAISE EXCEPTION 'Your account has been banned';
  END IF;

  -- Qualify columns to avoid ambiguity with OUT param "points"
  SELECT c.points, c.is_published
  INTO v_points, v_is_published
  FROM public.challenges AS c
  WHERE c.id = submit_flag.challenge_id;

  IF v_points IS NULL OR v_is_published IS DISTINCT FROM true THEN
    RAISE EXCEPTION 'Challenge not found or not published';
  END IF;

  SELECT TRUE INTO v_already
  FROM public.submissions AS s
  WHERE s.user_id = v_user AND s.challenge_id = submit_flag.challenge_id AND s.result = 'CORRECT'
  LIMIT 1;

  IF COALESCE(v_already, false) THEN
    result := 'LOCKED'; points := 0; message := 'You have already solved this challenge';
    RETURN NEXT;
    RETURN;
  END IF;

  SELECT f.hash INTO v_hash
  FROM public.flags AS f
  WHERE f.challenge_id = submit_flag.challenge_id;

  IF v_hash IS NULL THEN
    RAISE EXCEPTION 'Flag configuration error';
  END IF;

  v_correct := (v_hash = public.crypt(submitted_flag, v_hash));

  INSERT INTO public.submissions (user_id, challenge_id, result, submitted_flag)
  VALUES (
    v_user,
    submit_flag.challenge_id,
    CASE WHEN v_correct THEN 'CORRECT' ELSE 'INCORRECT' END,
    left(submitted_flag, 50)
  );

  result := CASE WHEN v_correct THEN 'CORRECT' ELSE 'INCORRECT' END;
  points := CASE WHEN v_correct THEN v_points ELSE 0 END;
  message := CASE WHEN v_correct THEN format('Congratulations! You earned %s points!', v_points) ELSE 'Incorrect flag. Try again!' END;
  RETURN NEXT;
END;
$$;