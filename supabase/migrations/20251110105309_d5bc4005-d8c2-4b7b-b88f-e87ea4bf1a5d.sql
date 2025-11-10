-- CRITICAL SECURITY FIX: Move flags to separate hashed table
-- Enable pgcrypto for bcrypt hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create secure flags table with strong hashing
CREATE TABLE IF NOT EXISTS public.H36GtndUU776H (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid NOT NULL UNIQUE REFERENCES public.challenges(id) ON DELETE CASCADE,
  flag_hash text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on flags table
ALTER TABLE public.H36GtndUU776H ENABLE ROW LEVEL SECURITY;

-- Only service role can access this table (no client access ever)
CREATE POLICY "service_role_only" ON public.H36GtndUU776H
  FOR ALL
  USING (false)
  WITH CHECK (false);

-- Migrate existing flags to hashed table (bcrypt with cost 12)
INSERT INTO public.H36GtndUU776H (challenge_id, flag_hash)
SELECT 
  id, 
  crypt(COALESCE(flag, ''), gen_salt('bf', 12))
FROM public.challenges
WHERE flag IS NOT NULL AND flag != ''
ON CONFLICT (challenge_id) DO NOTHING;

-- Update submit_flag function to use bcrypt comparison
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

  -- Get challenge data
  SELECT c.points, c.is_published
  INTO v_points, v_is_published
  FROM public.challenges AS c
  WHERE c.id = submit_flag.challenge_id;

  IF v_points IS NULL OR v_is_published IS DISTINCT FROM true THEN
    RAISE EXCEPTION 'Challenge not found or not published';
  END IF;

  -- Get hashed flag from secure table
  SELECT flag_hash INTO v_flag_hash
  FROM public.H36GtndUU776H
  WHERE H36GtndUU776H.challenge_id = submit_flag.challenge_id;

  -- Graceful handling when flag is not configured
  IF v_flag_hash IS NULL OR btrim(v_flag_hash) = '' THEN
    result := 'LOCKED';
    points := 0;
    message := 'Challenge flag not configured yet';
    RETURN NEXT;
    RETURN;
  END IF;

  -- Check if already solved
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

  -- Secure bcrypt comparison (constant-time, resistant to timing attacks)
  v_correct := (v_flag_hash = crypt(btrim(submitted_flag), v_flag_hash));

  -- Record submission (truncate submitted flag for security)
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

-- Create admin function to set/update flags securely
CREATE OR REPLACE FUNCTION public.admin_set_flag(p_challenge_id uuid, p_flag text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Only admins can set flags
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  -- Validate flag
  IF p_flag IS NULL OR btrim(p_flag) = '' THEN
    RAISE EXCEPTION 'Flag cannot be empty';
  END IF;

  -- Insert or update hashed flag
  INSERT INTO public.H36GtndUU776H (challenge_id, flag_hash, updated_at)
  VALUES (p_challenge_id, crypt(btrim(p_flag), gen_salt('bf', 12)), now())
  ON CONFLICT (challenge_id) 
  DO UPDATE SET 
    flag_hash = crypt(btrim(p_flag), gen_salt('bf', 12)),
    updated_at = now();
END;
$function$;

-- Drop flag column from challenges table for security
ALTER TABLE public.challenges DROP COLUMN IF EXISTS flag;

-- Update RLS policies to ensure challenges table never exposes flags
DROP POLICY IF EXISTS "Anyone can read published challenges during CTF" ON public.challenges;

CREATE POLICY "Users can read published challenges during CTF" ON public.challenges
  FOR SELECT
  USING ((is_published = true) AND (has_role(auth.uid(), 'admin'::app_role) OR is_ctf_active()));