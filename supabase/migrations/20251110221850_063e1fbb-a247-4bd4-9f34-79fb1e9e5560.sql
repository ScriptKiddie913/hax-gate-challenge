-- Ensure pgcrypto is available (Supabase installs extensions in the "extensions" schema)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1) Admin sets/updates a challenge flag with a strong random salt and SHA-256 hash
CREATE OR REPLACE FUNCTION public.admin_set_flag(p_challenge_id uuid, p_flag text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_salt text;
  v_hash text;
BEGIN
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  IF p_flag IS NULL OR btrim(p_flag) = '' THEN
    RAISE EXCEPTION 'Flag cannot be empty';
  END IF;

  -- Use cryptographically secure salt (16 bytes, hex encoded)
  v_salt := encode(extensions.gen_random_bytes(16), 'hex');

  -- Hash = SHA256( salt || trimmed_flag || salt ) as hex
  v_hash := encode(
    extensions.digest(
      convert_to(v_salt || btrim(p_flag) || v_salt, 'UTF8'),
      'sha256'
    ),
    'hex'
  );

  INSERT INTO public.h36gtnduu776h (challenge_id, flag_hash, salt, updated_at)
  VALUES (p_challenge_id, v_hash, v_salt, now())
  ON CONFLICT (challenge_id)
  DO UPDATE SET
    flag_hash = EXCLUDED.flag_hash,
    salt = EXCLUDED.salt,
    updated_at = now();
END;
$function$;

-- 2) Check if a challenge has a flag (admin only)
CREATE OR REPLACE FUNCTION public.admin_has_flag(p_challenge_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_exists boolean;
BEGIN
  IF NOT has_role(auth.uid(), 'admin') THEN
    RETURN false;
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.h36gtnduu776h
    WHERE challenge_id = p_challenge_id
  ) INTO v_exists;

  RETURN COALESCE(v_exists, false);
END;
$function$;

-- 3) User submits flag: validate against stored salted hash and record submission
CREATE OR REPLACE FUNCTION public.submit_flag(challenge_id uuid, submitted_flag text)
RETURNS TABLE(result text, points integer, message text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_user uuid := auth.uid();
  v_points integer;
  v_flag_hash text;
  v_salt text;
  v_is_published boolean;
  v_already boolean;
  v_correct boolean;
  v_submitted_hash text;
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  IF EXISTS (SELECT 1 FROM public.profiles AS p WHERE p.id = v_user AND p.is_banned = true) THEN
    RAISE EXCEPTION 'Your account has been banned';
  END IF;

  SELECT c.points, c.is_published
  INTO v_points, v_is_published
  FROM public.challenges AS c
  WHERE c.id = submit_flag.challenge_id;

  IF v_points IS NULL OR v_is_published IS DISTINCT FROM true THEN
    RAISE EXCEPTION 'Challenge not found or not published';
  END IF;

  SELECT flag_hash, salt
  INTO v_flag_hash, v_salt
  FROM public.h36gtnduu776h
  WHERE h36gtnduu776h.challenge_id = submit_flag.challenge_id;

  IF v_flag_hash IS NULL OR v_salt IS NULL THEN
    result := 'LOCKED';
    points := 0;
    message := 'Challenge flag not configured yet';
    RETURN NEXT;
    RETURN;
  END IF;

  -- Prevent duplicate solves
  SELECT TRUE INTO v_already
  FROM public.submissions AS s
  WHERE s.user_id = v_user AND s.challenge_id = submit_flag.challenge_id AND s.result = 'CORRECT'
  LIMIT 1;

  IF COALESCE(v_already, false) THEN
    result := 'LOCKED';
    points := 0;
    message := 'You have already solved this challenge';
    RETURN NEXT;
    RETURN;
  END IF;

  -- Compute submitted hash using the stored salt
  v_submitted_hash := encode(
    extensions.digest(
      convert_to(v_salt || btrim(submitted_flag) || v_salt, 'UTF8'),
      'sha256'
    ),
    'hex'
  );
  v_correct := (v_flag_hash = v_submitted_hash);

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
$function$;

-- 4) New user bootstrap: deterministic address + signatures using extensions.digest
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_seed TEXT;
  v_hash TEXT;
  v_address TEXT;
  v_timestamp BIGINT;
  v_sig_message TEXT;
  v_signature TEXT;
  v_username TEXT;
BEGIN
  -- Generate deterministic blockchain address
  v_seed := 'CTF_PLATFORM_' || NEW.id::TEXT || '_' || COALESCE(NEW.email, '') || '_IDENTITY';
  v_hash := encode(extensions.digest(convert_to(v_seed, 'UTF8'), 'sha256'), 'hex');
  v_address := '0x' || substring(v_hash from 25 for 40);

  -- Generate blockchain signature
  v_timestamp := extract(epoch from now())::BIGINT;
  v_sig_message := 'CTF Identity Verification' || E'\n' ||
                   'User: ' || NEW.id::TEXT || E'\n' ||
                   'Address: ' || v_address || E'\n' ||
                   'Timestamp: ' || v_timestamp::TEXT;
  v_signature := encode(extensions.digest(convert_to(v_sig_message, 'UTF8'), 'sha256'), 'hex');

  -- Generate username from metadata or default
  v_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'name',
    'user_' || substring(NEW.id::text from 1 for 8)
  );

  -- Insert profile with all required fields
  INSERT INTO public.profiles (
    id,
    username,
    email,
    blockchain_address,
    blockchain_signature,
    blockchain_verified,
    is_admin,
    is_banned,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    v_username,
    NEW.email,
    v_address,
    v_signature,
    true,
    false,
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = now();

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in handle_new_user: % %', SQLERRM, SQLSTATE;
    RETURN NEW;
END;
$function$;