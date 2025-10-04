-- Fix function search path security issue
DROP FUNCTION IF EXISTS public.get_scoreboard();
CREATE OR REPLACE FUNCTION public.get_scoreboard()
RETURNS TABLE(user_id uuid, username text, total_points bigint, solved_count bigint, last_submission timestamp with time zone)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.id AS user_id,
    p.username,
    COALESCE(SUM(DISTINCT c.points), 0) AS total_points,
    COUNT(DISTINCT s.challenge_id) FILTER (WHERE s.result = 'CORRECT') AS solved_count,
    MAX(s.created_at) AS last_submission
  FROM public.profiles p
  LEFT JOIN public.submissions s ON s.user_id = p.id AND s.result = 'CORRECT'
  LEFT JOIN public.challenges c ON c.id = s.challenge_id
  WHERE p.is_banned = false
  GROUP BY p.id, p.username
  HAVING COUNT(DISTINCT s.challenge_id) FILTER (WHERE s.result = 'CORRECT') > 0
  ORDER BY total_points DESC, last_submission ASC NULLS LAST
$$;

-- Add blockchain identity to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS blockchain_address text UNIQUE,
ADD COLUMN IF NOT EXISTS blockchain_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS blockchain_signature text;

-- Create CTF settings table for timer management
CREATE TABLE IF NOT EXISTS public.ctf_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.ctf_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can manage CTF settings
CREATE POLICY "Admins can manage CTF settings" ON public.ctf_settings
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Everyone can view active CTF settings (to check if CTF is running)
CREATE POLICY "Anyone can view active CTF settings" ON public.ctf_settings
FOR SELECT USING (is_active = true);

-- Create function to check if CTF is currently running
CREATE OR REPLACE FUNCTION public.is_ctf_active()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.ctf_settings
    WHERE is_active = true
    AND now() BETWEEN start_time AND end_time
  )
$$;

-- Update challenges RLS to only show published challenges during CTF time
DROP POLICY IF EXISTS "Anyone can read published challenges" ON public.challenges;
CREATE POLICY "Anyone can read published challenges during CTF" ON public.challenges
FOR SELECT USING (
  is_published = true 
  AND (
    has_role(auth.uid(), 'admin'::app_role) 
    OR public.is_ctf_active()
  )
);

-- Admins can always see all challenges
CREATE POLICY "Admins can read all challenges during anytime" ON public.challenges
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix email exposure: Remove email from profiles SELECT policy for non-admins
DROP POLICY IF EXISTS "Users can read their own profile" ON public.profiles;
CREATE POLICY "Users can read their own profile" ON public.profiles
FOR SELECT USING (
  auth.uid() = id
);

-- Create view for public profile data (no email)
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  username,
  is_banned,
  created_at,
  blockchain_address,
  blockchain_verified
FROM public.profiles;

-- Grant access to public profiles view
GRANT SELECT ON public.public_profiles TO authenticated, anon;

-- Trigger for updated_at on ctf_settings
CREATE TRIGGER update_ctf_settings_updated_at
BEFORE UPDATE ON public.ctf_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for submissions (set replica identity)
ALTER TABLE public.submissions REPLICA IDENTITY FULL;