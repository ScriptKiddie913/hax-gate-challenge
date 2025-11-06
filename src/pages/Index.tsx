import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { SCPHeader } from "@/components/SCPHeader";
import { Shield, AlertTriangle, Lock, FileText, ArrowRight, TerminalSquare, Database, KeyRound } from "lucide-react";
import scpFacility from "@/assets/scp-facility.png";
import scpCorridor from "@/assets/scp-corridor.png";
import scpCreature from "@/assets/scp-creature.png";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col relative text-[#dbe4ff]">
      <Navbar />
      
      <main className="flex-1 relative">
        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a]/50 via-[#0a0e1a]/40 to-[#0a0e1a]/60 z-0"></div>

        {/* Hero Section */}
        <section className="py-16 px-4 relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70 animate-fade-in-slow"
            style={{ 
              backgroundImage: `url(${scpFacility})`,
              filter: 'brightness(0.7) contrast(1.1) saturate(0.9) blur(1px)'
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a]/40 via-[#0a0e1a]/20 to-[#0a0e1a]/40 pointer-events-none backdrop-blur-[1px]"></div>

          <div className="container mx-auto relative z-10">
            <SCPHeader 
              classification="KETER"
              itemNumber="SCP-████"
              title="CAPTURE THE FLAG DIVISION"
            />

            <div className="max-w-5xl mx-auto">
              <div className="border-2 border-[#1c2a3d]/40 bg-white/5 backdrop-blur-xl shadow-[0_0_40px_rgba(30,60,120,0.3)] p-8 mb-8 rounded-xl animate-fade-in-soft">
                <div className="text-center mb-8 animate-fade-in-slow">
                  <div className="inline-flex items-center justify-center w-24 h-24 border-4 border-[#7fa8ff]/70 bg-white/10 mb-6 rounded-full shadow-[0_0_35px_rgba(127,168,255,0.25)] relative">
                    <Shield className="h-16 w-16 text-[#7fa8ff] animate-pulse-slow" />
                    <div className="absolute inset-0 border-4 border-[#7fa8ff] animate-ping-slow opacity-10 rounded-full"></div>
                  </div>
                  <h2 className="text-5xl font-bold mb-4 scp-header text-[#a9c4ff] glitch" data-text="SECURE. CONTAIN. PROTECT.">
                    SECURE. CONTAIN. PROTECT.
                  </h2>
                  <p className="text-lg text-[#d2e0ff] mb-2 animate-fade-in-delay">SCP Foundation - CTF Training Division</p>
                  <p className="text-[#b8c8ff] font-mono text-sm">
                    Security Clearance Required | Authorized Personnel Only | Node:{" "}
                    <span className="text-[#7fa8ff]">NODE-09/CTF-HQ</span>
                  </p>
                  <p className="text-[#a2b4e8] font-mono text-xs mt-2">
                    Build: v2.3.1 | Protocol Revision: SCP-CTF/INF-SEC-███ | Timestamp: {new Date().toUTCString()}
                  </p>
                </div>

                <div className="classification-bar my-6"></div>

                <div className="space-y-4 mb-8 animate-fade-in-delay text-[#e2eaff]/90">
                  <p className="text-lg">
                    <strong className="text-[#88b3ff] flicker-soft">NOTICE:</strong> You are accessing a restricted SCP Foundation training environment. 
                    This Capture The Flag (CTF) platform is designed to test and enhance the cybersecurity 
                    capabilities of Foundation personnel under simulated anomalous conditions.
                  </p>
                  <p>
                    Unauthorized access to this portal constitutes a direct violation of <span className="text-[#a0c3ff]">Containment Directive 88-GAMMA</span>. 
                    All activities within this environment are logged, monitored, and transmitted to the 
                    Foundation Cybersecurity Command (FCC) for archival analysis.
                  </p>
                  <p>
                    Participants will engage with anomalous digital containment scenarios across multiple 
                    security classifications. Each challenge represents a <span className="redacted">REDACTED</span>{" "}
                    containment breach simulation requiring specialized skills in:
                  </p>
                  <ul className="list-none space-y-2 ml-6 text-[#c6d8ff]">
                    <li className="hover:text-[#88b3ff] transition-colors">• Web Exploitation and System Analysis</li>
                    <li className="hover:text-[#88b3ff] transition-colors">• Cryptographic Protocol Investigation</li>
                    <li className="hover:text-[#88b3ff] transition-colors">• Digital Forensics and <span className="redacted">DATA EXPUNGED</span></li>
                    <li className="hover:text-[#88b3ff] transition-colors">• Reverse Engineering of Anomalous Code</li>
                    <li className="hover:text-[#88b3ff] transition-colors">• Binary Exploitation and Memory Corruption</li>
                    <li className="hover:text-[#88b3ff] transition-colors">• Threat Hunting within SCP-classified Digital Entities</li>
                  </ul>
                </div>

                <div className="flex gap-4 justify-center animate-fade-in-delay">
                  <Button 
                    size="lg" 
                    className="gap-2 bg-[#1e4fa3]/70 hover:bg-[#3769c7]/80 text-white font-mono shadow-[0_0_25px_rgba(55,110,200,0.5)] hover:shadow-[0_0_40px_rgba(80,140,255,0.7)] transition-all duration-300 rounded-lg backdrop-blur-sm" 
                    onClick={() => navigate("/auth")}
                  >
                    REQUEST CLEARANCE
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="gap-2 border-2 border-[#88b3ff]/60 text-[#d6e4ff] hover:border-[#a4c8ff] hover:text-[#a4c8ff] transition-all rounded-lg backdrop-blur-sm" 
                    onClick={() => navigate("/about")}
                  >
                    VIEW DOCUMENTATION
                  </Button>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative">
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 rounded-xl animate-fade-in-slow"
                  style={{ 
                    backgroundImage: `url(${scpCorridor})`,
                    filter: 'brightness(0.6) contrast(1.15)',
                    zIndex: -1
                  }}
                ></div>

                {[
                  { icon: FileText, title: "CLASSIFIED CHALLENGES", desc: "Access real-world anomalous scenarios across multiple security classifications: SAFE, EUCLID, KETER, and beyond. Declassified logs are rotated every 24 hours under protocol 42-DELTA." },
                  { icon: AlertTriangle, title: "CONTAINMENT PROTOCOLS", desc: "Earn security clearance points by successfully containing breaches. Real-time tracking of all containment operations. Incident logs transmitted to Command Node-7." },
                  { icon: Lock, title: "VERIFIED IDENTITIES", desc: "All participants undergo blockchain-verified identity confirmation. Foundation-level encryption standards (AES-512 / SCP-ENC-9) enforced under Cyber Ethics Directive 09-BETA." }
                ].map(({ icon: Icon, title, desc }, i) => (
                  <div key={i} className="border-2 border-[#1c2a3d]/40 bg-white/5 backdrop-blur-xl p-6 text-center hover:border-[#88b3ff]/70 hover:scale-[1.03] transition-all duration-500 group rounded-xl shadow-[0_0_20px_rgba(0,0,60,0.25)] animate-fade-in-soft">
                    <div className="inline-flex items-center justify-center w-16 h-16 border-3 border-[#88b3ff]/40 bg-white/10 mb-4 group-hover:border-[#a4c8ff] rounded-full relative shadow-[0_0_15px_rgba(80,120,200,0.3)]">
                      <Icon className="h-10 w-10 group-hover:text-[#a4c8ff] transition-colors" />
                      <div className="absolute inset-0 border-3 border-[#a4c8ff] opacity-0 group-hover:opacity-100 animate-ping-slow rounded-full"></div>
                    </div>
                    <h3 className="text-xl font-bold mb-3 scp-header text-[#e6ecff] group-hover:text-[#a4c8ff] transition-colors">{title}</h3>
                    <p className="text-sm text-[#d2e0ff]/80">{desc}</p>
                  </div>
                ))}
              </div>

              {/* Security Notice */}
              <div className="p-8 bg-white/5 backdrop-blur-2xl rounded-xl border border-[#88b3ff]/30 shadow-[0_0_25px_rgba(50,80,140,0.3)] animate-fade-in-soft relative overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 animate-fade-in-slow"
                  style={{ 
                    backgroundImage: `url(${scpCreature})`,
                    filter: 'brightness(0.6) contrast(1.15) blur(1px)'
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a]/60 via-[#0a0e1a]/30 to-[#0a0e1a]/60"></div>
                <div className="flex items-start gap-4 relative z-10">
                  <AlertTriangle className="h-12 w-12 text-[#a4c8ff] flex-shrink-0 mt-1 animate-pulse-slow" />
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-[#a4c8ff] scp-header flicker-soft">SECURITY CLEARANCE REQUIRED</h3>
                    <p className="mb-3 text-[#e2eaff]">
                      Access to this system requires <span className="text-[#a4c8ff] font-bold">Level-2</span> clearance. 
                      Unauthorized access attempts will be logged and reported to <span className="redacted">O5 COMMAND</span>.
                    </p>
                    <p className="text-sm text-[#cbd8ff] mb-6">
                      All activities are monitored. By proceeding, you acknowledge adherence to 
                      Foundation Ethics Committee guidelines and containment protocols.
                      This environment is classified under <span className="text-[#a4c8ff] font-mono">CYBERSECURITY DIVISION / CTF-BETA / CLASSIFIED</span>.
                    </p>
                    
                    <div className="classification-bar mb-4"></div>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs font-mono mb-6 text-[#e0e8ff]/90">
                      <div className="bg-white/5 p-3 border border-[#1c2a3d]/40 rounded-md">
                        <p className="text-[#bcd0ff] mb-1">THREAT LEVEL:</p>
                        <p className="text-[#a4c8ff] font-bold">ELEVATED</p>
                      </div>
                      <div className="bg-white/5 p-3 border border-[#1c2a3d]/40 rounded-md">
                        <p className="text-[#bcd0ff] mb-1">STATUS:</p>
                        <p className="text-[#79e7a3] font-bold">OPERATIONAL</p>
                      </div>
                      <div className="bg-white/5 p-3 border border-[#1c2a3d]/40 rounded-md">
                        <p className="text-[#bcd0ff] mb-1">PARTICIPANTS:</p>
                        <p className="text-[#e6ecff] font-bold">[CLASSIFIED]</p>
                      </div>
                      <div className="bg-white/5 p-3 border border-[#1c2a3d]/40 rounded-md">
                        <p className="text-[#bcd0ff] mb-1">CLEARANCE:</p>
                        <p className="text-[#ff7f7f] font-bold">REQUIRED</p>
                      </div>
                    </div>

                    <p className="text-xs font-mono text-[#c6d8ff]">
                      System Audit Log ID: {Math.floor(Math.random() * 1000000)} | Audit Timestamp: {new Date().toLocaleString()}
                    </p>
                    <p className="text-xs text-[#c6d8ff] font-mono mt-2">
                      Verified via SecureChannel-SCP/CTF/INFRA-02 — Node Integrity: 99.997%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-[#1c2a3d]/30 py-6 px-4 bg-white/5 backdrop-blur-xl">
        <div className="container mx-auto text-center text-sm text-[#bcd0ff]">
          <div className="classification-bar mb-4 max-w-md mx-auto opacity-60"></div>
          <p className="font-mono">© 2025 SCP Foundation CTF Division. All Rights Reserved.</p>
          <p className="mt-2">
            Secure Communications:{" "}
            <a
              href="https://discord.gg/g8FnU4vGJv"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#a4c8ff] hover:underline transition-all"
            >
              [ENCRYPTED CHANNEL]
            </a>
          </p>
          <p className="mt-2 text-xs uppercase tracking-wider font-mono text-[#b0c5ff]">
            CLEARANCE LEVEL <span className="redacted text-[8px]">████</span> REQUIRED | UNAUTHORIZED ACCESS PROHIBITED
          </p>
          <p className="mt-2 font-mono text-[10px] text-[#a4bfff]">
            Foundation Internal Node: SCPNET-12B | Encrypted Link Verified | Hash Integrity: VALID
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
