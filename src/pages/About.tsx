import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Flag, Target, Users, Shield, Instagram, Linkedin, Heart } from "lucide-react";
import caidoLogo from "@/assets/caido-logo.png";
import apisecLogo from "@/assets/apisec-logo.png";

export default function About() {
  const [fireflies, setFireflies] = useState<
    { id: number; top: string; left: string; delay: string; size: string }[]
  >([]);

  const [snowflakes, setSnowflakes] = useState<
    { id: number; left: string; delay: string; size: string; duration: string }[]
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

    const snowGen = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      size: `${8 + Math.random() * 10}px`,
      duration: `${6 + Math.random() * 6}s`,
    }));
    setSnowflakes(snowGen);
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
      <div className="absolute inset-0 bg-[#030b1d]/70 backdrop-blur-[3px]"></div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,rgba(90,150,255,0.2),transparent_70%)] animate-[softblink_5s_infinite_ease-in-out]"></div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(255,230,150,0.22),transparent_70%)] pointer-events-none"></div>

      {snowflakes.map((s) => (
        <div
          key={s.id}
          className="snowflake absolute text-white opacity-90 pointer-events-none select-none"
          style={{
            left: s.left,
            fontSize: s.size,
            animation: `snowfall ${s.duration} linear infinite`,
            animationDelay: s.delay,
            textShadow: "0 0 8px rgba(255,255,255,0.8)",
          }}
        >
          ❄
        </div>
      ))}

      <div className="absolute top-0 left-0 w-full flex justify-center gap-6 pointer-events-none z-20 mt-4">
        <div className="text-[#ffdf7f] ornament-spin text-2xl drop-shadow-[0_0_12px_rgba(255,200,120,0.6)]">🔔</div>
        <div className="text-[#ff9f9f] ornament-spin text-2xl drop-shadow-[0_0_12px_rgba(255,150,150,0.6)]">🎄</div>
        <div className="text-[#a0d8ff] ornament-spin text-2xl drop-shadow-[0_0_12px_rgba(150,200,255,0.6)]">⭐</div>
        <div className="text-[#ffd27f] ornament-spin text-2xl drop-shadow-[0_0_12px_rgba(255,225,150,0.6)]">🔔</div>
      </div>

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

          {/* Title */}
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
                The Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-[#d9e3ff]/90 leading-relaxed">
              <p>
A massive detonation ruptures Site-81’s containment wing, scattering ❄️ SCP-XMAS-239 fragments through frost-choked hallways as sectors ██-█ collapse [REDACTED].
Holiday lockdown lights glitch between red, green, and icy blue 🎄🔴🟢🔵, casting distorted reflections across freshly formed ice sheets.
Its harmonic emissions 🎵 rewrite systems, freezing terminals into looping winter UI patterns ☃️ and spawning corrupted ██ surveillance frames 🤖 [DATA EXPUNGED].
Researchers report drifting crystalline shards ✨ moving against airflow patterns, leaving trails of subzero particulate ❄️ behind them.
Temperature drops across Sublevel-5 trigger geometric frost fractures 🧊, spreading in near-perfect symmetry along ██ structural pillars.
CTF-81 deploys in insulated breach suits 🛡️🧥 to locate shards, stabilize affected corridors, and decrypt corrupted ██ logs 📜.
Personnel exposed to the anomaly report faint melodic distortions 🔔 and brief festive hallucinations ███⚠️.
Uncontained expansion may escalate into a full winter-class distortion event 🌨️🌪️, destabilizing local reality [REDACTED].
              </p>
              <p>
               
              </p>
            </CardContent>
          </Card>

          {/* Sponsors Section - Prominent */}
          <div className="py-6">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold text-[#b5ceff] tracking-[0.15em] font-mono drop-shadow-[0_0_25px_rgba(120,180,255,0.4)] mb-3">
                <Heart className="inline-block h-8 w-8 text-[#ff8fb7] mr-3 animate-pulse" />
                OUR SPONSORS
              </h2>
              <p className="text-[#8abaff]/80 text-base font-mono">The organizations powering SCPCTF</p>
              <div className="w-32 h-1 mx-auto mt-4 bg-gradient-to-r from-transparent via-[#5580ff] to-transparent rounded-full"></div>
            </div>
            
            <div className="space-y-8">
              {/* Caido */}
              <div className="group relative p-6 md:p-8 bg-gradient-to-br from-[#12203d]/90 via-[#0d1a33]/80 to-[#081226]/70 rounded-2xl border-2 border-[#ff9a4a]/30 hover:border-[#ff9a4a]/60 shadow-[0_0_40px_rgba(255,150,70,0.15)] hover:shadow-[0_0_60px_rgba(255,150,70,0.35)] transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#ff9a4a]/5 via-transparent to-[#ff9a4a]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-10">
                  <div className="p-5 bg-[#0a1628] rounded-xl shadow-[0_0_30px_rgba(255,150,70,0.1)] group-hover:shadow-[0_0_50px_rgba(255,150,70,0.25)] transition-all duration-500 group-hover:scale-105">
                    <img src={caidoLogo} alt="Caido Logo" className="h-28 md:h-32 w-auto" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <a 
                      href="https://caido.io/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block text-[#ffa54f] hover:text-[#ffbd7a] font-bold text-2xl md:text-3xl tracking-wide transition-all duration-300 hover:drop-shadow-[0_0_15px_rgba(255,165,79,0.6)]"
                    >
                      Caido
                    </a>
                    <p className="text-[#d6e2ff] font-mono text-base md:text-lg mt-3 leading-relaxed">
                      ❄️ Because even in a containment breach, security shouldn't melt. ❄️
                    </p>
                    <p className="text-[#ffa54f] text-lg md:text-xl font-bold mt-2 tracking-wide">
                      Reinventing the Hacker's Toolkit
                    </p>
                    <p className="text-[#a8bfff]/80 text-sm mt-3">
                      Caido is a lightweight web security auditing toolkit designed to help security professionals 
                      test and debug web applications with modern, intuitive tools.
                    </p>
                  </div>
                </div>
              </div>

              {/* APISEC University */}
              <div className="group relative p-6 md:p-8 bg-gradient-to-br from-[#12203d]/90 via-[#0d1a33]/80 to-[#081226]/70 rounded-2xl border-2 border-[#3d9dc9]/30 hover:border-[#3d9dc9]/60 shadow-[0_0_40px_rgba(60,160,200,0.15)] hover:shadow-[0_0_60px_rgba(60,160,200,0.35)] transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#3d9dc9]/5 via-transparent to-[#3d9dc9]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-10">
                  <div className="p-5 bg-white rounded-xl shadow-[0_0_30px_rgba(60,160,200,0.1)] group-hover:shadow-[0_0_50px_rgba(60,160,200,0.25)] transition-all duration-500 group-hover:scale-105">
                    <img src={apisecLogo} alt="APISEC University Logo" className="h-28 md:h-32 w-auto" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <a 
                      href="https://www.apisecuniversity.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block text-[#5dbde6] hover:text-[#8bd1f0] font-bold text-2xl md:text-3xl tracking-wide transition-all duration-300 hover:drop-shadow-[0_0_15px_rgba(93,189,230,0.6)]"
                    >
                      APISEC University
                    </a>
                    <p className="text-[#d6e2ff] font-mono text-base md:text-lg mt-3 leading-relaxed">
                      🛰️ Forging defenders who decode anomalies buried deep in the API grid. 🔐
                    </p>
                    <p className="text-[#5dbde6] text-lg md:text-xl font-bold mt-2 tracking-wide">
                      Secure every API, every day
                    </p>
                    <p className="text-[#a8bfff]/80 text-sm mt-3">
                      APISEC University provides free, hands-on API security training with courses designed 
                      to help developers and security professionals master the art of securing APIs.
                    </p>
                  </div>
                </div>
              </div>

              {/* Internshala */}
              <div className="group relative p-6 md:p-8 bg-gradient-to-br from-[#12203d]/90 via-[#0d1a33]/80 to-[#081226]/70 rounded-2xl border-2 border-[#00bfff]/30 hover:border-[#00bfff]/60 shadow-[0_0_40px_rgba(0,180,255,0.15)] hover:shadow-[0_0_60px_rgba(0,180,255,0.35)] transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00bfff]/5 via-transparent to-[#00bfff]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-10">
                  <div className="p-5 bg-white rounded-xl shadow-[0_0_30px_rgba(0,180,255,0.1)] group-hover:shadow-[0_0_50px_rgba(0,180,255,0.25)] transition-all duration-500 group-hover:scale-105">
                    <img src="/assets/internshala-logo.png" alt="Internshala Logo" className="h-28 md:h-32 w-auto" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <a 
                      href="https://internshala.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block text-[#00bfff] hover:text-[#5dd8ff] font-bold text-2xl md:text-3xl tracking-wide transition-all duration-300 hover:drop-shadow-[0_0_15px_rgba(0,191,255,0.6)]"
                    >
                      Internshala
                    </a>
                    <p className="text-[#d6e2ff] font-mono text-base md:text-lg mt-3 leading-relaxed">
                      🎯 Internshala fuels the challenge. You bring the skill.
                    </p>
                    <p className="text-[#00bfff] text-lg md:text-xl font-bold mt-2 tracking-wide">
                      Level up your cyber journey
                    </p>
                    <p className="text-[#a8bfff]/80 text-sm mt-3">
                      Internshala is India's leading platform for internships and online training, 
                      empowering students and professionals to build real-world skills.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
                Become part of our active cybersecurity community. Participants frequently collaborate, exchange ideas,
                and discuss strategies, strengthening their skills through shared knowledge.
              </p>
              <p>
                If you require assistance or wish to offer feedback, please join our official server:
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

          {/* TEAM SECTION */}
          <Card className="border border-[#335eff]/25 bg-[#0b1833]/55 backdrop-blur-2xl shadow-[0_0_32px_rgba(70,120,255,0.25)] hover:shadow-[0_0_45px_rgba(90,150,255,0.32)] transition-all duration-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#9ccaff]">
                <Users className="h-5 w-5 text-[#b5d4ff]" />
                Team
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-10 text-[#d9e3ff]/90 leading-relaxed">
              {/* MEMBER 1 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-[#c7d8ff]">disavowed913</h3>
                  <div className="flex gap-4">
                    <a
                      href="https://instagram.com/disavowed913"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition hover:scale-110 drop-shadow-[0_0_10px_rgba(255,120,180,0.6)]"
                    >
                      <Instagram className="w-6 h-6 text-[#ff8fb7]" />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/sagnik-saha-7ba227237/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition hover:scale-110 drop-shadow-[0_0_10px_rgba(120,200,255,0.6)]"
                    >
                      <Linkedin className="w-6 h-6 text-[#8ecaff]" />
                    </a>
                  </div>
                </div>
                <p className="text-[#a8bfff]/90">
                  disavowed913 leads the development and construction of the SecureContainProtect CTF platform, 
                  creating challenges and shaping the entire event ecosystem from structure to execution.
                </p>
              </div>

              {/* MEMBER 2 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-[#c7d8ff]">si_panja</h3>
                  <div className="flex gap-4">
                    <a
                      href="https://www.instagram.com/si._panja_/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition hover:scale-110 drop-shadow-[0_0_10px_rgba(255,120,180,0.6)]"
                    >
                      <Instagram className="w-6 h-6 text-[#ff8fb7]" />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/souvik-panja-5764a1321/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition hover:scale-110 drop-shadow-[0_0_10px_rgba(120,200,255,0.6)]"
                    >
                      <Linkedin className="w-6 h-6 text-[#8ecaff]" />
                    </a>
                  </div>
                </div>
                <p className="text-[#a8bfff]/90">
                  si_panja manages infrastructure, backend systems, and deployment operations, ensuring 
                  the CTF platform remains stable, reliable, and optimized at all times.
                </p>
              </div>
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
                All challenges on SecureContainProtect CTF are created solely for the purpose of ethical education and skill development. Unauthorized access to systems outside this controlled environment is strictly prohibited and illegal.
              </p>
              <p className="text-sm text-[#a8bfff]/85">
                By using this platform, you agree to follow all applicable laws and to use your technical abilities responsibly.
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
      `}</style>
    </div>
  );
}
