import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import {
  Shield,
  LogOut,
  Trophy,
  User as UserIcon,
  Info,
  ScrollText,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "./ui/badge";

/*
  Christmas SCP Navbar (Rewritten Clean Version)
  - Removed green bulbs
  - Removed candy-cane bar
  - Added Christmas trees, bells, stars
  - Added snowfall animation and warm SCP-lit fairy lights
  - All logic preserved
*/

export const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Load session and listen for updates
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check admin status
  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!error && data) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      toast.success("Signed out successfully");
      navigate("/auth");
    }
  };

  // Fixed safe username fallback (prevents crashes)
  const resolveDisplayName = () => {
    return (
      user?.user_metadata?.username ??
      user?.user_metadata?.name ??
      (user?.email ? user.email.split("@")[0] : "user")
    );
  };

  return (
    <nav
      className="
        sticky top-0 z-50
        bg-card scp-paper
        border-b-4 border-border
        backdrop-blur-xl
        shadow-[0_0_30px_rgba(120,160,255,0.25)]
        relative
      "
    >

      {/* Soft Snowfall Layer */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-white opacity-80 select-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${-10 - Math.random() * 40}px`,
              fontSize: `${6 + Math.random() * 10}px`,
              animation: `fallSnow ${4 + Math.random() * 6}s linear infinite`,
              animationDelay: `${Math.random() * 6}s`,
              textShadow: "0 0 10px rgba(255,255,255,0.9)",
            }}
          >
            ❄
          </div>
        ))}
      </div>

      {/* Christmas Light Garland (no green, only gold/white/blue SCP tones) */}
      <div className="absolute top-0 left-0 w-full flex justify-center items-center pointer-events-none py-1 z-10">
        <div className="flex gap-3">
          {Array.from({ length: 22 }).map((_, i) => (
            <div
              key={i}
              className={`
                w-2.5 h-2.5 rounded-full
                ${
                  i % 3 === 0
                    ? "bg-yellow-300"
                    : i % 3 === 1
                    ? "bg-blue-300"
                    : "bg-white"
                }
                shadow-[0_0_10px_currentColor] 
                animate-[glowPulse_2s_infinite_ease-in-out]
              `}
              style={{
                animationDelay: `${i * 0.15}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Hanging Christmas Ornaments */}
      <div className="absolute left-4 top-0 flex gap-4 pointer-events-none z-20 mt-3">
        <div className="text-yellow-300 text-xl drop-shadow-[0_0_10px_rgba(255,220,150,0.7)] animate-[ornamentSwing_3.5s_infinite]">
          🔔
        </div>
        <div className="text-[#a0d8ff] text-xl drop-shadow-[0_0_10px_rgba(120,180,255,0.6)] animate-[ornamentSwing_4s_infinite]">
          ⭐
        </div>
        <div className="text-[#ffb3b3] text-xl drop-shadow-[0_0_10px_rgba(255,160,160,0.6)] animate-[ornamentSwing_3s_infinite]">
          🎄
        </div>
      </div>

      <div className="container mx-auto px-4 h-20 flex items-center justify-between relative z-20">
        <Link to="/" className="flex items-center gap-3 group">
          <div
            className="
              w-12 h-12 border-2 border-primary
              bg-background rounded-sm
              flex items-center justify-center
              shadow-[0_0_12px_rgba(100,150,255,0.5)]
            "
          >
            <Shield className="h-7 w-7 text-primary group-hover:scale-110 transition-all" />
          </div>

          <div className="flex flex-col leading-tight">
            <span className="font-bold text-base scp-header text-primary glow-blue">
              SCP FOUNDATION
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              CTF DIVISION — WINTER OPS
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <Link to="/challenges">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 font-mono text-foreground hover:text-primary"
                >
                  <FileText className="h-4 w-4" />
                  CHALLENGES
                </Button>
              </Link>

              <Link to="/scoreboard">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 font-mono text-foreground hover:text-primary"
                >
                  <Trophy className="h-4 w-4" />
                  SCOREBOARD
                </Button>
              </Link>

              <Link to="/about">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 font-mono text-foreground hover:text-primary"
                >
                  <Info className="h-4 w-4" />
                  ABOUT
                </Button>
              </Link>

              <Link to="/rules">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 font-mono text-foreground hover:text-primary"
                >
                  <ScrollText className="h-4 w-4" />
                  RULES
                </Button>
              </Link>

              <Link to="/profile">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 font-mono text-foreground hover:text-primary"
                >
                  <UserIcon className="h-4 w-4" />
                  PROFILE
                </Button>
              </Link>

              {isAdmin && (
                <Link to="/admin">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-destructive font-mono hover:text-red-400"
                  >
                    <Shield className="h-4 w-4" />
                    ADMIN
                  </Button>
                </Link>
              )}
            </>
          )}

          {!user && (
            <>
              <Link to="/about">
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-mono text-foreground hover:text-primary"
                >
                  ABOUT
                </Button>
              </Link>

              <Link to="/rules">
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-mono text-foreground hover:text-primary"
                >
                  RULES
                </Button>
              </Link>
            </>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <div
                className="
                  flex items-center gap-2 px-3 py-1.5
                  border-2 border-blue-400 bg-background
                  rounded-sm shadow-[0_0_10px_rgba(120,160,255,0.45)]
                "
              >
                <Badge
                  variant="outline"
                  className="
                    text-xs font-mono
                    bg-blue-500/20 text-blue-300 border-blue-400
                  "
                >
                  AUTHORIZED
                </Badge>

                <span className="text-xs font-mono text-foreground">
                  {resolveDisplayName()}
                </span>
              </div>

              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="
                  gap-2 font-mono border-2 border-primary
                  text-foreground hover:bg-primary/20 hover:text-primary
                "
              >
                <LogOut className="h-4 w-4" />
                LOGOUT
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button
                size="sm"
                className="
                  font-mono bg-primary text-primary-foreground
                  hover:bg-primary/80 transition-all shadow-[0_0_15px_rgba(120,160,255,0.6)]
                "
              >
                REQUEST ACCESS
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Animations for snow + ornaments */}
      <style>{`
        @keyframes fallSnow {
          0% { transform: translateY(0px); opacity: 1; }
          100% { transform: translateY(110vh); opacity: 0.3; }
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        @keyframes ornamentSwing {
          0% { transform: rotate(0deg) translateY(0px); }
          50% { transform: rotate(6deg) translateY(3px); }
          100% { transform: rotate(0deg) translateY(0px); }
        }
      `}</style>
    </nav>
  );
};
