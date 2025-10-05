import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { SCPHeader } from "@/components/SCPHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Trophy, Calendar, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface Profile {
  id: string;
  username: string;
  email: string;
  created_at: string;
  is_banned: boolean;
}

interface UserStats {
  total_points: number;
  solved_count: number;
  total_submissions: number;
}

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<UserStats>({ total_points: 0, solved_count: 0, total_submissions: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      // Load profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Load stats
      const { data: submissions } = await supabase
        .from('submissions')
        .select('result, challenge_id, challenges(points)')
        .eq('user_id', session.user.id);

      if (submissions) {
        const correctSubmissions = submissions.filter(s => s.result === 'CORRECT');
        const uniqueChallenges = new Set(correctSubmissions.map(s => s.challenge_id));
        const totalPoints = correctSubmissions.reduce((sum, s) => {
          const points = (s.challenges as any)?.points || 0;
          return sum + points;
        }, 0);

        setStats({
          total_points: totalPoints,
          solved_count: uniqueChallenges.size,
          total_submissions: submissions.length
        });
      }

      setLoading(false);
    } catch (error: any) {
      toast.error("Error loading profile");
      console.error(error);
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col matrix-bg">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="scp-paper border-2 border-border p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto mb-4"></div>
            <p className="font-mono">LOADING PERSONNEL FILE...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen flex flex-col matrix-bg">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <SCPHeader 
          classification="SAFE"
          itemNumber="SCP-PROFILE"
          title="PERSONNEL RECORD"
        />

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Info Card */}
          <Card className="scp-paper border-2 border-border scan-line animate-fade-in">
            <CardHeader>
              <div className="classification-bar mb-3"></div>
              <CardTitle className="flex items-center gap-2 font-mono">
                <User className="h-5 w-5 text-primary" />
                PERSONNEL DATA
              </CardTitle>
              <div className="classification-bar mt-3"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1 font-mono uppercase">Designation:</p>
                <p className="font-mono font-bold text-lg">{profile.username}</p>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground mb-1 font-mono uppercase">Contact:</p>
                <p className="font-mono text-sm">{profile.email}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1 font-mono uppercase">Enrollment Date:</p>
                <p className="flex items-center gap-2 font-mono text-sm">
                  <Calendar className="h-4 w-4" />
                  {new Date(profile.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1 font-mono uppercase">Security Status:</p>
                <Badge 
                  variant="outline" 
                  className={profile.is_banned ? "bg-destructive/20 text-destructive border-destructive" : "bg-success/20 text-success border-success"}
                >
                  {profile.is_banned ? "ACCESS REVOKED" : "ACTIVE CLEARANCE"}
                </Badge>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1 font-mono uppercase">User ID:</p>
                <p className="font-mono text-xs text-muted-foreground break-all">
                  {profile.id}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className="scp-paper border-2 border-border scan-line animate-fade-in-delay">
            <CardHeader>
              <div className="classification-bar mb-3"></div>
              <CardTitle className="flex items-center gap-2 font-mono">
                <Trophy className="h-5 w-5 text-primary" />
                CONTAINMENT STATISTICS
              </CardTitle>
              <div className="classification-bar mt-3"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-background/50 border border-border">
                <span className="text-muted-foreground font-mono text-sm">CLEARANCE POINTS</span>
                <span className="font-mono font-bold text-2xl text-primary pulse-glow">{stats.total_points}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-background/50 border border-border">
                <span className="text-muted-foreground font-mono text-sm">CONTAINMENTS SECURED</span>
                <span className="font-mono font-bold text-xl text-success">{stats.solved_count}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-background/50 border border-border">
                <span className="text-muted-foreground font-mono text-sm">TOTAL ATTEMPTS</span>
                <span className="font-mono font-bold">{stats.total_submissions}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-background/50 border border-border">
                <span className="text-muted-foreground font-mono text-sm">SUCCESS RATE</span>
                <span className="font-mono font-bold">
                  {stats.total_submissions > 0 
                    ? `${((stats.solved_count / stats.total_submissions) * 100).toFixed(1)}%`
                    : '0%'}
                </span>
              </div>

              <div className="classification-bar mt-4"></div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Card className="scp-paper border-2 border-primary md:col-span-2 glow-red animate-fade-in-delay">
            <CardHeader>
              <div className="classification-bar mb-3"></div>
              <CardTitle className="flex items-center gap-2 font-mono text-primary">
                <AlertTriangle className="h-5 w-5 animate-pulse" />
                SECURITY NOTICE
              </CardTitle>
              <div className="classification-bar mt-3"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <p className="font-mono">
                  <strong className="text-primary">CLASSIFIED:</strong> All personnel records are monitored 
                  and subject to O5 Council review. Unauthorized access or data manipulation will result 
                  in immediate <span className="redacted">REDACTED</span> procedures.
                </p>
                <p className="font-mono text-muted-foreground">
                  Your activities within the CTF Division are logged for security purposes. 
                  All containment attempts, successful or otherwise, contribute to your security clearance rating.
                </p>
                <div className="flex gap-4 mt-4 text-xs">
                  <div className="flex-1 bg-background/50 border border-border p-2">
                    <p className="text-muted-foreground">THREAT LEVEL</p>
                    <p className="font-bold text-success">MINIMAL</p>
                  </div>
                  <div className="flex-1 bg-background/50 border border-border p-2">
                    <p className="text-muted-foreground">CLEARANCE</p>
                    <p className="font-bold text-primary">LEVEL-{stats.solved_count > 10 ? '3' : stats.solved_count > 5 ? '2' : '1'}</p>
                  </div>
                  <div className="flex-1 bg-background/50 border border-border p-2">
                    <p className="text-muted-foreground">STATUS</p>
                    <p className="font-bold">{profile.is_banned ? 'REVOKED' : 'ACTIVE'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
