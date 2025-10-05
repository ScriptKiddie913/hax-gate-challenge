-- Ensure pgcrypto is available
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Freshly (re)create handle_new_user trigger function and trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_seed TEXT;
  v_hash TEXT;
  v_address TEXT;
  v_timestamp BIGINT;
  v_sig_message TEXT;
  v_signature TEXT;
BEGIN
  v_seed := 'CTF_PLATFORM_' || NEW.id::TEXT || '_' || COALESCE(NEW.email, '') || '_IDENTITY';
  v_hash := encode(digest(v_seed, 'sha256'), 'hex');
  v_address := '0x' || substring(v_hash from 25 for 40);

  v_timestamp := extract(epoch from now())::BIGINT;
  v_sig_message := 'CTF Identity Verification' || E'\n' || 
                   'User: ' || NEW.id::TEXT || E'\n' ||
                   'Address: ' || v_address || E'\n' ||
                   'Timestamp: ' || v_timestamp::TEXT;
  v_signature := encode(digest(v_sig_message, 'sha256'), 'hex');

  INSERT INTO public.profiles (id, username, email, blockchain_address, blockchain_signature, blockchain_verified)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substring(NEW.id::text from 1 for 8)),
    NEW.email,
    v_address,
    v_signature,
    true
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in handle_new_user: % %', SQLERRM, SQLSTATE;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Replace Edge Functions with secure Postgres RPCs
DROP FUNCTION IF EXISTS public.set_flag(uuid, text);
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
    SET hash = crypt(flag, gen_salt('bf')),
        created_at = now()
    WHERE challenge_id = set_flag.challenge_id;
  ELSE
    INSERT INTO public.flags (challenge_id, hash)
    VALUES (set_flag.challenge_id, crypt(flag, gen_salt('bf')));
  END IF;

  -- Audit
  INSERT INTO public.audit_logs (actor_id, action, meta)
  VALUES (auth.uid(), 'SET_FLAG', jsonb_build_object('challenge_id', challenge_id));
END;
$$;

DROP FUNCTION IF EXISTS public.submit_flag(uuid, text);
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
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = v_user AND is_banned = true) THEN
    RAISE EXCEPTION 'Your account has been banned';
  END IF;

  SELECT points, is_published
  INTO v_points, v_is_published
  FROM public.challenges
  WHERE id = submit_flag.challenge_id;

  IF v_points IS NULL OR v_is_published IS DISTINCT FROM true THEN
    RAISE EXCEPTION 'Challenge not found or not published';
  END IF;

  SELECT TRUE INTO v_already
  FROM public.submissions
  WHERE user_id = v_user AND challenge_id = submit_flag.challenge_id AND result = 'CORRECT'
  LIMIT 1;

  IF COALESCE(v_already, false) THEN
    result := 'LOCKED'; points := 0; message := 'You have already solved this challenge';
    RETURN NEXT;
    RETURN;
  END IF;

  SELECT hash INTO v_hash
  FROM public.flags
  WHERE challenge_id = submit_flag.challenge_id;

  IF v_hash IS NULL THEN
    RAISE EXCEPTION 'Flag configuration error';
  END IF;

  v_correct := (v_hash = crypt(submitted_flag, v_hash));

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