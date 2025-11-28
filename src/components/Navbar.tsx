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
  SCP Winter Night Navbar
  - NO green anywhere
  - NO warm colors
  - NO candy cane stripe
  - Night blue + icy blue + white only
  - Snowfall, frost lights, winter ornaments
  - All logic preserved
*/

export const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

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

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) toast.error("Error signing out");
    else {
      toast.success("Signed out successfully");
      navigate("/auth");
    }
  };

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
        shadow-[0_0_35px_rgba(120,150,255,0.35)]
        relative
      "
    >

      {/* ❄ Pure snowflakes – icy white/blue only */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        {Array.from({ length: 45 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-[#e8f3ff] opacity-90 select-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${-10 - Math.random() * 50}px`,
              fontSize: `${6 + Math.random() * 10}px`,
              animation: `snowFall ${6 + Math.random() * 8}s linear infinite`,
              animationDelay: `${Math.random() * 8}s`,
              textShadow: "0 0 12px rgba(200,230,255,0.9)",
            }}
          >
            ❄
          </div>
        ))}
      </div>

      {/* ❄ Icy Blue Fairy Lights – NO GREEN */}
      <div className="absolute top-1 left-0 w-full flex justify-center pointer-events-none z-10">
        <div className="flex gap-4 py-1">
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className="
                w-2.5 h-2.5 rounded-full
                bg-[#bcdcff]
                shadow-[0_0_10px_#bcdcff]
                animate-[frostPulse_2.4s_infinite_ease-in-out]
              "
              style={{
                animationDelay: `${i * 0.18}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* ❄ Hanging Ornaments (Winter blue only) */}
      <div className="absolute left-4 top-2 flex gap-4 pointer-events-none z-20">
        <div className="text-[#9fc6ff] text-xl drop-shadow-[0_0_10px_rgba(160,200,255,0.7)] animate-[swing_3.6s_infinite]">
          🔔
        </div>
        <div className="text-[#d4e9ff] text-xl drop-shadow-[0_0_10px_rgba(200,230,255,0.7)] animate-[swing_4s_infinite]">
          ⭐
        </div>
        <div className="text-[#a2c8ff] text-xl drop-shadow-[0_0_10px_rgba(160,210,255,0.7)] animate-[swing_3.2s_infinite]">
          ❄️
        </div>
      </div>

      <div className="container mx-auto px-4 h-20 flex items-center justify-between relative z-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div
            className="
              w-12 h-12 border-2 border-primary
              bg-background rounded-sm
              flex items-center justify-center
              shadow-[0_0_15px_rgba(120,150,255,0.6)]
            "
          >
            <Shield className="h-7 w-7 text-primary group-hover:scale-110 transition-all" />
          </div>

          <div className="flex flex-col leading-tight">
            <span className="font-bold text-base scp-header text-primary">
              SCP FOUNDATION
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              WINTER OPS
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <Link to="/challenges">
                <Button variant="ghost" size="sm" className="gap-2 font-mono hover:text-primary">
                  <FileText className="h-4 w-4" />
                  CHALLENGES
                </Button>
              </Link>

              <Link to="/scoreboard">
                <Button variant="ghost" size="sm" className="gap-2 font-mono hover:text-primary">
                  <Trophy className="h-4 w-4" />
                  SCOREBOARD
                </Button>
              </Link>

              <Link to="/about">
                <Button variant="ghost" size="sm" className="gap-2 font-mono hover:text-primary">
                  <Info className="h-4 w-4" />
                  ABOUT
                </Button>
              </Link>

              <Link to="/rules">
                <Button variant="ghost" size="sm" className="gap-2 font-mono hover:text-primary">
                  <ScrollText className="h-4 w-4" />
                  RULES
                </Button>
              </Link>

              <Link to="/profile">
                <Button variant="ghost" size="sm" className="gap-2 font-mono hover:text-primary">
                  <UserIcon className="h-4 w-4" />
                  PROFILE
                </Button>
              </Link>

              {isAdmin && (
                <Link to="/admin">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-blue-300 font-mono hover:text-blue-400"
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
                <Button variant="ghost" size="sm" className="font-mono hover:text-primary">
                  ABOUT
                </Button>
              </Link>

              <Link to="/rules">
                <Button variant="ghost" size="sm" className="font-mono hover:text-primary">
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
                  border-2 border-blue-300 bg-background
                  rounded-sm shadow-[0_0_10px_rgba(160,200,255,0.45)]
                "
              >
                <Badge
                  variant="outline"
                  className="
                    text-xs font-mono
                    bg-blue-500/20 text-blue-200 border-blue-300
                  "
                >
                  AUTHORIZED
                </Badge>

                <span className="text-xs font-mono">{resolveDisplayName()}</span>
              </div>

              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="
                  gap-2 font-mono border-2 border-primary
                  hover:bg-primary/30 hover:text-primary
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
                  hover:bg-primary/70 shadow-[0_0_15px_rgba(120,150,255,0.7)]
                "
              >
                REQUEST ACCESS
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* ❄ Animations */}
      <style>{`
        @keyframes snowFall {
          0% { transform: translateY(0px); opacity: 1; }
          100% { transform: translateY(110vh); opacity: 0.3; }
        }

        @keyframes frostPulse {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }

        @keyframes swing {
          0%, 100% { transform: rotate(0deg) translateY(0px); }
          50% { transform: rotate(4deg) translateY(3px); }
        }
      `}</style>
    </nav>
  );
};
