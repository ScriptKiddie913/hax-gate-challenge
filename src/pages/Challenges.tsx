/* --------------------------------------------------------------------- */
/*  Challenges page – countdown displayed in a page box                 */
/* --------------------------------------------------------------------- */

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
import { Shield, Lock } from "lucide-react";
import { toast } from "sonner";
import { CTFCountdown } from "@/components/CTFCountdown";
import scpCorridor from "@/assets/scp-corridor.png";
import scpCreature from "@/assets/scp-creature.png";

/* --------------------------------------------------------------------- */
/*  Types                                                             */
/* --------------------------------------------------------------------- */
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

/* --------------------------------------------------------------------- */
/*  Category styling helper                                           */
/* --------------------------------------------------------------------- */
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

/* --------------------------------------------------------------------- */
/*  Main component – Challenges                                        */
/* --------------------------------------------------------------------- */
export default function Challenges() {
  const navigate = useNavigate();

  /* ------------------------------------------------------------------- */
  /*  State                                                            */
  /* ------------------------------------------------------------------- */
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [ctfSettings, setCtfSettings] = useState<CTFSettings | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ------------------------------------------------------------------- */
  /*  Load data once on mount                                          */
  /* ------------------------------------------------------------------- */
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      /* ---------------- Auth -------------------------------------- */
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate("/auth");
        return;
      }

      /* ---------------- Admin check ------------------------------ */
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      setIsAdmin(!!roles);

      /* ---------------- CTF settings ----------------------------- */
      const { data: settings } = await supabase
        .from("ctf_settings")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      setCtfSettings(settings);

      /* ---------------- Challenges -------------------------------- */
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
        setChallenges(challengesData ?? []);
      }
    } catch (error: any) {
      toast.error("Error loading challenges");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------------------------------------------- */
  /*  Loading skeleton                                                */
  /* ------------------------------------------------------------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col matrix-bg relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 animate-fade-in"
          style={{ 
            backgroundImage: `url(${scpCorridor})`,
            filter: 'brightness(0.4) contrast(1.2)'
          }}
        />
        <Navbar />
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="scp-paper border-2 border-border p-8 scan-line">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto mb-4 glow-red" />
            <p className="font-mono text-primary pulse-glow">ACCESSING DATABASE...</p>
          </div>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------- */
  /*  Check if CTF is currently active                               */
  /* ------------------------------------------------------------------- */
  const now = new Date().toISOString();
  const isCtfActive =
    ctfSettings &&
    ctfSettings.is_active &&
    now >= ctfSettings.start_time &&
    now <= ctfSettings.end_time;

  const isBeforeStart = ctfSettings && now < ctfSettings.start_time;

  /* ------------------------------------------------------------------- */
  /*  If contest isn't active and the user isn't an admin              */
  /* ------------------------------------------------------------------- */
  if (!isAdmin && !isCtfActive) {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15 animate-fade-in"
          style={{ 
            backgroundImage: `url(${scpCreature})`,
            filter: 'brightness(0.3) contrast(1.3)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/85 to-background/95" />
        <div className="absolute inset-0 matrix-bg opacity-40" />
        
        <Navbar />

        <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
          <SCPHeader
            classification="KETER"
            itemNumber="SCP-CTF"
            title="CONTAINMENT BREACH PENDING"
          />
          
          {/* Countdown card – shown when CTF is inactive */}
          {isBeforeStart && ctfSettings && (
            <div className="max-w-4xl mx-auto mt-8 animate-fade-in">
              <CTFCountdown startTime={ctfSettings.start_time} />
            </div>
          )}
          
          {!isBeforeStart && (
            <div className="max-w-3xl mx-auto mt-8 animate-fade-in-delay">
              <Card className="scp-paper border-2 border-destructive glow-red">
                <CardHeader>
                  <div className="classification-bar mb-3" />
                  <CardTitle className="flex items-center gap-2 font-mono text-primary">
                    <Lock className="h-5 w-5 animate-pulse" />
                    NO ACTIVE CONTAINMENT BREACH
                  </CardTitle>
                  <div className="classification-bar mt-3" />
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground font-mono text-sm">
                    All SCP containment protocols are secure. No active breach events detected. 
                    Await further instructions from Site Command.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    );
  }

  /* ------------------------------------------------------------------- */
  /*  Main layout – always rendered once data is ready                 */
  /* ------------------------------------------------------------------- */
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 animate-fade-in"
        style={{ 
          backgroundImage: `url(${scpCorridor})`,
          filter: 'brightness(0.4) contrast(1.2)'
        }}
      />
      <div className="absolute inset-0 matrix-bg opacity-50" />
      
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
        <SCPHeader
          classification="EUCLID"
          itemNumber="SCP-CTF"
          title="ACTIVE CONTAINMENT BREACHES"
        />

        {/* Show countdown if before start time */}
        {isBeforeStart && ctfSettings && (
          <div className="max-w-4xl mx-auto mt-8 mb-8 animate-fade-in">
            <CTFCountdown startTime={ctfSettings.start_time} />
          </div>
        )}

        {challenges.length === 0 ? (
          <div className="max-w-3xl mx-auto mt-8 animate-fade-in-delay">
            <Card className="scp-paper border-2 border-border scan-line">
              <CardHeader>
                <div className="classification-bar mb-3" />
                <CardTitle className="flex items-center gap-2 font-mono">
                  <Shield className="h-5 w-5 text-success pulse-glow" />
                  ALL ANOMALIES CONTAINED
                </CardTitle>
                <div className="classification-bar mt-3" />
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-mono text-sm">
                  No active containment breaches detected. All SCP objects
                  remain secure. System integrity at 100%.
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            {challenges.map((challenge, index) => {
              const categoryInfo = getCategoryDetails(challenge.category);
              return (
                <Card
                  key={challenge.id}
                  className="scp-paper border-2 border-border hover:border-primary hover:scale-105 transition-all duration-300 cursor-pointer scan-line group animate-fade-in backdrop-blur-sm"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => navigate(`/challenge/${challenge.id}`)}
                >
                  <CardHeader>
                    <div className="classification-bar mb-3 group-hover:opacity-100 opacity-70 transition-opacity" />
                    <div className="flex items-start justify-between mb-2">
                      <Badge
                        variant="outline"
                        className={`font-mono text-xs ${categoryInfo.color} group-hover:scale-110 transition-transform`}
                      >
                        {categoryInfo.label}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-primary/20 text-primary border-primary font-mono text-xs group-hover:glow-red transition-all"
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
                    <div className="classification-bar mt-3 group-hover:opacity-100 opacity-70 transition-opacity" />
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
