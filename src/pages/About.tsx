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
      {/* Blue darkening overlay */}
      <div className="absolute inset-0 bg-[#030b1d]/70 backdrop-blur-[2px]"></div>

      {/* Gentle holographic glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,rgba(90,150,255,0.25),transparent_70%)] animate-[softblink_5s_infinite_ease-in-out]"></div>

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

      <main className="flex-1 container mx-auto px-4 py-10 relative z-10">
        <div className="max-w-4xl mx-auto space-y-10">

          {/* Title Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-[#c7dbff] drop-shadow-[0_0_12px_rgba(90,150,255,0.6)]">
              About{" "}
              <span className="text-[#8ebfff] drop-shadow-[0_0_10px_#5a9aff]">
                SecureContainProtect CTF
              </span>
            </h1>
            <p className="text-lg text-[#b9c8ff]/95">
              A platform for cybersecurity enthusiasts to test, learn, and enhance their skills through real-world simulations.
            </p>
          </div>

          {/* OUR MISSION — CLEAN, READABLE, NO STRIPES */}
          <Card
            className="
              border border-[#4c6dff]/40 
              bg-[#0a1327]/90 
              backdrop-blur-xl
              shadow-[0_0_35px_rgba(70,120,255,0.35)]
              hover:shadow-[0_0_45px_rgba(120,160,255,0.45)]
              transition-all duration-500
            "
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#bcd4ff]">
                <Target className="h-5 w-5 text-[#d0e2ff]" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-[#e3eaff]/95 leading-relaxed">
              <p>
                SecureContainProtect CTF is built to provide hands-on cybersecurity experience
                through realistic challenges and safe hacking environments. Our mission is to guide
                newcomers, support learners, and challenge advanced users with carefully curated tasks.
              </p>

              <p>
                The platform supports categories including web exploitation, cryptography,
                reverse engineering, digital forensics, OSINT, binary exploitation, and more.
              </p>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card
            className="
              border border-[#3b6eff]/30 
              bg-[#0a1530]/90 
              backdrop-blur-xl
              shadow-[0_0_30px_rgba(60,100,255,0.3)] 
              hover:shadow-[0_0_40px_rgba(90,140,255,0.45)]
              transition-all duration-500
            "
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#a2caff]">
                <Flag className="h-5 w-5 text-[#cfe0ff]" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-[#dbe6ff]/95">
              <div className="space-y-4">
                {[
                  {
                    step: "1",
                    title: "Create an Account",
                    desc: "Register with your email and select your unique CTF username.",
                  },
                  {
                    step: "2",
                    title: "Verify Your Email",
                    desc: "Complete verification to unlock access to all available challenges.",
                  },
                  {
                    step: "3",
                    title: "Solve Challenges",
                    desc: "Analyze clues, exploit weaknesses, inspect files, or perform investigations.",
                  },
                  {
                    step: "4",
                    title: "Submit Flags",
                    desc: "Correct flags reward points and lock the challenge for you.",
                  },
                  {
                    step: "5",
                    title: "Compete",
                    desc: "Climb the scoreboard and track your performance in real-time.",
                  },
                ].map(({ step, title, desc }) => (
                  <div key={step} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#8abaff]/20 border border-[#a2caff]/40 flex items-center justify-center flex-shrink-0 mt-1 shadow-[0_0_10px_rgba(130,180,255,0.4)]">
                      <span className="text-[#d6e5ff] font-bold">{step}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-[#cddbff]">{title}</h3>
                      <p className="text-[#b6c5ff]/90">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Community & Support */}
          <Card
            className="
              border border-[#3c4fff]/30 
              bg-[#0b162f]/90 
              backdrop-blur-xl
              shadow-[0_0_25px_rgba(0,60,255,0.25)] 
              hover:shadow-[0_0_40px_rgba(80,130,255,0.35)]
              transition-all duration-500
            "
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#8abaff]">
                <Users className="h-5 w-5 text-[#d0e2ff]" />
                Community & Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-[#d9e3ff]/95 leading-relaxed">
              <p>
                Become part of a friendly and passionate cybersecurity community.
                Discuss, learn, collaborate, and grow together.
              </p>
              <p>
                Need help? Join our Discord:
                <a
                  href="https://discord.gg/g8FnU4vGJv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#bcd3ff] underline ml-1 hover:text-white transition-all"
                >
                  Click here
                </a>
              </p>
            </CardContent>
          </Card>

          {/* Legal & Ethics */}
          <Card
            className="
              border border-[#2d4fff]/30 
              bg-[#0b1530]/90 
              backdrop-blur-xl
              shadow-[0_0_25px_rgba(0,60,255,0.25)] 
              hover:shadow-[0_0_40px_rgba(0,90,255,0.35)]
              transition-all duration-500
            "
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#bcd4ff]">
                <Shield className="h-5 w-5 text-[#d8e6ff]" />
                Legal & Ethics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-[#e0e8ff]/95 leading-relaxed">
              <p>
                SecureContainProtect CTF is strictly an educational platform.
                All challenges replicate simulated environments intended for legal learning only.
              </p>
              <p className="text-sm text-[#b4c6ff]/85">
                By using this platform, you agree to follow all applicable cybersecurity laws
                and ethical guidelines.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <style>{`
        @keyframes softblink {
          0%, 100% { opacity: 0.45; filter: brightness(0.9); }
          50% { opacity: 0.9; filter: brightness(1.15); }
        }

        @keyframes float {
          0% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.6; }
          25% { transform: translateY(-10px) translateX(6px) scale(1.1); opacity: 0.9; }
          50% { transform: translateY(-6px) translateX(-4px) scale(0.95); opacity: 0.5; }
          75% { transform: translateY(8px) translateX(5px) scale(1.05); opacity: 0.8; }
          100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
