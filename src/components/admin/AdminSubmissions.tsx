import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, XCircle, Flag } from "lucide-react";
import { toast } from "sonner";

interface Submission {
  id: string;
  user_id: string;
  challenge_id: string;
  result: string;
  created_at: string;
  profiles: {
    username: string;
    email: string;
  };
  challenges: {
    title: string;
    points: number;
  };
}

export function AdminSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubmissions();

    // Real-time subscription for new submissions
    const channel = supabase
      .channel('admin-submissions')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'submissions'
        },
        () => {
          loadSubmissions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select(`
          *,
          profiles (username, email),
          challenges (title, points)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error: any) {
      toast.error("Error loading submissions");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="border-border bg-card/50 backdrop-blur">
        <CardContent className="pt-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flag className="h-5 w-5 text-primary" />
          Recent Submissions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-3">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="flex items-start justify-between p-4 rounded-lg border border-border bg-secondary/30"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-3">
                    {submission.result === 'CORRECT' ? (
                      <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-semibold">{submission.challenges.title}</p>
                      <p className="text-sm text-muted-foreground">
                        by <span className="font-mono">{submission.profiles.username}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pl-8">
                    <Badge 
                      variant="outline" 
                      className={
                        submission.result === 'CORRECT'
                          ? 'bg-success/20 text-success border-success/30'
                          : 'bg-destructive/20 text-destructive border-destructive/30'
                      }
                    >
                      {submission.result}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(submission.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm text-primary">
                    {submission.challenges.points} pts
                  </p>
                </div>
              </div>
            ))}
            {submissions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No submissions yet
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
