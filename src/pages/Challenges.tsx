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
import { Shield, Lock, Trophy, Clock } from "lucide-react";
import { toast } from "sonner";

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
/*  On‑page countdown component                                       */
/* --------------------------------------------------------------------- */
const ContainmentCountdown = ({ until }: { until: Date }) => {
  const [now, setNow] = useState(new Date());

  /* update every second */
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const diffMs = until.getTime() - now.getTime();
  const totalSec = Math.max(0, Math.floor(diffMs / 1000));
  const days = Math.floor(totalSec / (24 * 60 * 60));
  const hours = Math.floor((totalSec % (24 * 60 * 60)) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  /* human readable event date */
  const eventDate = until.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Card className="scp-paper border-2 border-border mb-6">
      <CardHeader className="flex items-center gap-4">
        <Clock className="h-6 w-6 text-primary" />
        <h3 className="text-lg font-mono font-semibold text-primary">
          Time to Containment Breach (Countdown)
        </h3>
      </CardHeader>

      <CardContent>
        <p className="text-sm font-mono text-muted-foreground mb-1">
          <strong>Countdown:</strong>{" "}
          T‑{days}d {hours}h {minutes}m {seconds}s
        </p>

        <p className="text-sm font-mono text-muted-foreground mb-1">
          <strong>Event date:</strong> {eventDate}
        </p>

        <p className="text-sm font-mono text-muted-foreground">
          {diffMs <= 0
            ? "The breach has launched – you may now access the challenges."
            : "Preparation underway: countdown continues."}
        </p>
      </CardContent>
    </Card>
  );
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
  /*  Countdown target                                                */
  /* ------------------------------------------------------------------- */
  const COUNTDOWN_TARGET = new Date("2025-12-06T00:00:00Z"); // 6 Dec 2025 UTC

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
      <div className="min-h-screen flex flex-col matrix-bg">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="scp-paper border-2 border-border p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto mb-4" />
            <p className="font-mono">ACCESSING DATABASE...</p>
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
  /*  If contest isn’t active and the user isn’t an admin              */
  /* ------------------------------------------------------------------- */
  if (!isAdmin && !isCtfActive) {
    return (
      <div className="min-h-screen flex flex-col matrix-bg">
        <Navbar />

        {/* Countdown card – shown even when the CTF is inactive */}
        <ContainmentCountdown until={COUNTDOWN_TARGET} />

        <main className="flex-1 container mx-auto px-4 py-8">
          <SCPHeader
            classification="SAFE"
            itemNumber="SCP-CTF"
            title="CTF EVENT STATUS"
          />
          <div className="max-w-3xl mx-auto mt-8">
            <Card className="scp-paper border-2 border-border">
              <CardHeader>
                <div className="classification-bar mb-3" />
                <CardTitle className="flex items-center gap-2 font-mono">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  NO ACTIVE CONTAINMENT BREACH
                </CardTitle>
                <div className="classification-bar mt-3" />
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-mono text-sm">
                  There are currently no active CTF events scheduled. Please
                  check back later or contact Foundation administrators for
                  more information.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  /* ------------------------------------------------------------------- */
  /*  Main layout – always rendered once data is ready                 */
  /* ------------------------------------------------------------------- */
  return (
    <div className="min-h-screen flex flex-col matrix-bg">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <SCPHeader
          classification="EUCLID"
          itemNumber="SCP-CTF"
          title="ACTIVE CONTAINMENT BREACHES"
        />

        {/* Countdown displayed in a card at the top of the page */}
        <ContainmentCountdown until={COUNTDOWN_TARGET} />

        {challenges.length === 0 ? (
          <div className="max-w-3xl mx-auto mt-8">
            <Card className="scp-paper border-2 border-border">
              <CardHeader>
                <div className="classification-bar mb-3" />
                <CardTitle className="flex items-center gap-2 font-mono">
                  <Shield className="h-5 w-5 text-success" />
                  ALL ANOMALIES CONTAINED
                </CardTitle>
                <div className="classification-bar mt-3" />
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
                    <div className="classification-bar mb-3" />
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
                    <div className="classification-bar mt-3" />
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
