import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { SCPHeader } from "@/components/SCPHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Trophy, Calendar, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

/* ------------------------------------------------------------ */
/* Types                                                        */
/* ------------------------------------------------------------ */
interface Profile {
  id: string;
  username: string;
  email: string;
  created_at: string;
  is_banned: boolean | null;
}

interface UserStats {
  total_points: number;
  solved_count: number;
  total_submissions: number;
}

/* ------------------------------------------------------------ */
/* Main Component                                               */
/* ------------------------------------------------------------ */
export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<UserStats>({
    total_points: 0,
    solved_count: 0,
    total_submissions: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [fireflies, setFireflies] = useState<
    { id: number; top: string; left: string; delay: string; size: string }[]
  >([]);

  /* ------------------------------------------------------------ */
  /* Effects                                                      */
  /* ------------------------------------------------------------ */
  useEffect(() => {
    loadUserProfile();

    // Christmas + cyberpunk fireflies
    const generated = Array.from({ length: 26 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 6}s`,
      size: `${3 + Math.random() * 4}px`,
    }));
    setFireflies(generated);
  }, []);

  /* ------------------------------------------------------------ */
  /* Load Profile + Stats                                         */
  /* ------------------------------------------------------------ */
  const loadUserProfile = async () => {
    try {
      /* 🔥 FIX #1 — Use getUser() instead of getSession() */
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) {
        navigate("/auth");
        return;
      }

      /* Load profile */
      const { data: profileRow, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profileRow) throw new Error("Profile not found");

      setProfile(profileRow);

      /* Load user submissions + joined challenge points */
      const { data: submissions, error: submissionError } = await supabase
        .from("submissions")
        .select(
          `
          result,
          challenge_id,
          challenges(points)
        `
        )
        .eq("user_id", user.id);

      if (submissionError) throw submissionError;

      if (submissions) {
        const correct = submissions.filter((s) => s.result === "CORRECT");
        const solvedSet = new Set(correct.map((s: any) => s.challenge_id));
        const totalPoints = correct.reduce((sum, s: any) => {
          return sum + (s.challenges?.points || 0);
        }, 0);

        setStats({
          total_points: totalPoints,
          solved_count: solvedSet.size,
          total_submissions: submissions.length,
        });
      }

      setLoading(false);
    } catch (error: any) {
      console.error("Profile Load Error:", error);
      toast.error("Error loading profile");
      navigate("/");
    }
  };

  /* ------------------------------------------------------------ */
  /* Loading Screen                                               */
  /* ------------------------------------------------------------ */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15 animate-fade-in"
          style={{
            backgroundImage: "url('/images/s.png')",
            filter: "brightness(0.28) contrast(1.28)",
          }}
        />

        {/* Soft cyber blue Christmas overlay */}
        <div className="absolute inset-0 bg-[#030b1d]/80 backdrop-blur-sm"></div>

        <Navbar />

        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="scp-paper border-2 border-primary p-8 scan-line frosted-card">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto mb-4" />
            <p className="font-mono text-primary">LOADING PERSONNEL FILE...</p>
          </div>
        </div>

        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="snowflake"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${6 + Math.random() * 6}s`,
            }}
          >
            ❄
          </div>
        ))}
      </div>
    );
  }

  if (!profile) return null;

  /* ------------------------------------------------------------ */
  /* MAIN PAGE                                                    */
  /* ------------------------------------------------------------ */
  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        backgroundImage: "url('/images/s.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Cyberpunk + Christmas Mix Layers */}
      <div className="absolute inset-0 bg-[#020817]/70 backdrop-blur-[2px]"></div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(90,150,255,0.17),transparent_70%)] animate-[pulse_8s_infinite]"></div>

      {/* Snowfall */}
      {Array.from({ length: 55 }).map((_, i) => (
        <div
          key={i}
          className="snowflake"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random()}s`,
            animationDuration: `${6 + Math.random() * 6}s`,
          }}
        >
          ❄
        </div>
      ))}

      {/* Fireflies */}
      {fireflies.map((f) => (
        <div
          key={f.id}
          className="firefly"
          style={{
            top: f.top,
            left: f.left,
            width: f.size,
            height: f.size,
            animationDelay: f.delay,
          }}
        ></div>
      ))}

      {/* Ornaments */}
      <div className="ornament-row">
        <div className="ornament">🔔</div>
        <div className="ornament">🎄</div>
        <div className="ornament">🎁</div>
      </div>

      <Navbar />

      {/* MAIN CONTENT */}
      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <SCPHeader
          classification="SAFE"
          itemNumber="SCP-PROFILE"
          title="PERSONNEL RECORD"
        />

        <div className="grid gap-6 md:grid-cols-2">

          {/* --------------------------- PROFILE CARD --------------------------- */}
          <Card className="scp-paper border-2 border-border scan-line frosted-card">
            <CardHeader>
              <div className="classification-bar mb-3"></div>
              <CardTitle className="flex items-center gap-2 font-mono">
                <User className="h-5 w-5 text-primary" />
                PERSONNEL DATA
              </CardTitle>
              <div className="classification-bar mt-3"></div>
            </CardHeader>

            <CardContent className="space-y-4">

              <div>
                <p className="label">Designation:</p>
                <p className="value">{profile.username}</p>
              </div>

              <div>
                <p className="label">Contact:</p>
                <p className="value-sm">{profile.email}</p>
              </div>

              <div>
                <p className="label">Enrollment Date:</p>
                <p className="value-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(profile.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div>
                <p className="label">Security Status:</p>
                <Badge
                  variant="outline"
                  className={
                    profile.is_banned
                      ? "danger-badge"
                      : "success-badge"
                  }
                >
                  {profile.is_banned ? "ACCESS REVOKED" : "ACTIVE CLEARANCE"}
                </Badge>
              </div>

              <div>
                <p className="label">User ID:</p>
                <p className="id-text">{profile.id}</p>
              </div>
            </CardContent>
          </Card>

          {/* --------------------------- STATS CARD --------------------------- */}
          <Card className="scp-paper border-2 border-border scan-line frosted-card">
            <CardHeader>
              <div className="classification-bar mb-3"></div>
              <CardTitle className="flex items-center gap-2 font-mono">
                <Trophy className="h-5 w-5 text-primary" />
                CONTAINMENT STATISTICS
              </CardTitle>
              <div className="classification-bar mt-3"></div>
            </CardHeader>

            <CardContent className="space-y-4">

              <div className="stat-row">
                <span className="stat-label">CLEARANCE POINTS</span>
                <span className="stat-value text-primary">{stats.total_points}</span>
              </div>

              <div className="stat-row">
                <span className="stat-label">CONTAINMENTS SECURED</span>
                <span className="stat-value text-success">{stats.solved_count}</span>
              </div>

              <div className="stat-row">
                <span className="stat-label">TOTAL ATTEMPTS</span>
                <span className="stat-value">{stats.total_submissions}</span>
              </div>

              <div className="stat-row">
                <span className="stat-label">SUCCESS RATE</span>
                <span className="stat-value">
                  {stats.total_submissions > 0
                    ? `${((stats.solved_count / stats.total_submissions) * 100).toFixed(1)}%`
                    : "0%"}
                </span>
              </div>

            </CardContent>
          </Card>

          {/* ---------------------- SECURITY NOTICE ---------------------- */}
          <Card className="scp-paper border-2 border-primary frosted-card md:col-span-2">
            <CardHeader>
              <div className="classification-bar mb-3"></div>
              <CardTitle className="flex items-center gap-2 font-mono text-primary">
                <AlertTriangle className="h-5 w-5" />
                SECURITY NOTICE
              </CardTitle>
              <div className="classification-bar mt-3"></div>
            </CardHeader>

            <CardContent>
              <div className="space-y-3 font-mono text-sm">

                <p>
                  <strong className="text-primary">CLASSIFIED:</strong> All personnel records are monitored
                  and subject to O5 Council review. Unauthorized access will result in 
                  immediate <span className="redacted">REDACTED</span> procedures.
                </p>

                <p className="text-muted-foreground">
                  All activities in the CTF Division are monitored. Every attempt impacts your
                  security clearance progression.
                </p>

                <div className="flex gap-4 mt-4 text-xs">
                  <div className="sec-box">
                    <p className="sec-label">THREAT LEVEL</p>
                    <p className="sec-value text-success">MINIMAL</p>
                  </div>
                  <div className="sec-box">
                    <p className="sec-label">CLEARANCE</p>
                    <p className="sec-value text-primary">
                      LEVEL-
                      {stats.solved_count > 10
                        ? "3"
                        : stats.solved_count > 5
                        ? "2"
                        : "1"}
                    </p>
                  </div>
                  <div className="sec-box">
                    <p className="sec-label">STATUS</p>
                    <p className="sec-value">
                      {profile.is_banned ? "REVOKED" : "ACTIVE"}
                    </p>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* ------------------------------------------------------------ */}
      {/* Christmas + Cyberpunk Styles */}
      {/* ------------------------------------------------------------ */}
      <style>{`
        /* Fireflies */
        .firefly {
          position: absolute;
          background: #b8d6ff;
          border-radius: 50%;
          box-shadow: 0 0 14px #9ec9ff, 0 0 22px #7faafe;
          opacity: 0.85;
          animation: floatFirefly 10s infinite ease-in-out;
          pointer-events: none;
        }
        @keyframes floatFirefly {
          0% { transform: translateY(0) translateX(0) scale(1); }
          50% { transform: translateY(-20px) translateX(8px) scale(1.2); }
          100% { transform: translateY(0) translateX(0) scale(1); }
        }

        /* Snow */
        .snowflake {
          position: absolute;
          top: -5%;
          font-size: 14px;
          color: rgba(255,255,255,0.95);
          animation: snowfall linear infinite;
          pointer-events: none;
        }
        @keyframes snowfall {
          0% { transform: translateY(-10vh) rotate(0deg); }
          100% { transform: translateY(110vh) rotate(360deg); }
        }

        .ornament-row {
          position: absolute;
          top: 12px;
          width: 100%;
          display: flex;
          justify-content: center;
          gap: 18px;
          z-index: 25;
        }
        .ornament {
          font-size: 22px;
          animation: ornamentSwing 4s ease-in-out infinite;
        }
        @keyframes ornamentSwing {
          0% { transform: rotate(-4deg); }
          50% { transform: rotate(4deg); }
          100% { transform: rotate(-4deg); }
        }

        /* Frosted glass card */
        .frosted-card {
          background: rgba(255,255,255,0.015);
          backdrop-filter: blur(10px) saturate(120%);
          border-radius: 10px;
        }

        .label {
          font-size: 11px;
          text-transform: uppercase;
          color: #9eb6d9;
          margin-bottom: 2px;
        }
        .value {
          font-size: 20px;
          font-weight: bold;
          font-family: monospace;
        }
        .value-sm {
          font-size: 14px;
          font-family: monospace;
        }
        .id-text {
          font-size: 11px;
          font-family: monospace;
          color: #7886a5;
          word-break: break-all;
        }

        /* Stats rows */
        .stat-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          border: 1px solid rgba(120,150,255,0.2);
          background: rgba(0,0,0,0.2);
        }
        .stat-label {
          font-size: 12px;
          color: #9eb7d9;
          font-family: monospace;
        }
        .stat-value {
          font-size: 20px;
          font-family: monospace;
        }

        /* Security Box */
        .sec-box {
          flex: 1;
          padding: 8px;
          border: 1px solid rgba(120,150,255,0.2);
          background: rgba(0,0,0,0.2);
        }
        .sec-label {
          color: #9eb7d9;
        }
        .sec-value {
          font-weight: bold;
          font-family: monospace;
        }

        /* Badges */
        .danger-badge {
          background: rgba(255,80,80,0.15);
          color: #ff5f5f;
          border-color: #ff5f5f;
        }
        .success-badge {
          background: rgba(80,255,150,0.2);
          color: #5fff9a;
          border-color: #5fff9a;
        }

        /* Redacted */
        .redacted {
          background: #ff2745;
          color: transparent;
          padding: 0 4px;
          text-shadow: none;
        }

        .scan-line::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(90,150,255,0.1), transparent);
          animation: scanMove 3s infinite linear;
          pointer-events: none;
        }
        @keyframes scanMove {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
}
