import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Download, ExternalLink, Flag, CheckCircle2, XCircle, Lock } from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  category: string;
  points: number;
  description_md: string;
  files?: Array<{ name: string; url: string }>;
  links?: Array<{ name: string; url: string }>;
}

interface ChallengeDialogProps {
  challenge: Challenge | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChallengeDialog({ challenge, open, onOpenChange }: ChallengeDialogProps) {
  const [flag, setFlag] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{type: string; message: string} | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!challenge || !flag.trim()) return;

    setSubmitting(true);
    setResult(null);

    try {
      const { data, error } = await supabase.rpc("submit_flag", {
        challenge_id: challenge.id,
        submitted_flag: flag.trim(),
      });

      if (error) throw error;

      const submission = data?.[0];
      if (submission) {
        setResult({ type: submission.result, message: submission.message });
        
        if (submission.result === "CORRECT") {
          toast.success(submission.message);
          setFlag("");
          setTimeout(() => onOpenChange(false), 2000);
          
          // Trigger AI monitoring (fire and forget)
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            supabase.functions.invoke("monitor-submissions", {
              body: {
                userId: user.id,
                challengeId: challenge.id,
                result: submission.result,
              },
            }).catch(() => {
              // Silently fail - monitoring is non-critical
            });
          }
        } else if (submission.result === "LOCKED") {
          toast.info(submission.message);
        } else {
          toast.error(submission.message);
          
          // Also monitor incorrect attempts
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            supabase.functions.invoke("monitor-submissions", {
              body: {
                userId: user.id,
                challengeId: challenge.id,
                result: submission.result,
              },
            }).catch(() => {
              // Silently fail - monitoring is non-critical
            });
          }
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Error submitting flag");
    } finally {
      setSubmitting(false);
    }
  };

  if (!challenge) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto scp-paper border-2 border-primary">
        <DialogHeader>
          <div className="classification-bar mb-4" />
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-mono mb-2 glow-blue">
                {challenge.title}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="font-mono">
                  {challenge.category}
                </Badge>
                <Badge className="bg-primary/20 text-primary border-primary glow-blue">
                  {challenge.points} POINTS
                </Badge>
              </DialogDescription>
            </div>
          </div>
          <div className="classification-bar mt-4" />
        </DialogHeader>

        <div className="space-y-6">
                <div className="prose prose-sm max-w-none text-muted-foreground [&_h1]:text-primary [&_h2]:text-primary [&_h3]:text-primary [&_code]:text-primary [&_code]:bg-background/50 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_pre]:bg-background/50 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-border [&_a]:text-primary [&_a]:hover:underline">
                  <ReactMarkdown>
                    {challenge.description_md}
                  </ReactMarkdown>
                </div>

          {/* Files */}
          {challenge.files && challenge.files.length > 0 && (
            <div className="border border-border rounded-lg p-4 bg-background/50">
              <h3 className="font-mono text-sm font-bold mb-3 flex items-center gap-2">
                <Download className="h-4 w-4" />
                ATTACHED FILES
              </h3>
              <div className="space-y-2">
                {challenge.files.map((file, idx) => (
                  <a
                    key={idx}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline font-mono"
                  >
                    <Download className="h-4 w-4" />
                    {file.name}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          {challenge.links && challenge.links.length > 0 && (
            <div className="border border-border rounded-lg p-4 bg-background/50">
              <h3 className="font-mono text-sm font-bold mb-3 flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                EXTERNAL RESOURCES
              </h3>
              <div className="space-y-2">
                {challenge.links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline font-mono"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Flag Submission */}
          <form onSubmit={handleSubmit} className="border-2 border-primary rounded-lg p-6 bg-background/30 glow-blue-box">
            <h3 className="font-mono text-sm font-bold mb-4 flex items-center gap-2 text-primary">
              <Flag className="h-4 w-4" />
              SUBMIT FLAG
            </h3>
            
            {result && (
              <div className={`mb-4 p-3 rounded-lg border-2 flex items-center gap-2 ${
                result.type === 'CORRECT' 
                  ? 'bg-success/10 border-success text-success' 
                  : result.type === 'LOCKED'
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-destructive/10 border-destructive text-destructive'
              }`}>
                {result.type === 'CORRECT' && <CheckCircle2 className="h-5 w-5" />}
                {result.type === 'LOCKED' && <Lock className="h-5 w-5" />}
                {result.type === 'INCORRECT' && <XCircle className="h-5 w-5" />}
                <span className="font-mono text-sm">{result.message}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor="flag" className="font-mono text-xs uppercase">
                  Flag
                </Label>
                <Input
                  id="flag"
                  type="text"
                  value={flag}
                  onChange={(e) => setFlag(e.target.value)}
                  placeholder="SCP-CTF{...}"
                  className="font-mono mt-2"
                  disabled={submitting || result?.type === 'LOCKED'}
                />
              </div>
              <Button 
                type="submit" 
                disabled={submitting || !flag.trim() || result?.type === 'LOCKED'}
                className="w-full"
              >
                {submitting ? "VERIFYING..." : "SUBMIT FLAG"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
