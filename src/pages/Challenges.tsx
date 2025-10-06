/* --------------------------------------------------------------------- */
/*  Challenges page – always open to a countdown overlay until 6‑Dec‑2025 */
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
import { CTFCountdown } from "@/components/CTFCountdown";
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
/*  Countdown overlay component                                       */
/* --------------------------------------------------------------------- */
const ContainmentCountdown = ({ until }: { until: Date }) => {
  const [now, setNow] = useState(new Date());

  /* update once per second */
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const diffMs = until.getTime() - now.getTime();
  const isOver = diffMs <= 0;

  const totalSec = Math.max(0, Math.floor(diffMs / 1000));
  const days = Math.floor(totalSec / (24 * 60 * 60));
  const hours = Math.floor((totalSec % (24 * 60 * 60)) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      aria-live="polite"
    >
      <div className="scp-paper border-2 border-border p-8 text-center relative">
        <Clock className="h-12 w-12 mx-auto text-primary mb-4" />
        <h2 className="text-xl font-mono mb-2">
          T- {days}d {hours}h {minutes}m {seconds}s
        </h2>
        <p className="text-sm font-mono text-muted-foreground mb-4">
          to containment Breach
        </p>
        <p className="text-base font-mono text-muted-foreground">
          {isOver
            ? "The breach has launched – you may now access the challenges."
            : "Please wait until the event starts."}
        </p>
      </div>
    </div>
  );
};

/* --------------------------------------------------------------------- */
/*  Main component – Challenges                                        */
/* --------------------------------------------------------------------- */
export default function Challenges() {
  const navigate = useNavigate();

  /* ------------------------------------------------------------------- */
  /*  State – data & UI                                                  */
  /* ------------------------------------------------------------------- */
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [ctfSettings, setCtfSettings] = useState<CTFSettings | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ------------------------------------------------------------------- */
  /*  Countdown overlay                                               */
  /* ------------------------------------------------------------------- */
  const [showOverlay, setShowOverlay] = useState(false);
  const COUNTDOWN_TARGET = new Date("2025-12-06T00:00:00Z"); // 6 Dec 2025 UTC

  /* ------------------------------------------------------------------- */
  /*  Load data once on mount                                          */
  /* ------------------------------------------------------------------- */
  useEffect(() => {
    loadData();
    // If the contest hasn’t started yet, show the overlay immediately
    if (new Date() < COUNTDOWN_TARGET) setShowOverlay(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      /* ---------------- Auth -------------------------------------- */
      const {
        data: { user },
      } = await supabase.auth.getUser();

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
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto mb-4"></div>
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
      <main className="flex-1 container mx-auto px-4 py-8 relative">
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

        {/* ----------------------------------------------------------------- */}
        {/*  Overlay – always present until dismissed                        */}
        {/* ----------------------------------------------------------------- */}
        {showOverlay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <div className="scp-paper border-2 border-border p-8 relative text-center">
              <ContainmentCountdown until={COUNTDOWN_TARGET} />

              {/* Close button to let user go to other pages after timer is visible */}
              <button
                onClick={() => setShowOverlay(false)}
                className="mt-6 w-full py-2 bg-primary text-primary-foreground rounded font-mono hover:bg-primary/80 transition-colors"
              >
                Close (you can now navigate)
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
