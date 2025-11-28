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

/**
 * Index.jsx — SCP Foundation CTF landing page
 * - Combined Christmas themes (A + B + C + D)
 * - Dark SCP aesthetic preserved
 * - Snowfall, ornaments, bells, trees, stars, lights, frosty overlays, warm gold shimmer
 * - No candy-cane stripes
 * - Original logic (fireflies, timestamps, images, buttons) preserved exactly
 *
 * Full file, no shortening, no removal, no "buff".
 */

const Index = () => {
  const navigate = useNavigate();
  const [fireflies, setFireflies] = useState<
    { id: number; top: string; left: string; delay: string; size: string }[]
  >([]);

  // small state for decorative bell hint (not user-affecting)
  const [showBellHint, setShowBellHint] = useState(true);

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

  useEffect(() => {
    // Hide the bell hint after some seconds to avoid distraction
    const t = setTimeout(() => setShowBellHint(false), 12000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative text-[#eaf0ff] overflow-hidden bg-gradient-to-b from-[#03061a] via-[#04102a] to-[#071325]">
      {/* ===================================================================
          Layered decorative elements (Snow + Stars + Lights + Trees + Ornaments + Bells)
          =================================================================== */}

      {/* Multi-layer Snowfall canvases (CSS-driven) */}
      <div aria-hidden className="absolute inset-0 pointer-events-none z-40">
        <div className="snow-layer small"></div>
        <div className="snow-layer medium"></div>
        <div className="snow-layer large"></div>
      </div>

      {/* Subtle star field (neon frost) */}
      <div aria-hidden className="absolute inset-0 z-30 pointer-events-none">
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={`star-${i}`}
            className="frost-star"
            style={{
              left: `${(i * 7 + (i % 3) * 3) % 100}%`,
              top: `${(i * 11 + (i % 2) * 5) % 80}%`,
              transform: `scale(${0.6 + (i % 4) * 0.25})`,
              animationDelay: `${(i % 6) * 300}ms`,
            }}
          />
        ))}
      </div>

      {/* String lights across top (soft mix of warm & cool bulbs) */}
      <div aria-hidden className="absolute top-4 left-0 right-0 flex justify-center z-50 pointer-events-none">
        <div className="w-[92%] max-w-[1200px] flex items-center justify-between px-6">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={`light-${i}`}
              className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] animate-light-flicker ${
                i % 3 === 0 ? "bg-[#ffb86b]" : i % 3 === 1 ? "bg-[#8be58b]" : "bg-[#9fd8ff]"
              }`}
              style={{ opacity: 0.95 }}
            />
          ))}
        </div>
      </div>

      {/* Distant tree silhouettes along bottom edges (left + right) */}
      <div aria-hidden className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
        <div className="container mx-auto px-4 relative">
          <div className="absolute -bottom-8 left-4 w-40 h-40 tree-silhouette transform -scale-x-100" />
          <div className="absolute -bottom-6 right-8 w-48 h-48 tree-silhouette" />
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-56 h-56 tree-silhouette opacity-60" />
        </div>
      </div>

      {/* Hanging ornaments (decorative) */}
      <div aria-hidden className="absolute top-[90px] left-6 z-45 pointer-events-none">
        <div className="flex flex-col gap-6">
          <div className="ornament ornament-red"></div>
          <div className="ornament ornament-gold"></div>
        </div>
      </div>
      <div aria-hidden className="absolute top-[120px] right-8 z-45 pointer-events-none">
        <div className="flex flex-col gap-6 items-end">
          <div className="ornament ornament-blue"></div>
          <div className="ornament ornament-green"></div>
        </div>
      </div>

      {/* Decorative bell with subtle hint (disappears after 12s) */}
      {showBellHint && (
        <div aria-hidden className="absolute top-24 right-6 z-50 pointer-events-none">
          <div className="bell-wrapper animate-bell-sway">
            <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" aria-hidden>
              <defs>
                <linearGradient id="bellGrad" x1="0" x2="1">
                  <stop offset="0" stopColor="#ffd27a" />
                  <stop offset="1" stopColor="#ff9a2e" />
                </linearGradient>
              </defs>
              <path d="M12 2c1.657 0 3 1.571 3 3.5V8c0 1.657 1 3 1 3h-8c0 0 1-1.343 1-3V5.5C9 3.571 10.343 2 12 2z" fill="url(#bellGrad)" />
              <path d="M7 14h10l-1 3H8l-1-3z" fill="#2b2b2b" opacity="0.14" />
            </svg>
            <div className="bell-hint text-xs text-[#ffd27a] font-mono mt-1 text-right opacity-90">System Chime</div>
          </div>
        </div>
      )}

      {/* ===================================================================
          Original fireflies (kept intact)
          =================================================================== */}
      {fireflies.map((f) => (
        <div
          key={f.id}
          className="absolute bg-[#b8d6ff] rounded-full blur-[2px] opacity-60 animate-[float_12s_infinite_ease-in-out] pointer-events-none z-10"
          style={{
            top: f.top,
            left: f.left,
            width: f.size,
            height: f.size,
            boxShadow: "0 0 15px rgba(160,200,255,0.7), 0 0 25px rgba(120,160,255,0.5)",
            animationDelay: f.delay,
          }}
        />
      ))}

      {/* ===================================================================
          Navbar (imported) - remains as component
          =================================================================== */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* ===================================================================
          Main content area (hero, features, security notice) — original layout preserved
          =================================================================== */}
      <main className="flex-1 relative z-10">
        {/* subtle gradient overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#040915]/50 via-[#050b18]/40 to-[#08132c]/70 z-0 pointer-events-none"></div>

        {/* Hero Section */}
        <section className="py-16 px-4 relative overflow-hidden">
          {/* Facility background image preserved */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70 animate-fade-in-slow"
            style={{
              backgroundImage: `url(${scpFacility})`,
              filter: "brightness(0.6) contrast(1.05) saturate(0.9) blur(1px)",
            }}
          />

          {/* Frost + warm top overlay for combined themes */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#04122b]/60 to-[#071326]/80 pointer-events-none backdrop-blur-[2px]"></div>

          {/* warm-gold shimmer ribbon near header */}
          <div className="absolute left-6 right-6 top-12 pointer-events-none z-20">
            <div className="gold-shimmer h-1 rounded-full opacity-30" style={{ maxWidth: 900, margin: "0 auto" }} />
          </div>

          <div className="container mx-auto relative z-10 text-center">
            {/* Enhanced SCPHeader holographic aesthetic with frost + ornaments */}
            <div className="relative mx-auto mb-10 max-w-3xl p-[1px] rounded-xl bg-gradient-to-r from-[#2a68ff]/40 via-[#4d9aff]/30 to-[#2a68ff]/40 shadow-[0_0_35px_rgba(70,130,255,0.25)]">
              <div className="rounded-xl bg-[#081226]/40 backdrop-blur-2xl border border-[#4b6fff]/30 shadow-[inset_0_0_25px_rgba(70,130,255,0.2)] relative overflow-hidden">
                <div className="p-8 relative overflow-hidden">
                  {/* holographic frost overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(80,130,255,0.08),transparent_60%)] animate-[pulseGlow_6s_infinite_ease-in-out]" />
                  <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(70,120,255,0.06)_0%,transparent_30%,rgba(70,120,255,0.06)_60%,transparent_100%)] opacity-60 animate-[scanLine_9s_linear_infinite]" />

                  {/* warm ornament accent top-left (small) */}
                  <div className="absolute -left-6 -top-6 w-12 h-12 rounded-full gold-shimmer opacity-90 transform rotate-12" />

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
                    <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#357bff]/60 to-transparent my-2 animate-pulse-slow" />
                    <p className="text-sm text-[#a8c9ff] font-mono tracking-wider uppercase opacity-80">
                      SCP FOUNDATION DATABASE ACCESS NODE
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main card area */}
            <div className="max-w-5xl mx-auto mt-12 animate-fade-in-soft">
              <div className="p-4 md:p-8 backdrop-blur-xl bg-[#081226]/40 border border-[#3d6cff]/20 rounded-xl shadow-[0_0_25px_rgba(60,120,255,0.25)] relative overflow-hidden">
                {/* small frost pattern top-right */}
                <div className="absolute top-4 right-4 w-16 h-16 frost-ring opacity-40" />

                <div className="text-center mb-8 animate-fade-in-slow">
                  <div className="inline-flex items-center justify-center w-24 h-24 border-4 border-[#8abaff]/30 bg-[#0b193a]/30 mb-6 rounded-full shadow-[0_0_30px_rgba(138,186,255,0.25)] relative">
                    <Shield className="h-16 w-16 text-[#9fc3ff] animate-pulse-slow" />
                    <div className="absolute inset-0 border-4 border-[#8abaff]/40 animate-ping-slow opacity-5 rounded-full" />
                    {/* hanging ornament overlap */}
                    <div className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-gradient-to-br from-[#ffd27a] to-[#ff9a2e] shadow-[0_0_10px_rgba(255,180,100,0.18)] ornament-spin" />
                  </div>

                  <h2 className="text-5xl font-bold mb-4 text-[#b5ceff] tracking-widest glitch" data-text="SECURE. CONTAIN. PROTECT.">
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
                    <strong className="text-[#8abaff] flicker-soft">NOTICE:</strong>{" "}
                    Deep down the facility at Site-81, a massive explosion shattered the reinforced containment wing, sending shockwaves through the ice-coated sublevels. Emergency red-and-green holiday lockdown lights flickered wildly, casting festive but unsettling colors across the frost-cracked walls. It had been the annual “Secure Contain Protect Winter Protocol Week,” a rare moment when staff decorated terminals with holographic snowflakes and synthetic pine scent diffusers—until everything went catastrophically wrong.Moments before the blast, researchers were studying SCP-XMAS-239, a crystalline anomaly resembling a floating ornament that emitted harmonic frequencies capable of rewriting electronic systems. When containment failed, the anomaly fractured into thousands of shimmering fragments, each scattering across the database, corrupting files, unlocking challenge nodes, and activating dormant SCP simulations.
Now, the Foundation has initiated CTF-81: Containment Task Force, calling all personnel to track the anomalies, decode corrupted logs, and restore order before the “festive breach event” evolves into a full-scale reality distortion.
                  </p>
                  <p>
                    Unauthorized access to this portal constitutes a direct
                    violation of{" "}
                    <span className="text-[#a8c8ff]">Containment Directive 88-GAMMA</span>
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
                      • Digital Forensics and <span className="redacted">DATA EXPUNGED</span>
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
                />

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
                    className="border border-[#2a4aff]/20 bg-[#0a1433]/30 backdrop-blur-xl p-6 text-center hover:border-[#7fb3ff]/40 hover:scale-[1.03] transition-all duration-500 group rounded-xl shadow-[0_0_15px_rgba(40,90,255,0.1)] relative overflow-hidden"
                  >
                    {/* decorative small star */}
                    <div className="absolute -top-4 right-6 w-6 h-6 frost-star opacity-60" />

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
                />
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
      <footer className="border-t border-[#3d6cff]/20 py-6 px-4 bg-[#060b15]/60 backdrop-blur-md z-10 relative">
        <div className="container mx-auto text-center text-sm text-[#cbd8ff]">
          <div className="classification-bar mb-4 max-w-md mx-auto opacity-50"></div>
          <p className="font-mono">© 2025 SCP Foundation CTF Division. All Rights Reserved.</p>
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
            CLEARANCE LEVEL <span className="redacted text-[8px]">████</span> REQUIRED | UNAUTHORIZED ACCESS PROHIBITED
          </p>
          <p className="mt-2 font-mono text-[10px] text-[#bcd0ff]">Foundation Node: SCPNET-12B | Encrypted Link Verified | Hash Integrity: VALID</p>
        </div>
      </footer>

      {/* ===================================================================
          Styles and keyframes (kept inline to ensure component is self-contained)
          =================================================================== */}
      <style>{`
        /* ===== Snow layers ===== */
        .snow-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 40;
        }
        .snow-layer.small {
          background-image: radial-gradient(white 1px, rgba(255,255,255,0) 1px);
          background-size: 6px 6px;
          opacity: 0.06;
          animation: snow-small 26s linear infinite;
        }
        .snow-layer.medium {
          background-image: radial-gradient(white 1.2px, rgba(255,255,255,0) 1.2px);
          background-size: 12px 12px;
          opacity: 0.04;
          animation: snow-medium 18s linear infinite;
        }
        .snow-layer.large {
          background-image: radial-gradient(white 1.6px, rgba(255,255,255,0) 1.6px);
          background-size: 22px 22px;
          opacity: 0.02;
          animation: snow-large 12s linear infinite;
        }

        @keyframes snow-small {
          0% { background-position: 0 -10vh; transform: translateY(-10%); }
          100% { background-position: 400px 100vh; transform: translateY(100%); }
        }
        @keyframes snow-medium {
          0% { background-position: 0 -5vh; transform: translateY(-5%); }
          100% { background-position: 600px 110vh; transform: translateY(120%); }
        }
        @keyframes snow-large {
          0% { background-position: 0 0; transform: translateY(0%); }
          100% { background-position: 900px 120vh; transform: translateY(140%); }
        }

        /* ===== Frost stars (neon twinkle) ===== */
        .frost-star {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: linear-gradient(135deg, rgba(159,216,255,0.95), rgba(120,200,255,0.6));
          filter: blur(0.6px);
          box-shadow: 0 0 10px rgba(120,200,255,0.22), 0 0 20px rgba(159,216,255,0.12);
          opacity: 0.9;
          animation: frost-twinkle 2.6s ease-in-out infinite;
        }
        @keyframes frost-twinkle {
          0% { transform: scale(0.8); opacity: 0.4; }
          50% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(0.8); opacity: 0.4; }
        }

        /* ===== Light flicker ===== */
        @keyframes light-flicker {
          0% { transform: translateY(0) scale(1); opacity: 0.95; filter: drop-shadow(0 0 6px rgba(255,255,255,0.06)); }
          50% { transform: translateY(-1.5px) scale(1.05); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 0.95; }
        }
        .animate-light-flicker { animation: light-flicker 3s ease-in-out infinite; }

        /* ===== Tree silhouette ===== */
        .tree-silhouette {
          background-image: radial-gradient(circle at 30% 20%, rgba(20,40,20,0.12), rgba(8,12,6,0.95));
          background-size: cover;
          filter: brightness(0.3) saturate(0.6);
          border-radius: 8px;
          opacity: 0.6;
          box-shadow: inset 0 -12px 24px rgba(0,0,0,0.6);
          /* decorative pseudo-tree using CSS triangles */
        }
        .tree-silhouette::before {
          content: '';
          position: absolute;
          left: 8%;
          bottom: 6%;
          width: 0;
          height: 0;
          border-left: 16px solid transparent;
          border-right: 16px solid transparent;
          border-bottom: 30px solid rgba(10,20,10,0.8);
          transform: translateX(-50%);
        }

        /* ===== Ornaments ===== */
        .ornament {
          width: 36px;
          height: 36px;
          border-radius: 999px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.35), 0 0 12px rgba(255,255,255,0.04);
          border: 2px solid rgba(255,255,255,0.06);
          transform-origin: center;
        }
        .ornament-red { background: radial-gradient(circle at 30% 30%, #ff8a8a, #b12f2f); }
        .ornament-gold { background: radial-gradient(circle at 30% 30%, #ffd27a, #ff9a2e); }
        .ornament-blue { background: radial-gradient(circle at 30% 30%, #9fd8ff, #3a8bbd); }
        .ornament-green { background: radial-gradient(circle at 30% 30%, #8be58b, #1b6a3d); }

        .ornament { animation: ornament-bob 6s ease-in-out infinite; }
        @keyframes ornament-bob {
          0% { transform: translateY(0) rotate(0deg) }
          50% { transform: translateY(6px) rotate(4deg) }
          100% { transform: translateY(0) rotate(0deg) }
        }

        /* ===== Bell animation ===== */
        .bell-wrapper { display: flex; align-items: center; gap: 6px; justify-content: flex-end; }
        @keyframes bell-sway {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(-6deg); }
          50% { transform: rotate(4deg); }
          75% { transform: rotate(-3deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-bell-sway { animation: bell-sway 3s ease-in-out infinite; }

        /* ===== Holographic & Frost effects ===== */
        .frost-ring {
          border-radius: 8px;
          background: radial-gradient(circle at 30% 20%, rgba(159,216,255,0.06), transparent 30%);
          width: 80px;
          height: 80px;
          filter: blur(4px);
          transform: rotate(12deg);
        }

        .gold-shimmer {
          background: linear-gradient(135deg, rgba(255,210,122,0.28), rgba(255,154,46,0.18));
          background-size: 200% 200%;
          animation: shimmer 4s ease-in-out infinite;
          border-radius: 999px;
        }
        @keyframes shimmer {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }

        /* ===== Floating, scanline & pulse (existing) ===== */
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

        .animate-[pulseGlow_6s_infinite_ease-in-out] { animation: pulseGlow 6s infinite ease-in-out; }
        .animate-[scanLine_9s_linear_infinite] { animation: scanLine 9s linear infinite; }
        .animate-[float_12s_infinite_ease-in-out] { animation: float 12s infinite ease-in-out; }

        /* ===== Small helpers (fades, pings) ===== */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-slow { animation: fadeIn 1.2s ease-in-out both; }
        .animate-fade-in-soft { animation: fadeIn 0.9s ease-in-out both; }
        .animate-fade-in-delay { animation: fadeIn 1.4s ease-in-out both; }

        @keyframes ping-slow {
          0% { box-shadow: 0 0 0 rgba(80,130,255,0.06); }
          50% { box-shadow: 0 0 20px rgba(80,130,255,0.06); }
          100% { box-shadow: 0 0 0 rgba(80,130,255,0.06); }
        }
        .animate-ping-slow { animation: ping-slow 4.8s infinite ease-in-out; }

        @keyframes pulse-slow {
          0% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.03); }
          100% { opacity: 0.6; transform: scale(1); }
        }
        .animate-pulse-slow { animation: pulse-slow 3.4s infinite ease-in-out; }

        /* ===== Ornament spin ===== */
        @keyframes ornament-rotate {
          from { transform: rotate(0deg) }
          to { transform: rotate(360deg) }
        }
        .ornament-spin { animation: ornament-rotate 20s linear infinite; }

        /* ===== accessibility: reduce motion support ===== */
        @media (prefers-reduced-motion: reduce) {
          .snow-layer, .frost-star, .animate-light-flicker, .animate-bell-sway, .animate-ping-slow, .animate-pulse-slow, .ornament-spin, .ornament { animation: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Index;
