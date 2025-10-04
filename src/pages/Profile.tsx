import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Shield, Trophy, Calendar, Wallet, CheckCircle2, Copy } from "lucide-react";
import { toast } from "sonner";
import { truncateAddress } from "@/lib/blockchain";
import { Button } from "@/components/ui/button";

interface Profile {
  id: string;
  username: string;
  email: string;
  created_at: string;
  is_banned: boolean;
  blockchain_address: string | null;
  blockchain_verified: boolean;
  blockchain_signature: string | null;
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Address copied to clipboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-gradient-cyan">Profile</span>
          </h1>
          <p className="text-muted-foreground">Your account information and statistics</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Info Card */}
          <Card className="border-border bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Username</p>
                <p className="font-mono font-semibold text-lg">{profile.username}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p className="font-mono">{profile.email}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Member Since</p>
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(profile.created_at).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Account Status</p>
                <Badge variant={profile.is_banned ? "destructive" : "default"}>
                  {profile.is_banned ? "Banned" : "Active"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className="border-border bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Points</span>
                <span className="font-mono font-bold text-2xl text-primary">{stats.total_points}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Challenges Solved</span>
                <span className="font-mono font-bold text-xl">{stats.solved_count}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Submissions</span>
                <span className="font-mono">{stats.total_submissions}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Success Rate</span>
                <span className="font-mono">
                  {stats.total_submissions > 0 
                    ? `${((stats.solved_count / stats.total_submissions) * 100).toFixed(1)}%`
                    : '0%'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Blockchain Identity Card */}
          <Card className="border-border bg-card/50 backdrop-blur md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Blockchain Identity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile.blockchain_address ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-border">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">Blockchain Address</p>
                      <p className="font-mono font-semibold text-lg mb-1">{truncateAddress(profile.blockchain_address)}</p>
                      <p className="text-xs text-muted-foreground break-all">{profile.blockchain_address}</p>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(profile.blockchain_address!)}
                        className="gap-2"
                      >
                        <Copy className="h-4 w-4" />
                        Copy
                      </Button>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/30">
                          Verified
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {profile.blockchain_signature && (
                    <div className="p-4 bg-secondary/30 rounded-lg border border-border">
                      <p className="text-sm text-muted-foreground mb-2">Cryptographic Signature</p>
                      <p className="text-xs font-mono break-all text-muted-foreground">
                        {profile.blockchain_signature}
                      </p>
                    </div>
                  )}

                  <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="space-y-2 text-sm">
                      <p className="font-semibold">About Your Blockchain Identity</p>
                      <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                        <li>Automatically generated using cryptographic hashing (SHA-256)</li>
                        <li>Unique Ethereum-style address format (0x...)</li>
                        <li>Immutable proof of your participation</li>
                        <li>Can be verified independently on blockchain explorers</li>
                        <li>No wallet connection required - fully managed by the platform</li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Blockchain Identity Pending</h3>
                  <p className="text-muted-foreground mb-4">
                    Your blockchain identity is being generated. Please refresh the page.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
