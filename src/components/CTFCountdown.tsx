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
    // Create calm glowing fireflies
    const generatedFireflies = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${2 + Math.random() * 3}px`,
      delay: `${Math.random() * 10}s`,
      duration: `${15 + Math.random() * 25}s`,
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
      } catch {
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
    <div
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url('/images/bbbbbbbb.png')",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Semi-dark overlay for depth */}
      <div className="absolute inset-0 bg-[#010b05]/60 backdrop-blur-[2px] z-0"></div>

      {/* Ambient fireflies floating gently */}
      {fireflies.map((fly) => (
        <div
          key={fly.id}
          className="absolute rounded-full bg-[#80ffb0] opacity-70 blur-[2px] animate-float"
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

      {/* Transparent countdown card */}
      <Card className="relative z-10 border border-[#80ffb0]/30 bg-[#02140a]/25 backdrop-blur-sm text-[#e9fff1] shadow-[0_0_25px_rgba(90,255,140,0.1)] hover:shadow-[0_0_35px_rgba(120,255,180,0.15)] transition-all duration-700 max-w-2xl w-full mx-4">
        <CardHeader>
          <div className="classification-bar mb-3 opacity-50"></div>
          <CardTitle className="flex items-center gap-3 font-mono text-2xl text-[#a4ffc9]">
            <AlertTriangle className="h-8 w-8 text-[#7dff9a] animate-pulse-slow" />
            <span
              className="glitch text-[#a4ffc9] tracking-wide"
              data-text="CONTAINMENT BREACH"
            >
              CONTAINMENT BREACH
            </span>
          </CardTitle>
          <div className="classification-bar mt-3 opacity-50"></div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-sm font-mono text-[#b2ffcc]/70 mb-2 uppercase tracking-wider">
              SCHEDULED BREACH EVENT IN:
            </p>
            <div className="bg-[#031d10]/25 border border-[#6aff9b]/30 rounded-lg p-6 backdrop-blur-sm shadow-[0_0_15px_rgba(60,255,120,0.08)]">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Clock className="h-6 w-6 text-[#70ff9a] animate-pulse-slow" />
                <div className="text-4xl font-bold font-mono text-[#a4ffc9] tracking-wider">
                  {timeLeft}
                </div>
              </div>
            </div>
          </div>

          {!isValid && (
            <div className="p-3 text-center border border-[#ff9b9b]/60 bg-[#1a0a0a]/40 font-mono text-sm text-[#ffbaba] rounded-md">
              INVALID START TIME FORMAT DETECTED. CHECK SUPABASE DATA.
            </div>
          )}

          <div className="space-y-3 text-sm font-mono">
            <div className="flex items-start gap-2 p-3 bg-[#05180f]/25 border border-[#60ff9b]/20 rounded-md backdrop-blur-sm">
              <div className="w-2 h-2 bg-[#6aff9b] mt-1.5 flex-shrink-0 animate-pulse"></div>
              <p>
                <strong className="text-[#6aff9b]">ALERT:</strong> Containment protocols
                will be lifted at scheduled time. All personnel must maintain
                security clearance level-2 or higher.
              </p>
            </div>

            <div className="flex items-start gap-2 p-3 bg-[#05180f]/25 border border-[#60ff9b]/20 rounded-md backdrop-blur-sm">
              <div className="w-2 h-2 bg-[#6aff9b] mt-1.5 flex-shrink-0 animate-pulse"></div>
              <p>
                <strong className="text-[#6aff9b]">NOTICE:</strong> Unauthorized access
                attempts before breach event initialization will be logged and reported
                to <span className="redacted text-[10px]">O5 COMMAND</span>.
              </p>
            </div>

            <div className="flex items-start gap-2 p-3 bg-[#05180f]/25 border border-[#60ff9b]/20 rounded-md backdrop-blur-sm">
              <div className="w-2 h-2 bg-[#6aff9b] mt-1.5 flex-shrink-0 animate-pulse"></div>
              <p>
                <strong className="text-[#6aff9b]">DIRECTIVE:</strong> All Foundation
                personnel are advised to prepare containment tools and security
                protocols in advance. SCP anomalies classified from SAFE to EUCLID
                will be accessible.
              </p>
            </div>
          </div>

          <div className="classification-bar opacity-40"></div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-[#0a2013]/25 p-2 border border-[#75ffa6]/20 rounded">
              <p className="text-[#a9ffcb]/60 mb-1">STATUS:</p>
              <p className="text-[#ff7a7a] font-bold">
                {timeLeft === "BREACH IMMINENT" ? "ACTIVE" : "BREACH PENDING"}
              </p>
            </div>
            <div className="bg-[#0a2013]/25 p-2 border border-[#75ffa6]/20 rounded">
              <p className="text-[#a9ffcb]/60 mb-1">THREAT LEVEL:</p>
              <p className="text-[#7dffb1] font-bold">CRITICAL</p>
            </div>
            <div className="bg-[#0a2013]/25 p-2 border border-[#75ffa6]/20 rounded">
              <p className="text-[#a9ffcb]/60 mb-1">CLEARANCE:</p>
              <p className="text-[#e7ffee] font-bold">LEVEL-2+</p>
            </div>
            <div className="bg-[#0a2013]/25 p-2 border border-[#75ffa6]/20 rounded">
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

      {/* Firefly + pulse animation */}
      <style>{`
        @keyframes float {
          0% { transform: translate(0, 0) scale(1); opacity: 0.5; }
          50% { transform: translate(25px, -25px) scale(1.4); opacity: 1; }
          100% { transform: translate(-15px, 15px) scale(1); opacity: 0.5; }
        }
        .animate-float {
          animation-name: float;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s infinite ease-in-out;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
