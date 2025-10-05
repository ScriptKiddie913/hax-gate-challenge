-- Add plaintext flag column directly on challenges (per user request)
ALTER TABLE public.challenges
ADD COLUMN IF NOT EXISTS flag TEXT;