import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { Flag, LogOut, Trophy, User as UserIcon, Shield, Info, ScrollText } from "lucide-react";
import { toast } from "sonner";

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
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();
    
    if (!error && data) {
      setIsAdmin(data.is_admin);
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
    <nav className="border-b border-border bg-card/50 backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Flag className="h-6 w-6 text-primary group-hover:text-primary-glow transition-colors" />
          <span className="font-bold text-xl font-mono">HaxGate<span className="text-primary">CTF</span></span>
        </Link>

        <div className="flex items-center gap-6">
          {user && (
            <>
              <Link to="/challenges">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Flag className="h-4 w-4" />
                  Challenges
                </Button>
              </Link>
              <Link to="/scoreboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Trophy className="h-4 w-4" />
                  Scoreboard
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Info className="h-4 w-4" />
                  About
                </Button>
              </Link>
              <Link to="/rules">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ScrollText className="h-4 w-4" />
                  Rules
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="ghost" size="sm" className="gap-2">
                  <UserIcon className="h-4 w-4" />
                  Profile
                </Button>
              </Link>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost" size="sm" className="gap-2 text-accent">
                    <Shield className="h-4 w-4" />
                    Admin
                  </Button>
                </Link>
              )}
            </>
          )}
          
          {!user && (
            <>
              <Link to="/about">
                <Button variant="ghost" size="sm">About</Button>
              </Link>
              <Link to="/rules">
                <Button variant="ghost" size="sm">Rules</Button>
              </Link>
            </>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-lg border border-border">
                <UserIcon className="h-4 w-4 text-primary" />
                <span className="text-sm font-mono">{user.email}</span>
              </div>
              <Button 
                onClick={handleLogout} 
                variant="ghost" 
                size="sm"
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button size="sm" className="glow-cyan">
                Login / Sign Up
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
