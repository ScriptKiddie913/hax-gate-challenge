import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { SCPHeader } from "@/components/SCPHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Unlock, Trophy, AlertTriangle, Clock } from "lucide-react";
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

interface CTFSettings {
  start_time: string;
  end_time: string;
  is_active: boolean;
}

export default function Challenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [solvedChallenges, setSolvedChallenges] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [ctfSettings, setCtfSettings] = useState<CTFSettings | null>(null);
  const [timeUntilStart, setTimeUntilStart] = useState<string | null>(null);
  const [isCtfActive, setIsCtfActive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (ctfSettings && !isCtfActive) {
      const interval = setInterval(() => updateCountdown(), 1000);
      return () => clearInterval(interval);
    }
  }, [ctfSettings, isCtfActive]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    if (!session.user.email_confirmed_at) {
      toast.error("Please verify your email to access challenges");
      navigate("/");
      return;
    }

    loadCTFSettings();
  };

  const loadCTFSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("ctf_settings")
        .select("*")
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;

      setCtfSettings(data);

      const now = new Date();
      const start = new Date(data.start_time);
      const end = new Date(data.end_time);

      if (now >= start && now <= end) {
        setIsCtfActive(true);
        loadChallenges();
      } else {
        setIsCtfActive(false);
        updateCountdown(data.start_time);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error loading CTF settings");
      setLoading(false);
    }
  };

  const updateCountdown = (startTime?: string) => {
    if (!ctfSettings && !startTime) return;

    const start = new Date(startTime || ctfSettings!.start_time).getTime();
    const now = new Date().getTime();
    const diff = start - now;

    if (diff <= 0) {
      setIsCtfActive(true);
      loadChallenges();
      setTimeUntilStart(null);
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setTimeUntilStart(
      `${hours.toString().padStart(2, "0")}h : ${minutes.toString().padStart(2, "0")}m : ${seconds
        .toString()
        .padStart(2, "0")}s`
    );
  };

  const loadChallenges = async () => {
    try {
      const { data: challengesData, error: challengesError } = await supabase
        .from("challenges")
        .select("*")
        .eq("is_published", true)
        .order("points", { ascending: true });

      if (challengesError) throw challengesError;

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: submissionsData, error: submissionsError } = await supabase
          .from("submissions")
          .select("challenge_id, result")
          .eq("user_id", user.id)
          .eq("result", "CORRECT");

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
      web: "bg-primary/20 text-primary border-primary",
      pwn: "bg-destructive/20 text-destructive border-destructive",
      crypto: "bg-accent/20 text-accent border-accent",
      rev: "bg-success/20 text-success border-success",
      forensics: "bg-yellow-600/20 text-yellow-700 border-yellow-700",
      misc: "bg-purple-600/20 text-purple-700 border-purple-700",
    };
    return colors[category.toLowerCase()] || "bg-muted text-muted-foreground border-border";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center scp-paper border-2 border-border p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto mb-4"></div>
            <p className="font-mono">LOADING CLASSIFIED DOCUMENTS...</p>
          </div>
        </div>
      </div>
    );
  }

  // Countdown display before CTF start
  if (!isCtfActive && timeUntilStart) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-16 flex flex-col items-center justify-center">
          <SCPHeader
            classification="SAFE"
            itemNumber="SCP-CTF-LOCKDOWN"
            title="ACCESS RESTRICTED - CTF COUNTDOWN"
          />
          <Card className="scp-paper border-2 border-border p-8 mt-8 text-center max-w-lg">
            <Clock className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
            <p className="font-mono text-lg mb-2">CTF will begin in:</p>
            <h1 className="font-mono text-4xl font-bold text-primary mb-4">{timeUntilStart}</h1>
            <p className="text-sm text-muted-foreground">
              Prepare your containment protocols. Access to challenges will unlock automatically.
            </p>
          </Card>
        </main>
        <footer className="border-t-2 border-border py-4 px-4 scp-paper">
          <div className="container mx-auto text-center text-xs font-mono text-muted-foreground">
            SCP Foundation CTF Division | Awaiting Activation
          </div>
        </footer>
      </div>
    );
  }

  // Display challenges once CTF starts
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <SCPHeader
          classification="EUCLID"
          itemNumber="SCP-CTF-ACCESS"
          title="ANOMALOUS ENTITY CONTAINMENT CHALLENGES"
        />

        {challenges.length === 0 ? (
          <div className="scp-paper border-2 border-border p-12 text-center">
            <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-xl font-mono mb-2">NO ACTIVE CONTAINMENT BREACHES</p>
            <p className="text-muted-foreground">
              All anomalies currently contained. Check back later for new challenges.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 scp-paper border border-border p-4">
              <p className="text-sm font-mono">
                <strong className="text-destructive">NOTICE:</strong> The following documents detail
                active containment scenarios. Each entry represents a classified security challenge
                requiring immediate attention.
                <span className="redacted ml-2">LEVEL 4 CLEARANCE</span> personnel only.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.map((challenge) => {
                const isSolved = solvedChallenges.has(challenge.id);
                return (
                  <Card
                    key={challenge.id}
                    className="scp-paper border-2 border-border hover:border-primary transition-all cursor-pointer group"
                    onClick={() => navigate(`/challenge/${challenge.id}`)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-3">
                        <Badge
                          variant="outline"
                          className={`${getCategoryColor(challenge.category)} font-mono text-xs`}
                        >
                          {challenge.category.toUpperCase()}
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
                      <div className="classification-bar mb-2"></div>
                      <CardTitle className="group-hover:text-primary transition-colors font-mono text-lg">
                        {challenge.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 text-xs">
                        {challenge.description_md.substring(0, 100)}...
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-primary" />
                          <span className="font-mono font-bold text-lg">
                            {challenge.points} pts
                          </span>
                        </div>
                        {isSolved && (
                          <Badge
                            variant="outline"
                            className="bg-success/20 text-success border-success font-mono text-xs"
                          >
                            CONTAINED
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </main>

      <footer className="border-t-2 border-border py-4 px-4 scp-paper">
        <div className="container mx-auto text-center text-xs font-mono text-muted-foreground">
          SCP Foundation CTF Division | Clearance Required
        </div>
      </footer>
    </div>
  );
}

