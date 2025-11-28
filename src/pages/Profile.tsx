import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { SCPHeader } from "@/components/SCPHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Trophy, Calendar, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface Profile {
  id: string;
  username: string;
  email: string;
  created_at: string;
  is_banned: boolean;
}

interface UserStats {
  total_points: number;
  solved_count: number;
  total_submissions: number;
}

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<UserStats>({ total_points: 0, solved_count: 0, total_submissions: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [fireflies, setFireflies] = useState<
    { id: number; top: string; left: string; delay: string; size: string }[]
  >([]);

  useEffect(() => {
    loadProfile();

    // Generate fireflies
    const generated = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 6}s`,
      size: `${3 + Math.random() * 4}px`,
    }));
    setFireflies(generated);
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate("/auth");
        return;
      }

      // Load profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Load stats
      const { data: submissions } = await supabase
        .from("submissions")
        .select("result, challenge_id, challenges(points)")
        .eq("user_id", session.user.id);

      if (submissions) {
        const correctSubmissions = submissions.filter((s) => s.result === "CORRECT");
        const uniqueChallenges = new Set(correctSubmissions.map((s) => s.challenge_id));
        const totalPoints = correctSubmissions.reduce((sum, s) => {
          const points = (s.challenges as any)?.points || 0;
          return sum + points;
        }, 0);

        setStats({
          total_points: totalPoints,
          solved_count: uniqueChallenges.size,
          total_submissions: submissions.length,
        });
      }

      setLoading(false);
    } catch (error: any) {
      toast.error("Error loading profile");
      console.error(error);
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col matrix-bg">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="scp-paper border-2 border-border p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto mb-4"></div>
            <p className="font-mono">LOADING PERSONNEL FILE...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

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
      {/* =========================
          Winter decorations: Aurora, snow layers, trees, ornaments, bells
          Non-intrusive and behind content (z-index ordering)
          ========================= */}

      {/* Aurora band (tri-phase) */}
      <div aria-hidden className="absolute top-0 left-0 right-0 h-56 pointer-events-none z-10">
        <div className="aurora-wrap absolute inset-0 overflow-hidden">
          <div className="aurora-layer back"></div>
          <div className="aurora-layer mid"></div>
          <div className="aurora-layer front"></div>
        </div>
      </div>

      {/* Snow layers */}
      <div aria-hidden className="absolute inset-0 pointer-events-none z-30">
        <div className="snow-layer micro"></div>
        <div className="snow-layer fine"></div>
        <div className="snow-layer medium"></div>
        <div className="snow-layer large"></div>
        <div className="snow-layer crystals"></div>
      </div>

      {/* Decorative tree silhouettes (bottom, far behind) */}
      <div aria-hidden className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
        <div className="container mx-auto px-4 relative">
          <div className="absolute -bottom-10 left-4 w-36 h-44 tree-silhouette opacity-70 transform -scale-x-100"></div>
          <div className="absolute -bottom-8 right-8 w-48 h-56 tree-silhouette opacity-80"></div>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-60 h-64 tree-silhouette opacity-60"></div>
        </div>
      </div>

      {/* Hanging ornaments & bells (edges only) */}
      <div aria-hidden className="absolute top-28 left-6 z-40 pointer-events-none">
        <div className="flex flex-col gap-6 items-start">
          <div className="ornament ornament-ice"></div>
          <div className="bell ornament-bell"></div>
        </div>
      </div>
      <div aria-hidden className="absolute top-32 right-8 z-40 pointer-events-none">
        <div className="flex flex-col gap-6 items-end">
          <div className="ornament ornament-ice small"></div>
          <div className="ornament ornament-gold small"></div>
        </div>
      </div>

      {/* Snow fox silhouette near footer (decorative) */}
      <div aria-hidden className="absolute bottom-2 right-6 z-20 pointer-events-none">
        <svg className="w-24 h-12 opacity-70" viewBox="0 0 200 100" fill="none" aria-hidden>
          <path d="M10 70 Q30 20 70 40 T150 60" stroke="#d9f3ff" strokeWidth="2" fill="none" opacity="0.9" />
          <ellipse cx="70" cy="72" rx="40" ry="8" fill="#0b1b2e" opacity="0.6" />
        </svg>
      </div>

      {/* Fireflies (kept as original) */}
      {fireflies.map((f) => (
        <div
          key={f.id}
          className="absolute bg-[#b8d6ff] rounded-full blur-[3px] opacity-70 animate-[float_10s_infinite_ease-in-out] z-40 pointer-events-none"
          style={{
            top: f.top,
            left: f.left,
            width: f.size,
            height: f.size,
            boxShadow: "0 0 10px rgba(160,200,255,0.6), 0 0 20px rgba(120,160,255,0.4)",
            animationDelay: f.delay,
          }}
        />
      ))}

      {/* Blue ambient overlay */}
      <div className="absolute inset-0 bg-[#030b1d]/75 backdrop-blur-[2px] z-0"></div>

      {/* soft radial pulse */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(90,150,255,0.08),transparent_70%)] animate-[pulse_8s_infinite_ease-in-out] z-5 pointer-events-none"></div>

      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
        <SCPHeader classification="SAFE" itemNumber="SCP-PROFILE" title="PERSONNEL RECORD" />

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Info Card */}
          <Card className="scp-paper border-2 border-border scan-line animate-fade-in relative overflow-visible">
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
                <p className="text-xs text-muted-foreground mb-1 font-mono uppercase">Designation:</p>
                <p className="font-mono font-bold text-lg">{profile.username}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1 font-mono uppercase">Contact:</p>
                <p className="font-mono text-sm">{profile.email}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1 font-mono uppercase">Enrollment Date:</p>
                <p className="flex items-center gap-2 font-mono text-sm">
                  <Calendar className="h-4 w-4" />
                  {new Date(profile.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1 font-mono uppercase">Security Status:</p>
                <Badge
                  variant="outline"
                  className={
                    profile.is_banned
                      ? "bg-destructive/20 text-destructive border-destructive"
                      : "bg-success/20 text-success border-success"
                  }
                >
                  {profile.is_banned ? "ACCESS REVOKED" : "ACTIVE CLEARANCE"}
                </Badge>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1 font-mono uppercase">User ID:</p>
                <p className="font-mono text-xs text-muted-foreground break-all">{profile.id}</p>
              </div>
            </CardContent>
            {/* Frost accent bottom-left (decorative, non-obtrusive) */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 frost-accent opacity-30 pointer-events-none" />
          </Card>

          {/* Stats Card */}
          <Card className="scp-paper border-2 border-border scan-line animate-fade-in-delay relative overflow-visible">
            <CardHeader>
              <div className="classification-bar mb-3"></div>
              <CardTitle className="flex items-center gap-2 font-mono">
                <Trophy className="h-5 w-5 text-primary" />
                CONTAINMENT STATISTICS
              </CardTitle>
              <div className="classification-bar mt-3"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-background/50 border border-border">
                <span className="text-muted-foreground font-mono text-sm">CLEARANCE POINTS</span>
                <span className="font-mono font-bold text-2xl text-primary pulse-glow">{stats.total_points}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-background/50 border border-border">
                <span className="text-muted-foreground font-mono text-sm">CONTAINMENTS SECURED</span>
                <span className="font-mono font-bold text-xl text-success">{stats.solved_count}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-background/50 border border-border">
                <span className="text-muted-foreground font-mono text-sm">TOTAL ATTEMPTS</span>
                <span className="font-mono font-bold">{stats.total_submissions}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-background/50 border border-border">
                <span className="text-muted-foreground font-mono text-sm">SUCCESS RATE</span>
                <span className="font-mono font-bold">
                  {stats.total_submissions > 0 ? `${((stats.solved_count / stats.total_submissions) * 100).toFixed(1)}%` : "0%"}
                </span>
              </div>

              <div className="classification-bar mt-4"></div>
            </CardContent>

            {/* small ornament peek (non-interactive) */}
            <div className="absolute -top-6 -right-6 w-10 h-10 ornament ornament-ice opacity-90 pointer-events-none" />
          </Card>

          {/* Security Notice */}
          <Card className="scp-paper border-2 border-primary md:col-span-2 glow-red animate-fade-in-delay relative overflow-visible">
            <CardHeader>
              <div className="classification-bar mb-3"></div>
              <CardTitle className="flex items-center gap-2 font-mono text-primary">
                <AlertTriangle className="h-5 w-5 animate-pulse" />
                SECURITY NOTICE
              </CardTitle>
              <div className="classification-bar mt-3"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <p className="font-mono">
                  <strong className="text-primary">CLASSIFIED:</strong> All personnel records are monitored and subject to O5 Council review.
                  Unauthorized access or data manipulation will result in immediate <span className="redacted">REDACTED</span> procedures.
                </p>
                <p className="font-mono text-muted-foreground">
                  Your activities within the CTF Division are logged for security purposes. All containment attempts, successful or otherwise,
                  contribute to your security clearance rating.
                </p>
                <div className="flex gap-4 mt-4 text-xs">
                  <div className="flex-1 bg-background/50 border border-border p-2">
                    <p className="text-muted-foreground">THREAT LEVEL</p>
                    <p className="font-bold text-success">MINIMAL</p>
                  </div>
                  <div className="flex-1 bg-background/50 border border-border p-2">
                    <p className="text-muted-foreground">CLEARANCE</p>
                    <p className="font-bold text-primary">LEVEL-{stats.solved_count > 10 ? "3" : stats.solved_count > 5 ? "2" : "1"}</p>
                  </div>
                  <div className="flex-1 bg-background/50 border border-border p-2">
                    <p className="text-muted-foreground">STATUS</p>
                    <p className="font-bold">{profile.is_banned ? "REVOKED" : "ACTIVE"}</p>
                  </div>
                </div>
              </div>
            </CardContent>

            {/* icicle decorative bar (top) */}
            <div className="absolute top-0 left-0 right-0 h-6 icicles opacity-40 pointer-events-none" />
          </Card>
        </div>
      </main>

      {/* Footer area left untouched / decorations near bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none z-10">
        {/* subtle ground frost */}
        <div className="w-full h-full frost-ground opacity-20" />
      </div>

      {/* Inline styles and keyframes for Christmas/winter theming */}
      <style>{`
        /* ---------- AURORA ---------- */
        .aurora-wrap { position: absolute; inset: 0; pointer-events: none; }
        .aurora-layer {
          position: absolute;
          left: -20%;
          right: -20%;
          top: 0;
          bottom: 0;
          opacity: 0.16;
          filter: blur(28px);
          transform: translateZ(0);
          background-repeat: no-repeat;
          background-size: 300% 100%;
          mix-blend-mode: screen;
          animation: aurora-move 18s linear infinite;
        }
        .aurora-layer.back {
          background: linear-gradient(90deg, rgba(18,58,110,0.0), rgba(40,120,210,0.22), rgba(24,58,120,0.0));
          opacity: 0.08;
          animation-duration: 26s;
          top: 0;
        }
        .aurora-layer.mid {
          background: linear-gradient(90deg, rgba(45,123,212,0.0), rgba(110,200,240,0.28), rgba(120,80,190,0.14));
          opacity: 0.12;
          animation-duration: 20s;
          top: 6%;
        }
        .aurora-layer.front {
          background: linear-gradient(90deg, rgba(120,80,190,0.0), rgba(180,220,255,0.22), rgba(255,255,255,0.12));
          opacity: 0.18;
          animation-duration: 14s;
          top: 12%;
          filter: blur(20px) saturate(120%);
        }
        @keyframes aurora-move {
          0% { background-position: 0% 50%;}
          50% { background-position: 100% 50%;}
          100% { background-position: 0% 50%;}
        }

        /* ---------- SNOW LAYERS ---------- */
        .snow-layer { position: absolute; inset: 0; pointer-events: none; z-index: 30; }
        .snow-layer.micro {
          background-image: radial-gradient(white 0.8px, rgba(255,255,255,0) 0.8px);
          background-size: 6px 6px;
          opacity: 0.06;
          animation: snow-micro 28s linear infinite;
        }
        .snow-layer.fine {
          background-image: radial-gradient(white 1.2px, rgba(255,255,255,0) 1.2px);
          background-size: 12px 12px;
          opacity: 0.045;
          animation: snow-fine 20s linear infinite;
        }
        .snow-layer.medium {
          background-image: radial-gradient(white 1.8px, rgba(255,255,255,0) 1.8px);
          background-size: 30px 30px;
          opacity: 0.03;
          animation: snow-medium 14s linear infinite;
        }
        .snow-layer.large {
          background-image: radial-gradient(white 2.6px, rgba(255,255,255,0) 2.6px);
          background-size: 48px 48px;
          opacity: 0.02;
          animation: snow-large 10s linear infinite;
        }
        .snow-layer.crystals {
          background-image: radial-gradient( rgba(200,240,255,0.95) 0.8px, rgba(200,240,255,0) 0.8px);
          background-size: 140px 140px;
          opacity: 0.03;
          mix-blend-mode: screen;
          animation: snow-crystals 36s linear infinite;
        }
        @keyframes snow-micro { 0% { background-position: 0 -20vh } 100% { background-position: 800px 120vh } }
        @keyframes snow-fine  { 0% { background-position: 0 -10vh } 100% { background-position: 600px 110vh } }
        @keyframes snow-medium{ 0% { background-position: 0 0 } 100% { background-position: 900px 120vh } }
        @keyframes snow-large { 0% { background-position: 0 0 } 100% { background-position: 1200px 140vh } }
        @keyframes snow-crystals { 0% { background-position: 0 0 } 100% { background-position: 1500px 150vh } }

        /* ---------- TREE SILHOUETTES ---------- */
        .tree-silhouette {
          position: absolute;
          background-image: linear-gradient(180deg, rgba(6,14,26,0.75), rgba(0,0,0,0.85));
          border-radius: 6px;
          filter: saturate(60%) brightness(40%);
          box-shadow: inset 0 -8px 24px rgba(0,0,0,0.6);
        }
        .tree-silhouette::before {
          content: '';
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: 12%;
          width: 0; height: 0;
          border-left: 24px solid transparent;
          border-right: 24px solid transparent;
          border-bottom: 70px solid rgba(10,20,30,0.85);
          filter: drop-shadow(0 -6px 8px rgba(0,0,0,0.6));
        }

        /* ---------- ORNAMENTS & BELLS ---------- */
        .ornament { width: 36px; height: 36px; border-radius: 999px; box-shadow: 0 6px 18px rgba(0,0,0,0.45), 0 0 10px rgba(255,255,255,0.04); border: 2px solid rgba(255,255,255,0.06); transform-origin: center; }
        .ornament.small { width: 26px; height: 26px; }
        .ornament-ice { background: radial-gradient(circle at 30% 30%, #cfefff, #4aa6e0); }
        .ornament-gold { background: radial-gradient(circle at 30% 30%, #ffd27a, #ff9a2e); }
        .ornament-ice.small { background: radial-gradient(circle at 30% 30%, #e6f7ff, #7fd0ff); }
        .ornament { animation: ornament-sway 6s ease-in-out infinite; }
        @keyframes ornament-sway { 0% { transform: translateY(0) } 50% { transform: translateY(6px) rotate(4deg) } 100% { transform: translateY(0) } }

        .bell { width: 34px; height: 34px; border-radius: 6px; background: linear-gradient(180deg,#ffd27a,#ff9a2e); box-shadow: 0 6px 18px rgba(0,0,0,0.45); transform-origin: top center; animation: bell-sway 3s ease-in-out infinite; }
        @keyframes bell-sway { 0% { transform: rotate(0) } 25% { transform: rotate(-6deg) } 50% { transform: rotate(4deg) } 75% { transform: rotate(-3deg) } 100% { transform: rotate(0) } }

        /* ---------- FROST ACCENTS ---------- */
        .frost-accent {
          background: radial-gradient(circle at 20% 20%, rgba(180,235,255,0.18), transparent 30%);
          width: 80px; height: 80px; border-radius: 12px; filter: blur(8px);
        }
        .frost-ground { background: linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02)); height: 72px; }

        /* ---------- ICICLES ---------- */
        .icicles {
          background-image: linear-gradient(180deg, rgba(200,240,255,0.18), rgba(200,240,255,0.02));
        }

        /* ---------- FLOAT ANIMATION (fireflies preserved) ---------- */
        @keyframes float {
          0% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.5; }
          25% { transform: translateY(-15px) translateX(6px) scale(1.1); opacity: 0.9; }
          50% { transform: translateY(-8px) translateX(-4px) scale(0.95); opacity: 0.4; }
          75% { transform: translateY(8px) translateX(5px) scale(1.05); opacity: 0.8; }
          100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.5; }
        }
        .animate-[float_10s_infinite_ease-in-out] { animation: float 10s infinite ease-in-out; }

        /* ---------- PULSE / SHIMMER ---------- */
        @keyframes pulse {
          0% { opacity: 0.6; transform: scale(1) }
          50% { opacity: 1; transform: scale(1.02) }
          100% { opacity: 0.6; transform: scale(1) }
        }
        .animate-[pulse_8s_infinite_ease-in-out] { animation: pulse 8s infinite ease-in-out; }

        /* ---------- SMALL HELPERS (glow, ping, fade) ---------- */
        @keyframes ping-slow {
          0% { box-shadow: 0 0 0 rgba(80,130,255,0.06); }
          50% { box-shadow: 0 0 20px rgba(80,130,255,0.06); }
          100% { box-shadow: 0 0 0 rgba(80,130,255,0.06); }
        }
        .animate-ping-slow { animation: ping-slow 4.8s infinite ease-in-out; }

        @keyframes pulse-glow { 0% { box-shadow: 0 0 10px rgba(80,130,255,0.12) } 50% { box-shadow: 0 0 20px rgba(80,130,255,0.2) } 100% { box-shadow: 0 0 10px rgba(80,130,255,0.12) } }
        .pulse-glow { animation: pulse-glow 3.4s infinite ease-in-out; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: translateY(0) } }
        .animate-fade-in { animation: fadeIn 0.8s ease-in-out both; }
        .animate-fade-in-delay { animation: fadeIn 1.2s ease-in-out both; }

        /* ---------- REDACTED ---------- */
        .redacted { background: hsl(355 85% 55%); color: transparent; padding: 0 0.5em; border-radius: 0.125rem; user-select: none; position: relative; }
        .redacted::after { content: "█████████"; color: hsl(355 85% 55%); position: absolute; left: 0; top: 0; }

        /* ---------- ACCESSIBILITY: reduce motion ---------- */
        @media (prefers-reduced-motion: reduce) {
          .aurora-layer, .snow-layer, .ornament, .bell, .animate-[float_10s_infinite_ease-in-out], .animate-ping-slow, .pulse-glow, .animate-[pulse_8s_infinite_ease-in-out] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

