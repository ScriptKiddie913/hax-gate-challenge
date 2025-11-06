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

  return (
    <div className="min-h-screen flex flex-col relative text-[#eaf0ff]">
      <Navbar />

      <main className="flex-1 relative">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#060b15]/60 via-[#070c18]/50 to-[#0a1020]/70 z-0"></div>

        {/* Hero Section */}
        <section className="py-16 px-4 relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80 animate-fade-in-slow"
            style={{
              backgroundImage: `url(${scpFacility})`,
              filter:
                "brightness(0.7) contrast(1.1) saturate(0.9) blur(0.4px)",
            }}
          ></div>

          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#060b15]/60 to-[#080f22]/80 pointer-events-none backdrop-blur-[1px]"></div>

          <div className="container mx-auto relative z-10 text-center">
            {/* Enhanced SCPHeader aesthetic */}
            <div className="relative mx-auto mb-10 max-w-3xl bg-[#071225]/70 backdrop-blur-md border border-[#3b61ff]/20 shadow-[0_0_25px_rgba(0,80,255,0.2)] rounded-md p-6 transition-all duration-700 hover:shadow-[0_0_35px_rgba(0,120,255,0.25)]">
              <div className="absolute inset-0 bg-gradient-to-b from-[#0c1933]/40 to-[#071225]/60 rounded-md"></div>

              <div className="relative z-10 border border-[#2b4bbf]/30 rounded-md p-6 bg-[#0b1328]/70 backdrop-blur-sm">
                <div className="mb-3 flex items-center justify-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-[#ff6c6c] animate-pulse-slow" />
                  <h2 className="text-xl font-mono tracking-wide text-[#8abaff]">
                    SCP-████ – CAPTURE THE FLAG DIVISION
                  </h2>
                  <span className="ml-2 px-4 py-1 border border-[#ff5252]/60 bg-[#ff5252]/15 text-[#ff8a8a] rounded-full text-xs font-bold tracking-widest uppercase">
                    KETER
                  </span>
                </div>
                <div className="h-[2px] bg-gradient-to-r from-transparent via-[#2b7fff]/60 to-transparent mb-3 animate-pulse-slow"></div>
                <p className="text-sm text-[#9db5ff] font-mono tracking-wider uppercase opacity-80">
                  SCP FOUNDATION DATABASE ACCESS NODE
                </p>
              </div>
            </div>

            <div className="max-w-5xl mx-auto mt-12 animate-fade-in-soft">
              <div className="p-4 md:p-8 backdrop-blur-md bg-[#0b1530]/50 border border-[#3d6cff]/20 rounded-xl shadow-[0_0_25px_rgba(0,80,255,0.2)]">
                <div className="text-center mb-8 animate-fade-in-slow">
                  <div className="inline-flex items-center justify-center w-24 h-24 border-4 border-[#8abaff]/30 bg-[#0b193a]/50 mb-6 rounded-full shadow-[0_0_30px_rgba(138,186,255,0.2)] relative">
                    <Shield className="h-16 w-16 text-[#9fc3ff] animate-pulse-slow" />
                    <div className="absolute inset-0 border-4 border-[#8abaff] animate-ping-slow opacity-5 rounded-full"></div>
                  </div>

                  <h2 className="text-5xl font-bold mb-4 text-[#b5ceff] glitch tracking-widest">
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
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 rounded-xl animate-fade-in-slow"
                  style={{
                    backgroundImage: `url(${scpCorridor})`,
                    filter: "brightness(0.55) contrast(1.15)",
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
                    className="border border-[#2a4aff]/20 bg-[#0a1433]/50 backdrop-blur-xl p-6 text-center hover:border-[#7fb3ff]/40 hover:scale-[1.03] transition-all duration-500 group rounded-xl shadow-[0_0_15px_rgba(40,90,255,0.1)]"
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
              <div className="p-8 bg-[#0b1530]/60 backdrop-blur-xl border border-[#3d6cff]/20 rounded-xl shadow-[0_0_25px_rgba(0,80,255,0.15)] mt-10 relative overflow-hidden animate-fade-in-soft">
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
                  style={{
                    backgroundImage: `url(${scpCreature})`,
                    filter: "brightness(0.6) contrast(1.1) blur(0.8px)",
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a]/60 via-transparent to-[#0a0e1a]/40"></div>

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
                      <div className="bg-[#0a1433]/50 p-3 border border-[#2b4aff]/20 rounded-md">
                        <p className="text-[#cbd8ff] mb-1">THREAT LEVEL:</p>
                        <p className="text-[#a8c8ff] font-bold">ELEVATED</p>
                      </div>
                      <div className="bg-[#0a1433]/50 p-3 border border-[#2b4aff]/20 rounded-md">
                        <p className="text-[#cbd8ff] mb-1">STATUS:</p>
                        <p className="text-[#81e9a0] font-bold">OPERATIONAL</p>
                      </div>
                      <div className="bg-[#0a1433]/50 p-3 border border-[#2b4aff]/20 rounded-md">
                        <p className="text-[#cbd8ff] mb-1">PARTICIPANTS:</p>
                        <p className="text-[#f0f5ff] font-bold">[CLASSIFIED]</p>
                      </div>
                      <div className="bg-[#0a1433]/50 p-3 border border-[#2b4aff]/20 rounded-md">
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
      <footer className="border-t border-[#3d6cff]/20 py-6 px-4 bg-[#060b15]/70 backdrop-blur-md">
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
    </div>
  );
};

export default Index;
