-- Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Drop and recreate the handle_new_user function with proper error handling
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_seed TEXT;
  v_hash TEXT;
  v_address TEXT;
  v_timestamp BIGINT;
  v_sig_message TEXT;
  v_signature TEXT;
BEGIN
  -- Generate deterministic blockchain address
  v_seed := 'CTF_PLATFORM_' || NEW.id::TEXT || '_' || COALESCE(NEW.email, '') || '_IDENTITY';
  v_hash := encode(digest(v_seed, 'sha256'), 'hex');
  v_address := '0x' || substring(v_hash from 25 for 40);
  
  -- Generate signature for verification
  v_timestamp := extract(epoch from now())::BIGINT;
  v_sig_message := 'CTF Identity Verification' || E'\n' || 
                   'User: ' || NEW.id::TEXT || E'\n' ||
                   'Address: ' || v_address || E'\n' ||
                   'Timestamp: ' || v_timestamp::TEXT;
  v_signature := encode(digest(v_sig_message, 'sha256'), 'hex');
  
  -- Insert profile with blockchain identity
  INSERT INTO public.profiles (id, username, email, blockchain_address, blockchain_signature, blockchain_verified)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substring(NEW.id::text from 1 for 8)),
    NEW.email,
    v_address,
    v_signature,
    true
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in handle_new_user: % %', SQLERRM, SQLSTATE;
    RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();