-- Create a function to get all registered users for the public scoreboard
CREATE OR REPLACE FUNCTION public.get_all_participants()
RETURNS TABLE(
  user_id uuid,
  username text,
  created_at timestamp with time zone
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.id AS user_id,
    p.username,
    p.created_at
  FROM public.profiles p
  WHERE p.is_banned = false
  ORDER BY p.created_at DESC
$$;