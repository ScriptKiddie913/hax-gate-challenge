import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, Flag, FileText } from "lucide-react";
import { AdminChallenges } from "@/components/admin/AdminChallenges";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { AdminSubmissions } from "@/components/admin/AdminSubmissions";
import { CTFTimer } from "@/components/admin/CTFTimer";
import { SecurityAlerts } from "@/components/admin/SecurityAlerts";

export default function Admin() {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const navigate = useNavigate();
  const [fireflies, setFireflies] = useState<
    { id: number; top: string; left: string; delay: string; size: string }[]
  >([]);

  useEffect(() => {
    checkAdminAccess();
    
    // Generate fireflies
    const generated = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 6}s`,
      size: `${3 + Math.random() * 4}px`,
    }));
    setFireflies(generated);
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/");
        return;
      }

      // Check admin role from user_roles table (server-side via RLS)
      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (error || !roles) {
        // Not admin - redirect immediately
        navigate("/");
        return;
      }

      setHasAccess(true);
      setLoading(false);
    } catch (error) {
      navigate("/");
    }
  };

  if (loading || !hasAccess) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        backgroundImage: "url('/images/a.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Blue ambient overlay */}
      <div className="absolute inset-0 bg-[#030b1d]/80 backdrop-blur-[2px]"></div>

      {/* Pulsing gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(90,150,255,0.15),transparent_70%)] animate-[pulse_8s_infinite_ease-in-out]"></div>

      {/* Fireflies */}
      {fireflies.map((f) => (
        <div
          key={f.id}
          className="absolute bg-[#b8d6ff] rounded-full blur-[3px] opacity-70 animate-[float_10s_infinite_ease-in-out]"
          style={{
            top: f.top,
            left: f.left,
            width: f.size,
            height: f.size,
            boxShadow: "0 0 10px rgba(160,200,255,0.6), 0 0 20px rgba(120,160,255,0.4)",
            animationDelay: f.delay,
          }}
        ></div>
      ))}

      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <Shield className="h-8 w-8 md:h-10 md:w-10 text-primary" />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Admin Panel
            </span>
          </h1>
          <p className="text-muted-foreground">Manage platform content, users, and security</p>
        </div>

        <Tabs defaultValue="challenges" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8 bg-card border border-border">
            <TabsTrigger value="challenges" className="gap-2">
              <Flag className="h-4 w-4" />
              <span className="hidden sm:inline">Challenges</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="submissions" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Submissions</span>
            </TabsTrigger>
            <TabsTrigger value="timer" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">CTF Timer</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="challenges">
            <AdminChallenges />
          </TabsContent>

          <TabsContent value="users">
            <AdminUsers />
          </TabsContent>

          <TabsContent value="submissions">
            <AdminSubmissions />
          </TabsContent>

          <TabsContent value="timer">
            <CTFTimer />
          </TabsContent>

          <TabsContent value="alerts">
            <SecurityAlerts />
          </TabsContent>
        </Tabs>
      </main>

      {/* Animations */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.5; }
          25% { transform: translateY(-15px) translateX(6px) scale(1.1); opacity: 0.9; }
          50% { transform: translateY(-8px) translateX(-4px) scale(0.95); opacity: 0.4; }
          75% { transform: translateY(8px) translateX(5px) scale(1.05); opacity: 0.8; }
          100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
