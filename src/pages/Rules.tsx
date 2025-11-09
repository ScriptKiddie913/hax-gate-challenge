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
 */ helps preserve it through some
   build minifiers (like Terser) which keep "important" comments.

 If you want to ensure it survives production builds:
   - Set "terserOptions: { format: { comments: /!/ } }" in your build.
   - OR serve this file unminified during the CTF.

==============================================================
*/

export default function Rules() {
  const [blobs, setBlobs] = useState<
    { id: number; top: string; left: string; size: string; delay: string }[]
  >([]);

  useEffect(() => {
    // Random glowing light blobs generation
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
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        backgroundImage: "url('/images/r.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Flickering blue ambient overlay */}
      <div className="absolute inset-0 bg-[#010b1a]/80 backdrop-blur-sm animate-[ambient_6s_infinite]"></div>

      {/* Glowing random light blobs */}
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
        <div className="max-w-4xl mx-auto space-y-8 text-[#cdd9ff]">
          {/* Heading Section */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl font-extrabold mb-4 text-[#9fc5ff] tracking-wide">
              <span className="text-gradient-cyan drop-shadow-[0_0_10px_#005eff]">
                Rules & Guidelines
              </span>
            </h1>
            <p className="text-lg text-[#aebeff] font-light">
              Please read and follow these rules to ensure fair play and a smooth experience for everyone.
            </p>
          </div>

          {/* Important Notice Card */}
          <Card className="border border-[#3d6cff]/40 bg-[#0a1530]/60 backdrop-blur-xl shadow-[0_0_30px_rgba(0,60,255,0.15)] hover:shadow-[0_0_40px_rgba(0,90,255,0.25)] transition-all duration-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#4eaaff]">
                <AlertCircle className="h-5 w-5" />
                Important Notice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#d9e3ff] leading-relaxed">
                All participants must follow these rules. Violation may result in disqualification or a permanent ban from the platform. Report any suspicious activity immediately to the moderators or event admins.
              </p>
            </CardContent>
          </Card>

          {/* Scoring Rules Card */}
          <Card className="border border-[#3358ff]/30 bg-[#081226]/70 backdrop-blur-md shadow-[0_0_20px_rgba(0,60,255,0.1)] hover:shadow-[0_0_25px_rgba(0,90,255,0.2)] transition-all duration-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#62a0ff]">
                <Trophy className="h-5 w-5" />
                Scoring Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 list-none text-[#d0dbff]">
                <li className="flex gap-3">
                  <span className="text-[#4eaaff]">•</span>
                  <span>
                    Each challenge is worth a specific number of points based on its difficulty level.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#4eaaff]">•</span>
                  <span>
                    Points are awarded only for the <strong>first correct submission</strong> per user per challenge.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#4eaaff]">•</span>
                  <span>
                    Once you solve a challenge, it becomes <strong>locked</strong> — no further submissions are accepted.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#4eaaff]">•</span>
                  <span>
                    Scoreboard ranks are determined by total points, with ties broken by the earliest correct submission timestamp.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Submission Rules Card */}
          <Card className="border border-[#2f5aff]/30 bg-[#0b1935]/70 backdrop-blur-md shadow-[0_0_20px_rgba(0,60,255,0.1)] hover:shadow-[0_0_25px_rgba(0,90,255,0.2)] transition-all duration-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#4eaaff]">
                <Flag className="h-5 w-5" />
                Submission Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 list-none text-[#d0dbff]">
                <li className="flex gap-3">
                  <span className="text-[#4eaaff]">•</span>
                  <span>
                    Flags must match the format described in each challenge, typically in the format{" "}
                    <code className="font-mono bg-[#112249]/70 px-1 py-0.5 rounded text-[#b8d4ff]">
                      scpctf{"{...}"}
                    </code>.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#4eaaff]">•</span>
                  <span>You can attempt unlimited submissions until correct.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#4eaaff]">•</span>
                  <span>Rate limiting is enforced to prevent brute-force attempts.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#4eaaff]">•</span>
                  <span>Do not share flags or write-ups during the active event period.</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Prohibited Activities Card */}
          <Card className="border border-[#3c4fff]/30 bg-[#08162d]/70 backdrop-blur-md shadow-[0_0_20px_rgba(0,60,255,0.1)] hover:shadow-[0_0_25px_rgba(0,90,255,0.2)] transition-all duration-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#ff5c5c]">
                <Ban className="h-5 w-5" />
                Prohibited Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 list-none text-[#d0dbff]">
                <li className="flex gap-3">
                  <span className="text-[#ff5c5c]">✕</span>
                  <span>
                    <strong>No attacks on the platform</strong> — only target designated challenge environments.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#ff5c5c]">✕</span>
                  <span>
                    <strong>No flag sharing</strong> or collaboration beyond what is allowed by event rules.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#ff5c5c]">✕</span>
                  <span>
                    <strong>No DDoS, brute-forcing, or service abuse</strong> — violations result in immediate suspension.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Hidden keyframes block also containing flag in comment */}
      {/* FLAG: scpctf{Rul3s_4r3_m3ant_t0_b3_br0k3n} */}
      <style>{`
        @keyframes blink {
          0%, 100% {
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.2);
          }
        }

        @keyframes ambient {
          0%, 100% {
            opacity: 0.95;
            filter: brightness(0.9);
          }
          50% {
            opacity: 0.85;
            filter: brightness(1.05);
          }
        }
      `}</style>
    </div>
  );
}
