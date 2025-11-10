-- Create admin helper function to check if flag exists for a challenge
CREATE OR REPLACE FUNCTION public.admin_has_flag(p_challenge_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_exists boolean;
BEGIN
  -- Only admins can check
  IF NOT has_role(auth.uid(), 'admin') THEN
    RETURN false;
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.H36GtndUU776H
    WHERE challenge_id = p_challenge_id
  ) INTO v_exists;

  RETURN COALESCE(v_exists, false);
END;
$function$;