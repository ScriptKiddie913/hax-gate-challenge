-- ============================================
-- COMPLETE DATABASE SCHEMA RESET & SETUP
-- ============================================

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- ============================================
-- PROFILES TABLE - Auto-create on signup
-- ============================================

-- Recreate the handle_new_user function with proper error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
  v_hash := encode(digest(v_seed, 'sha256'), 'hex');
  v_address := '0x' || substring(v_hash from 25 for 40);

  -- Generate blockchain signature
  v_timestamp := extract(epoch from now())::BIGINT;
  v_sig_message := 'CTF Identity Verification' || E'\n' || 
                   'User: ' || NEW.id::TEXT || E'\n' ||
                   'Address: ' || v_address || E'\n' ||
                   'Timestamp: ' || v_timestamp::TEXT;
  v_signature := encode(digest(v_sig_message, 'sha256'), 'hex');

  -- Generate username from metadata or default
  v_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'name',
    'user_' || substring(NEW.id::text from 1 for 8)
  );

  -- Insert profile with all required fields
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
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = now();

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't block signup
    RAISE LOG 'Error in handle_new_user: % %', SQLERRM, SQLSTATE;
    RETURN NEW;
END;
$$;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- ENSURE ALL EXISTING USERS HAVE PROFILES
-- ============================================

-- Create profiles for any existing users without profiles
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
SELECT 
  u.id,
  COALESCE(
    u.raw_user_meta_data->>'username',
    u.raw_user_meta_data->>'name',
    'user_' || substring(u.id::text from 1 for 8)
  ) as username,
  u.email,
  '0x' || substring(encode(digest('CTF_PLATFORM_' || u.id::TEXT || '_' || COALESCE(u.email, '') || '_IDENTITY', 'sha256'), 'hex') from 25 for 40) as blockchain_address,
  encode(digest('CTF_IDENTITY_' || u.id::TEXT, 'sha256'), 'hex') as blockchain_signature,
  true as blockchain_verified,
  false as is_admin,
  false as is_banned,
  u.created_at,
  now() as updated_at
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = u.id
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- FIX RLS POLICIES FOR ADMIN ACCESS
-- ============================================

-- Ensure admins can read all profiles
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
CREATE POLICY "Admins can read all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
);

-- Users can read their own profile
DROP POLICY IF EXISTS "Users can read their own profile" ON public.profiles;
CREATE POLICY "Users can read their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Admins can update any profile
DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;
CREATE POLICY "Admins can update profiles"
ON public.profiles
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete profiles
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
CREATE POLICY "Admins can delete profiles"
ON public.profiles
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- VERIFY SETUP
-- ============================================

-- Show summary
DO $$
DECLARE
  user_count INT;
  profile_count INT;
  admin_count INT;
BEGIN
  SELECT COUNT(*) INTO user_count FROM auth.users;
  SELECT COUNT(*) INTO profile_count FROM public.profiles;
  SELECT COUNT(*) INTO admin_count FROM public.user_roles WHERE role = 'admin';
  
  RAISE NOTICE 'Setup complete:';
  RAISE NOTICE '- Total users: %', user_count;
  RAISE NOTICE '- Total profiles: %', profile_count;
  RAISE NOTICE '- Total admins: %', admin_count;
END $$;