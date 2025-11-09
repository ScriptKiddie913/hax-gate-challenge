-- Fix ambiguous points column in get_scoreboard function
DROP FUNCTION IF EXISTS public.get_scoreboard();

CREATE OR REPLACE FUNCTION public.get_scoreboard()
RETURNS TABLE(user_id uuid, username text, total_points bigint, solved_count bigint, last_submission timestamp with time zone)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT 
    p.id AS user_id,
    p.username,
    COALESCE(SUM(DISTINCT challenges.points), 0) AS total_points,
    COUNT(DISTINCT s.challenge_id) FILTER (WHERE s.result = 'CORRECT') AS solved_count,
    MAX(s.created_at) AS last_submission
  FROM public.profiles p
  LEFT JOIN public.submissions s ON s.user_id = p.id AND s.result = 'CORRECT'
  LEFT JOIN public.challenges ON challenges.id = s.challenge_id
  WHERE p.is_banned = false
  GROUP BY p.id, p.username
  HAVING COUNT(DISTINCT s.challenge_id) FILTER (WHERE s.result = 'CORRECT') > 0
  ORDER BY total_points DESC, last_submission ASC NULLS LAST
$function$;