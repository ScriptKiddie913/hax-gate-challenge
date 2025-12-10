-- Update get_scoreboard to break ties by earliest achievement of each score
-- When two users have the same score, the one who achieved that score first ranks higher
CREATE OR REPLACE FUNCTION public.get_scoreboard()
 RETURNS TABLE(user_id uuid, username text, total_points bigint, solved_count bigint, last_submission timestamp with time zone)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  WITH user_scores AS (
    -- Calculate total points and solved count per user
    SELECT 
      p.id AS user_id,
      p.username,
      COALESCE(SUM(DISTINCT c.points), 0) AS total_points,
      COUNT(DISTINCT s.challenge_id) FILTER (WHERE s.result = 'CORRECT') AS solved_count,
      MAX(s.created_at) AS last_submission
    FROM public.profiles p
    LEFT JOIN public.submissions s ON s.user_id = p.id AND s.result = 'CORRECT'
    LEFT JOIN public.challenges c ON c.id = s.challenge_id
    WHERE p.is_banned = false
    GROUP BY p.id, p.username
    HAVING COUNT(DISTINCT s.challenge_id) FILTER (WHERE s.result = 'CORRECT') > 0
  ),
  score_achieved_at AS (
    -- Find when each user first achieved their current total score
    -- This is the time of their last correct submission that brought them to current total
    SELECT 
      us.user_id,
      us.total_points,
      (
        SELECT s.created_at
        FROM public.submissions s
        JOIN public.challenges c ON c.id = s.challenge_id
        WHERE s.user_id = us.user_id 
          AND s.result = 'CORRECT'
        ORDER BY s.created_at DESC
        LIMIT 1
      ) AS score_achieved_time
    FROM user_scores us
  )
  SELECT 
    us.user_id,
    us.username,
    us.total_points,
    us.solved_count,
    us.last_submission
  FROM user_scores us
  JOIN score_achieved_at sa ON sa.user_id = us.user_id
  ORDER BY 
    us.total_points DESC, 
    sa.score_achieved_time ASC NULLS LAST
$function$;