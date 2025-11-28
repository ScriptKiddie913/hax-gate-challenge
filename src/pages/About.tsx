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

      {/* ❄ Christmas Snowfall Overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={`snow-${i}`}
            className="absolute text-white opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 20}%`,
              fontSize: `${10 + Math.random() * 14}px`,
              animation: `snowFall ${5 + Math.random() * 8}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            ❄
          </div>
        ))}
      </div>

      {/* Christmas Glow Lights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={`tw-${i}`}
            className="absolute rounded-full christmas-lights"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: "5px",
              height: "5px",
              backgroundColor: ["#ff6666", "#66ff66", "#66ccff", "#ffd966"][
                Math.floor(Math.random() * 4)
              ],
              boxShadow: "0 0 10px currentColor, 0 0 20px currentColor",
              animationDelay: `${Math.random()}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Dark Winter Overlay */}
      <div className="absolute inset-0 bg-[#030b1d]/70 backdrop-blur-[2px]"></div>

      {/* Soft Magical Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,rgba(180,220,255,0.25),transparent_70%)] animate-[softblink_5s_infinite_ease-in-out]"></div>

      {/* Blue Magical Fireflies */}
      {fireflies.map((f) => (
        <div
          key={f.id}
          className="absolute bg-[#cfe3ff] rounded-full blur-[4px] opacity-80 animate-[float_10s_infinite_ease-in-out]"
          style={{
            top: f.top,
            left: f.left,
            width: f.size,
            height: f.size,
            boxShadow: "0 0 12px rgba(200,220,255,0.7), 0 0 25px rgba(120,150,255,0.4)",
            animationDelay: f.delay,
          }}
        ></div>
      ))}

      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-10 relative z-10">
        <div className="max-w-4xl mx-auto space-y-10">

          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-[#e3efff] drop-shadow-[0_0_20px_rgba(100,150,255,0.6)]">
              About{" "}
              <span className="text-[#b9d3ff] drop-shadow-[0_0_15px_#78aaff]">
                SecureContainProtect CTF
              </span>
            </h1>
            <p className="text-lg text-[#d3ddff]/95">
              A winter-themed hacking experience for cybersecurity enthusiasts to learn, compete, and grow.
            </p>
          </div>

          {/* OUR MISSION — Christmas Frost Panel */}
          <Card
            className="
              border border-[#6ea0ff]/40 
              bg-[#0a1a33]/90 
              backdrop-blur-2xl
              shadow-[0_0_45px_rgba(100,150,255,0.45)]
              hover:shadow-[0_0_60px_rgba(150,200,255,0.6)]
              transition-all duration-500
              rounded-xl
            "
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#d8e7ff]">
                <Target className="h-5 w-5 text-[#e8f3ff]" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-[#f0f4ff]/95 leading-relaxed">
              <p>
                SecureContainProtect CTF provides realistic and safe cybersecurity challenges
                designed to improve hacking abilities in a controlled environment.
                Our mission is to help learners grow — from newcomers to advanced practitioners.
              </p>

              <p>
                Categories include web exploitation, cryptography, reverse engineering, digital forensics,
                OSINT, binary exploitation, and more — all presented with a festive Christmas experience.
              </p>
            </CardContent>
          </Card>

          {/* How It Works — Winter Panel */}
          <Card
            className="
              border border-[#6c8cff]/30 
              bg-[#0b1b36]/90 
              backdrop-blur-2xl
              shadow-[0_0_38px_rgba(80,130,255,0.35)] 
              hover:shadow-[0_0_55px_rgba(120,160,255,0.5)]
              transition-all duration-500
              rounded-xl
            "
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#c7daff]">
                <Flag className="h-5 w-5 text-[#e2eeff]" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-[#e6edff]/95">
              <div className="space-y-4">
                {[
                  {
                    step: "1",
                    title: "Create an Account",
                    desc: "Sign up and choose your CTF username.",
                  },
                  {
                    step: "2",
                    title: "Verify Your Email",
                    desc: "Verification unlocks full platform access.",
                  },
                  {
                    step: "3",
                    title: "Solve Challenges",
                    desc: "Explore festive hacking puzzles and simulations.",
                  },
                  {
                    step: "4",
                    title: "Submit Flags",
                    desc: "Earn points and climb the Christmas scoreboard.",
                  },
                  {
                    step: "5",
                    title: "Compete",
                    desc: "Challenge others and rank higher every day.",
                  },
                ].map(({ step, title, desc }) => (
                  <div key={step} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#9ec4ff]/20 border border-[#bdd8ff]/40 flex items-center justify-center flex-shrink-0 mt-1 shadow-[0_0_12px_rgba(160,200,255,0.4)]">
                      <span className="text-[#e8f2ff] font-bold">{step}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-[#d9e7ff]">{title}</h3>
                      <p className="text-[#cbd8ff]/90">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Community & Support — Snowy Panel */}
          <Card
            className="
              border border-[#769aff]/30 
              bg-[#0c1c38]/90 
              backdrop-blur-2xl
              shadow-[0_0_40px_rgba(90,140,255,0.4)] 
              hover:shadow-[0_0_55px_rgba(140,190,255,0.55)]
              transition-all duration-500
              rounded-xl
            "
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#b1cdff]">
                <Users className="h-5 w-5 text-[#e3edff]" />
                Community & Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-[#e8efff]/95 leading-relaxed">
              <p>
                Join our festive and friendly community of cybersecurity learners
                and professionals. Collaborate, improve, and celebrate this winter season.
              </p>
              <p>
                Need help? Reach us through Discord:
                <a
                  href="https://discord.gg/g8FnU4vGJv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#cfe0ff] underline ml-2 hover:text-white transition-all"
                >
                  Click here
                </a>
              </p>
            </CardContent>
          </Card>

          {/* Legal & Ethics — Frosted Winter Panel */}
          <Card
            className="
              border border-[#6d8bff]/30 
              bg-[#0b1933]/90 
              backdrop-blur-2xl
              shadow-[0_0_35px_rgba(70,110,255,0.4)] 
              hover:shadow-[0_0_55px_rgba(110,150,255,0.55)]
              transition-all duration-500
              rounded-xl
            "
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#cdddff]">
                <Shield className="h-5 w-5 text-[#e9f1ff]" />
                Legal & Ethics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-[#eef3ff]/95 leading-relaxed">
              <p>
                SecureContainProtect CTF is strictly intended for educational cybersecurity training.
                All simulated environments are legal and controlled.
              </p>
              <p className="text-sm text-[#d2ddff]/85">
                By using this platform, you agree to follow ethical hacking practices
                and all cybersecurity laws.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* CHRISTMAS ANIMATIONS */}
      <style>{`
        @keyframes snowFall {
          0% { transform: translateY(0vh); opacity: 1; }
          100% { transform: translateY(110vh); opacity: 0.3; }
        }

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

        @keyframes christmas-light-twinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.9); }
        }

        .christmas-lights {
          animation: christmas-light-twinkle 1.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
