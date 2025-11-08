import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { SCPHeader } from "@/components/SCPHeader";
import {
  Shield,
  AlertTriangle,
  Lock,
  FileText,
  ArrowRight,
} from "lucide-react";
import scpFacility from "@/assets/scp-facility.png";
import scpCorridor from "@/assets/scp-corridor.png";
import scpCreature from "@/assets/scp-creature.png";

const Index = () => {
  const navigate = useNavigate();
  const [fireflies, setFireflies] = useState<
    { id: number; top: string; left: string; delay: string; size: string }[]
  >([]);

  useEffect(() => {
    const generated = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      size: `${2 + Math.random() * 5}px`,
    }));
    setFireflies(generated);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative text-[#eaf0ff] overflow-hidden">
      {/* Animated fireflies */}
      {fireflies.map((f) => (
        <div
          key={f.id}
          className="absolute bg-[#b8d6ff] rounded-full blur-[2px] opacity-60 animate-[float_12s_infinite_ease-in-out] pointer-events-none"
          style={{
            top: f.top,
            left: f.left,
            width: f.size,
            height: f.size,
            boxShadow: "0 0 15px rgba(160,200,255,0.7), 0 0 25px rgba(120,160,255,0.5)",
            animationDelay: f.delay,
          }}
        ></div>
      ))}

      <Navbar />

      <main className="flex-1 relative">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#040915]/50 via-[#050b18]/40 to-[#08132c]/70 z-0"></div>

        {/* Hero Section */}
        <section className="py-16 px-4 relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70 animate-fade-in-slow"
            style={{
              backgroundImage: `url(${scpFacility})`,
              filter: "brightness(0.6) contrast(1.05) saturate(0.9) blur(1px)",
            }}
          ></div>

          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#040915]/70 to-[#08132c]/80 pointer-events-none backdrop-blur-[2px]"></div>

          <div className="container mx-auto relative z-10 text-center">
            {/* Enhanced SCPHeader holographic aesthetic */}
            <div className="relative mx-auto mb-10 max-w-3xl p-[1px] rounded-xl bg-gradient-to-r from-[#2a68ff]/40 via-[#4d9aff]/30 to-[#2a68ff]/40 shadow-[0_0_35px_rgba(70,130,255,0.25)]">
              <div className="rounded-xl bg-[#081226]/40 backdrop-blur-2xl border border-[#4b6fff]/30 shadow-[inset_0_0_25px_rgba(70,130,255,0.2)]">
                <div className="p-8 relative overflow-hidden">
                  {/* Animated holographic overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(80,130,255,0.08),transparent_60%)] animate-[pulseGlow_6s_infinite_ease-in-out]"></div>
                  <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(70,120,255,0.07)_0%,transparent_30%,rgba(70,120,255,0.07)_60%,transparent_100%)] opacity-60 animate-[scanLine_9s_linear_infinite]"></div>

                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="flex items-center justify-center gap-3">
                      <AlertTriangle className="h-6 w-6 text-[#ff7474] animate-pulse-slow" />
                      <h2 className="text-2xl font-mono tracking-wide text-[#9ccaff] drop-shadow-[0_0_8px_#4688ff]">
                        SCP-████ – CAPTURE THE FLAG DIVISION
                      </h2>
                      <span className="ml-2 px-4 py-1 border border-[#ff6060]/50 bg-[#ff6060]/10 text-[#ff9090] rounded-full text-xs font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(255,90,90,0.3)]">
                        KETER
                      </span>
                    </div>
                    <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#357bff]/60 to-transparent my-2 animate-pulse-slow"></div>
                    <p className="text-sm text-[#a8c9ff] font-mono tracking-wider uppercase opacity-80">
                      SCP FOUNDATION DATABASE ACCESS NODE
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-5xl mx-auto mt-12 animate-fade-in-soft">
              <div className="p-4 md:p-8 backdrop-blur-xl bg-[#081226]/40 border border-[#3d6cff]/20 rounded-xl shadow-[0_0_25px_rgba(60,120,255,0.25)]">
                <div className="text-center mb-8 animate-fade-in-slow">
                  <div className="inline-flex items-center justify-center w-24 h-24 border-4 border-[#8abaff]/30 bg-[#0b193a]/30 mb-6 rounded-full shadow-[0_0_30px_rgba(138,186,255,0.25)] relative">
                    <Shield className="h-16 w-16 text-[#9fc3ff] animate-pulse-slow" />
                    <div className="absolute inset-0 border-4 border-[#8abaff]/40 animate-ping-slow opacity-5 rounded-full"></div>
                  </div>

                  <h2 className="text-5xl font-bold mb-4 text-[#b5ceff] tracking-widest glitch">
                    SECURE. CONTAIN. PROTECT.
                  </h2>

                  <p className="text-lg text-[#d6e2ff] mb-2 animate-fade-in-delay">
                    SCP Foundation - CTF Training Division
                  </p>

                  <p className="text-[#c2d4ff] font-mono text-sm">
                    Security Clearance Required | Foundation Intranet Node:{" "}
                    <span className="text-[#9fc3ff]">NODE-09/CTF-HQ</span>
                  </p>

                  <p className="text-[#aec4ff] font-mono text-xs mt-2">
                    Build: v2.3.1 | Protocol: SCP-CTF/INF-SEC-███ | Timestamp:{" "}
                    {new Date().toUTCString()}
                  </p>
                </div>

                <div className="classification-bar my-6 opacity-60"></div>

                <div className="space-y-4 mb-8 text-[#f0f5ff]/90">
                  <p className="text-lg">
                    <strong className="text-[#8abaff] flicker-soft">
                      NOTICE:
                    </strong>{" "}
                    You are accessing a restricted SCP Foundation training
                    environment. This Capture The Flag (CTF) platform is
                    designed to test and enhance the cybersecurity capabilities
                    of Foundation personnel under simulated anomalous
                    conditions.
                  </p>
                  <p>
                    Unauthorized access to this portal constitutes a direct
                    violation of{" "}
                    <span className="text-[#a8c8ff]">
                      Containment Directive 88-GAMMA
                    </span>
                    . All activities are logged and monitored by the Foundation
                    Cybersecurity Command (FCC).
                  </p>
                  <p>
                    Participants will engage with anomalous containment
                    simulations requiring expertise in:
                  </p>
                  <ul className="list-none space-y-2 ml-6 text-[#d9e5ff]">
                    <li className="hover:text-[#9fc3ff] transition-colors">
                      • Web Exploitation and System Analysis
                    </li>
                    <li className="hover:text-[#9fc3ff] transition-colors">
                      • Cryptographic Protocol Investigation
                    </li>
                    <li className="hover:text-[#9fc3ff] transition-colors">
                      • Digital Forensics and{" "}
                      <span className="redacted">DATA EXPUNGED</span>
                    </li>
                    <li className="hover:text-[#9fc3ff] transition-colors">
                      • Reverse Engineering of Anomalous Code
                    </li>
                    <li className="hover:text-[#9fc3ff] transition-colors">
                      • Binary Exploitation and Memory Corruption
                    </li>
                    <li className="hover:text-[#9fc3ff] transition-colors">
                      • Threat Hunting within SCP-classified Digital Entities
                    </li>
                  </ul>
                </div>

                <div className="flex gap-4 justify-center animate-fade-in-delay">
                  <Button
                    size="lg"
                    className="gap-2 bg-[#1c44a5]/70 hover:bg-[#2859d1]/80 text-white font-mono shadow-[0_0_25px_rgba(60,120,255,0.4)] hover:shadow-[0_0_35px_rgba(80,140,255,0.5)] rounded-lg transition-all duration-300 backdrop-blur-sm"
                    onClick={() => navigate("/auth")}
                  >
                    REQUEST CLEARANCE
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 border-2 border-[#8abaff]/30 text-[#d6e2ff] hover:border-[#b2d1ff]/60 hover:text-[#b2d1ff] transition-all rounded-lg backdrop-blur-sm"
                    onClick={() => navigate("/about")}
                  >
                    VIEW DOCUMENTATION
                  </Button>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 relative">
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15 rounded-xl animate-fade-in-slow"
                  style={{
                    backgroundImage: `url(${scpCorridor})`,
                    filter: "brightness(0.5) contrast(1.2)",
                    zIndex: -1,
                  }}
                ></div>

                {[
                  {
                    icon: FileText,
                    title: "CLASSIFIED CHALLENGES",
                    desc: "Engage in real-world anomalous cybersecurity simulations. Logs rotate under protocol 42-DELTA every 24 hours.",
                  },
                  {
                    icon: AlertTriangle,
                    title: "CONTAINMENT PROTOCOLS",
                    desc: "Contain simulated breaches and gain clearance points. Operations monitored by Command Node-7.",
                  },
                  {
                    icon: Lock,
                    title: "VERIFIED IDENTITIES",
                    desc: "All participants verified via blockchain protocols. AES-512 / SCP-ENC-9 enforced Foundation-wide.",
                  },
                ].map(({ icon: Icon, title, desc }, i) => (
                  <div
                    key={i}
                    className="border border-[#2a4aff]/20 bg-[#0a1433]/30 backdrop-blur-xl p-6 text-center hover:border-[#7fb3ff]/40 hover:scale-[1.03] transition-all duration-500 group rounded-xl shadow-[0_0_15px_rgba(40,90,255,0.1)]"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-[#8abaff]/20 bg-[#0b193a]/40 mb-4 group-hover:border-[#b2d1ff] rounded-full relative shadow-[0_0_15px_rgba(100,140,220,0.25)]">
                      <Icon className="h-10 w-10 group-hover:text-[#b2d1ff] transition-colors text-[#e6ecff]" />
                      <div className="absolute inset-0 border-2 border-[#b2d1ff] opacity-0 group-hover:opacity-100 animate-ping-slow rounded-full"></div>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-[#f2f6ff] group-hover:text-[#b2d1ff] transition-colors">
                      {title}
                    </h3>
                    <p className="text-sm text-[#dce6ff]/80">{desc}</p>
                  </div>
                ))}
              </div>

              {/* Security Notice */}
              <div className="p-8 bg-[#081226]/40 backdrop-blur-xl border border-[#3d6cff]/20 rounded-xl shadow-[0_0_25px_rgba(0,80,255,0.15)] mt-10 relative overflow-hidden animate-fade-in-soft">
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
                  style={{
                    backgroundImage: `url(${scpCreature})`,
                    filter: "brightness(0.6) contrast(1.1) blur(0.8px)",
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a]/70 via-transparent to-[#0a0e1a]/40"></div>

                <div className="relative z-10 flex items-start gap-4">
                  <AlertTriangle className="h-12 w-12 text-[#9fc3ff] flex-shrink-0 mt-1 animate-pulse-slow" />
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-[#b5ceff] flicker-soft">
                      SECURITY CLEARANCE REQUIRED
                    </h3>
                    <p className="mb-3 text-[#eaf0ff]">
                      Access requires{" "}
                      <span className="text-[#a8c8ff] font-bold">Level-2</span>{" "}
                      clearance or higher. Unauthorized access attempts are
                      logged and reviewed by{" "}
                      <span className="redacted">O5 COMMAND</span>.
                    </p>
                    <p className="text-sm text-[#d4e0ff] mb-6">
                      All operations are monitored. Proceed only if you
                      acknowledge Foundation containment protocols and ethics
                      directives.
                    </p>

                    <div className="classification-bar mb-4 opacity-60"></div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-mono mb-6 text-[#f0f5ff]/90">
                      <div className="bg-[#0a1433]/40 p-3 border border-[#2b4aff]/20 rounded-md">
                        <p className="text-[#cbd8ff] mb-1">THREAT LEVEL:</p>
                        <p className="text-[#a8c8ff] font-bold">ELEVATED</p>
                      </div>
                      <div className="bg-[#0a1433]/40 p-3 border border-[#2b4aff]/20 rounded-md">
                        <p className="text-[#cbd8ff] mb-1">STATUS:</p>
                        <p className="text-[#81e9a0] font-bold">OPERATIONAL</p>
                      </div>
                      <div className="bg-[#0a1433]/40 p-3 border border-[#2b4aff]/20 rounded-md">
                        <p className="text-[#cbd8ff] mb-1">PARTICIPANTS:</p>
                        <p className="text-[#f0f5ff] font-bold">[CLASSIFIED]</p>
                      </div>
                      <div className="bg-[#0a1433]/40 p-3 border border-[#2b4aff]/20 rounded-md">
                        <p className="text-[#cbd8ff] mb-1">CLEARANCE:</p>
                        <p className="text-[#ff8383] font-bold">REQUIRED</p>
                      </div>
                    </div>

                    <p className="text-xs font-mono text-[#d4e0ff]">
                      System Audit Log ID: {Math.floor(Math.random() * 1000000)}{" "}
                      | Audit Timestamp: {new Date().toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#3d6cff]/20 py-6 px-4 bg-[#060b15]/60 backdrop-blur-md">
        <div className="container mx-auto text-center text-sm text-[#cbd8ff]">
          <div className="classification-bar mb-4 max-w-md mx-auto opacity-50"></div>
          <p className="font-mono">
            © 2025 SCP Foundation CTF Division. All Rights Reserved.
          </p>
          <p className="mt-2">
            Secure Communications:{" "}
            <a
              href="https://discord.gg/g8FnU4vGJv"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#a8c8ff] hover:underline transition-all"
            >
              [ENCRYPTED CHANNEL]
            </a>
          </p>
          <p className="mt-2 text-xs uppercase tracking-wider font-mono text-[#bcd0ff]">
            CLEARANCE LEVEL <span className="redacted text-[8px]">████</span>{" "}
            REQUIRED | UNAUTHORIZED ACCESS PROHIBITED
          </p>
          <p className="mt-2 font-mono text-[10px] text-[#bcd0ff]">
            Foundation Node: SCPNET-12B | Encrypted Link Verified | Hash
            Integrity: VALID
          </p>
        </div>
      </footer>

      {/* Animated holographic keyframes */}
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes scanLine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes float {
          0% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.4; }
          25% { transform: translateY(-20px) translateX(10px) scale(1.15); opacity: 0.9; }
          50% { transform: translateY(-10px) translateX(-8px) scale(0.9); opacity: 0.3; }
          75% { transform: translateY(12px) translateX(8px) scale(1.1); opacity: 0.85; }
          100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export default Index;
