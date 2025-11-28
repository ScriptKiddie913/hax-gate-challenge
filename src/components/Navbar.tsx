import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { Shield, LogOut, Trophy, User as UserIcon, Info, ScrollText, FileText } from "lucide-react";
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
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
    <nav className="border-b-3 border-border bg-card scp-paper sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 border-3 border-primary bg-background flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-sm scp-header">SCP FOUNDATION</span>
            <span className="text-xs text-muted-foreground font-mono">CTF DIVISION</span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <Link to="/challenges">
                <Button variant="ghost" size="sm" className="gap-2 font-mono">
                  <FileText className="h-4 w-4" />
                  CHALLENGES
                </Button>
              </Link>
              <Link to="/scoreboard">
                <Button variant="ghost" size="sm" className="gap-2 font-mono">
                  <Trophy className="h-4 w-4" />
                  SCOREBOARD
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="ghost" size="sm" className="gap-2 font-mono">
                  <Info className="h-4 w-4" />
                  ABOUT
                </Button>
              </Link>
              <Link to="/rules">
                <Button variant="ghost" size="sm" className="gap-2 font-mono">
                  <ScrollText className="h-4 w-4" />
                  RULES
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="ghost" size="sm" className="gap-2 font-mono">
                  <UserIcon className="h-4 w-4" />
                  PROFILE
                </Button>
              </Link>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost" size="sm" className="gap-2 text-destructive font-mono">
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
                <Button variant="ghost" size="sm" className="font-mono">ABOUT</Button>
              </Link>
              <Link to="/rules">
                <Button variant="ghost" size="sm" className="font-mono">RULES</Button>
              </Link>
            </>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 border-2 border-border bg-background">
                <Badge variant="outline" className="text-xs font-mono bg-success/20 text-success border-success">
                  AUTHORIZED
                </Badge>
                <span className="text-xs font-mono">{user.email?.split('@')[0]}</span>
              </div>
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                size="sm"
                className="gap-2 font-mono border-2"
              >
                <LogOut className="h-4 w-4" />
                LOGOUT
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button size="sm" className="font-mono bg-primary hover:bg-primary/90">
                REQUEST ACCESS
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
