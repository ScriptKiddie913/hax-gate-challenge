import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Flag, Target, Users, Shield } from "lucide-react";

export default function About() {
  const [fireflies, setFireflies] = useState<
    { id: number; top: string; left: string; delay: string; size: string }[]
  >([]);

  useEffect(() => {
    // Generate more visible calm fireflies
    const generated = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 6}s`,
      size: `${3 + Math.random() * 4}px`,
    }));
    setFireflies(generated);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden text-[#eaf0ff]"
      style={{
        backgroundImage: "url('/images/a.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        filter: "brightness(1.05) contrast(1.1) saturate(1.15)",
      }}
    >
      {/* Deepened blue ambient overlay */}
      <div className="absolute inset-0 bg-[#030b1d]/70 backdrop-blur-[3px]"></div>

      {/* SCP holographic gradient shimmer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,rgba(90,150,255,0.2),transparent_70%)] animate-[softblink_5s_infinite_ease-in-out]"></div>

      {/* Christmas soft golden glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(255,230,150,0.22),transparent_70%)] pointer-events-none"></div>

      {/* Christmas hanging ornaments */}
      <div className="absolute top-0 left-0 w-full flex justify-center gap-6 pointer-events-none z-20 mt-4">
        <div className="text-[#ffdf7f] ornament-spin text-2xl drop-shadow-[0_0_12px_rgba(255,200,120,0.6)]">🔔</div>
        <div className="text-[#ff9f9f] ornament-spin text-2xl drop-shadow-[0_0_12px_rgba(255,150,150,0.6)]">🎄</div>
        <div className="text-[#a0d8ff] ornament-spin text-2xl drop-shadow-[0_0_12px_rgba(150,200,255,0.6)]">⭐</div>
        <div className="text-[#ffd27f] ornament-spin text-2xl drop-shadow-[0_0_12px_rgba(255,225,150,0.6)]">🔔</div>
      </div>

      {/* Floating fireflies */}
      {fireflies.map((f) => (
        <div
          key={f.id}
          className="absolute bg-[#b8d6ff] rounded-full blur-[3px] opacity-80 animate-[float_10s_infinite_ease-in-out]"
          style={{
            top: f.top,
            left: f.left,
            width: f.size,
            height: f.size,
            boxShadow:
              "0 0 10px rgba(160,200,255,0.6), 0 0 20px rgba(120,160,255,0.4)",
            animationDelay: f.delay,
          }}
        ></div>
      ))}

      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Title section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-[#c7dbff] drop-shadow-[0_0_15px_rgba(90,150,255,0.5)]">
              About{" "}
              <span className="text-[#8ebfff] drop-shadow-[0_0_12px_#5a9aff]">
                SecureContainProtect CTF
              </span>
            </h1>
            <p className="text-lg text-[#a8bfff]/95">
              A platform for cybersecurity enthusiasts to test and improve their hacking skills
            </p>
          </div>

          {/* Our Mission */}
          <Card className="border border-[#3d6cff]/30 bg-[#081226]/50 backdrop-blur-2xl shadow-[0_0_35px_rgba(70,120,255,0.25)] hover:shadow-[0_0_45px_rgba(100,160,255,0.3)] transition-all duration-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#9ccaff]">
                <Target className="h-5 w-5 text-[#b0d1ff]" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-[#d9e3ff]/90 leading-relaxed">
              <p>
                SecureContainProtect CTF is a cybersecurity challenge platform designed to provide hands-on experience
                with real-world hacking scenarios in a safe, legal environment. Our goal is to foster
                learning and skill development within the cybersecurity community.
              </p>
              <p>
                Whether you're a beginner looking to learn the basics or an experienced hacker seeking
                to sharpen your skills, SecureContainProtect CTF offers challenges across multiple categories including
                web exploitation, cryptography, reverse engineering, forensics, and more.
              </p>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card className="border border-[#3b6eff]/25 bg-[#0a1530]/55 backdrop-blur-2xl shadow-[0_0_30px_rgba(60,100,255,0.25)] hover:shadow-[0_0_40px_rgba(90,140,255,0.3)] transition-all duration-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#a2caff]">
                <Flag className="h-5 w-5 text-[#b5d4ff]" />
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
                    <div className="w-8 h-8 rounded-full bg-[#8abaff]/15 border border-[#a2caff]/40 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-[0_0_12px_rgba(130,180,255,0.4)]">
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
          <Card className="border border-[#3c4fff]/25 bg-[#08162d]/55 backdrop-blur-2xl shadow-[0_0_25px_rgba(0,60,255,0.2)] hover:shadow-[0_0_40px_rgba(80,130,255,0.3)] transition-all duration-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#8abaff]">
                <Users className="h-5 w-5 text-[#b2d1ff]" />
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

          {/* Legal & Ethics */}
          <Card className="border border-[#2d4fff]/25 bg-[#0b1530]/55 backdrop-blur-2xl shadow-[0_0_25px_rgba(0,60,255,0.2)] hover:shadow-[0_0_40px_rgba(0,90,255,0.3)] transition-all duration-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#9ccaff]">
                <Shield className="h-5 w-5 text-[#b5d4ff]" />
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
        </div>
      </main>

      {/* Animations */}
      <style>{`
        @keyframes softblink {
          0%, 100% { opacity: 0.4; filter: brightness(0.9); }
          50% { opacity: 0.9; filter: brightness(1.15); }
        }

        @keyframes float {
          0% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.6; }
          25% { transform: translateY(-15px) translateX(6px) scale(1.1); opacity: 0.9; }
          50% { transform: translateY(-8px) translateX(-4px) scale(0.95); opacity: 0.5; }
          75% { transform: translateY(8px) translateX(5px) scale(1.05); opacity: 0.8; }
          100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.6; }
        }

        @keyframes snowfall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0.4; }
        }

        @keyframes ornament-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
