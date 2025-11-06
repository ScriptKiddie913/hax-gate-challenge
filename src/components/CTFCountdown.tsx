import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Clock } from "lucide-react";

interface CTFCountdownProps {
  startTime: string;
}

export function CTFCountdown({ startTime }: CTFCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(true);
  const [fireflies, setFireflies] = useState<
    { id: number; top: string; left: string; size: string; delay: string; duration: string }[]
  >([]);

  useEffect(() => {
    // Generate calm floating green fireflies
    const generatedFireflies = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${2 + Math.random() * 4}px`,
      delay: `${Math.random() * 5}s`,
      duration: `${10 + Math.random() * 20}s`,
    }));
    setFireflies(generatedFireflies);
  }, []);

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!startTime) {
        setIsValid(false);
        setTimeLeft("INVALID TIME");
        return;
      }

      let parsedStartTime: number;
      try {
        parsedStartTime = Date.parse(startTime);
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

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Soft glowing green fireflies */}
      {fireflies.map((fly) => (
        <div
          key={fly.id}
          className="absolute rounded-full bg-[#8affb8] opacity-40 blur-[3px] animate-float"
          style={{
            top: fly.top,
            left: fly.left,
            width: fly.size,
            height: fly.size,
            animationDelay: fly.delay,
            animationDuration: fly.duration,
          }}
        ></div>
      ))}

      <Card className="relative z-10 border-2 border-[#6aff9b]/40 bg-[#05130a]/40 backdrop-blur-md text-[#d7ffe2] shadow-[0_0_25px_rgba(80,255,140,0.15)] hover:shadow-[0_0_40px_rgba(120,255,180,0.2)] transition-all duration-700">
        <CardHeader>
          <div className="classification-bar mb-3 opacity-60"></div>
          <CardTitle className="flex items-center gap-3 font-mono text-2xl text-[#9affc3]">
            <AlertTriangle className="h-8 w-8 text-[#70ff9a] animate-pulse-slow" />
            <span
              className="glitch text-[#a4ffc9] tracking-wide"
              data-text="CONTAINMENT BREACH"
            >
              CONTAINMENT BREACH
            </span>
          </CardTitle>
          <div className="classification-bar mt-3 opacity-60"></div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-sm font-mono text-[#b2ffcc]/70 mb-2 uppercase tracking-wider">
              SCHEDULED BREACH EVENT IN:
            </p>
            <div className="bg-[#0a1c10]/60 border-2 border-[#6aff9b]/40 rounded-lg p-6 backdrop-blur-md shadow-[0_0_20px_rgba(60,255,120,0.1)]">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Clock className="h-6 w-6 text-[#70ff9a] animate-pulse-slow" />
                <div className="text-4xl font-bold font-mono text-[#a4ffc9] tracking-wider">
                  {timeLeft}
                </div>
              </div>
            </div>
          </div>

          {!isValid && (
            <div className="p-3 text-center border border-[#ff7b7b]/50 bg-[#1a0a0a]/50 font-mono text-sm text-[#ff9b9b] rounded-md">
              INVALID START TIME FORMAT DETECTED. CHECK SUPABASE DATA.
            </div>
          )}

          <div className="space-y-3 text-sm font-mono">
            <div className="flex items-start gap-2 p-3 bg-[#08140d]/60 border border-[#60ff9b]/20 rounded-md backdrop-blur-sm">
              <div className="w-2 h-2 bg-[#6aff9b] mt-1.5 flex-shrink-0 animate-pulse"></div>
              <p>
                <strong className="text-[#6aff9b]">ALERT:</strong> Containment protocols
                will be lifted at scheduled time. All personnel must maintain
                security clearance level-2 or higher.
              </p>
            </div>

            <div className="flex items-start gap-2 p-3 bg-[#08140d]/60 border border-[#60ff9b]/20 rounded-md backdrop-blur-sm">
              <div className="w-2 h-2 bg-[#6aff9b] mt-1.5 flex-shrink-0 animate-pulse"></div>
              <p>
                <strong className="text-[#6aff9b]">NOTICE:</strong> Unauthorized access
                attempts before breach event initialization will be logged and reported
                to <span className="redacted text-[10px]">O5 COMMAND</span>.
              </p>
            </div>

            <div className="flex items-start gap-2 p-3 bg-[#08140d]/60 border border-[#60ff9b]/20 rounded-md backdrop-blur-sm">
              <div className="w-2 h-2 bg-[#6aff9b] mt-1.5 flex-shrink-0 animate-pulse"></div>
              <p>
                <strong className="text-[#6aff9b]">DIRECTIVE:</strong> All Foundation
                personnel are advised to prepare containment tools and security
                protocols in advance. SCP anomalies classified from SAFE to EUCLID
                will be accessible.
              </p>
            </div>
          </div>

          <div className="classification-bar opacity-50"></div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-[#0a1c10]/50 p-2 border border-[#6aff9b]/20 rounded">
              <p className="text-[#a9ffcb]/60 mb-1">STATUS:</p>
              <p className="text-[#ff7a7a] font-bold">
                {timeLeft === "BREACH IMMINENT" ? "ACTIVE" : "BREACH PENDING"}
              </p>
            </div>
            <div className="bg-[#0a1c10]/50 p-2 border border-[#6aff9b]/20 rounded">
              <p className="text-[#a9ffcb]/60 mb-1">THREAT LEVEL:</p>
              <p className="text-[#7dffb1] font-bold">CRITICAL</p>
            </div>
            <div className="bg-[#0a1c10]/50 p-2 border border-[#6aff9b]/20 rounded">
              <p className="text-[#a9ffcb]/60 mb-1">CLEARANCE:</p>
              <p className="text-[#e7ffee] font-bold">LEVEL-2+</p>
            </div>
            <div className="bg-[#0a1c10]/50 p-2 border border-[#6aff9b]/20 rounded">
              <p className="text-[#a9ffcb]/60 mb-1">PROTOCOL:</p>
              <p className="text-[#89ffad] font-bold">
                {timeLeft === "BREACH IMMINENT" ? "ACTIVE" : "STANDBY"}
              </p>
            </div>
          </div>

          <p className="text-xs text-[#a9ffcb]/70 font-mono text-center">
            System Timestamp: {new Date().toUTCString()}
          </p>
        </CardContent>
      </Card>

      {/* Floating animation + calm pulse */}
      <style>{`
        @keyframes float {
          0% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          50% { transform: translate(20px, -20px) scale(1.3); opacity: 1; }
          100% { transform: translate(-10px, 10px) scale(1); opacity: 0.5; }
        }
        .animate-float {
          animation-name: float;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 2.5s infinite ease-in-out;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
