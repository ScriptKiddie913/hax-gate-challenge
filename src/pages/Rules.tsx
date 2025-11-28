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
        bg-[#02040a] festive-glow
      "
    >

      {/* ❄ GLOBAL SNOWFALL */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none snowfall">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={`snow-${i}`}
            className="snowflake"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${6 + Math.random() * 4}s`,
              animationDelay: `${Math.random() * 4}s`,
              fontSize: `${0.4 + Math.random() * 1.2}rem`,
            }}
          >
            ❄
          </div>
        ))}
      </div>

      {/* ✨ TWINKLE PARTICLES */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 35 }).map((_, i) => (
          <div
            key={`tw-${i}`}
            className="absolute rounded-full christmas-lights"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: "5px",
              height: "5px",
              backgroundColor: ["#ffffff", "#a8c8ff", "#d0e6ff"][Math.floor(Math.random() * 3)],
              opacity: 0.75,
              animationDelay: `${Math.random()}s`,
            }}
          ></div>
        ))}
      </div>

      {/* DARK BLUE HOLIDAY OVERLAY */}
      <div className="absolute inset-0 bg-[#010b1a]/80 backdrop-blur-[3px] animate-[ambient_6s_infinite]"></div>

      {/* GLOWING BLUR BLOBS */}
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

      {/* MAIN CONTENT */}
      <main className="flex-1 container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-4xl mx-auto space-y-10 text-[#d5e1ff]">

          {/* HEADER */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl font-extrabold mb-4 text-[#b7d4ff] drop-shadow-[0_0_15px_#3a7bff] tracking-wide">
              Rules & Guidelines
            </h1>
            <p className="text-lg text-[#c5d3ff]/90 font-light">
              Please read these carefully to ensure fair play and a great event for everyone.
            </p>
          </div>

          {/* IMPORTANT NOTICE */}
          <Card
            className="
              border border-[#6ea0ff]/40 
              bg-[#0a1327]/85 
              backdrop-blur-xl
              shadow-[0_0_35px_rgba(100,150,255,0.35)]
              hover:shadow-[0_0_45px_rgba(150,200,255,0.45)]
              transition-all duration-500
              rounded-xl
            "
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#9ec7ff]">
                <AlertCircle className="h-5 w-5" />
                Important Notice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#e3ebff] leading-relaxed">
                All participants must follow these rules. Violations may result in disqualification or
                permanent suspension. If you notice suspicious activity,
                notify moderators or event administrators immediately.
              </p>
            </CardContent>
          </Card>

          {/* SCORING RULES */}
          <Card
            className="
              border border-[#608cff]/35 
              bg-[#0a1530]/85 
              backdrop-blur-xl
              shadow-[0_0_28px_rgba(80,130,255,0.25)]
              hover:shadow-[0_0_38px_rgba(120,160,255,0.35)]
              transition-all duration-500
              rounded-xl
            "
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#90b8ff]">
                <Trophy className="h-5 w-5" />
                Scoring Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 list-none text-[#d8e4ff]">
                <li className="flex gap-3">
                  <span className="text-[#8bb8ff]">•</span>
                  <span>
                    Each challenge has a score based on difficulty.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#8bb8ff]">•</span>
                  <span>
                    Only the <strong>first correct submission</strong> gives points.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#8bb8ff]">•</span>
                  <span>
                    After solving a challenge, it becomes <strong>locked</strong>.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#8bb8ff]">•</span>
                  <span>
                    Ties are broken by earliest submission time.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* SUBMISSION RULES */}
          <Card
            className="
              border border-[#5c82ff]/35 
              bg-[#0b1935]/85 
              backdrop-blur-xl
              shadow-[0_0_25px_rgba(70,110,255,0.25)]
              hover:shadow-[0_0_35px_rgba(110,150,255,0.35)]
              transition-all duration-500
              rounded-xl
            "
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#8bbaff]">
                <Flag className="h-5 w-5" />
                Submission Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 list-none text-[#d5e2ff]">
                <li className="flex gap-3">
                  <span className="text-[#8bbaff]">•</span>
                  <span>
                    Flags must match the exact format specified, usually{" "}
                    <code className="font-mono bg-[#13224a]/70 px-1 py-0.5 rounded text-[#cfe0ff]">
                      scpctf{"{...}"}
                    </code>.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#8bbaff]">•</span>
                  <span>You may attempt submissions until correct.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#8bbaff]">•</span>
                  <span>Rate limiting is enforced to prevent brute forcing.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#8bbaff]">•</span>
                  <span>Sharing flags or hints during the event is prohibited.</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* PROHIBITED ACTIVITIES */}
          <Card
            className="
              border border-[#728cff]/30 
              bg-[#0a162d]/85 
              backdrop-blur-xl
              shadow-[0_0_25px_rgba(60,100,255,0.25)]
              hover:shadow-[0_0_35px_rgba(90,130,255,0.35)]
              transition-all duration-500
              rounded-xl
            "
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#ff6c6c]">
                <Ban className="h-5 w-5" />
                Prohibited Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 list-none text-[#e7ebff]">
                <li className="flex gap-3">
                  <span className="text-[#ff6c6c]">✕</span>
                  <span>
                    <strong>No attacking the platform</strong> — only designated challenge servers.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#ff6c6c]">✕</span>
                  <span>
                    <strong>No flag sharing</strong> or unauthorized collaboration.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#ff6c6c]">✕</span>
                  <span>
                    <strong>No DDoS, brute forcing, or exploiting the scoring system.</strong>
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

        </div>
      </main>

      {/* ANIMATIONS */}
      <style>{`
        @keyframes blink {
          0%, 100% {
            opacity: 0.1;
            transform: scale(0.85);
          }
          50% {
            opacity: 0.35;
            transform: scale(1.1);
          }
        }

        @keyframes ambient {
          0%, 100% { opacity: 0.95; filter: brightness(0.85); }
          50% { opacity: 0.85; filter: brightness(1.05); }
        }
      `}</style>
    </div>
  );
}
