import { useState, useEffect } from "react";
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
import { Download, ExternalLink, Flag, CheckCircle2, XCircle, Lock, Trophy } from "lucide-react";

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
  initialSolvedState?: boolean;
  onChallengeUpdate?: () => void;
}

export function ChallengeDialog({ challenge, open, onOpenChange, initialSolvedState = false, onChallengeUpdate }: ChallengeDialogProps) {
  const [flag, setFlag] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ type: string; message: string } | null>(null);
  const [isSolved, setIsSolved] = useState(initialSolvedState);

  // Sync solved state when challenge changes or dialog opens
  useEffect(() => {
    setIsSolved(initialSolvedState);
    setResult(null);
    setFlag("");
  }, [challenge?.id, initialSolvedState, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!challenge || !flag.trim() || isSolved) return;

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
          setIsSolved(true);
          toast.success(submission.message);
          setFlag("");
          
          // Trigger refresh of challenges list
          if (onChallengeUpdate) {
            onChallengeUpdate();
          }
          
          setTimeout(() => onOpenChange(false), 2000);

          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            supabase.functions
              .invoke("monitor-submissions", {
                body: {
                  userId: user.id,
                  challengeId: challenge.id,
                  result: submission.result,
                },
              })
              .catch(() => {});
          }
        } else if (submission.result === "LOCKED") {
          toast.info(submission.message);
        } else {
          toast.error(submission.message);

          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            supabase.functions
              .invoke("monitor-submissions", {
                body: {
                  userId: user.id,
                  challengeId: challenge.id,
                  result: submission.result,
                },
              })
              .catch(() => {});
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

  const disabledInteraction = isSolved || result?.type === "CORRECT" || result?.type === "LOCKED";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`max-w-4xl max-h-[90vh] overflow-y-auto scp-paper border-2 ${
          isSolved
            ? "border-green-500 bg-green-950/20 glow-green transition-all duration-500"
            : "border-primary bg-background/80 transition-all duration-300"
        }`}
      >
        <DialogHeader>
          <div
            className={`classification-bar mb-4 ${
              isSolved ? "bg-green-600/70 animate-pulse" : ""
            }`}
          />
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle
                className={`text-2xl font-mono mb-2 ${
                  isSolved ? "text-green-400 glow-green" : "glow-blue text-primary"
                }`}
              >
                {challenge.title}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className={`font-mono ${
                    isSolved ? "bg-green-500/20 text-green-400 border-green-500/40" : ""
                  }`}
                >
                  {challenge.category}
                </Badge>
                <Badge
                  className={`${
                    isSolved
                      ? "bg-green-600/20 text-green-400 border-green-600"
                      : "bg-primary/20 text-primary border-primary glow-blue"
                  }`}
                >
                  {challenge.points} POINTS
                </Badge>
                {isSolved && (
                  <Badge className="bg-green-600/30 text-green-400 border-green-600/50 gap-1 font-mono">
                    <Trophy className="h-4 w-4" /> SOLVED
                  </Badge>
                )}
              </DialogDescription>
            </div>
          </div>
          <div
            className={`classification-bar mt-4 ${
              isSolved ? "bg-green-600/70 animate-pulse" : ""
            }`}
          />
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          <div className="prose prose-sm max-w-none text-muted-foreground [&_h1]:text-primary [&_h2]:text-primary [&_h3]:text-primary [&_code]:text-primary [&_code]:bg-background/50 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_pre]:bg-background/50 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-border [&_a]:text-primary [&_a]:hover:underline">
            <ReactMarkdown>{challenge.description_md}</ReactMarkdown>
          </div>

          {/* Files */}
          {challenge.files && challenge.files.length > 0 && (
            <div
              className={`border border-border rounded-lg p-4 ${
                isSolved ? "bg-green-900/20 border-green-600/40" : "bg-background/50"
              }`}
            >
              <h3
                className={`font-mono text-sm font-bold mb-3 flex items-center gap-2 ${
                  isSolved ? "text-green-400" : "text-primary"
                }`}
              >
                <Download className="h-4 w-4" />
                ATTACHED FILES
              </h3>
              <div className="space-y-2">
                {challenge.files.map((file, idx) => (
                  <span
                    key={idx}
                    className={`flex items-center gap-2 text-sm font-mono ${
                      disabledInteraction
                        ? "text-green-400/60 pointer-events-none select-none"
                        : "text-primary hover:underline"
                    }`}
                  >
                    <Download className="h-4 w-4" />
                    {file.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          {challenge.links && challenge.links.length > 0 && (
            <div
              className={`border border-border rounded-lg p-4 ${
                isSolved ? "bg-green-900/20 border-green-600/40" : "bg-background/50"
              }`}
            >
              <h3
                className={`font-mono text-sm font-bold mb-3 flex items-center gap-2 ${
                  isSolved ? "text-green-400" : "text-primary"
                }`}
              >
                <ExternalLink className="h-4 w-4" />
                EXTERNAL RESOURCES
              </h3>
              <div className="space-y-2">
                {challenge.links.map((link, idx) => (
                  <span
                    key={idx}
                    className={`flex items-center gap-2 text-sm font-mono ${
                      disabledInteraction
                        ? "text-green-400/60 pointer-events-none select-none"
                        : "text-primary hover:underline"
                    }`}
                  >
                    <ExternalLink className="h-4 w-4" />
                    {link.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Flag Submission */}
          <form
            onSubmit={handleSubmit}
            className={`border-2 rounded-lg p-6 ${
              isSolved
                ? "border-green-600 bg-green-900/20 glow-green-box"
                : "border-primary bg-background/30 glow-blue-box"
            }`}
          >
            <h3
              className={`font-mono text-sm font-bold mb-4 flex items-center gap-2 ${
                isSolved ? "text-green-400" : "text-primary"
              }`}
            >
              <Flag className="h-4 w-4" />
              {isSolved ? "CHALLENGE SOLVED" : "SUBMIT FLAG"}
            </h3>

            {result && (
              <div
                className={`mb-4 p-3 rounded-lg border-2 flex items-center gap-2 ${
                  result.type === "CORRECT"
                    ? "bg-green-900/30 border-green-500 text-green-400"
                    : result.type === "LOCKED"
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-destructive/10 border-destructive text-destructive"
                }`}
              >
                {result.type === "CORRECT" && <CheckCircle2 className="h-5 w-5" />}
                {result.type === "LOCKED" && <Lock className="h-5 w-5" />}
                {result.type === "INCORRECT" && <XCircle className="h-5 w-5" />}
                <span className="font-mono text-sm">{result.message}</span>
              </div>
            )}

            {isSolved ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 border-4 border-green-500 bg-background flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-10 w-10 text-green-400" />
                </div>
                <p className="text-green-400 font-bold font-mono text-lg mb-2">CHALLENGE SOLVED</p>
                <p className="text-xs text-green-300/70 font-mono">
                  This challenge has been successfully completed and is now locked.
                </p>
              </div>
            ) : (
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
                    disabled={submitting || disabledInteraction}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submitting || !flag.trim() || disabledInteraction}
                  className="w-full"
                >
                  {submitting
                    ? "VERIFYING..."
                    : "SUBMIT FLAG"}
                </Button>
              </div>
            )}
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
