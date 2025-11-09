-- Ensure crypt functions are available
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Clean up duplicate flags (keep latest per challenge)
WITH ranked AS (
  SELECT id, challenge_id,
         ROW_NUMBER() OVER (PARTITION BY challenge_id ORDER BY created_at DESC, id DESC) AS rn
  FROM public.flags
)
DELETE FROM public.flags f
USING ranked r
WHERE f.id = r.id AND r.rn > 1;

-- Enforce 1:1 between challenges and flags
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'flags_challenge_unique'
  ) THEN
    ALTER TABLE public.flags
    ADD CONSTRAINT flags_challenge_unique UNIQUE (challenge_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'flags_challenge_fk'
  ) THEN
    ALTER TABLE public.flags
    ADD CONSTRAINT flags_challenge_fk
    FOREIGN KEY (challenge_id)
    REFERENCES public.challenges(id)
    ON DELETE CASCADE;
  END IF;
END $$;

-- Trigger function to sync plaintext challenge.flag into hashed flags table
CREATE OR REPLACE FUNCTION public.sync_flag_on_challenges()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.flag IS NOT NULL AND btrim(NEW.flag) <> '' THEN
    INSERT INTO public.flags AS fl (challenge_id, hash, created_at)
    VALUES (COALESCE(NEW.id, OLD.id), crypt(NEW.flag, gen_salt('bf')), now())
    ON CONFLICT (challenge_id) DO UPDATE
      SET hash = EXCLUDED.hash,
          created_at = now();
    -- Remove plaintext from challenges to avoid leaks
    NEW.flag := NULL;
  END IF;
  RETURN NEW;
END;
$$;

-- Create/replace trigger on challenges for INSERT/UPDATE of flag
DROP TRIGGER IF EXISTS trg_sync_flag_on_challenges ON public.challenges;
CREATE TRIGGER trg_sync_flag_on_challenges
BEFORE INSERT OR UPDATE OF flag ON public.challenges
FOR EACH ROW
EXECUTE FUNCTION public.sync_flag_on_challenges();

-- Backfill: hash any existing plaintext flags and clear the column
INSERT INTO public.flags (challenge_id, hash, created_at)
SELECT c.id, crypt(c.flag, gen_salt('bf')), now()
FROM public.challenges c
LEFT JOIN public.flags f ON f.challenge_id = c.id
WHERE c.flag IS NOT NULL AND btrim(c.flag) <> '' AND f.challenge_id IS NULL
ON CONFLICT (challenge_id) DO UPDATE
  SET hash = EXCLUDED.hash,
      created_at = now();

UPDATE public.challenges
SET flag = NULL
WHERE flag IS NOT NULL AND btrim(flag) <> '';

-- Small helpful index to speed up submit checks
CREATE INDEX IF NOT EXISTS idx_submissions_user_challenge_result
  ON public.submissions (user_id, challenge_id, result);
