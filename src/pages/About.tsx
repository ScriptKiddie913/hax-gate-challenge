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
    // Generate calm, random fireflies
    const generated = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 6}s`,
      size: `${2 + Math.random() * 3}px`,
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
      }}
    >
      {/* Soft blue ambient overlay */}
      <div className="absolute inset-0 bg-[#030b1d]/80 backdrop-blur-xl"></div>

      {/* Blinking holographic light gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(70,120,255,0.15),transparent_70%)] animate-[softblink_6s_infinite_ease-in-out]"></div>

      {/* Gentle floating fireflies */}
      {fireflies.map((f) => (
        <div
          key={f.id}
          className="absolute bg-[#9ccaff]/70 rounded-full blur-[2px] opacity-70 animate-[float_10s_infinite_ease-in-out]"
          style={{
            top: f.top,
            left: f.left,
            width: f.size,
            height: f.size,
            animationDelay: f.delay,
          }}
        ></div>
      ))}

      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Title section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-[#b5ceff]">
              About{" "}
              <span className="text-[#7fbaff] drop-shadow-[0_0_10px_#4a8cff]">
                SecureContainProtect CTF
              </span>
            </h1>
            <p className="text-lg text-[#a8bfff]/90">
              A platform for cybersecurity enthusiasts to test and improve their hacking skills
            </p>
          </div>

          {/* Our Mission */}
          <Card className="border border-[#3d6cff]/20 bg-[#081226]/40 backdrop-blur-xl shadow-[0_0_25px_rgba(0,80,255,0.15)] hover:shadow-[0_0_35px_rgba(0,90,255,0.25)] transition-all duration-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#8abaff]">
                <Target className="h-5 w-5 text-[#9ccaff]" />
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
          <Card className="border border-[#2f5aff]/20 bg-[#08152b]/40 backdrop-blur-xl shadow-[0_0_20px_rgba(0,60,255,0.15)] hover:shadow-[0_0_30px_rgba(0,90,255,0.2)] transition-all duration-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#9ccaff]">
                <Flag className="h-5 w-5 text-[#8abaff]" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-[#d0dbff]/90">
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
                    <div className="w-8 h-8 rounded-full bg-[#8abaff]/10 border border-[#9ccaff]/40 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-[0_0_8px_rgba(138,186,255,0.3)]">
                      <span className="text-[#b2d1ff] font-bold">{step}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-[#bcd2ff]">{title}</h3>
                      <p className="text-[#a8bfff]/90">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Community & Support */}
          <Card className="border border-[#3c4fff]/20 bg-[#08162d]/40 backdrop-blur-xl shadow-[0_0_20px_rgba(0,60,255,0.15)] hover:shadow-[0_0_25px_rgba(0,90,255,0.2)] transition-all duration-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#7fbaff]">
                <Users className="h-5 w-5 text-[#8abaff]" />
                Community & Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-[#d9e3ff]/90 leading-relaxed">
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
                  className="text-[#9ccaff] underline ml-1 hover:text-[#b6d1ff]"
                >
                  Discord
                </a>
              </p>
            </CardContent>
          </Card>

          {/* Legal & Ethics */}
          <Card className="border border-[#2d4fff]/20 bg-[#0b1530]/40 backdrop-blur-xl shadow-[0_0_20px_rgba(0,60,255,0.15)] hover:shadow-[0_0_30px_rgba(0,90,255,0.25)] transition-all duration-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#8abaff]">
                <Shield className="h-5 w-5 text-[#9ccaff]" />
                Legal & Ethics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-[#d0dbff]/90 leading-relaxed">
              <p>
                All challenges on SecureContainProtect CTF are designed for educational purposes. The skills you
                learn here should be used ethically and responsibly. Unauthorized access to computer
                systems is illegal and unethical.
              </p>
              <p className="text-sm text-[#a8bfff]/80">
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
          0%, 100% { opacity: 0.3; filter: brightness(0.9); }
          50% { opacity: 0.6; filter: brightness(1.1); }
        }

        @keyframes float {
          0% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.6; }
          25% { transform: translateY(-10px) translateX(4px) scale(1.1); opacity: 0.8; }
          50% { transform: translateY(-5px) translateX(-3px) scale(0.9); opacity: 0.5; }
          75% { transform: translateY(5px) translateX(6px) scale(1.05); opacity: 0.7; }
          100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
