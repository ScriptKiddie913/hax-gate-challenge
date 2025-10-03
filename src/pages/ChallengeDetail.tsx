import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Flag, ArrowLeft, ExternalLink, Download, Send, Trophy, Lock } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

interface Challenge {
  id: string;
  title: string;
  category: string;
  points: number;
  description_md: string;
  files: any;
  links: any;
}

export default function ChallengeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [flag, setFlag] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadChallenge();
    }
  }, [id]);

  const loadChallenge = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: challengeData, error: challengeError } = await supabase
        .from('challenges')
        .select('*')
        .eq('id', id)
        .eq('is_published', true)
        .single();

      if (challengeError) throw challengeError;
      setChallenge(challengeData);

      // Check if already solved
      const { data: submission } = await supabase
        .from('submissions')
        .select('result')
        .eq('user_id', user.id)
        .eq('challenge_id', id)
        .eq('result', 'CORRECT')
        .single();

      setIsSolved(!!submission);
    } catch (error: any) {
      toast.error("Error loading challenge");
      navigate("/challenges");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flag.trim()) {
      toast.error("Please enter a flag");
      return;
    }

    if (isSolved) {
      toast.error("You've already solved this challenge!");
      return;
    }

    setSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('submit-flag', {
        body: { challenge_id: id, submitted_flag: flag }
      });

      if (error) throw error;

      if (data.result === 'CORRECT') {
        toast.success(`Correct! You earned ${challenge?.points} points! 🎉`);
        setIsSolved(true);
        setFlag("");
      } else {
        toast.error("Incorrect flag. Try again!");
      }
    } catch (error: any) {
      toast.error(error.message || "Error submitting flag");
    } finally {
      setSubmitting(false);
    }
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

  if (!challenge) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p>Challenge not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/challenges")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Challenges
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-2">
                    <Badge variant="outline" className="mb-2">
                      {challenge.category}
                    </Badge>
                    <CardTitle className="text-3xl">{challenge.title}</CardTitle>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Flag className="h-5 w-5 text-primary" />
                        <span className="font-mono font-bold text-xl">{challenge.points} points</span>
                      </div>
                      {isSolved && (
                        <Badge variant="outline" className="bg-success/20 text-success border-success/30 gap-1">
                          <Trophy className="h-3 w-3" />
                          Solved
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown>{challenge.description_md}</ReactMarkdown>
                </div>

                {challenge.files && challenge.files.length > 0 && (
                  <div className="mt-6 space-y-2">
                    <h3 className="font-semibold text-lg mb-3">Files</h3>
                    {challenge.files.map((file: any, index: number) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start gap-2"
                        asChild
                      >
                        <a href={file.url} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                          {file.name}
                        </a>
                      </Button>
                    ))}
                  </div>
                )}

                {challenge.links && challenge.links.length > 0 && (
                  <div className="mt-6 space-y-2">
                    <h3 className="font-semibold text-lg mb-3">Links</h3>
                    {challenge.links.map((link: any, index: number) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start gap-2"
                        asChild
                      >
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                          {link.label}
                        </a>
                      </Button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="border-border bg-card/50 backdrop-blur sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {isSolved ? (
                    <>
                      <Trophy className="h-5 w-5 text-success" />
                      Challenge Solved!
                    </>
                  ) : (
                    <>
                      <Flag className="h-5 w-5 text-primary" />
                      Submit Flag
                    </>
                  )}
                </CardTitle>
                <CardDescription>
                  {isSolved 
                    ? "You've already solved this challenge. Great job!"
                    : "Enter the flag you discovered"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSolved ? (
                  <div className="text-center py-8">
                    <Lock className="h-16 w-16 text-success mx-auto mb-4" />
                    <p className="text-success font-semibold">Challenge Locked</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      You can't submit more flags for this challenge
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="flag">Flag</Label>
                      <Input
                        id="flag"
                        type="text"
                        placeholder="flag{example_flag_here}"
                        value={flag}
                        onChange={(e) => setFlag(e.target.value)}
                        className="font-mono"
                        disabled={submitting}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full glow-cyan gap-2"
                      disabled={submitting}
                    >
                      {submitting ? "Submitting..." : "Submit Flag"}
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
