-- Update challenge categories to SCP classifications
-- Add a check constraint to ensure only valid SCP classifications are used

-- First, update existing challenges to map old categories to new SCP classifications
-- Safe (Very Easy) = old misc or easy challenges
-- Archon (Easy) = old web challenges  
-- Keter (Medium) = old crypto, forensics challenges
-- Euclid (Hard) = old pwn, rev challenges

UPDATE public.challenges 
SET category = CASE
  WHEN category IN ('misc') THEN 'Safe'
  WHEN category IN ('web') THEN 'Archon'
  WHEN category IN ('crypto', 'forensics') THEN 'Keter'
  WHEN category IN ('pwn', 'rev') THEN 'Euclid'
  ELSE 'Safe'
END;

-- Add a comment to the category column explaining the classification system
COMMENT ON COLUMN public.challenges.category IS 'SCP Object Classification: Safe (Very Easy), Archon (Easy), Keter (Medium), Euclid (Hard)';