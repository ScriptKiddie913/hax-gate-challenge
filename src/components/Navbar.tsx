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
    if (error) {
      toast.error("Error signing out");
    } else {
      toast.success("Signed out successfully");
      navigate("/auth");
    }
  };

  return (
    <nav
      className="
        sticky top-0 z-50
        border-b-4
        bg-[#02040a]/90
        backdrop-blur-xl
        shadow-[0_0_40px_rgba(0,80,255,0.25)]
        relative
      "
    >

      {/* 🎄 CSS Animated Christmas Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        {/* Falling Snowflakes */}
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={`snow-${i}`}
            className="snowflake"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${3 + Math.random() * 4}s`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.3 + Math.random() * 0.5,
            }}
          ></div>
        ))}

        {/* Twinkle Stars */}
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={`star-${i}`}
            className="twinkle-star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${1 + Math.random() * 2}s`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          ></div>
        ))}

      </div>

      {/* Christmas lights garland */}
      <div className="absolute top-0 left-0 w-full h-3 flex justify-center items-center">
        <div className="w-full flex justify-between px-4 animate-pulse-slow pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={`
                w-2 h-2 rounded-full 
                ${
                  i % 3 === 0
                    ? "bg-red-400"
                    : i % 3 === 1
                    ? "bg-green-400"
                    : "bg-yellow-300"
                }
                shadow-[0_0_8px_currentColor]
              `}
            ></div>
          ))}
        </div>
      </div>

      {/* Candy cane border */}
      <div
        className="absolute bottom-0 left-0 w-full h-1"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #ff0000 0 10px, #ffffff 10px 20px)",
        }}
      ></div>

      <div className="container mx-auto px-4 h-20 flex items-center justify-between relative">
        <Link to="/" className="flex items-center gap-3 group">
          <div
            className="
              w-12 h-12 border-4
              bg-[#0a0e1a]/80
              border-[#2b4aff]
              shadow-[0_0_20px_rgba(80,130,255,0.45)]
              rounded-md flex items-center justify-center
            "
          >
            <Shield className="h-7 w-7 text-[#9fc3ff] group-hover:text-[#cde0ff] transition-all" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-base text-[#cfe3ff] drop-shadow-[0_0_4px_#4a78ff]">
              SCP FOUNDATION
            </span>
            <span className="text-xs text-[#9bb8ff] font-mono">
              CTF DIVISION — HOLIDAY OPS
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
                  className="
                    gap-2 font-mono text-[#d6e2ff]
                    hover:text-white
                    hover:bg-[#1c2a55]/60
                  "
                >
                  <FileText className="h-4 w-4" />
                  CHALLENGES
                </Button>
              </Link>

              <Link to="/scoreboard">
                <Button
                  variant="ghost"
                  size="sm"
                  className="
                    gap-2 font-mono text-[#d6e2ff]
                    hover:text-white
                    hover:bg-[#1c2a55]/60
                  "
                >
                  <Trophy className="h-4 w-4" />
                  SCOREBOARD
                </Button>
              </Link>

              <Link to="/about">
                <Button
                  variant="ghost"
                  size="sm"
                  className="
                    gap-2 font-mono text-[#d6e2ff]
                    hover:text-white
                    hover:bg-[#1c2a55]/60
                  "
                >
                  <Info className="h-4 w-4" />
                  ABOUT
                </Button>
              </Link>

              <Link to="/rules">
                <Button
                  variant="ghost"
                  size="sm"
                  className="
                    gap-2 font-mono text-[#d6e2ff]
                    hover:text-white
                    hover:bg-[#1c2a55]/60
                  "
                >
                  <ScrollText className="h-4 w-4" />
                  RULES
                </Button>
              </Link>

              <Link to="/profile">
                <Button
                  variant="ghost"
                  size="sm"
                  className="
                    gap-2 font-mono text-[#d6e2ff]
                    hover:text-white
                    hover:bg-[#1c2a55]/60
                  "
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
                    className="
                      gap-2 text-red-400 font-mono
                      hover:text-red-300
                      hover:bg-[#381212]/60
                    "
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
                  className="font-mono text-[#cde0ff] hover:text-white hover:bg-[#162341]"
                >
                  ABOUT
                </Button>
              </Link>

              <Link to="/rules">
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-mono text-[#cde0ff] hover:text-white hover:bg-[#162341]"
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
                  flex items-center gap-2 px-3 py-1.5 border-2
                  border-[#2b4aff]/40 bg-[#0a0e1a]/70
                  rounded-md shadow-[0_0_12px_rgba(80,120,255,0.3)]
                "
              >
                <Badge
                  variant="outline"
                  className="
                    text-xs font-mono
                    bg-green-600/20 text-green-300
                    border-green-500
                  "
                >
                  AUTHORIZED
                </Badge>
                <span className="text-xs font-mono text-[#d6e2ff]">
                  {user.email?.split("@")[0]}
                </span>
              </div>

              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="
                  gap-2 font-mono border-2
                  border-[#8abaff]/40
                  bg-[#0a0e1a]/60
                  text-[#d6e2ff]
                  hover:bg-[#1b294f]
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
                  font-mono bg-[#2b4aff]/80
                  hover:bg-[#4d6aff]/90
                  shadow-[0_0_20px_rgba(80,130,255,0.4)]
                  text-white
                "
              >
                REQUEST ACCESS
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

