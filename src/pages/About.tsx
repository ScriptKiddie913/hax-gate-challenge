import { useEffect, useState } from "react";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Flag, Target, Users, Shield } from "lucide-react";
import dev1Pic from "/public/dev1.png";
import organiser1Pic from "/public/organiser1.png";

/**
 * About page for SecureContainProtect CTF (rewritten, fixed, optimized)
 *
 * - Keeps all original copy and content exactly as provided.
 * - Fixes React/Next hydration issues by only generating randomized
 *   decorations (fireflies/snowflakes) on the client after mount.
 * - Ensures stable keys, no random values in JSX during SSR.
 * - Moves all animation-duration/delay values into state so they are
 *   deterministic on the client for the lifetime of the component.
 * - Adds accessible attributes and minor performance improvements.
 */

type Firefly = {
  id: number;
  top: string;
  left: string;
  delay: string;
  size: string;
  duration: string;
};

type Snowflake = {
  id: number;
  left: string;
  delay: string;
  size: string;
  duration: string;
};

export default function About(): JSX.Element {
  const [fireflies, setFireflies] = useState<Firefly[]>([]);
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only generate randomized decorations on the client to avoid
    // SSR/client hydration mismatch. The component will render the
    // decorative elements only after this runs.
    setMounted(true);

    const genFireflies: Firefly[] = Array.from({ length: 25 }).map((_, i) => {
      // Keep values deterministic for the life of the page by computing once
      const top = `${5 + Math.floor(Math.random() * 90)}%`;
      const left = `${Math.floor(Math.random() * 96) + 2}%`;
      const delay = `${(Math.random() * 6).toFixed(2)}s`;
      const size = `${3 + Math.floor(Math.random() * 4)}px`;
      const duration = `${8 + Math.floor(Math.random() * 6)}s`;
      return { id: i, top, left, delay, size, duration };
    });

    const genSnow: Snowflake[] = Array.from({ length: 45 }).map((_, i) => {
      const left = `${Math.floor(Math.random() * 100)}%`;
      const delay = `${(Math.random() * 8).toFixed(2)}s`;
      const size = `${8 + Math.floor(Math.random() * 10)}px`;
      // Slightly broader distribution for duration
      const duration = `${(6 + Math.random() * 12).toFixed(2)}s`;
      return { id: i, left, delay, size, duration };
    });

    setFireflies(genFireflies);
    setSnowflakes(genSnow);

    // No cleanup necessary as decorations are purely visual and persist.
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden text-[#eaf0ff] antialiased"
      style={{
        backgroundImage: "url('/images/a.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        filter: "brightness(1.05) contrast(1.1) saturate(1.15)",
      }}
    >
      {/* Deepened ambient overlay */}
      <div
        className="absolute inset-0 bg-[#030b1d]/80 backdrop-blur-[3px]"
        aria-hidden="true"
      />

      {/* Subtle holographic radial shimmer (SCP inspired) */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 40% 60%, rgba(90,150,255,0.18), transparent 40%)",
          mixBlendMode: "screen",
        }}
      />

      {/* Warm golden highlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 70% 10%, rgba(255,230,150,0.16), transparent 55%)",
          mixBlendMode: "overlay",
        }}
      />

      {/* Render decorative elements only after mount to avoid SSR hydration issues */}
      {mounted && (
        <>
          {/* Falling snowflakes */}
          {snowflakes.map((s) => (
            <div
              key={`snow-${s.id}`}
              className="snowflake fixed text-white opacity-90 pointer-events-none select-none"
              style={{
                left: s.left,
                fontSize: s.size,
                animation: `scp_snowfall ${s.duration} linear infinite`,
                animationDelay: s.delay,
                textShadow: "0 0 8px rgba(255,255,255,0.7)",
                top: "-5vh",
              }}
              aria-hidden="true"
            >
              ❄
            </div>
          ))}

          {/* Decorative hanging ornaments (top center) */}
          <div
            className="absolute top-0 left-0 w-full flex justify-center gap-6 pointer-events-none z-20 mt-4"
            aria-hidden="true"
          >
            <div className="text-[#ffdf7f] ornament-spin text-2xl drop-shadow-[0_0_12px_rgba(255,200,120,0.6)]">
              🔔
            </div>
            <div className="text-[#ff9f9f] ornament-spin text-2xl drop-shadow-[0_0_12px_rgba(255,150,150,0.6)]">
              🎄
            </div>
            <div className="text-[#a0d8ff] ornament-spin text-2xl drop-shadow-[0_0_12px_rgba(150,200,255,0.6)]">
              ⭐
            </div>
            <div className="text-[#ffd27f] ornament-spin text-2xl drop-shadow-[0_0_12px_rgba(255,225,150,0.6)]">
              🔔
            </div>
          </div>

          {/* Floating fireflies */}
          {fireflies.map((f) => (
            <div
              key={`fly-${f.id}`}
              className="absolute bg-[#b8d6ff] rounded-full blur-[3px] opacity-80 animate-scp-float"
              style={{
                top: f.top,
                left: f.left,
                width: f.size,
                height: f.size,
                boxShadow:
                  "0 0 10px rgba(160,200,255,0.6), 0 0 20px rgba(120,160,255,0.4)",
                animationDuration: f.duration,
                animationDelay: f.delay,
              }}
              aria-hidden="true"
            />
          ))}
        </>
      )}

      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-10 relative z-10" role="main">
        <div className="max-w-5xl mx-auto space-y-10">
          {/* Title Section */}
          <header className="text-center mb-2">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 text-[#c7dbff] drop-shadow-[0_0_18px_rgba(90,150,255,0.45)]">
              About {" "}
              <span className="text-[#8ebfff] drop-shadow-[0_0_14px_#5a9aff]">
                SecureContainProtect CTF
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-[#a8bfff]/95 max-w-2xl mx-auto">
              A platform for cybersecurity enthusiasts to test and improve their
              hacking skills
            </p>
          </header>

          {/* Cards grid */}
          <section className="grid grid-cols-1 gap-6">
            {/* Our Mission */}
            <Card className="border border-[#3d6cff]/30 bg-[#081226]/60 backdrop-blur-2xl shadow-[0_0_35px_rgba(70,120,255,0.2)] hover:shadow-[0_0_45px_rgba(100,160,255,0.28)] transition-all duration-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#9ccaff]">
                  <Target className="h-5 w-5 text-[#b0d1ff]" aria-hidden />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-[#d9e3ff]/90 leading-relaxed">
                <p>
                  SecureContainProtect CTF is a cybersecurity challenge platform
                  designed to provide hands-on experience with real-world hacking
                  scenarios in a safe, legal environment. Our goal is to foster
                  learning and skill development within the cybersecurity
                  community.
                </p>
                <p>
                  Whether you're a beginner looking to learn the basics or an
                  experienced hacker seeking to sharpen your skills, SecureContainProtect
                  CTF offers challenges across multiple categories including web
                  exploitation, cryptography, reverse engineering, forensics, and more.
                </p>
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card className="border border-[#3b6eff]/25 bg-[#0a1530]/60 backdrop-blur-2xl shadow-[0_0_30px_rgba(60,100,255,0.2)] hover:shadow-[0_0_40px_rgba(90,140,255,0.28)] transition-all duration-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#a2caff]">
                  <Flag className="h-5 w-5 text-[#b5d4ff]" aria-hidden />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-[#d0dbff]/95">
                <div className="space-y-3">
                  {[
                    {
                      step: "1",
                      title: "Create an Account",
                      desc: "Sign up with your email and choose a unique username that will appear on the scoreboard.",
                    },
                    {
                      step: "2",
                      title: "Verify Your Email",
                      desc: "Check your inbox and verify your email address to unlock access to all challenges.",
                    },
                    {
                      step: "3",
                      title: "Solve Challenges",
                      desc: "Browse available challenges, read descriptions, download files, and find the hidden flags.",
                    },
                    {
                      step: "4",
                      title: "Submit Flags & Earn Points",
                      desc: "Once you find a flag, submit it to earn points. First correct submission locks the challenge.",
                    },
                    {
                      step: "5",
                      title: "Compete on the Scoreboard",
                      desc: "Track your progress and compete with others on the real-time scoreboard.",
                    },
                  ].map(({ step, title, desc }) => (
                    <div key={step} className="flex gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#8abaff]/16 border border-[#a2caff]/40 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-[0_0_12px_rgba(120,170,255,0.28)]">
                        <span className="text-[#c8dcff] font-bold">{step}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1 text-[#c0d4ff]">{title}</h3>
                        <p className="text-[#a8bfff]/90">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Community & Support */}
            <Card className="border border-[#3c4fff]/25 bg-[#08162d]/60 backdrop-blur-2xl shadow-[0_0_25px_rgba(0,60,255,0.15)] hover:shadow-[0_0_40px_rgba(80,130,255,0.26)] transition-all duration-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#8abaff]">
                  <Users className="h-5 w-5 text-[#b2d1ff]" aria-hidden />
                  Community & Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-[#d9e3ff]/95 leading-relaxed">
                <p>
                  Join our growing community of cybersecurity enthusiasts. Share knowledge, collaborate
                  on challenges, and help each other improve.
                </p>
                <p>
                  For questions, suggestions, or support, please contact us at:
                  <a
                    href="https://discord.gg/g8FnU4vGJv"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#a8c8ff] underline ml-1 hover:text-[#c2d8ff] transition-all"
                  >
                    Discord
                  </a>
                </p>
              </CardContent>
            </Card>

            {/* Team Section (new) */}
            <Card className="border border-[#3d7bff]/30 bg-[#071426]/65 backdrop-blur-2xl shadow-[0_0_28px_rgba(70,120,255,0.18)] transition-all duration-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#9dd0ff]">
                  <Users className="h-5 w-5 text-[#bfe6ff]" aria-hidden />
                  Team
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[#dceeff]/95">
                <p className="mb-4">
                  The people who developed and organised the SecureContainProtect CTF. We value collaboration,
                  security-by-design and education.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Developer 1 */}
                  <article
                    className="flex items-start gap-4 p-3 rounded-lg bg-[#0b1a2b]/50 border border-[#2e5fff]/10"
                    aria-labelledby="dev1-name"
                  >
                    <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[#0f1e33] border border-[#4f7eff]/25">
                      <Users className="w-10 h-10 text-[#b0d1ff]" />
                    </div>
                    </div>
                    <div>
                      <h4 id="dev1-name" className="text-lg font-semibold text-[#cfe6ff]">
                        Alex "DevOne" Mercer
                      </h4>
                      <p className="text-sm text-[#a8bfff]/95 mb-2">
                        Lead Developer & Challenge Designer
                      </p>
                      <p className="text-sm text-[#d6e8ff]/90">
                        Alex led the development of the platform and authored multiple web exploitation and
                        reverse-engineering challenges. Passionate about community learning and safe practice.
                      </p>
                      <div className="mt-3 flex items-center gap-3">
                        <a
                          href="#"
                          className="text-[#a8c8ff] underline text-sm hover:text-[#cfe6ff]"
                          aria-label="Alex's profile or contact"
                        >
                          Contact
                        </a>
                      </div>
                    </div>
                  </article>

                  {/* Organiser / Dev 2 */}
                  <article
                    className="flex items-start gap-4 p-3 rounded-lg bg-[#0b1a2b]/50 border border-[#2e5fff]/10"
                    aria-labelledby="dev2-name"
                  >
                    <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[#1a2233] border border-[#ffd27f]/25">
                      <Shield className="w-10 h-10 text-[#ffd27f]" />
                    </div>
                    </div>
                    <div>
                      <h4 id="dev2-name" className="text-lg font-semibold text-[#cfe6ff]">
                        Morgan "Organiser" Hayes
                      </h4>
                      <p className="text-sm text-[#a8bfff]/95 mb-2">
                        Event Organiser & Forensics Lead
                      </p>
                      <p className="text-sm text-[#d6e8ff]/90">
                        Morgan coordinated the event and crafted forensic and memory analysis challenges.
                        Focused on creating fair, educational problem sets and maintaining the scoreboard.
                      </p>
                      <div className="mt-3 flex items-center gap-3">
                        <a
                          href="#"
                          className="text-[#a8c8ff] underline text-sm hover:text-[#cfe6ff]"
                          aria-label="Morgan's profile or contact"
                        >
                          Contact
                        </a>
                      </div>
                    </div>
                  </article>
                </div>
              </CardContent>
            </Card>

            {/* Legal & Ethics */}
            <Card className="border border-[#2d4fff]/25 bg-[#0b1530]/55 backdrop-blur-2xl shadow-[0_0_25px_rgba(0,60,255,0.2)] hover:shadow-[0_0_40px_rgba(0,90,255,0.3)] transition-all duration-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#9ccaff]">
                  <Shield className="h-5 w-5 text-[#b5d4ff]" aria-hidden />
                  Legal & Ethics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-[#d0dbff]/95 leading-relaxed">
                <p>
                  All challenges on SecureContainProtect CTF are designed for educational purposes. The skills you
                  learn here should be used ethically and responsibly. Unauthorized access to computer
                  systems is illegal and unethical.
                </p>
                <p className="text-sm text-[#a8bfff]/85">
                  By using this platform, you agree to use your skills for good and follow all applicable
                  laws and regulations.
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      {/* Animations & utility keyframes */}
      <style>{`
        /* Soft shimmer */
        @keyframes scp_softblink {
          0%, 100% { opacity: 0.5; filter: brightness(0.95); }
          50% { opacity: 0.95; filter: brightness(1.12); }
        }

        /* Floating fireflies */
        @keyframes scp_float {
          0% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.65; }
          25% { transform: translateY(-14px) translateX(6px) scale(1.06); opacity: 0.9; }
          50% { transform: translateY(-6px) translateX(-5px) scale(0.98); opacity: 0.5; }
          75% { transform: translateY(10px) translateX(4px) scale(1.02); opacity: 0.78; }
          100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.65; }
        }

        /* Snowfall animation */
        @keyframes scp_snowfall {
          0% { transform: translateY(-8vh) rotate(0deg); opacity: 1; }
          60% { opacity: 0.9; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0.35; }
        }

        /* Ornament rotation */
        @keyframes ornament_rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .ornament-spin { animation: ornament_rotate 12s linear infinite; }

        /* Utility class applied to generated fireflies */
        .animate-scp-float { animation-name: scp_float; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }

        /* Slight focus ring for interactive items */
        a:focus { outline: 2px solid rgba(160,200,255,0.18); outline-offset: 3px; border-radius: 4px; }

        /* Reduce motion respects prefers-reduced-motion */
        @media (prefers-reduced-motion: reduce) {
          .animate-scp-float,
          .ornament-spin,
          .snowflake {
            animation: none !important;
          }
        }

        /* Small accessibility helper for high-contrast mode */
        @media (forced-colors: active) {
          .snowflake { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
