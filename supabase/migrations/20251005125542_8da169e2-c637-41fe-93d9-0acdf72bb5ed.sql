-- Ensure pgcrypto for crypt
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Fix linter: set search_path and align with existing flags.hash column
CREATE OR REPLACE FUNCTION public.secure_set_flag(challenge_id uuid, flag text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  hashed_flag text;
BEGIN
  -- Hash using bcrypt
  hashed_flag := crypt(flag, gen_salt('bf'));

  IF EXISTS (SELECT 1 FROM public.flags WHERE challenge_id = secure_set_flag.challenge_id) THEN
    UPDATE public.flags
    SET hash = hashed_flag,
        created_at = now()
    WHERE challenge_id = secure_set_flag.challenge_id;
  ELSE
    INSERT INTO public.flags (challenge_id, hash)
    VALUES (secure_set_flag.challenge_id, hashed_flag);
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.verify_flag(challenge_id uuid, submitted text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  stored_hash text;
BEGIN
  SELECT hash INTO stored_hash FROM public.flags WHERE challenge_id = verify_flag.challenge_id;
  IF stored_hash IS NULL THEN
    RETURN false;
  END IF;
  RETURN stored_hash = crypt(submitted, stored_hash);
END;
$function$;