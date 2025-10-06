import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SCPHeader } from "@/components/SCPHeader";
import { CTFCountdown } from "@/components/CTFCountdown";
import { Shield, Lock, Trophy } from "lucide-react";
import { toast } from "sonner";

interface Challenge {
  id: string;
  title: string;
  category: string;
  points: number;
  description_md: string;
}

interface CTFSettings {
  start_time: string;
  end_time: string;
  is_active: boolean;
}

const getCategoryDetails = (category: string) => {
  switch (category) {
    case "Safe":
      return {
        label: "SAFE",
        difficulty: "Very Easy",
        color: "bg-green-500/20 text-green-500 border-green-500/30",
      };
    case "Archon":
      return {
        label: "ARCHON",
        difficulty: "Easy",
        color: "bg-blue-500/20 text-blue-500 border-blue-500/30",
      };
    case "Keter":
      return {
        label: "KETER",
        difficulty: "Medium",
        color: "bg-orange-500/20 text-orange-500 border-orange-500/30",
      };
    case "Euclid":
      return {
        label: "EUCLID",
        difficulty: "Hard",
        color: "bg-red-500/20 text-red-500 border-red-500/30",
      };
    default:
      return {
        label: category.toUpperCase(),
        difficulty: "Unknown",
        color: "bg-gray-500/20 text-gray-500 border-gray-500/30",
      };
  }
};

export default function Challenges() {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [ctfSettings, setCtfSettings] = useState<CTFSettings | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/auth");
        return;
      }

      // Check if user is admin
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      setIsAdmin(!!roles);

      // Load CTF settings
      const { data: settings } = await supabase
        .from("ctf_settings")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      setCtfSettings(settings);

      // Load challenges (only if CTF is active or user is admin)
      const now = new Date().toISOString();
      const isCtfActive =
        settings &&
        settings.is_active &&
        now >= settings.start_time &&
        now <= settings.end_time;

      if (isAdmin || isCtfActive) {
        const { data: challengesData, error } = await supabase
          .from("challenges")
          .select("id, title, category, points, description_md")
          .eq("is_published", true)
          .order("points", { ascending: true });

        if (error) throw error;
        setChallenges(challengesData || []);
      }
    } catch (error: any) {
      toast.error("Error loading challenges");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col matrix-bg">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="scp-paper border-2 border-border p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto mb-4"></div>
            <p className="font-mono">ACCESSING DATABASE...</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if CTF is active
  const now = new Date().toISOString();
  const isCtfActive =
    ctfSettings &&
    ctfSettings.is_active &&
    now >= ctfSettings.start_time &&
    now <= ctfSettings.end_time;

  const isBeforeStart = ctfSettings && now < ctfSettings.start_time;

  // Show countdown for non-admin users before CTF starts
  if (!isAdmin && isBeforeStart && ctfSettings) {
    return (
      <div className="min-h-screen flex flex-col matrix-bg">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <SCPHeader
            classification="KETER"
            itemNumber="SCP-CTF"
            title="CONTAINMENT BREACH EVENT"
          />
          <div className="max-w-3xl mx-auto mt-8">
            <CTFCountdown startTime={ctfSettings.start_time} />
          </div>
        </main>
      </div>
    );
  }

  // Show message if CTF is not active and user is not admin
  if (!isAdmin && !isCtfActive) {
    return (
      <div className="min-h-screen flex flex-col matrix-bg">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <SCPHeader
            classification="SAFE"
            itemNumber="SCP-CTF"
            title="CTF EVENT STATUS"
          />
          <div className="max-w-3xl mx-auto mt-8">
            <Card className="scp-paper border-2 border-border">
              <CardHeader>
                <div className="classification-bar mb-3"></div>
                <CardTitle className="flex items-center gap-2 font-mono">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  NO ACTIVE CONTAINMENT BREACH
                </CardTitle>
                <div className="classification-bar mt-3"></div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-mono text-sm">
                  There are currently no active CTF events scheduled. Please
                  check back later or contact Foundation administrators for more
                  information.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col matrix-bg">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <SCPHeader
          classification="EUCLID"
          itemNumber="SCP-CTF"
          title="ACTIVE CONTAINMENT BREACHES"
        />
        {challenges.length === 0 ? (
          <div className="max-w-3xl mx-auto mt-8">
            <Card className="scp-paper border-2 border-border">
              <CardHeader>
                <div className="classification-bar mb-3"></div>
                <CardTitle className="flex items-center gap-2 font-mono">
                  <Shield className="h-5 w-5 text-success" />
                  ALL ANOMALIES CONTAINED
                </CardTitle>
                <div className="classification-bar mt-3"></div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-mono text-sm">
                  No active containment breaches detected. All SCP objects
                  remain secure.
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            {challenges.map((challenge) => {
              const categoryInfo = getCategoryDetails(challenge.category);
              return (
                <Card
                  key={challenge.id}
                  className="scp-paper border-2 border-border hover:border-primary transition-all cursor-pointer scan-line group"
                  onClick={() => navigate(`/challenges/${challenge.id}`)}
                >
                  <CardHeader>
                    <div className="classification-bar mb-3"></div>
                    <div className="flex items-start justify-between mb-2">
                      <Badge
                        variant="outline"
                        className={`font-mono text-xs ${categoryInfo.color}`}
                      >
                        {categoryInfo.label}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-primary/20 text-primary border-primary font-mono text-xs"
                      >
                        {challenge.points} PTS
                      </Badge>
                    </div>
                    <CardTitle className="font-mono text-lg group-hover:text-primary transition-colors">
                      {challenge.title}
                    </CardTitle>
                    <CardDescription className="font-mono text-xs">
                      Difficulty: {categoryInfo.difficulty}
                    </CardDescription>
                    <div className="classification-bar mt-3"></div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 font-mono">
                      {challenge.description_md.substring(0, 100)}...
                    </p>
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
