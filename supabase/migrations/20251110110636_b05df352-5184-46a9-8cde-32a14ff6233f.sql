-- Ensure pgcrypto is available
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Force functions to use fully-qualified digest from public schema
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

  v_submitted_hash := encode(public.digest(v_salt || btrim(submitted_flag) || v_salt, 'sha256'), 'hex');
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

  v_salt := encode(public.digest(p_challenge_id::text || extract(epoch from now())::text || random()::text, 'sha256'), 'hex');
  v_hash := encode(public.digest(v_salt || btrim(p_flag) || v_salt, 'sha256'), 'hex');

  INSERT INTO public.h36gtnduu776h (challenge_id, flag_hash, salt, updated_at)
  VALUES (p_challenge_id, v_hash, v_salt, now())
  ON CONFLICT (challenge_id) 
  DO UPDATE SET 
    flag_hash = v_hash,
    salt = v_salt,
    updated_at = now();
END;
$function$;

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