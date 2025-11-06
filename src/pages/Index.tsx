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
    <div className="min-h-screen flex flex-col bg-[#0a0e1a] text-foreground relative">
      <Navbar />
      
      <main className="flex-1 relative">
        {/* Soft gradient background overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a]/90 via-[#0a0e1a]/80 to-[#0a0e1a]/95 z-0"></div>

        {/* Hero Section */}
        <section className="py-16 px-4 relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 animate-fade-in-slow"
            style={{ 
              backgroundImage: `url(${scpFacility})`,
              filter: 'brightness(0.6) contrast(1.1) saturate(0.8) blur(1px)'
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a]/70 via-[#0a0e1a]/50 to-[#0a0e1a]/90 pointer-events-none backdrop-blur-[2px]"></div>
          <div className="absolute inset-0 matrix-bg opacity-20"></div>
          
          <div className="container mx-auto relative z-10">
            <SCPHeader 
              classification="KETER"
              itemNumber="SCP-████"
              title="CAPTURE THE FLAG DIVISION"
            />

            <div className="max-w-5xl mx-auto">
              <div className="scp-paper border-2 border-[#1c2a3d]/60 bg-[#101624]/70 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,50,0.25)] p-8 mb-8 rounded-xl animate-fade-in-soft">
                <div className="text-center mb-8 animate-fade-in-slow">
                  <div className="inline-flex items-center justify-center w-24 h-24 border-4 border-[#4a80f0]/70 bg-[#0d1320]/70 mb-6 shadow-[0_0_30px_rgba(74,128,240,0.2)] rounded-full relative transition-all duration-500">
                    <Shield className="h-16 w-16 text-[#4a80f0] animate-pulse-slow" />
                    <div className="absolute inset-0 border-4 border-[#4a80f0] animate-ping-slow opacity-10 rounded-full"></div>
                  </div>
                  <h2 className="text-5xl font-bold mb-4 scp-header glitch text-[#7fb0ff]" data-text="SECURE. CONTAIN. PROTECT.">
                    SECURE. CONTAIN. PROTECT.
                  </h2>
                  <p className="text-lg text-[#b0c8f0] mb-2 animate-fade-in-delay">SCP Foundation - CTF Training Division</p>
                  <p className="text-[#92a8d8] font-mono text-sm">
                    Security Clearance Required | Authorized Personnel Only | Foundation Intranet Node: <span className="text-[#70a1ff]">NODE-09/CTF-HQ</span>
                  </p>
                  <p className="text-[#8ca0d1] font-mono text-xs mt-2">
                    Build: v2.3.1 | Protocol Revision: SCP-CTF/INF-SEC-███ | Timestamp: {new Date().toUTCString()}
                  </p>
                </div>

                <div className="classification-bar my-6"></div>

                <div className="space-y-4 mb-8 animate-fade-in-delay text-[#c7d2ee]">
                  <p className="text-lg">
                    <strong className="text-[#70a1ff] flicker-soft">NOTICE:</strong> You are accessing a restricted SCP Foundation training environment. 
                    This Capture The Flag (CTF) platform is designed to test and enhance the cybersecurity 
                    capabilities of Foundation personnel under simulated anomalous conditions.
                  </p>
                  <p>
                    Unauthorized access to this portal constitutes a direct violation of <span className="text-[#7fb0ff]">Containment Directive 88-GAMMA</span>. 
                    All activities within this environment are logged, monitored, and transmitted to the 
                    Foundation Cybersecurity Command (FCC) for archival analysis.
                  </p>
                  <p>
                    Participants will engage with anomalous digital containment scenarios across multiple 
                    security classifications. Each challenge represents a <span className="redacted">REDACTED</span>{" "}
                    containment breach simulation requiring specialized skills in:
                  </p>
                  <ul className="list-none space-y-2 ml-6 text-[#a6bde7]">
                    <li className="hover:text-[#70a1ff] transition-colors">• Web Exploitation and System Analysis</li>
                    <li className="hover:text-[#70a1ff] transition-colors">• Cryptographic Protocol Investigation</li>
                    <li className="hover:text-[#70a1ff] transition-colors">• Digital Forensics and <span className="redacted">DATA EXPUNGED</span></li>
                    <li className="hover:text-[#70a1ff] transition-colors">• Reverse Engineering of Anomalous Code</li>
                    <li className="hover:text-[#70a1ff] transition-colors">• Binary Exploitation and Memory Corruption</li>
                    <li className="hover:text-[#70a1ff] transition-colors">• Threat Hunting within SCP-classified Digital Entities</li>
                  </ul>
                </div>

                <div className="flex gap-4 justify-center animate-fade-in-delay">
                  <Button 
                    size="lg" 
                    className="gap-2 bg-[#274a8e] hover:bg-[#365ea8] text-white font-mono shadow-[0_0_15px_rgba(39,74,142,0.6)] hover:shadow-[0_0_25px_rgba(55,100,180,0.8)] transition-all duration-300 rounded-lg" 
                    onClick={() => navigate("/auth")}
                  >
                    REQUEST CLEARANCE
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="gap-2 border-2 border-[#4a80f0]/70 text-[#bcd0ff] hover:border-[#70a1ff] hover:text-[#70a1ff] transition-all rounded-lg backdrop-blur-sm" 
                    onClick={() => navigate("/about")}
                  >
                    VIEW DOCUMENTATION
                  </Button>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative">
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15 rounded-xl animate-fade-in-slow"
                  style={{ 
                    backgroundImage: `url(${scpCorridor})`,
                    filter: 'brightness(0.5) contrast(1.1)',
                    zIndex: -1
                  }}
                ></div>

                {/* Feature Cards */}
                {[
                  { icon: FileText, title: "CLASSIFIED CHALLENGES", desc: "Access real-world anomalous scenarios across multiple security classifications: SAFE, EUCLID, KETER, and beyond. Declassified logs are rotated every 24 hours under protocol 42-DELTA." },
                  { icon: AlertTriangle, title: "CONTAINMENT PROTOCOLS", desc: "Earn security clearance points by successfully containing breaches. Real-time tracking of all containment operations. Incident logs transmitted to Command Node-7." },
                  { icon: Lock, title: "VERIFIED IDENTITIES", desc: "All participants undergo blockchain-verified identity confirmation. Foundation-level encryption standards (AES-512 / SCP-ENC-9) enforced under Cyber Ethics Directive 09-BETA." }
                ].map(({ icon: Icon, title, desc }, i) => (
                  <div key={i} className="scp-paper border-2 border-[#1c2a3d]/60 bg-[#0d1320]/60 backdrop-blur-lg p-6 text-center hover:border-[#70a1ff]/80 hover:scale-[1.03] transition-all duration-500 group rounded-xl shadow-[0_0_10px_rgba(0,0,50,0.25)] animate-fade-in-soft">
                    <div className="inline-flex items-center justify-center w-16 h-16 border-3 border-[#334a7c] bg-[#0d1320]/70 mb-4 group-hover:border-[#70a1ff] rounded-full relative shadow-[0_0_15px_rgba(55,90,160,0.2)]">
                      <Icon className="h-10 w-10 group-hover:text-[#70a1ff] transition-colors" />
                      <div className="absolute inset-0 border-3 border-[#70a1ff] opacity-0 group-hover:opacity-100 animate-ping-slow rounded-full"></div>
                    </div>
                    <h3 className="text-xl font-bold mb-3 scp-header text-[#c7d2ee] group-hover:text-[#70a1ff] transition-colors">{title}</h3>
                    <p className="text-sm text-[#a3b6d9]">{desc}</p>
                  </div>
                ))}
              </div>

              {/* System Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in-slow">
                {[
                  { icon: TerminalSquare, title: "MONITORED SYSTEMS", desc: "All operations within this training division are continuously monitored by the Foundation’s AI Sentinel System (Codename: “WATCHTOWER-03”). Unauthorized activities trigger automated lockdown procedures." },
                  { icon: Database, title: "DATA VAULT", desc: "All captured anomalies, reports, and containment logs are securely archived in Foundation Vault 09. Data integrity verified via quantum-resistant checksum validation." },
                  { icon: KeyRound, title: "ACCESS CONTROL", desc: "Multi-factor clearance validation required. Personnel attempting to bypass CTF security systems without clearance will be flagged under Incident Report: #███-09X." }
                ].map(({ icon: Icon, title, desc }, i) => (
                  <div key={i} className="scp-paper border-2 border-[#1c2a3d]/60 bg-[#0d1320]/60 backdrop-blur-md p-6 text-center hover:border-[#70a1ff]/80 hover:scale-[1.03] transition-all duration-500 group rounded-xl shadow-[0_0_10px_rgba(0,0,50,0.25)]">
                    <div className="inline-flex items-center justify-center w-16 h-16 border-3 border-[#334a7c] bg-[#0d1320]/70 mb-4 group-hover:border-[#70a1ff] rounded-full relative shadow-[0_0_15px_rgba(55,90,160,0.2)]">
                      <Icon className="h-10 w-10 group-hover:text-[#70a1ff] transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 scp-header text-[#c7d2ee] group-hover:text-[#70a1ff] transition-colors">{title}</h3>
                    <p className="text-sm text-[#a3b6d9]">{desc}</p>
                  </div>
                ))}
              </div>

              {/* Security Notice */}
              <div className="border-classified p-8 bg-[#111a2d]/60 backdrop-blur-md rounded-xl shadow-[0_0_25px_rgba(0,0,50,0.3)] animate-fade-in-soft relative overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 animate-fade-in-slow"
                  style={{ 
                    backgroundImage: `url(${scpCreature})`,
                    filter: 'brightness(0.5) contrast(1.2) saturate(0.9) blur(1px)'
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a]/90 via-[#0a0e1a]/70 to-[#0a0e1a]/90"></div>
                <div className="flex items-start gap-4 relative z-10">
                  <AlertTriangle className="h-12 w-12 text-[#70a1ff] flex-shrink-0 mt-1 animate-pulse-slow" />
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-[#70a1ff] scp-header flicker-soft">SECURITY CLEARANCE REQUIRED</h3>
                    <p className="mb-3 text-[#cbd8f5]">
                      Access to this system requires <span className="text-[#7fb0ff] font-bold">Level-2</span> security clearance or higher. 
                      Unauthorized access attempts will be logged and reported to <span className="redacted">O5 COMMAND</span>.
                    </p>
                    <p className="text-sm text-[#a3b6d9] mb-6">
                      All activities are monitored. By proceeding, you acknowledge adherence to 
                      Foundation Ethics Committee guidelines and containment protocols.
                      This digital environment is classified under <span className="text-[#7fb0ff] font-mono">CYBERSECURITY DIVISION / CTF-BETA / CLASSIFIED</span>.
                    </p>
                    
                    <div className="classification-bar mb-4"></div>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs font-mono mb-6 text-[#b7c8ef]">
                      <div className="bg-[#101624]/60 p-3 border border-[#1c2a3d]/60 rounded-md">
                        <p className="text-[#8ca0d1] mb-1">THREAT LEVEL:</p>
                        <p className="text-[#70a1ff] font-bold">ELEVATED</p>
                      </div>
                      <div className="bg-[#101624]/60 p-3 border border-[#1c2a3d]/60 rounded-md">
                        <p className="text-[#8ca0d1] mb-1">STATUS:</p>
                        <p className="text-[#57d38e] font-bold">OPERATIONAL</p>
                      </div>
                      <div className="bg-[#101624]/60 p-3 border border-[#1c2a3d]/60 rounded-md">
                        <p className="text-[#8ca0d1] mb-1">PARTICIPANTS:</p>
                        <p className="text-[#c7d2ee] font-bold">[CLASSIFIED]</p>
                      </div>
                      <div className="bg-[#101624]/60 p-3 border border-[#1c2a3d]/60 rounded-md">
                        <p className="text-[#8ca0d1] mb-1">CLEARANCE:</p>
                        <p className="text-[#f55b5b] font-bold">REQUIRED</p>
                      </div>
                    </div>

                    <p className="text-xs font-mono text-[#a3b6d9]">
                      System Audit Log ID: {Math.floor(Math.random() * 1000000)} | Audit Timestamp: {new Date().toLocaleString()}
                    </p>
                    <p className="text-xs text-[#a3b6d9] font-mono mt-2">
                      Verified via SecureChannel-SCP/CTF/INFRA-02 — Foundation CyberNet Node Integrity: 99.997%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-[#1c2a3d]/60 py-6 px-4 bg-[#0a0e1a]/90 backdrop-blur-sm shadow-inner">
        <div className="container mx-auto text-center text-sm text-[#8ca0d1]">
          <div className="classification-bar mb-4 max-w-md mx-auto opacity-60"></div>
          <p className="font-mono">© 2025 SCP Foundation CTF Division. All Rights Reserved.</p>
          <p className="mt-2">
            Secure Communications:{" "}
            <a
              href="https://discord.gg/g8FnU4vGJv"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#70a1ff] hover:text-[#7fb0ff] hover:underline transition-all"
            >
              [ENCRYPTED CHANNEL]
            </a>
          </p>
          <p className="mt-2 text-xs uppercase tracking-wider font-mono text-[#7a92c2]">
            CLEARANCE LEVEL <span className="redacted text-[8px]">████</span> REQUIRED | UNAUTHORIZED ACCESS PROHIBITED
          </p>
          <p className="mt-2 font-mono text-[10px] text-[#7a92c2]">
            Foundation Internal Network Node: SCPNET-12B | Encrypted Link Verified | Hash Integrity: VALID
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index


