-- ============================================
-- COMPREHENSIVE SECURITY FIX
-- ============================================

-- 1. Add explicit RLS policy to deny anonymous access to profiles
CREATE POLICY "deny_anonymous_access" ON public.profiles
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- 2. Add unique constraint on profiles.username to prevent duplicates
ALTER TABLE public.profiles ADD CONSTRAINT profiles_username_unique UNIQUE (username);

-- 3. Add CHECK constraint for username format
ALTER TABLE public.profiles ADD CONSTRAINT profiles_username_format 
  CHECK (username ~ '^[a-zA-Z0-9_-]{3,20}$');

-- 4. Add trigger to validate and normalize usernames on insert/update
CREATE OR REPLACE FUNCTION validate_username()
RETURNS TRIGGER AS $$
BEGIN
  -- Trim whitespace
  NEW.username := TRIM(NEW.username);
  
  -- Check length
  IF LENGTH(NEW.username) < 3 OR LENGTH(NEW.username) > 20 THEN
    RAISE EXCEPTION 'Username must be between 3 and 20 characters';
  END IF;
  
  -- Check format (alphanumeric, underscore, hyphen only)
  IF NEW.username !~ '^[a-zA-Z0-9_-]+$' THEN
    RAISE EXCEPTION 'Username can only contain letters, numbers, underscores, and hyphens';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_username_trigger
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION validate_username();

-- 5. Make audit_logs truly immutable
CREATE POLICY "service_only_insert" ON public.audit_logs
  FOR INSERT 
  WITH CHECK (false);

CREATE POLICY "no_updates" ON public.audit_logs
  FOR UPDATE 
  USING (false);

CREATE POLICY "no_deletes" ON public.audit_logs
  FOR DELETE 
  USING (false);

-- 6. Create a secure view for submissions that hides the submitted_flag
CREATE OR REPLACE VIEW public.user_submissions AS
SELECT 
  id,
  user_id,
  challenge_id,
  result,
  created_at,
  CASE 
    WHEN result = 'CORRECT' THEN '***REDACTED***'
    ELSE NULL
  END as submitted_flag
FROM public.submissions;

-- Grant access to the view
GRANT SELECT ON public.user_submissions TO authenticated;

-- Add RLS to the view
ALTER VIEW public.user_submissions SET (security_invoker = true);

-- 7. Update all SECURITY DEFINER functions to have proper search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_ctf_settings_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.validate_username()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.username := TRIM(NEW.username);
  IF LENGTH(NEW.username) < 3 OR LENGTH(NEW.username) > 20 THEN
    RAISE EXCEPTION 'Username must be between 3 and 20 characters';
  END IF;
  IF NEW.username !~ '^[a-zA-Z0-9_-]+$' THEN
    RAISE EXCEPTION 'Username can only contain letters, numbers, underscores, and hyphens';
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.secure_set_flag(challenge_id uuid, flag text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  hashed_flag text;
BEGIN
  hashed_flag := crypt(flag, gen_salt('bf'));
  IF EXISTS (SELECT 1 FROM public.flags WHERE challenge_id = secure_set_flag.challenge_id) THEN
    UPDATE public.flags
    SET hash = hashed_flag, created_at = now()
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
SET search_path TO 'public'
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