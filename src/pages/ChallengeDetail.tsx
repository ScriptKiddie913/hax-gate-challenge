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
import scpFacility from "@/assets/scp-facility.png";

interface Challenge {
  id: string;
  title: string;
  category: string;
  points: number;
  description_md: string;
  files: any;
  links: any;
  flag?: string;
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
        .select('*, flag')
        .eq('id', id)
        .eq('is_published', true)
        .maybeSingle();

      if (challengeError) throw challengeError;
      if (!challengeData) throw new Error("Challenge not found");
      
      setChallenge(challengeData);

      // Check if already solved
      const { data: submission } = await supabase
        .from('submissions')
        .select('result')
        .eq('user_id', user.id)
        .eq('challenge_id', id)
        .eq('result', 'CORRECT')
        .maybeSingle();

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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Direct flag comparison
      if (!challenge?.flag) {
        toast.error("Challenge flag not configured");
        return;
      }

      const isCorrect = flag.trim() === challenge.flag.trim();

      // Record submission
      const { error: submissionError } = await supabase
        .from('submissions')
        .insert({
          user_id: user.id,
          challenge_id: id,
          result: isCorrect ? 'CORRECT' : 'INCORRECT',
          submitted_flag: flag.substring(0, 50),
        });

      if (submissionError) throw submissionError;

      if (isCorrect) {
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
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 animate-fade-in"
          style={{ 
            backgroundImage: `url(${scpFacility})`,
            filter: 'brightness(0.3) contrast(1.3)'
          }}
        />
        <div className="absolute inset-0 matrix-bg opacity-50" />
        <Navbar />
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="scp-paper border-2 border-primary p-8 scan-line glow-red">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto mb-4" />
            <p className="font-mono text-primary pulse-glow">ACCESSING CLASSIFIED FILE...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 animate-fade-in"
          style={{ 
            backgroundImage: `url(${scpFacility})`,
            filter: 'brightness(0.3) contrast(1.3)'
          }}
        />
        <div className="absolute inset-0 matrix-bg opacity-50" />
        <Navbar />
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="scp-paper border-2 border-destructive p-8 text-center glow-red">
            <p className="font-mono text-xl mb-2 text-destructive flicker">DOCUMENT NOT FOUND</p>
            <p className="text-muted-foreground font-mono">Classification error or insufficient clearance</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 animate-fade-in"
        style={{ 
          backgroundImage: `url(${scpFacility})`,
          filter: 'brightness(0.3) contrast(1.3)'
        }}
      />
      <div className="absolute inset-0 matrix-bg opacity-40" />
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
        <Button
          variant="outline"
          onClick={() => navigate("/challenges")}
          className="mb-6 gap-2 font-mono border-2 hover:border-primary hover:text-primary hover:scale-105 transition-all animate-fade-in"
        >
          <ArrowLeft className="h-4 w-4" />
          RETURN TO INDEX
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="scp-paper border-2 border-border scan-line animate-fade-in backdrop-blur-sm">
              <CardHeader>
                <div className="classification-bar mb-4 pulse-glow"></div>
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge 
                        variant="outline" 
                        className={`font-mono text-xs border-2 animate-fade-in ${
                          challenge.category === 'Safe' ? 'bg-green-500/20 text-green-500 border-green-500/30' :
                          challenge.category === 'Archon' ? 'bg-blue-500/20 text-blue-500 border-blue-500/30' :
                          challenge.category === 'Keter' ? 'bg-orange-500/20 text-orange-500 border-orange-500/30' :
                          challenge.category === 'Euclid' ? 'bg-red-500/20 text-red-500 border-red-500/30' :
                          ''
                        }`}
                      >
                        {challenge.category.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="bg-primary/20 text-primary border-primary font-mono text-xs glow-red animate-fade-in-delay">
                        {challenge.points} POINTS
                      </Badge>
                      {isSolved && (
                        <Badge variant="outline" className="bg-success/20 text-success border-success gap-1 font-mono text-xs animate-fade-in pulse-glow">
                          <Trophy className="h-3 w-3" />
                          CONTAINED
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-2xl font-mono text-primary animate-fade-in">{challenge.title}</CardTitle>
                  </div>
                </div>
                <div className="classification-bar pulse-glow"></div>
              </CardHeader>
              <CardContent className="animate-fade-in-delay">
                <div className="prose prose-sm max-w-none [&>*]:text-foreground [&_strong]:text-foreground [&_em]:text-muted-foreground">
                  <ReactMarkdown>{challenge.description_md}</ReactMarkdown>
                </div>

                {challenge.files && challenge.files.length > 0 && (
                  <div className="mt-8 space-y-3">
                    <h3 className="font-bold text-sm mb-3 font-mono border-b-2 border-border pb-2">ATTACHED FILES:</h3>
                    {challenge.files.map((file: any, index: number) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start gap-2 font-mono border-2"
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
                  <div className="mt-8 space-y-3">
                    <h3 className="font-bold text-sm mb-3 font-mono border-b-2 border-border pb-2">EXTERNAL REFERENCES:</h3>
                    {challenge.links.map((link: any, index: number) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start gap-2 font-mono border-2"
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
            <Card className="scp-paper border-2 border-border sticky top-24">
              <CardHeader>
                <div className="classification-bar mb-3"></div>
                <CardTitle className="flex items-center gap-2 font-mono text-lg">
                  {isSolved ? (
                    <>
                      <Trophy className="h-5 w-5 text-success" />
                      ANOMALY CONTAINED
                    </>
                  ) : (
                    <>
                      <Flag className="h-5 w-5 text-primary" />
                      FLAG SUBMISSION
                    </>
                  )}
                </CardTitle>
                <CardDescription className="font-mono text-xs">
                  {isSolved 
                    ? "Containment procedures complete."
                    : "Enter containment protocol key"
                  }
                </CardDescription>
                <div className="classification-bar mt-3"></div>
              </CardHeader>
              <CardContent>
                {isSolved ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 border-4 border-success bg-background flex items-center justify-center mx-auto mb-4">
                      <Lock className="h-10 w-10 text-success" />
                    </div>
                    <p className="text-success font-bold font-mono mb-2">SECURED</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      This anomaly has been successfully contained.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="flag" className="font-mono text-xs">CONTAINMENT KEY:</Label>
                      <Input
                        id="flag"
                        type="text"
                        placeholder="flag{...}"
                        value={flag}
                        onChange={(e) => setFlag(e.target.value)}
                        className="font-mono border-2"
                        disabled={submitting}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full gap-2 font-mono bg-primary hover:bg-primary/90"
                      disabled={submitting}
                    >
                      {submitting ? "VERIFYING..." : "SUBMIT FOR VERIFICATION"}
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
