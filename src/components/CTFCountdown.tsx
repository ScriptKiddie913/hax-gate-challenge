import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Clock } from "lucide-react";

interface CTFCountdownProps {
  startTime: string;
}

export function CTFCountdown({ startTime }: CTFCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(true);

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!startTime) {
        setIsValid(false);
        setTimeLeft("INVALID TIME");
        return;
      }

      // Ensure start time is parsed as UTC. Add "Z" if missing.
      let parsedStartTime: number;
      try {
        const normalized = startTime.endsWith("Z") ? startTime : startTime + "Z";
        parsedStartTime = Date.parse(normalized);
      } catch (err) {
        setIsValid(false);
        setTimeLeft("INVALID TIME");
        return;
      }

      if (isNaN(parsedStartTime)) {
        setIsValid(false);
        setTimeLeft("INVALID TIME");
        return;
      }

      setIsValid(true);

      const now = new Date().getTime();
      const difference = parsedStartTime - now;

      if (difference <= 0) {
        setTimeLeft("BREACH IMMINENT");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      const parts: string[] = [];
      if (days > 0) parts.push(`${days}D`);
      if (hours > 0) parts.push(`${hours}H`);
      if (minutes > 0) parts.push(`${minutes}M`);
      parts.push(`${seconds}S`);

      setTimeLeft(parts.join(" : "));
    };

    // Run once immediately
    calculateTimeLeft();

    // Then update every 1 second
    const interval = setInterval(calculateTimeLeft, 1000);

    // Cleanup interval when component unmounts
    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <Card className="scp-paper border-2 border-primary glow-red animate-fade-in">
      <CardHeader>
        <div className="classification-bar mb-3"></div>
        <CardTitle className="flex items-center gap-3 font-mono text-2xl">
          <AlertTriangle className="h-8 w-8 text-primary animate-pulse" />
          <span className="glitch text-primary" data-text="CONTAINMENT BREACH">
            CONTAINMENT BREACH
          </span>
        </CardTitle>
        <div className="classification-bar mt-3"></div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-sm font-mono text-muted-foreground mb-2 uppercase tracking-wider">
            SCHEDULED BREACH EVENT IN:
          </p>
          <div className="bg-background/50 border-2 border-primary p-6 scan-line">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Clock className="h-6 w-6 text-primary animate-pulse" />
              <div className="text-4xl font-bold font-mono text-primary pulse-glow tracking-wider">
                {timeLeft}
              </div>
            </div>
          </div>
        </div>

        {!isValid && (
          <div className="p-3 text-center border border-destructive bg-destructive/20 font-mono text-sm text-destructive">
            INVALID START TIME FORMAT DETECTED. CHECK SUPABASE DATA.
          </div>
        )}

        <div className="space-y-3 text-sm font-mono">
          <div className="flex items-start gap-2 p-3 bg-background/30 border border-border">
            <div className="w-2 h-2 bg-primary mt-1.5 flex-shrink-0 animate-pulse"></div>
            <p>
              <strong className="text-primary">ALERT:</strong> Containment protocols
              will be lifted at scheduled time. All personnel must maintain
              security clearance level-2 or higher.
            </p>
          </div>

          <div className="flex items-start gap-2 p-3 bg-background/30 border border-border">
            <div className="w-2 h-2 bg-primary mt-1.5 flex-shrink-0 animate-pulse"></div>
            <p>
              <strong className="text-primary">NOTICE:</strong> Unauthorized access
              attempts before breach event initialization will be logged and reported
              to <span className="redacted text-[10px]">O5 COMMAND</span>.
            </p>
          </div>

          <div className="flex items-start gap-2 p-3 bg-background/30 border border-border">
            <div className="w-2 h-2 bg-primary mt-1.5 flex-shrink-0 animate-pulse"></div>
            <p>
              <strong className="text-primary">DIRECTIVE:</strong> All Foundation
              personnel are advised to prepare containment tools and security
              protocols in advance. SCP anomalies classified from SAFE to EUCLID
              will be accessible.
            </p>
          </div>
        </div>

        <div className="classification-bar"></div>

        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="bg-background/50 p-2 border border-border">
            <p className="text-muted-foreground mb-1">STATUS:</p>
            <p className="text-destructive font-bold">
              {timeLeft === "BREACH IMMINENT" ? "ACTIVE" : "BREACH PENDING"}
            </p>
          </div>
          <div className="bg-background/50 p-2 border border-border">
            <p className="text-muted-foreground mb-1">THREAT LEVEL:</p>
            <p className="text-primary font-bold">CRITICAL</p>
          </div>
          <div className="bg-background/50 p-2 border border-border">
            <p className="text-muted-foreground mb-1">CLEARANCE:</p>
            <p className="text-foreground font-bold">LEVEL-2+</p>
          </div>
          <div className="bg-background/50 p-2 border border-border">
            <p className="text-muted-foreground mb-1">PROTOCOL:</p>
            <p className="text-success font-bold">
              {timeLeft === "BREACH IMMINENT" ? "ACTIVE" : "STANDBY"}
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground font-mono text-center">
          System Timestamp: {new Date().toUTCString()}
        </p>
      </CardContent>
    </Card>
  );
}
