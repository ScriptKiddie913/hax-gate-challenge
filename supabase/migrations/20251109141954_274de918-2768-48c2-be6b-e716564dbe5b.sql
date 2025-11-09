-- Drop all the complex hashing infrastructure
DROP TRIGGER IF EXISTS trg_sync_flag_on_challenges ON public.challenges;
DROP FUNCTION IF EXISTS public.sync_flag_on_challenges();
DROP FUNCTION IF EXISTS public.set_flag(uuid, text);
DROP FUNCTION IF EXISTS public.secure_set_flag(uuid, text);
DROP FUNCTION IF EXISTS public.verify_flag(uuid, text);

-- Drop the flags table entirely
DROP TABLE IF EXISTS public.flags CASCADE;

-- Recreate submit_flag to verify plaintext directly from challenges.flag
CREATE OR REPLACE FUNCTION public.submit_flag(challenge_id uuid, submitted_flag text)
RETURNS TABLE(result text, points integer, message text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid := auth.uid();
  v_points integer;
  v_flag text;
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
  SELECT c.points, c.is_published, c.flag
  INTO v_points, v_is_published, v_flag
  FROM public.challenges AS c
  WHERE c.id = submit_flag.challenge_id;

  IF v_points IS NULL OR v_is_published IS DISTINCT FROM true THEN
    RAISE EXCEPTION 'Challenge not found or not published';
  END IF;

  IF v_flag IS NULL OR btrim(v_flag) = '' THEN
    RAISE EXCEPTION 'Flag configuration error';
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

  -- Simple plaintext comparison
  v_correct := (btrim(v_flag) = btrim(submitted_flag));

  -- Record submission
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
$$;