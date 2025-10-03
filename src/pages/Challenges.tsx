import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Unlock, Trophy, Flag } from "lucide-react";
import { toast } from "sonner";

interface Challenge {
  id: string;
  title: string;
  category: string;
  points: number;
  description_md: string;
  is_published: boolean;
}

interface Submission {
  challenge_id: string;
  result: string;
}

export default function Challenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [solvedChallenges, setSolvedChallenges] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    // Check if email is verified
    if (!session.user.email_confirmed_at) {
      toast.error("Please verify your email to access challenges");
      navigate("/");
      return;
    }

    loadChallenges();
  };

  const loadChallenges = async () => {
    try {
      const { data: challengesData, error: challengesError } = await supabase
        .from('challenges')
        .select('*')
        .eq('is_published', true)
        .order('points', { ascending: true });

      if (challengesError) throw challengesError;

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: submissionsData, error: submissionsError } = await supabase
          .from('submissions')
          .select('challenge_id, result')
          .eq('user_id', user.id)
          .eq('result', 'CORRECT');

        if (submissionsError) throw submissionsError;

        const solved = new Set(submissionsData?.map((s: Submission) => s.challenge_id) || []);
        setSolvedChallenges(solved);
      }

      setChallenges(challengesData || []);
    } catch (error: any) {
      toast.error("Error loading challenges");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'web': 'bg-primary/20 text-primary border-primary/30',
      'pwn': 'bg-destructive/20 text-destructive border-destructive/30',
      'crypto': 'bg-accent/20 text-accent border-accent/30',
      'rev': 'bg-success/20 text-success border-success/30',
      'forensics': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'misc': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    };
    return colors[category.toLowerCase()] || 'bg-muted text-muted-foreground border-border';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading challenges...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-gradient-cyan">Challenges</span>
          </h1>
          <p className="text-muted-foreground">Select a challenge to view details and submit flags</p>
        </div>

        {challenges.length === 0 ? (
          <Card className="border-border bg-card/50 backdrop-blur">
            <CardContent className="pt-8 text-center">
              <Flag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No challenges available yet. Check back soon!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => {
              const isSolved = solvedChallenges.has(challenge.id);
              return (
                <Card
                  key={challenge.id}
                  className="border-border bg-card/50 backdrop-blur hover:border-primary/50 transition-all cursor-pointer group"
                  onClick={() => navigate(`/challenge/${challenge.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline" className={getCategoryColor(challenge.category)}>
                        {challenge.category}
                      </Badge>
                      {isSolved ? (
                        <div className="flex items-center gap-1 text-success">
                          <Unlock className="h-4 w-4" />
                          <Trophy className="h-4 w-4" />
                        </div>
                      ) : (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {challenge.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {challenge.description_md.substring(0, 100)}...
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Flag className="h-4 w-4 text-primary" />
                        <span className="font-mono font-bold text-lg">{challenge.points} pts</span>
                      </div>
                      {isSolved && (
                        <Badge variant="outline" className="bg-success/20 text-success border-success/30">
                          Solved
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
