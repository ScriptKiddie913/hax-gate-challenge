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
    // Generate calm floating fireflies
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
      className="min-h-screen flex flex-col relative overflow-hidden text-[#eaf0ff] festive-glow"
      style={{
        backgroundImage: "url('/images/a.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        filter: "brightness(1.05) contrast(1.1) saturate(1.15)",
      }}
    >

      {/* ❄️ GLOBAL SNOWFALL */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none snowfall">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={`snow-${i}`}
            className="snowflake"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${5 + Math.random() * 5}s`,
              animationDelay: `${Math.random() * 5}s`,
              fontSize: `${0.4 + Math.random() * 1.1}rem`,
            }}
          >
            ❄
          </div>
        ))}
      </div>

      {/* ✨ TWINKLING LIGHT PARTICLES */}
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

      {/* 🔵 DARK BLUE OVERLAY */}
      <div className="absolute inset-0 bg-[#030b1d]/70 backdrop-blur-[3px]"></div>

      {/* 🌈 HOLOGRAPHIC SHIMMER LAYER */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,rgba(90,150,255,0.2),transparent_70%)] animate-[softblink_5s_infinite_ease-in-out]"></div>

      {/* 🟦 GLOWING FLOATING FIREFLIES */}
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

          {/* 🎄 TITLE SECTION */}
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

          {/* 🎯 OUR MISSION */}
          <Card className="
            border border-[#3d6cff]/30 
            bg-[#081226]/50 backdrop-blur-2xl 
            shadow-[0_0_35px_rgba(70,120,255,0.25)] 
            hover:shadow-[0_0_45px_rgba(100,160,255,0.3)]
            transition-all duration-500
            candy-cane-stripe
          ">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#9ccaff]">
                <Target className="h-5 w-5 text-[#b0d1ff]" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-[#d9e3ff]/90 leading-relaxed">
              <p>
                SecureContainProtect CTF is a cybersecurity challenge
                platform designed to provide hands-on experience with
                real-world hacking scenarios in a safe, legal environment.
              </p>
              <p>
                Whether you're a beginner or an experienced hacker,
                SCP-CTF offers challenges in web exploitation,
                cryptography, reverse engineering, forensics, OSINT, and more.
              </p>
            </CardContent>
          </Card>

          {/* 🚩 HOW IT WORKS */}
          <Card className="
            border border-[#3b6eff]/25 
            bg-[#0a1530]/55 backdrop-blur-2xl 
            shadow-[0_0_30px_rgba(60,100,255,0.25)] 
            hover:shadow-[0_0_40px_rgba(90,140,255,0.3)]
            transition-all duration-500
          ">
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
                    desc: "Register with your email and pick your CTF username.",
                  },
                  {
                    step: "2",
                    title: "Verify Your Email",
                    desc: "Verify to unlock full access to challenges.",
                  },
                  {
                    step: "3",
                    title: "Solve Challenges",
                    desc: "Find flags by analyzing files, exploiting systems, or decoding data.",
                  },
                  {
                    step: "4",
                    title: "Earn Points",
                    desc: "Correct flag submission grants points and locks the challenge.",
                  },
                  {
                    step: "5",
                    title: "Compete",
                    desc: "Watch your rank rise on the live scoreboard.",
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

          {/* 👥 COMMUNITY */}
          <Card className="
            border border-[#3c4fff]/25 
            bg-[#08162d]/55 backdrop-blur-2xl 
            shadow-[0_0_25px_rgba(0,60,255,0.2)] 
            hover:shadow-[0_0_40px_rgba(80,130,255,0.3)]
            transition-all duration-500
          ">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#8abaff]">
                <Users className="h-5 w-5 text-[#b2d1ff]" />
                Community & Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-[#d9e3ff]/95 leading-relaxed">
              <p>
                Join our cybersecurity community. Share knowledge,
                collaborate, and learn with others.
              </p>
              <p>
                Need help? Contact us on:
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

          {/* 🛡️ LEGAL */}
          <Card className="
            border border-[#2d4fff]/25 
            bg-[#0b1530]/55 backdrop-blur-2xl 
            shadow-[0_0_25px_rgba(0,60,255,0.2)] 
            hover:shadow-[0_0_40px_rgba(0,90,255,0.3)]
            transition-all duration-500
          ">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#9ccaff]">
                <Shield className="h-5 w-5 text-[#b5d4ff]" />
                Legal & Ethics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-[#d0dbff]/95 leading-relaxed">
              <p>
                All challenges are intended for legal, ethical cybersecurity learning.
                Misuse of these skills outside controlled environments is strictly prohibited.
              </p>
              <p className="text-sm text-[#a8bfff]/85">
                By using this platform, you agree to abide by all laws and guidelines.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* 🔧 LOCAL ANIMATIONS */}
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
      `}</style>
    </div>
  );
}
