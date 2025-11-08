-- Create table for AI-generated security alerts
CREATE TABLE public.security_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL, -- 'bruteforce', 'rapid_submission', 'suspicious_pattern'
  severity TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high'
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  acknowledged BOOLEAN NOT NULL DEFAULT false,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  acknowledged_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.security_alerts ENABLE ROW LEVEL SECURITY;

-- Only admins can view alerts
CREATE POLICY "Admins can view all security alerts"
ON public.security_alerts
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can acknowledge alerts
CREATE POLICY "Admins can update security alerts"
ON public.security_alerts
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- System can insert alerts (via edge function with service role)
CREATE POLICY "Service role can insert alerts"
ON public.security_alerts
FOR INSERT
WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_security_alerts_user_id ON public.security_alerts(user_id);
CREATE INDEX idx_security_alerts_created_at ON public.security_alerts(created_at DESC);
CREATE INDEX idx_security_alerts_acknowledged ON public.security_alerts(acknowledged);