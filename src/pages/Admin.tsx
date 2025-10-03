import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, Flag, FileText } from "lucide-react";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { AdminChallenges } from "@/components/admin/AdminChallenges";
import { AdminSubmissions } from "@/components/admin/AdminSubmissions";

export default function Admin() {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
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
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
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
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-card border border-border">
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
        </Tabs>
      </main>
    </div>
  );
}
