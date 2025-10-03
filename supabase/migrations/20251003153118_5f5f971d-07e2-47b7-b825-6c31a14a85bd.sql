-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- =====================================================
-- PROFILES TABLE
-- =====================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT,
  is_banned BOOLEAN DEFAULT false NOT NULL,
  is_admin BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can read their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON public.profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can update profiles"
  ON public.profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can delete profiles"
  ON public.profiles
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- =====================================================
-- CHALLENGES TABLE
-- =====================================================
CREATE TABLE public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  points INTEGER NOT NULL CHECK (points > 0),
  description_md TEXT NOT NULL,
  files JSONB DEFAULT '[]'::jsonb,
  links JSONB DEFAULT '[]'::jsonb,
  is_published BOOLEAN DEFAULT false NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS on challenges
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

-- RLS Policies for challenges
CREATE POLICY "Anyone can read published challenges"
  ON public.challenges
  FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can read all challenges"
  ON public.challenges
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can insert challenges"
  ON public.challenges
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can update challenges"
  ON public.challenges
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can delete challenges"
  ON public.challenges
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- =====================================================
-- FLAGS TABLE (SECURITY CRITICAL - NO PUBLIC ACCESS)
-- =====================================================
CREATE TABLE public.flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID UNIQUE NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS on flags
ALTER TABLE public.flags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for flags - DENY ALL CLIENT ACCESS
-- Only service role can access this table
CREATE POLICY "No public access to flags"
  ON public.flags
  FOR ALL
  USING (false);

-- =====================================================
-- SUBMISSIONS TABLE
-- =====================================================
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  submitted_flag TEXT,
  result TEXT NOT NULL CHECK (result IN ('CORRECT', 'INCORRECT')),
  ip TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create index for faster queries
CREATE INDEX idx_submissions_user_challenge ON public.submissions(user_id, challenge_id);
CREATE INDEX idx_submissions_result ON public.submissions(result);
CREATE INDEX idx_submissions_created_at ON public.submissions(created_at DESC);

-- Enable RLS on submissions
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for submissions
CREATE POLICY "Users can insert their own submissions"
  ON public.submissions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own submissions"
  ON public.submissions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all submissions"
  ON public.submissions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- =====================================================
-- AUDIT LOGS TABLE
-- =====================================================
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  meta JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create index for faster queries
CREATE INDEX idx_audit_logs_actor ON public.audit_logs(actor_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- Enable RLS on audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for audit_logs
CREATE POLICY "Admins can read all audit logs"
  ON public.audit_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for challenges
CREATE TRIGGER update_challenges_updated_at
  BEFORE UPDATE ON public.challenges
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substring(NEW.id::text from 1 for 8)),
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- SCOREBOARD FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION public.get_scoreboard()
RETURNS TABLE (
  user_id UUID,
  username TEXT,
  total_points BIGINT,
  solved_count BIGINT,
  last_submission TIMESTAMPTZ
) 
LANGUAGE sql
STABLE
AS $$
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
  ORDER BY total_points DESC, last_submission ASC NULLS LAST
$$;

-- =====================================================
-- ENABLE REALTIME FOR SCOREBOARD
-- =====================================================

-- Enable realtime for submissions table
ALTER PUBLICATION supabase_realtime ADD TABLE public.submissions;

-- =====================================================
-- SEED ADMIN ACCOUNT
-- =====================================================

-- This will be executed after the first user signs up
-- The admin account must sign up with email: sagnik.saha.araptor@gmail.com
-- Then run this update manually or via a secure one-time script:

-- UPDATE public.profiles 
-- SET is_admin = true 
-- WHERE email = 'sagnik.saha.araptor@gmail.com';
