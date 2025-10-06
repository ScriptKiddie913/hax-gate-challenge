/* --------------------------------------------------------------------- */
/*  Challenges Page – Full Re‑write with pre‑December‑6 countdown        */
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
/*  Helper – Category styling                                          */
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
/*  Countdown component                                                */
/*  --------------------------------------------------------------------*/
const ContainmentCountdown = ({
  until,
  onDismiss,
}: {
  until: Date;
  onDismiss: () => void;
}) => {
  const [now, setNow] = useState(new Date());

  /* update every second */
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const diffMs = until.getTime() - now.getTime();
  const isOver = diffMs <= 0;

  const totalSec = Math.max(0, Math.floor(diffMs / 1000));
  const days = Math.floor(totalSec / (24 * 3600));
  const hours = Math.floor((totalSec % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  useEffect(() => {
    if (isOver) {
      // once the countdown hits zero we simply hide it
      onDismiss();
    }
  }, [isOver, onDismiss]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-black/80"
      aria-live="polite"
    >
      <div className="scp-paper border-2 border-border p-8 relative">
        <Clock className="h-12 w-12 mx-auto text-primary mb-4" />
        <h2 className="text-xl font-mono text-center mb-2">
          T- {days}d {hours}h {minutes}m {seconds}s
        </h2>
        <p className="text-base font-mono text-center text-muted-foreground">
          to containment Breach
        </p>

        <button
          onClick={onDismiss}
          className="mt-6 w-full py-2 bg-primary text-primary-foreground rounded font-mono hover:bg-primary/80 transition-colors"
        >
          Close
        </button>
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
  /*  State – data and UI                                              */
  /* ------------------------------------------------------------------- */
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [ctfSettings, setCtfSettings] = useState<CTFSettings | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ---------------- Countdown UI ------------------------------------- */
  const [countdownVisible, setCountdownVisible] = useState(false);
  // the date that the countdown will target
  const COUNTDOWN_TARGET = new Date("2025-12-06T00:00:00Z");

  /* ------------------------------------------------------------------- */
  /*  Data loading – once on mount                                     */
  /* ------------------------------------------------------------------- */
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      /* ---------------- Auth ---------------------------------------- */
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/auth");
        return;
      }

      /* ---------------- Admin check --------------------------------- */
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      setIsAdmin(!!roles);

      /* ---------------- Load CTF configuration --------------------- */
      const { data: settings } = await supabase
        .from("ctf_settings")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      setCtfSettings(settings);

      /* ---------------- Load challenges if allowed ----------------- */
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

  /* ------------------------------------------------------------------- */
  /*  UI – Loading skeleton                                            */
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
  /*  Helpers – check if CTF active / time before start                */
  /* ------------------------------------------------------------------- */
  const now = new Date().toISOString();
  const isCtfActive =
    ctfSettings &&
    ctfSettings.is_active &&
    now >= ctfSettings.start_time &&
    now <= ctfSettings.end_time;

  const isBeforeStart = ctfSettings && now < ctfSettings.start_time;

  /* ------------------------------------------------------------------- */
  /*  Pre‑December‑6: If user is not an admin and the countdown is
   *  still running we prevent navigation to challenge pages.
   *  The Countdown component will be shown below, but still
   *  rendered inside this component.
   */
  /* ------------------------------------------------------------------- */
  const handleCardClick = (id: string) => {
    /* If the user tries to open a challenge before 6 Dec 2025, show
     * the countdown overlay instead of navigating. */
    if (new Date() < COUNTDOWN_TARGET) {
      setCountdownVisible(true);
      return;
    }

    /* Normal navigation – allowed after 6 Dec or to admins */
    navigate(`/challenges/${id}`);
  };

  /* ------------------------------------------------------------------- */
  /*  UI – If the CTF isn’t active (and we’re not an admin)             */
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
  /*  UI – Countdown for users who click a challenge before 6 Dec      */
  /* ------------------------------------------------------------------- */
  if (countdownVisible) {
    return (
      <div className="min-h-screen flex flex-col matrix-bg">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 relative">
          <SCPHeader
            classification="KETER"
            itemNumber="SCP-CTF"
            title="CONTAINMENT BREACH EVENT"
          />

          {/* Main content – still visible beneath the overlay */}
          <div className="max-w-3xl mx-auto mt-8">
            <Card className="scp-paper border-2 border-border">
              <CardHeader>
                <div className="classification-bar mb-3"></div>
                <CardTitle className="flex items-center gap-2 font-mono">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  COUNTDOWN TO 6 DEC 2025
                </CardTitle>
                <div className="classification-bar mt-3"></div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-mono text-sm">
                  You cannot open challenge pages before the containment breach
                  begins.  Please wait until the event starts.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Full‑screen overlay countdown */}
          <ContainmentCountdown
            until={COUNTDOWN_TARGET}
            onDismiss={() => setCountdownVisible(false)}
          />
        </main>
      </div>
    );
  }

  /* ------------------------------------------------------------------- */
  /*  UI – Normal: CTF active or you are admin                         */
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
                  onClick={() => handleCardClick(challenge.id)}
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
