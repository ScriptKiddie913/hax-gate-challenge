/* --------------------------------------------------------------------- */
/*  Challenges page – Christmas-festive SCP theme, full rewrite         */
/*  Keeps all background images and logic intact.                       */
/* --------------------------------------------------------------------- */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ChallengeDialog } from "@/components/ChallengeDialog";
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
/*  Types                                                               */
/* --------------------------------------------------------------------- */
interface Challenge {
  id: string;
  title: string;
  category: string;
  points: number;
  description_md: string;
  files?: Array<{ name: string; url: string }>;
  links?: Array<{ name: string; url: string }>;
  isSolved?: boolean;
}

interface CTFSettings {
  start_time: string;
  end_time: string;
  is_active: boolean;
}

/* --------------------------------------------------------------------- */
/*  Category helpers                                                     */
/* --------------------------------------------------------------------- */
const getCategoryIcon = (category: string) => {
  const categoryMap: Record<string, string> = {
    OSINT: "🔍",
    Web: "🌐",
    Forensics: "🔬",
    Misc: "🎯",
    Crypto: "🔐",
    Malware: "☠️",
  };
  return categoryMap[category] || "📁";
};

const getCategoryColor = (category: string) => {
  const colorMap: Record<string, string> = {
    OSINT: "from-cyan-500/20 to-blue-600/20 border-cyan-500/30",
    Web: "from-blue-500/20 to-indigo-600/20 border-blue-500/30",
    Forensics: "from-purple-500/20 to-violet-600/20 border-purple-500/30",
    Misc: "from-pink-500/20 to-rose-600/20 border-pink-500/30",
    Crypto: "from-amber-500/20 to-yellow-600/20 border-amber-500/30",
    Malware: "from-red-500/20 to-rose-600/20 border-red-500/30",
  };
  return colorMap[category] || "from-gray-500/20 to-slate-600/20 border-gray-500/30";
};

/* --------------------------------------------------------------------- */
/*  Main component – Challenges                                          */
/* --------------------------------------------------------------------- */
export default function Challenges() {
  const navigate = useNavigate();

  /* ------------------------------------------------------------------- */
  /*  State                                                              */
  /* ------------------------------------------------------------------- */
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [ctfSettings, setCtfSettings] = useState<CTFSettings | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [solvedChallenges, setSolvedChallenges] = useState<Set<string>>(new Set());
  const [blobs, setBlobs] = useState<
    { id: number; top: string; left: string; size: string; delay: string }[]
  >([]);

  /* ------------------------------------------------------------------- */
  /*  Decorative blobs for festive background                            */
  /* ------------------------------------------------------------------- */
  useEffect(() => {
    const generated = Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${80 + Math.random() * 120}px`,
      delay: `${Math.random() * 6}s`,
    }));
    setBlobs(generated);
  }, []);

  /* ------------------------------------------------------------------- */
  /*  Load data once on mount                                             */
  /* ------------------------------------------------------------------- */
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

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
          .select("id, title, category, points, description_md, files, links")
          .eq("is_published", true)
          .order("points", { ascending: true });

        if (error) throw error;

        /* ---------------- Fetch solved challenges for user ---- */
        const { data: solvedData } = await supabase
          .from("submissions")
          .select("challenge_id")
          .eq("user_id", user.id)
          .eq("result", "CORRECT");

        const solved = new Set(solvedData?.map((s: any) => s.challenge_id) || []);
        setSolvedChallenges(solved);

        setChallenges((challengesData ?? []).map((d: any) => ({
          ...d,
          files: Array.isArray(d.files) ? d.files as Array<{ name: string; url: string }> : [],
          links: Array.isArray(d.links) ? d.links as Array<{ name: string; url: string }> : [],
          isSolved: solved.has(d.id),
        })));
      } else {
        // If not admin and CTF inactive, still set empty list (handled below)
        setChallenges([]);
      }
    } catch (error: any) {
      toast.error("Error loading challenges");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------------------------------------------- */
  /*  Loading skeleton                                                    */
  /* ------------------------------------------------------------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col matrix-bg relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15 animate-fade-in"
          style={{
            backgroundImage: `url(${scpCorridor})`,
            filter: "brightness(0.3) contrast(1.2)",
          }}
        />
        <Navbar />
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="scp-paper border-2 border-border p-8 scan-line">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto mb-4 glow-blue-box" />
            <p className="font-mono text-primary pulse-glow">ACCESSING DATABASE...</p>
          </div>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------- */
  /*  Check if CTF is currently active                                   */
  /* ------------------------------------------------------------------- */
  const now = new Date().toISOString();
  const isCtfActive =
    ctfSettings &&
    ctfSettings.is_active &&
    now >= ctfSettings.start_time &&
    now <= ctfSettings.end_time;

  const isBeforeStart = ctfSettings && now < ctfSettings.start_time;

  /* ------------------------------------------------------------------- */
  /*  If contest isn't active and the user isn't an admin                */
  /* ------------------------------------------------------------------- */
  if (!isAdmin && !isCtfActive) {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 animate-fade-in"
          style={{
            backgroundImage: `url(${scpCreature})`,
            filter: "brightness(0.2) contrast(1.3)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/85 to-background/95" />
        <div className="absolute inset-0 matrix-bg opacity-40" />

        {/* Festive decorative ornaments (non-intrusive) */}
        <div className="absolute top-8 right-8 pointer-events-none">
          <div className="w-10 h-10 rounded-full bg-[#c9e6ff]/10 flex items-center justify-center border border-[#bfe7ff]/20 shadow-[0_0_10px_rgba(120,160,255,0.15)]">
            🎁
          </div>
        </div>

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
              <Card className="scp-paper border-2 border-destructive glow-blue-box">
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
  /*  Group challenges by category                                        */
  /* ------------------------------------------------------------------- */
  const groupedChallenges = challenges.reduce((acc, challenge) => {
    const cat = challenge.category;
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(challenge);
    return acc;
  }, {} as Record<string, Challenge[]>);

  const categories = Object.keys(groupedChallenges).sort();

  /* ------------------------------------------------------------------- */
  /*  Main layout – always rendered once data is ready                    */
  /* ------------------------------------------------------------------- */
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background corridor image (kept) */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15 animate-fade-in"
        style={{
          backgroundImage: `url(${scpCorridor})`,
          filter: "brightness(0.3) contrast(1.2)",
        }}
      />
      {/* matrix-like subtle overlay */}
      <div className="absolute inset-0 matrix-bg opacity-50" />

      {/* Subtle ornaments and holly accent (non-intrusive) */}
      <div className="absolute left-6 bottom-12 pointer-events-none">
        <div className="w-12 h-12 rounded-full bg-[#ffe4b5]/5 flex items-center justify-center border border-[#ffd9a8]/10 shadow-[0_0_10px_rgba(255,215,150,0.05)]">
          🎄
        </div>
      </div>

      {/* Floating festive blobs */}
      {blobs.map((b) => (
        <div
          key={b.id}
          className="absolute rounded-full opacity-80 pointer-events-none"
          style={{
            top: b.top,
            left: b.left,
            width: b.size,
            height: b.size,
            background:
              "radial-gradient(circle at 30% 30%, rgba(180,220,255,0.18), rgba(100,140,255,0.06))",
            filter: "blur(28px)",
            animation: `blobFloat ${6 + Math.random() * 6}s ease-in-out infinite`,
            animationDelay: b.delay,
          }}
        />
      ))}

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
                  No active containment breaches detected. All SCP objects remain secure.
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-12 mt-8">
            {categories.map((category, catIndex) => (
              <div
                key={category}
                className="space-y-6 animate-fade-in"
                style={{ animationDelay: `${catIndex * 100}ms` }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{getCategoryIcon(category)}</span>
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-primary glow-blue">
                      {category}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {groupedChallenges[category].length} challenge
                      {groupedChallenges[category].length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedChallenges[category].map((challenge, index) => (
                    <Card
                      key={challenge.id}
                      className={`group relative overflow-hidden backdrop-blur-sm border transition-all duration-300 animate-fade-in ${
                        challenge.isSolved
                          ? "bg-gradient-to-br from-green-500/30 to-green-600/30 border-green-500/50 cursor-default"
                          : `bg-gradient-to-br ${getCategoryColor(
                              category
                            )} cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-primary/20`
                      }`}
                      style={{ animationDelay: `${(catIndex * 3 + index) * 50}ms` }}
                      onClick={() => {
                        // Only open for unsolved or to view details
                        setSelectedChallenge(challenge);
                        setDialogOpen(true);
                      }}
                    >
                      {/* subtle decorative header overlay */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div className="scan-line" />
                      </div>

                      <CardHeader className="relative z-10">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle
                            className={`text-xl font-bold transition-colors ${
                              challenge.isSolved ? "text-green-400" : "group-hover:text-primary"
                            }`}
                          >
                            {challenge.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-2xl">{getCategoryIcon(category)}</span>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-mono font-bold ${
                                challenge.isSolved
                                  ? "bg-green-500/30 text-green-400 border border-green-500/50"
                                  : "bg-primary/20 glow-blue"
                              }`}
                            >
                              {challenge.points}pts
                            </span>
                          </div>
                        </div>
                        <CardDescription
                          className={`text-xs uppercase tracking-wider font-mono ${
                            challenge.isSolved ? "text-green-400/80" : ""
                          }`}
                        >
                          {category} {challenge.isSolved && "✓ SOLVED"}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="relative z-10">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {challenge.description_md?.substring(0, 150) ?? ""}...
                        </p>
                      </CardContent>

                      {/* bottom shimmer */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity pulse-glow" />
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <ChallengeDialog
        challenge={selectedChallenge}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialSolvedState={selectedChallenge?.isSolved || false}
        onChallengeUpdate={loadData}
      />

      {/* Local animations & festive CSS (kept self-contained) */}
      <style>{`
        /* Snowfall animation used across pages */
        @keyframes snowFall {
          0% { transform: translateY(-5vh); opacity: 1; }
          100% { transform: translateY(110vh); opacity: 0.25; }
        }

        /* Floating blob gentle motion */
        @keyframes blobFloat {
          0% { transform: translateY(0) translateX(0) scale(1); }
          50% { transform: translateY(-12px) translateX(6px) scale(1.02); }
          100% { transform: translateY(0) translateX(0) scale(1); }
        }

        /* Twinkle for lights */
        @keyframes christmasLightTwinkle {
          0%, 100% { opacity: 1; transform: scale(1); filter: drop-shadow(0 0 8px rgba(255,255,255,0.12)); }
          50% { opacity: 0.6; transform: scale(0.92); filter: none; }
        }

        /* Ambient holographic shimmer */
        @keyframes softblink {
          0%, 100% { opacity: 0.45; filter: brightness(0.9); }
          50% { opacity: 0.95; filter: brightness(1.16); }
        }

        /* Simple fade-in & float reused */
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .snowfall .snowflake {
          position: absolute;
          top: -10vh;
          color: rgba(255,255,255,0.95);
          animation-name: snowFall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          pointer-events: none;
        }

        .christmas-lights {
          animation: christmasLightTwinkle 1.6s ease-in-out infinite;
        }

        .festive-glow {
          animation: softblink 6s infinite;
        }

        .scan-line::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(160,200,255,0.08), transparent);
          animation: scan 3s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes scan {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .pulse-glow {
          animation: pulse-glow 2.2s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0% { box-shadow: 0 0 6px rgba(100,160,255,0.15); }
          50% { box-shadow: 0 0 20px rgba(100,160,255,0.28); }
          100% { box-shadow: 0 0 6px rgba(100,160,255,0.15); }
        }

        .animate-fade-in { animation: fade-in 0.6s ease forwards; }
        .animate-fade-in-delay { animation: fade-in 0.6s ease 0.25s forwards; }
      `}</style>
    </div>
  );
}
