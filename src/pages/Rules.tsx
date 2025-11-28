import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Trophy, Flag, Ban } from "lucide-react";

/*!
==============================================================
 FLAG: scpctf{Rul3s_4r3_m3ant_t0_b3_br0k3n}
==============================================================
*/

export default function Rules() {
  const [blobs, setBlobs] = useState<
    { id: number; top: string; left: string; size: string; delay: string }[]
  >([]);

  useEffect(() => {
    const generatedBlobs = Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${80 + Math.random() * 120}px`,
      delay: `${Math.random() * 5}s`,
    }));
    setBlobs(generatedBlobs);
  }, []);

  return (
    <div
      className="
        min-h-screen flex flex-col relative overflow-hidden 
        text-[#d8e4ff]
        festive-glow
      "
      style={{
        backgroundImage: "url('/images/r.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >

      {/* ❄️ GLOBAL SNOWFALL — Match About Page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none snowfall">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={`snow-${i}`}
            className="snowflake"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${6 + Math.random() * 5}s`,
              animationDelay: `${Math.random() * 4}s`,
              fontSize: `${0.4 + Math.random() * 1.1}rem`,
            }}
          >
            ❄
          </div>
        ))}
      </div>

      {/* ✨ TWINKLING CHRISTMAS LIGHT PARTICLES */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={`twinkle-${i}`}
            className="christmas-lights absolute rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: "4px",
              height: "4px",
              backgroundColor: "white",
              opacity: 0.7,
              animationDelay: `${Math.random()}s`,
            }}
          ></div>
        ))}
      </div>

      {/* 🔵 DARKENING BLUE OVERLAY — DO NOT REMOVE */}
      <div className="absolute inset-0 bg-[#010b1a]/80 backdrop-blur-md animate-[ambient_6s_infinite]"></div>

      {/* 🌈 HOLOGRAPHIC BLUR BLOBS */}
      {blobs.map((blob) => (
        <div
          key={blob.id}
          className="absolute rounded-full bg-cyan-400/10 blur-3xl animate-[blink_6s_infinite]"
          style={{
            top: blob.top,
            left: blob.left,
            width: blob.size,
            height: blob.size,
            animationDelay: blob.delay,
          }}
        ></div>
      ))}

      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-4xl mx-auto space-y-10 text-[#d9e6ff]">

          {/* TITLE */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl font-extrabold mb-4 drop-shadow-[0_0_15px_rgba(90,150,255,0.6)]">
              <span className="text-[#bcd9ff] drop-shadow-[0_0_12px_#6aa7ff]">
                Rules & Guidelines
              </span>
            </h1>
            <p className="text-lg text-[#b4c8ff]/95">
              Please read carefully to ensure a fair and enjoyable experience for all participants.
            </p>
          </div>

          {/* IMPORTANT NOTICE */}
          <Card
            className="
              border border-[#4d7cff]/40 
              bg-[#071327]/85 
              backdrop-blur-xl
              shadow-[0_0_35px_rgba(70,120,255,0.35)]
              hover:shadow-[0_0_45px_rgba(120,160,255,0.45)]
              transition-all duration-500
            "
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#82baff]">
                <AlertCircle className="h-5 w-5" />
                Important Notice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed text-[#dce6ff]/95">
                All participants must follow these rules. Any form of rule violation may result in suspension,
                disqualification, or permanent bans depending on severity.
              </p>
            </CardContent>
          </Card>

          {/* SCORING RULES */}
          <Card
            className="
              border border-[#3d6cff]/30 
              bg-[#08142e]/85 
              backdrop-blur-xl
              shadow-[0_0_30px_rgba(0,60,255,0.25)] 
              hover:shadow-[0_0_40px_rgba(0,90,255,0.4)]
              transition-all duration-500
            "
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#82b7ff]">
                <Trophy className="h-5 w-5" />
                Scoring Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-[#d8e4ff] leading-relaxed">
                <li className="flex gap-3">
                  <span className="text-[#6fbaff]">•</span>
                  <span>Each challenge gives points based on difficulty.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#6fbaff]">•</span>
                  <span>First correct submission locks the challenge for you.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#6fbaff]">•</span>
                  <span>Scoreboard positions are based on total points.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#6fbaff]">•</span>
                  <span>Early submissions win tie-breakers.</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* SUBMISSION RULES */}
          <Card
            className="
              border border-[#3b6eff]/30 
              bg-[#0b1937]/85 
              backdrop-blur-xl
              shadow-[0_0_25px_rgba(0,60,255,0.25)] 
              hover:shadow-[0_0_35px_rgba(0,90,255,0.35)]
              transition-all duration-500
            "
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#94c2ff]">
                <Flag className="h-5 w-5" />
                Submission Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-[#d7e4ff] leading-relaxed">
                <li className="flex gap-3">
                  <span className="text-[#6fbaff]">•</span>
                  <span>
                    Flags must match the exact expected format, usually{" "}
                    <code className="font-mono bg-[#112249]/70 px-1 py-0.5 rounded text-[#cfe0ff]">
                      scpctf{"{...}"}
                    </code>.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#6fbaff]">•</span>
                  <span>Unlimited attempts allowed until correct.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#6fbaff]">•</span>
                  <span>Rate-limits apply to prevent brute forcing.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#6fbaff]">•</span>
                  <span>Do not share flags or solutions publicly.</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* PROHIBITED ACTIVITIES */}
          <Card
            className="
              border border-[#4a5cff]/30 
              bg-[#08162e]/85 
              backdrop-blur-xl
              shadow-[0_0_25px_rgba(0,60,255,0.2)] 
              hover:shadow-[0_0_35px_rgba(0,90,255,0.35)]
              transition-all duration-500
            "
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#ff7a7a]">
                <Ban className="h-5 w-5" />
                Prohibited Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-[#e3eaff] leading-relaxed">
                <li className="flex gap-3">
                  <span className="text-[#ff7a7a]">✕</span>
                  <span><strong>No attacking the platform infrastructure.</strong></span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#ff7a7a]">✕</span>
                  <span><strong>No sharing of flags or challenge answers.</strong></span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#ff7a7a]">✕</span>
                  <span><strong>No DDoS, brute-force, or automated exploitation.</strong></span>
                </li>
              </ul>
            </CardContent>
          </Card>

        </div>
      </main>

      {/* LOCAL ANIMATIONS */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 0.3; transform: scale(1.2); }
        }
        @keyframes ambient {
          0%, 100% { opacity: 0.95; filter: brightness(0.9); }
          50% { opacity: 0.85; filter: brightness(1.05); }
        }
      `}</style>
    </div>
  );
}
