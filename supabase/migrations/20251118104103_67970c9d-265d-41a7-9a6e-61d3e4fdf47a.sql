-- Fix the handle_new_user function to insert correct values
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_seed TEXT;
  v_hash TEXT;
  v_address TEXT;
  v_timestamp BIGINT;
  v_sig_message TEXT;
  v_signature TEXT;
  v_username TEXT;
BEGIN
  -- Generate deterministic blockchain address
  v_seed := 'CTF_PLATFORM_' || NEW.id::TEXT || '_' || COALESCE(NEW.email, '') || '_IDENTITY';
  v_hash := encode(extensions.digest(convert_to(v_seed, 'UTF8'), 'sha256'), 'hex');
  v_address := '0x' || substring(v_hash from 25 for 40);

  -- Generate blockchain signature
  v_timestamp := extract(epoch from now())::BIGINT;
  v_sig_message := 'CTF Identity Verification' || E'\n' ||
                   'User: ' || NEW.id::TEXT || E'\n' ||
                   'Address: ' || v_address || E'\n' ||
                   'Timestamp: ' || v_timestamp::TEXT;
  v_signature := encode(extensions.digest(convert_to(v_sig_message, 'UTF8'), 'sha256'), 'hex');

  -- Generate username from metadata or default
  v_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'name',
    'user_' || substring(NEW.id::text from 1 for 8)
  );

  -- Insert profile with all required fields (10 columns, 10 values)
  INSERT INTO public.profiles (
    id,
    username,
    email,
    blockchain_address,
    blockchain_signature,
    blockchain_verified,
    is_admin,
    is_banned,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    v_username,
    NEW.email,
    v_address,
    v_signature,
    true,
    false,
    false,
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = now();

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in handle_new_user: % %', SQLERRM, SQLSTATE;
    RETURN NEW;
END;
$function$;

-- Now manually create profiles for existing users who don't have them
INSERT INTO public.profiles (
  id, username, email, blockchain_address, blockchain_signature, 
  blockchain_verified, is_admin, is_banned, created_at, updated_at
)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data->>'username', 'user_' || substring(u.id::text from 1 for 8)),
  u.email,
  '0x' || substring(encode(extensions.digest(convert_to('CTF_PLATFORM_' || u.id::TEXT || '_' || COALESCE(u.email, '') || '_IDENTITY', 'UTF8'), 'sha256'), 'hex') from 25 for 40),
  encode(extensions.digest(convert_to('CTF Identity Verification', 'UTF8'), 'sha256'), 'hex'),
  true,
  false,
  false,
  u.created_at,
  now()
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;