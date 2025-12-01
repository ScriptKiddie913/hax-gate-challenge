import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Ban, Unlock, Trash2, Users, ChevronDown, ChevronUp, Copy, Shield, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface User {
  id: string;
  username: string;
  email: string | null;
  is_banned: boolean;
  is_admin: boolean;
  created_at: string;
}

export function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();

    // Set up realtime subscription for new users
    const channel = supabase
      .channel('admin-users-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          console.log('Profile change detected:', payload);
          loadUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, email, is_banned, is_admin, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      toast.error("Error loading users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBan = async (userId: string, currentBanStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_banned: !currentBanStatus })
        .eq('id', userId);

      if (error) throw error;

      toast.success(currentBanStatus ? "User unbanned" : "User banned");
      loadUsers();
    } catch (error: any) {
      toast.error("Error updating user status");
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      toast.success("User deleted");
      loadUsers();
    } catch (error: any) {
      toast.error("Error deleting user");
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  if (loading) {
    return (
      <Card className="scp-paper border-2 border-border">
        <CardContent className="pt-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="font-mono">LOADING PERSONNEL FILES...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="scp-paper border-2 border-border scan-line">
      <CardHeader>
        <div className="classification-bar mb-3"></div>
        <CardTitle className="flex items-center gap-2 font-mono">
          <Users className="h-5 w-5 text-primary" />
          PERSONNEL MANAGEMENT
          <span className="ml-2 text-sm text-muted-foreground">({users.length} total)</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadUsers}
            className="ml-auto"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
        <div className="classification-bar mt-3"></div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {users.map((user) => (
            <Collapsible
              key={user.id}
              open={expandedUser === user.id}
              onOpenChange={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
            >
              <div className="border-2 border-border bg-background/50 rounded">
                <div className="flex items-center justify-between p-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-mono font-bold">{user.username}</p>
                      {user.is_admin && (
                        <Badge variant="outline" className="bg-destructive/20 text-destructive border-destructive font-mono text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          ADMIN
                        </Badge>
                      )}
                      {user.is_banned && (
                        <Badge variant="outline" className="bg-destructive/20 text-destructive border-destructive font-mono text-xs">
                          BANNED
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground font-mono">{user.email || 'No email'}</p>
                    <p className="text-xs text-muted-foreground mt-1 font-mono">
                      ENROLLED: {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!user.is_admin && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleBan(user.id, user.is_banned)}
                          className="gap-2 font-mono border-2"
                        >
                          {user.is_banned ? (
                            <>
                              <Unlock className="h-4 w-4" />
                              UNBAN
                            </>
                          ) : (
                            <>
                              <Ban className="h-4 w-4" />
                              BAN
                            </>
                          )}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteUser(user.id)}
                          className="gap-2 font-mono"
                        >
                          <Trash2 className="h-4 w-4" />
                          DELETE
                        </Button>
                      </>
                    )}
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" size="sm" className="border-2">
                        {expandedUser === user.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </div>

                <CollapsibleContent>
                  <div className="border-t-2 border-border p-4 space-y-3 bg-muted/30">
                    <div className="classification-bar mb-3"></div>
                    
                    <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                      <div className="bg-background/50 p-3 border border-border">
                        <p className="text-muted-foreground mb-1">USER ID:</p>
                        <div className="flex items-center gap-2">
                          <p className="break-all text-[10px]">{user.id}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => copyToClipboard(user.id, "User ID")}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="bg-background/50 p-3 border border-border">
                        <p className="text-muted-foreground mb-1">ACCOUNT STATUS:</p>
                        <p className={user.is_banned ? "text-destructive font-bold" : "text-success font-bold"}>
                          {user.is_banned ? "REVOKED" : "ACTIVE"}
                        </p>
                      </div>
                    </div>

                    <div className="classification-bar mt-3"></div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
          {users.length === 0 && (
            <div className="text-center py-8 text-muted-foreground font-mono">
              NO PERSONNEL RECORDS FOUND
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
