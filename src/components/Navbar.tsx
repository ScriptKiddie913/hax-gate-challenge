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
  Christmas SCP Navbar
  - Fully compatible with your SCP Christmas CSS
  - No shortening
  - All logic preserved
  - Profile page loading fixed
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
    if (error) {
      toast.error("Error signing out");
    } else {
      toast.success("Signed out successfully");
      navigate("/auth");
    }
  };

  // Safe username fallback (fixes profile loading crash)
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
        shadow-[0_0_30px_rgba(255,0,0,0.18)]
        relative
      "
    >

      {/* Christmas Lights Garland */}
      <div className="absolute top-0 left-0 w-full h-4 flex justify-center items-center pointer-events-none">
        <div className="w-full flex justify-between px-4 christmas-lights">
          {Array.from({ length: 22 }).map((_, i) => (
            <div
              key={i}
              className={`
                w-2 h-2 rounded-full 
                ${
                  i % 3 === 0
                    ? "bg-red-500"
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

      {/* Candy Cane Border */}
      <div
        className="absolute bottom-0 left-0 w-full h-1 candy-cane-stripe"
        style={{ opacity: 0.9 }}
      ></div>

      <div className="container mx-auto px-4 h-20 flex items-center justify-between relative">
        <Link to="/" className="flex items-center gap-3 group">
          <div
            className="
              w-12 h-12 border-2 border-primary
              bg-background rounded-sm
              flex items-center justify-center
              shadow-[0_0_10px_hsla(355,85%,55%,0.4)]
            "
          >
            <Shield className="h-7 w-7 text-primary group-hover:scale-110 transition-all" />
          </div>

          <div className="flex flex-col leading-tight">
            <span className="font-bold text-base scp-header text-primary glow-red">
              SCP FOUNDATION
            </span>
            <span className="text-xs text-muted-foreground font-mono">
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
                  border-2 border-success bg-background
                  rounded-sm shadow-[0_0_8px_hsla(145,70%,45%,0.35)]
                "
              >
                <Badge
                  variant="outline"
                  className="
                    text-xs font-mono
                    bg-success/20 text-success border-success
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
                  hover:bg-primary-glow transition-all shadow-[0_0_12px_hsla(355,85%,55%,0.6)]
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
