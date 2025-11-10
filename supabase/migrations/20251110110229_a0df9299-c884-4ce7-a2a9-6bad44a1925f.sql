-- Drop and recreate the secure flags table with correct structure
DROP TABLE IF EXISTS public.H36GtndUU776H CASCADE;

-- Create secure flags table with SHA256 hashing
CREATE TABLE public.H36GtndUU776H (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid NOT NULL UNIQUE REFERENCES public.challenges(id) ON DELETE CASCADE,
  flag_hash text NOT NULL,
  salt text NOT NULL,
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

-- Create index for faster lookups
CREATE INDEX idx_H36GtndUU776H_challenge_id ON public.H36GtndUU776H(challenge_id);