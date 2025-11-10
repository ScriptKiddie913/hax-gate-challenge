-- Fix admin_set_flag to use SHA256 instead of bcrypt
CREATE OR REPLACE FUNCTION public.admin_set_flag(p_challenge_id uuid, p_flag text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_salt text;
  v_hash text;
BEGIN
  -- Only admins can set flags
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  -- Validate flag
  IF p_flag IS NULL OR btrim(p_flag) = '' THEN
    RAISE EXCEPTION 'Flag cannot be empty';
  END IF;

  -- Generate random salt using challenge_id and timestamp
  v_salt := encode(digest(p_challenge_id::text || extract(epoch from now())::text || random()::text, 'sha256'), 'hex');
  
  -- Hash the flag with SHA256
  v_hash := encode(digest(v_salt || btrim(p_flag) || v_salt, 'sha256'), 'hex');

  -- Insert or update hashed flag
  INSERT INTO public.H36GtndUU776H (challenge_id, flag_hash, salt, updated_at)
  VALUES (p_challenge_id, v_hash, v_salt, now())
  ON CONFLICT (challenge_id) 
  DO UPDATE SET 
    flag_hash = v_hash,
    salt = v_salt,
    updated_at = now();
END;
$function$;