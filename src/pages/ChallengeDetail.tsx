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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadChallenge = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: challengeData, error: challengeError } = await supabase
        .from("challenges")
        .select("*")
        .eq("id", id)
        .eq("is_published", true)
        .maybeSingle();

      if (challengeError) throw challengeError;
      if (!challengeData) throw new Error("Challenge not found");

      setChallenge(challengeData);

      const { data: submission } = await supabase
        .from("submissions")
        .select("result")
        .eq("user_id", user.id)
        .eq("challenge_id", id)
        .eq("result", "CORRECT")
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
      const { data, error } = await supabase.rpc("submit_flag", {
        challenge_id: id,
        submitted_flag: flag.trim(),
      });

      if (error) throw error;

      const result = data?.[0];

      if (result?.result === "LOCKED") {
        toast.error(result.message);
      } else if (result?.result === "CORRECT") {
        toast.success(result.message || `Correct! You earned ${result.points} points! 🎉`);
        setIsSolved(true);
        setFlag("");
      } else {
        toast.error(result?.message || "Incorrect flag. Try again!");
      }
    } catch (error: any) {
      toast.error(error.message || "Error submitting flag");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden festive-page">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 animate-fade-in"
          style={{
            backgroundImage: `url(${scpFacility})`,
            filter: "brightness(0.28) contrast(1.28)",
          }}
        />
        <div className="absolute inset-0 matrix-bg opacity-50" />
        <Navbar />
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="scp-paper border-2 border-primary p-8 scan-line glow-red frosted-card">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto mb-4" />
            <p className="font-mono text-primary pulse-glow">ACCESSING CLASSIFIED FILE...</p>
          </div>
        </div>

        {/* Global Decorations — keep on loading screen too */}
        <div className="snowfall" aria-hidden>
          {Array.from({ length: 36 }).map((_, i) => (
            <div
              key={`snow-l-${i}`}
              className="snowflake"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${6 + Math.random() * 6}s`,
                animationDelay: `${Math.random() * 4}s`,
                fontSize: `${8 + Math.random() * 18}px`,
              }}
            >
              ❄
            </div>
          ))}
        </div>

        <div className="festive-lights" aria-hidden>
          {/* mix of warm and icy light dots */}
          {Array.from({ length: 26 }).map((_, i) => (
            <div
              key={`light-l-${i}`}
              className="festive-light"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: ["#ffd966", "#ff6b6b", "#66ffd9", "#7fb3ff"][i % 4],
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden festive-page">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 animate-fade-in"
          style={{
            backgroundImage: `url(${scpFacility})`,
            filter: "brightness(0.28) contrast(1.28)",
          }}
        />
        <div className="absolute inset-0 matrix-bg opacity-50" />
        <Navbar />
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="scp-paper border-2 border-destructive p-8 text-center glow-red frosted-card">
            <p className="font-mono text-xl mb-2 text-destructive flicker">DOCUMENT NOT FOUND</p>
            <p className="text-muted-foreground font-mono">
              Classification error or insufficient clearance
            </p>
          </div>
        </div>

        <div className="snowfall" aria-hidden>
          {Array.from({ length: 36 }).map((_, i) => (
            <div
              key={`snow-n-${i}`}
              className="snowflake"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${6 + Math.random() * 6}s`,
                animationDelay: `${Math.random() * 4}s`,
                fontSize: `${8 + Math.random() * 18}px`,
              }}
            >
              ❄
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Visual style class for solved state
  const solvedStyle =
    "border-green-600 bg-green-950/20 backdrop-blur-sm glow-green transition-all duration-500";
  const unsolvedStyle =
    "border-border backdrop-blur-sm hover:scale-[1.01] transition-transform duration-300";

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden festive-page">
      {/* background image - DO NOT REMOVE OR CHANGE */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 animate-fade-in"
        style={{
          backgroundImage: `url(${scpFacility})`,
          filter: "brightness(0.28) contrast(1.28)",
        }}
      />
      <div className="absolute inset-0 matrix-bg opacity-40" />

      {/* Global Decorations */}
      <div className="snowfall" aria-hidden>
        {Array.from({ length: 48 }).map((_, i) => (
          <div
            key={`snow-${i}`}
            className="snowflake"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${6 + Math.random() * 6}s`,
              animationDelay: `${Math.random() * 4}s`,
              fontSize: `${8 + Math.random() * 18}px`,
            }}
          >
            ❄
          </div>
        ))}
      </div>

      <div className="festive-lights" aria-hidden>
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={`light-${i}`}
            className="festive-light"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              backgroundColor: ["#ffd966", "#ff6b6b", "#66ffd9", "#7fb3ff"][i % 4],
            }}
          />
        ))}
      </div>

      <div className="hanging-ornaments" aria-hidden>
        {/* ornaments — subtle, non-intrusive, mix of gold/blue/red */}
        <div className="ornament ornament-1">🔔</div>
        <div className="ornament ornament-2">🎄</div>
        <div className="ornament ornament-3">🔴</div>
      </div>

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
            <Card
              className={`scp-paper border-2 scan-line animate-fade-in frosted-card ${
                isSolved ? solvedStyle : unsolvedStyle
              }`}
            >
              <CardHeader>
                <div className="classification-bar mb-4 pulse-glow"></div>
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge
                        variant="outline"
                        className={`font-mono text-xs border-2 animate-fade-in ${
                          challenge.category === "Safe"
                            ? "bg-green-500/20 text-green-500 border-green-500/30"
                            : challenge.category === "Archon"
                            ? "bg-blue-500/20 text-blue-500 border-blue-500/30"
                            : challenge.category === "Keter"
                            ? "bg-orange-500/20 text-orange-500 border-orange-500/30"
                            : challenge.category === "Euclid"
                            ? "bg-red-500/20 text-red-500 border-red-500/30"
                            : ""
                        }`}
                      >
                        {challenge.category.toUpperCase()}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-primary/20 text-primary border-primary font-mono text-xs glow-red animate-fade-in-delay"
                      >
                        {challenge.points} POINTS
                      </Badge>
                      {isSolved && (
                        <Badge
                          variant="outline"
                          className="bg-green-500/20 text-green-400 border-green-500/40 gap-1 font-mono text-xs animate-fade-in pulse-glow"
                        >
                          <Trophy className="h-3 w-3" />
                          SOLVED
                        </Badge>
                      )}
                    </div>
                    <CardTitle
                      className={`text-2xl font-mono ${
                        isSolved ? "text-green-400" : "text-primary"
                      } animate-fade-in`}
                    >
                      {challenge.title}
                    </CardTitle>
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
                    <h3 className="font-bold text-sm mb-3 font-mono border-b-2 border-border pb-2">
                      ATTACHED FILES:
                    </h3>
                    {challenge.files.map((file: any, index: number) => (
                      <Button
                        key={index}
                        variant="outline"
                        className={`w-full justify-start gap-2 font-mono border-2 ${isSolved ? "pointer-events-none opacity-50" : ""}`}
                        asChild
                        disabled={isSolved}
                      >
                        <a href={isSolved ? undefined : file.url} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                          {file.name}
                        </a>
                      </Button>
                    ))}
                  </div>
                )}

                {challenge.links && challenge.links.length > 0 && (
                  <div className="mt-8 space-y-3">
                    <h3 className="font-bold text-sm mb-3 font-mono border-b-2 border-border pb-2">
                      EXTERNAL REFERENCES:
                    </h3>
                    {challenge.links.map((link: any, index: number) => (
                      <Button
                        key={index}
                        variant="outline"
                        className={`w-full justify-start gap-2 font-mono border-2 ${isSolved ? "pointer-events-none opacity-50" : ""}`}
                        asChild
                        disabled={isSolved}
                      >
                        <a href={isSolved ? undefined : link.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                          {link.label ?? link.name ?? link.url}
                        </a>
                      </Button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card
              className={`scp-paper border-2 sticky top-24 ${isSolved ? "border-green-600 bg-green-950/20 glow-green" : "border-border"} frosted-card`}
            >
              <CardHeader>
                <div className="classification-bar mb-3"></div>
                <CardTitle className="flex items-center gap-2 font-mono text-lg">
                  {isSolved ? (
                    <>
                      <Trophy className="h-5 w-5 text-green-400" />
                      CHALLENGE SOLVED
                    </>
                  ) : (
                    <>
                      <Flag className="h-5 w-5 text-primary" />
                      FLAG SUBMISSION
                    </>
                  )}
                </CardTitle>
                <CardDescription className="font-mono text-xs">
                  {isSolved ? "Challenge already solved successfully." : "Enter the containment protocol key below."}
                </CardDescription>
                <div className="classification-bar mt-3"></div>
              </CardHeader>
              <CardContent>
                {isSolved ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 border-4 border-green-500 bg-background flex items-center justify-center mx-auto mb-4">
                      <Lock className="h-10 w-10 text-green-400" />
                    </div>
                    <p className="text-green-400 font-bold font-mono mb-2">SOLVED</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      This challenge has been marked as completed and cannot be reopened.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="flag" className="font-mono text-xs">
                        CONTAINMENT KEY:
                      </Label>
                      <Input
                        id="flag"
                        type="text"
                        placeholder="flag{...}"
                        value={flag}
                        onChange={(e) => setFlag(e.target.value)}
                        className="font-mono border-2"
                        disabled={submitting || isSolved}
                      />
                    </div>
                    <Button type="submit" className="w-full gap-2 font-mono bg-primary hover:bg-primary/90" disabled={submitting || isSolved}>
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

      {/* Festive local styles */}
      <style>{`
        /* Global festive + SCP mixed theme */
        .festive-page { --primary: #6ea8ff; --background: #02040a; --foreground: #dbeaff; position: relative; }

        /* Snowfall */
        .snowfall { position: absolute; inset: 0; pointer-events: none; z-index: 30; }
        .snowflake {
          position: absolute;
          top: -10vh;
          color: rgba(255,255,255,0.95);
          animation-name: snowFall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform, opacity;
          text-shadow: 0 0 6px rgba(255,255,255,0.35);
        }
        @keyframes snowFall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0.25; }
        }

        /* Festive lights — mix warm and icy */
        .festive-lights { position: absolute; inset: 0; pointer-events: none; z-index: 25; }
        .festive-light {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          box-shadow: 0 0 8px currentColor, 0 0 14px currentColor;
          animation: festiveTwinkle 1.6s ease-in-out infinite;
        }
        @keyframes festiveTwinkle {
          0%,100% { transform: scale(1); opacity: 1; filter: drop-shadow(0 0 8px rgba(255,255,255,0.06)); }
          50% { transform: scale(0.85); opacity: 0.6; filter: none; }
        }

        /* Hanging ornaments (subtle) */
        .hanging-ornaments { position: absolute; top: 6px; left: 50%; transform: translateX(-50%); width: 100%; pointer-events: none; z-index: 28; display: flex; justify-content: center; gap: 18px; }
        .ornament { font-size: 20px; opacity: 0.95; transform-origin: top center; animation: ornamentSwing 4s ease-in-out infinite; filter: drop-shadow(0 6px 14px rgba(0,0,0,0.5)); }
        .ornament-1 { animation-delay: 0s; color: #ffd966; }
        .ornament-2 { animation-delay: 0.3s; color: #7fb3ff; }
        .ornament-3 { animation-delay: 0.6s; color: #ff6b6b; }
        @keyframes ornamentSwing {
          0% { transform: translateY(0) rotate(-6deg) scale(1); }
          25% { transform: translateY(6px) rotate(6deg) scale(1.02); }
          50% { transform: translateY(0) rotate(-3deg) scale(1); }
          75% { transform: translateY(6px) rotate(3deg) scale(1.02); }
          100% { transform: translateY(0) rotate(-6deg) scale(1); }
        }

        /* Crystal shards floating */
        .crystal-shard {
          position: absolute;
          width: 18px;
          height: 40px;
          background: linear-gradient(180deg, rgba(230,250,255,0.85), rgba(120,180,255,0.06));
          transform: rotate(18deg);
          opacity: 0.12;
          filter: blur(4px) drop-shadow(0 4px 12px rgba(120,180,255,0.08));
          pointer-events: none;
          z-index: 26;
          animation: shardFloat 8s ease-in-out infinite;
        }
        @keyframes shardFloat {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.12; }
          50% { transform: translateY(-12px) rotate(-6deg); opacity: 0.22; }
          100% { transform: translateY(0) rotate(0deg); opacity: 0.12; }
        }

        /* Soft holo shimmer overlay used by frosted cards */
        .frosted-card {
          background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
          border-radius: 12px;
          backdrop-filter: blur(8px) saturate(120%);
          -webkit-backdrop-filter: blur(8px) saturate(120%);
        }

        .glow-red { box-shadow: 0 8px 30px rgba(255,80,90,0.06); }
        .glow-green { box-shadow: 0 8px 30px rgba(70,210,120,0.06); }
        .glow-blue-box { box-shadow: 0 8px 30px rgba(60,140,255,0.06); }

        .pulse-glow { animation: pulseGlow 2.4s ease-in-out infinite; }
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 6px rgba(110,168,255,0.08); }
          50% { box-shadow: 0 0 22px rgba(255,210,110,0.10), 0 0 32px rgba(110,168,255,0.16); transform: translateY(-1px); }
          100% { box-shadow: 0 0 6px rgba(110,168,255,0.08); transform: translateY(0); }
        }

        /* scan line */
        .scan-line::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(170,200,255,0.06), transparent);
          animation: scan 3.2s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes scan {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        /* small utility animations */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeInUp 0.55s ease both; }
        .animate-fade-in-delay { animation: fadeInUp 0.55s ease 0.22s both; }

        /* subtle matrix overlay for cyberpunk feel (very soft) */
        .matrix-bg::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(120,160,255,0.02) 2px, rgba(120,160,255,0.02) 4px);
          pointer-events: none;
        }

        /* accessibility: reduce motion */
        @media (prefers-reduced-motion: reduce) {
          .snowflake, .festive-light, .ornament, .crystal-shard {
            animation: none !important;
            transition: none !important;
          }
        }

      `}</style>

      {/* Insert a few crystal shards programmatically for visual depth */}
      <div aria-hidden>
        <div className="crystal-shard" style={{ left: "8%", top: "22%", animationDelay: "0.2s" }} />
        <div className="crystal-shard" style={{ left: "82%", top: "36%", animationDelay: "1.1s", transform: "rotate(-8deg)" }} />
        <div className="crystal-shard" style={{ left: "42%", top: "8%", animationDelay: "0.6s", transform: "rotate(12deg)" }} />
      </div>

      {/* subtle chime on page load (no autoplay — purely decorative element placeholder)
          Note: actual sound playback would require user gesture to respect UX & browsers; omitted for now. */}
    </div>
  );
}
