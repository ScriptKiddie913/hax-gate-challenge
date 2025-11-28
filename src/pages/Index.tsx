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
 * Index.jsx
 * Rewritten with combined themes:
 * - Dark Frosted Christmas (elegant)
 * - Cozy Christmas (candy canes, ornaments, lights)
 * - SCP Winter Ops (tactical neon accents)
 *
 * No logic removed. Only styling / decorations added.
 */

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
    <div className="min-h-screen flex flex-col relative text-[#eaf0ff] overflow-hidden bg-gradient-to-b from-[#020617] to-[#04122a]">
      {/* -------------------------
          Global decorative overlays
          ------------------------- */}

      {/* Snowfall (multiple layers) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-40"
        style={{ mixBlendMode: "screen" }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="snow-layer layer-small animate-snow-slow" />
          <div className="snow-layer layer-medium animate-snow-medium" />
          <div className="snow-layer layer-large animate-snow-fast" />
        </div>
      </div>

      {/* Top garland + ornaments overlay behind navbar to augment navbar theming */}
      <div className="absolute top-0 left-0 w-full z-50 pointer-events-none">
        <div className="container mx-auto px-4">
          <div className="relative h-20">
            {/* Garland base */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-[80%] h-6 rounded-full bg-gradient-to-r from-[#07305b]/80 to-[#2b0b0b]/80 opacity-60 blur-[2px]" />
            {/* Lights */}
            <div className="absolute inset-x-0 top-1 flex justify-between px-8 items-center">
              {Array.from({ length: 22 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${
                    i % 3 === 0 ? "bg-red-400" : i % 3 === 1 ? "bg-green-400" : "bg-yellow-300"
                  } animate-light-flicker`}
                />
              ))}
            </div>

            {/* Ornaments (hanging) */}
            <div className="absolute inset-x-0 top-6 flex justify-between px-6 pointer-events-none">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center -mt-2"
                  style={{ transform: `translateY(${(i % 2 === 0 ? -2 : 2)}px)` }}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      i % 2 === 0 ? "bg-[#ff4d4d] border-[#320606]" : "bg-[#3ac6a8] border-[#063027]"
                    } shadow-[0_0_10px_rgba(255,255,255,0.06)] animate-ornament-sway`}
                  />
                  <div className="w-[1px] h-3 bg-[#2b2b2b] opacity-40 mt-1" />
                </div>
              ))}
            </div>

            {/* Candy-cane accent corners */}
            <div className="absolute left-4 top-2 w-8 h-8 rounded-full border-2 border-white/10 flex items-center justify-center transform rotate-12">
              <div className="w-6 h-6 rounded-full bg-[repeating-linear-gradient(45deg,#fff, #fff 6px, #e00 6px, #e00 12px)]" />
            </div>
            <div className="absolute right-4 top-2 w-8 h-8 rounded-full border-2 border-white/10 flex items-center justify-center transform -rotate-12">
              <div className="w-6 h-6 rounded-full bg-[repeating-linear-gradient(45deg,#fff, #fff 6px, #e00 6px, #e00 12px)]" />
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------
          Fireflies (original)
          ------------------------- */}
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

      {/* -------------------------
          Navbar (imported) - sits on top of dark background
          ------------------------- */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* -------------------------
          Main content
          ------------------------- */}
      <main className="flex-1 relative z-20 pt-6">
        {/* Global subtle gradient overlay for depth + readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020a18]/40 to-[#02060c]/80 pointer-events-none z-0" />

        {/* Hero Section */}
        <section className="py-16 px-4 relative overflow-hidden">
          {/* Background facility image with frosted vignette and neon highlights */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70 animate-fade-in-slow"
            style={{
              backgroundImage: `url(${scpFacility})`,
              filter: "brightness(0.45) contrast(1.08) saturate(0.85) blur(1px)",
            }}
          />

          {/* Holographic + frosted glass overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#04112a]/70 to-[#08132c]/90 pointer-events-none backdrop-blur-[2px] z-5" />

          <div className="container mx-auto relative z-10 text-center">
            {/* Enhanced SCPHeader holographic aesthetic with holiday accents */}
            <div className="relative mx-auto mb-10 max-w-3xl p-[1px] rounded-xl bg-gradient-to-r from-[#2a68ff]/30 via-[#4d9aff]/20 to-[#2a68ff]/30 shadow-[0_0_45px_rgba(70,130,255,0.18)]">
              <div className="rounded-xl bg-[#071427]/60 backdrop-blur-2xl border border-[#4b6fff]/25 shadow-[inset_0_0_25px_rgba(70,130,255,0.12)] relative overflow-hidden">
                {/* Tiny stars (neon frost) */}
                <div className="absolute inset-0 pointer-events-none">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1.5 h-1.5 rounded-full bg-[#9fe0ff] opacity-60 animate-twinkle"
                      style={{
                        left: `${10 + i * 7}%`,
                        top: `${6 + (i % 3) * 6}%`,
                        transform: `scale(${0.7 + (i % 3) * 0.2})`,
                      }}
                    />
                  ))}
                </div>

                <div className="p-8 relative overflow-hidden">
                  {/* Holographic scan + festive scan */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(80,130,255,0.06),transparent_60%)] animate-[pulseGlow_6s_infinite_ease-in-out]" />
                  <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(70,120,255,0.04)_0%,transparent_30%,rgba(70,120,255,0.04)_60%,transparent_100%)] opacity-70 animate-[scanLine_9s_linear_infinite]" />

                  {/* Candy-cane ribbons on top corners */}
                  <div className="absolute left-4 top-4 w-14 h-6 rounded-full transform -rotate-12">
                    <div className="w-full h-full rounded-full bg-[repeating-linear-gradient(45deg,#fff,#fff 8px,#ff3b3b 8px,#ff3b3b 16px)] opacity-90" />
                  </div>
                  <div className="absolute right-4 top-4 w-14 h-6 rounded-full transform rotate-12">
                    <div className="w-full h-full rounded-full bg-[repeating-linear-gradient(45deg,#fff,#fff 8px,#ff3b3b 8px,#ff3b3b 16px)] opacity-90" />
                  </div>

                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="flex items-center justify-center gap-3">
                      {/* Red warning triangle + warm ornament */}
                      <div className="relative">
                        <AlertTriangle className="h-6 w-6 text-[#ff7474] animate-pulse-slow" />
                        <div className="absolute -right-2 -top-2 w-3 h-3 rounded-full bg-[#ffd27a] shadow-[0_0_6px_rgba(255,210,122,0.6)]" />
                      </div>

                      <h2 className="text-2xl font-mono tracking-wide text-[#bfe8ff] drop-shadow-[0_0_8px_#4688ff]">
                        SCP-████ – CAPTURE THE FLAG DIVISION
                      </h2>

                      <span className="ml-2 px-4 py-1 border border-[#ff6060]/40 bg-[#ff6060]/10 text-[#ff9090] rounded-full text-xs font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(255,90,90,0.18)]">
                        KETER
                      </span>
                    </div>

                    <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#357bff]/50 to-transparent my-2 animate-pulse-slow" />

                    <p className="text-sm text-[#c9e7ff] font-mono tracking-wider uppercase opacity-90">
                      SCP FOUNDATION DATABASE ACCESS NODE
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main card area */}
            <div className="max-w-5xl mx-auto mt-12 animate-fade-in-soft">
              <div className="p-4 md:p-8 backdrop-blur-xl bg-[#071226]/60 border border-[#2e63ff]/20 rounded-xl shadow-[0_0_35px_rgba(50,90,180,0.18)] relative overflow-hidden">
                {/* Neon frosted emblem */}
                <div className="text-center mb-8 animate-fade-in-slow">
                  <div className="inline-flex items-center justify-center w-28 h-28 border-4 border-[#7fb8ff]/20 bg-[#07122a]/40 mb-6 rounded-full shadow-[0_0_40px_rgba(100,160,255,0.12)] relative">
                    <Shield className="h-16 w-16 text-[#9fc3ff] animate-pulse-slow" />
                    <div className="absolute -right-4 -top-4 w-6 h-6 rounded-full bg-[#ff7a7a]/80 shadow-[0_0_10px_rgba(255,122,122,0.25)]" />
                    {/* small ornament */}
                    <div className="absolute -left-4 -top-5 w-5 h-5 rounded-full bg-gradient-to-br from-[#ffd27a] to-[#ff9a2e] shadow-[0_0_10px_rgba(255,180,100,0.2)]" />
                  </div>

                  <h2 className="text-5xl font-bold mb-4 text-[#cfe7ff] tracking-widest glitch">
                    SECURE. CONTAIN. PROTECT.
                  </h2>

                  <p className="text-lg text-[#d6e2ff] mb-2 animate-fade-in-delay">
                    SCP Foundation - CTF Training Division
                  </p>

                  <p className="text-[#cfe4ff] font-mono text-sm">
                    Security Clearance Required | Foundation Intranet Node:{" "}
                    <span className="text-[#9fc3ff]">NODE-09/CTF-HQ</span>
                  </p>

                  <p className="text-[#bfe0ff] font-mono text-xs mt-2">
                    Build: v2.3.1 | Protocol: SCP-CTF/INF-SEC-███ | Timestamp:{" "}
                    {new Date().toUTCString()}
                  </p>
                </div>

                <div className="classification-bar my-6 opacity-60"></div>

                <div className="space-y-4 mb-8 text-[#eef6ff]/95">
                  <p className="text-lg">
                    <strong className="text-[#9ccaff] flicker-soft">NOTICE:</strong>{" "}
                    You are accessing a restricted SCP Foundation training
                    environment. This Capture The Flag (CTF) platform is
                    designed to test and enhance the cybersecurity capabilities
                    of Foundation personnel under simulated anomalous
                    conditions.
                  </p>
                  <p>
                    Unauthorized access to this portal constitutes a direct
                    violation of{" "}
                    <span className="text-[#a8c8ff">Containment Directive 88-GAMMA</span>.
                    All activities are logged and monitored by the Foundation
                    Cybersecurity Command (FCC).
                  </p>
                  <p>
                    Participants will engage with anomalous containment
                    simulations requiring expertise in:
                  </p>

                  {/* Features list */}
                  <ul className="list-none space-y-2 ml-6 text-[#e3f0ff]">
                    <li className="hover:text-[#bfe8ff] transition-colors">
                      • Web Exploitation and System Analysis
                    </li>
                    <li className="hover:text-[#bfe8ff] transition-colors">
                      • Cryptographic Protocol Investigation
                    </li>
                    <li className="hover:text-[#bfe8ff] transition-colors">
                      • Digital Forensics and <span className="redacted">DATA EXPUNGED</span>
                    </li>
                    <li className="hover:text-[#bfe8ff] transition-colors">
                      • Reverse Engineering of Anomalous Code
                    </li>
                    <li className="hover:text-[#bfe8ff] transition-colors">
                      • Binary Exploitation and Memory Corruption
                    </li>
                    <li className="hover:text-[#bfe8ff] transition-colors">
                      • Threat Hunting within SCP-classified Digital Entities
                    </li>
                  </ul>
                </div>

                {/* Action buttons */}
                <div className="flex gap-4 justify-center animate-fade-in-delay">
                  <Button
                    size="lg"
                    className="gap-2 bg-[#1c44a5]/80 hover:bg-[#2e5dd6]/90 text-white font-mono shadow-[0_0_30px_rgba(80,120,255,0.35)] hover:shadow-[0_0_45px_rgba(90,150,255,0.45)] rounded-lg transition-all duration-300 backdrop-blur-sm"
                    onClick={() => navigate("/auth")}
                  >
                    REQUEST CLEARANCE
                    <ArrowRight className="h-5 w-5" />
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 border-2 border-[#7fb3ff]/30 text-[#d6e2ff] hover:border-[#b2d1ff]/60 hover:text-[#b2d1ff] transition-all rounded-lg backdrop-blur-sm"
                    onClick={() => navigate("/about")}
                  >
                    VIEW DOCUMENTATION
                  </Button>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 relative">
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-12 rounded-xl animate-fade-in-slow"
                  style={{
                    backgroundImage: `url(${scpCorridor})`,
                    filter: "brightness(0.45) contrast(1.12)",
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
                    className="border border-[#2a4aff]/18 bg-[#071226]/50 backdrop-blur-xl p-6 text-center hover:border-[#7fb3ff]/40 hover:scale-[1.03] transition-all duration-500 group rounded-xl shadow-[0_0_12px_rgba(40,90,255,0.08)] relative overflow-hidden"
                  >
                    {/* small candy cane corner */}
                    <div className="absolute left-4 top-4 w-8 h-4 rounded-full transform -rotate-12 opacity-80">
                      <div className="w-full h-full rounded-full bg-[repeating-linear-gradient(45deg,#fff,#fff 7px,#f23 7px,#f23 14px)]" />
                    </div>

                    <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-[#6fb7ff]/18 bg-[#07122a]/40 mb-4 group-hover:border-[#b2d1ff] rounded-full relative shadow-[0_0_12px_rgba(60,120,255,0.08)]">
                      <Icon className="h-10 w-10 group-hover:text-[#b2d1ff] transition-colors text-[#e6ecff]" />
                      <div className="absolute inset-0 border-2 border-[#b2d1ff] opacity-0 group-hover:opacity-100 animate-ping-slow rounded-full" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-[#f2f6ff] group-hover:text-[#b2d1ff] transition-colors">
                      {title}
                    </h3>
                    <p className="text-sm text-[#dce6ff]/80">{desc}</p>
                  </div>
                ))}
              </div>

              {/* Security Notice */}
              <div className="p-8 bg-[#071226]/60 backdrop-blur-xl border border-[#2e63ff]/18 rounded-xl shadow-[0_0_25px_rgba(25,60,120,0.08)] mt-10 relative overflow-hidden animate-fade-in-soft">
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-12"
                  style={{
                    backgroundImage: `url(${scpCreature})`,
                    filter: "brightness(0.55) contrast(1.05) blur(0.8px)",
                  }}
                />

                {/* neon star + small candy accents */}
                <div className="absolute right-6 top-6 w-8 h-8 rounded-full bg-gradient-to-br from-[#7ef] to-[#3af] opacity-90 blur-[1px] animate-twinkle" />

                <div className="relative z-10 flex items-start gap-4">
                  <AlertTriangle className="h-12 w-12 text-[#9fc3ff] flex-shrink-0 mt-1 animate-pulse-slow" />
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-[#bfe0ff] flicker-soft">
                      SECURITY CLEARANCE REQUIRED
                    </h3>
                    <p className="mb-3 text-[#eaf0ff]">
                      Access requires <span className="text-[#a8c8ff] font-bold">Level-2</span> clearance or higher. Unauthorized access attempts are logged and reviewed by{" "}
                      <span className="redacted">O5 COMMAND</span>.
                    </p>
                    <p className="text-sm text-[#d4e0ff] mb-6">
                      All operations are monitored. Proceed only if you acknowledge Foundation containment protocols and ethics directives.
                    </p>

                    <div className="classification-bar mb-4 opacity-60"></div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-mono mb-6 text-[#f0f5ff]/90">
                      <div className="bg-[#071226]/40 p-3 border border-[#2b4aff]/18 rounded-md">
                        <p className="text-[#cbd8ff] mb-1">THREAT LEVEL:</p>
                        <p className="text-[#a8c8ff] font-bold">ELEVATED</p>
                      </div>
                      <div className="bg-[#071226]/40 p-3 border border-[#2b4aff]/18 rounded-md">
                        <p className="text-[#cbd8ff] mb-1">STATUS:</p>
                        <p className="text-[#81e9a0] font-bold">OPERATIONAL</p>
                      </div>
                      <div className="bg-[#071226]/40 p-3 border border-[#2b4aff]/18 rounded-md">
                        <p className="text-[#cbd8ff] mb-1">PARTICIPANTS:</p>
                        <p className="text-[#f0f5ff] font-bold">[CLASSIFIED]</p>
                      </div>
                      <div className="bg-[#071226]/40 p-3 border border-[#2b4aff]/18 rounded-md">
                        <p className="text-[#cbd8ff] mb-1">CLEARANCE:</p>
                        <p className="text-[#ff8383] font-bold">REQUIRED</p>
                      </div>
                    </div>

                    <p className="text-xs font-mono text-[#d4e0ff]">
                      System Audit Log ID: {Math.floor(Math.random() * 1000000)} | Audit Timestamp: {new Date().toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#233a63]/18 py-6 px-4 bg-[#040718]/70 backdrop-blur-md z-20 relative">
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

      {/* -------------------------
          Keyframes and utility styles
          ------------------------- */}
      <style>{`
        /* Snow layers - visual only */
        .snow-layer { position: absolute; inset: 0; pointer-events: none; }
        .snow-layer.layer-small { background-image: radial-gradient(white 1px, rgba(255,255,255,0) 1px); background-size: 6px 6px; opacity: 0.06; transform: translateZ(0); }
        .snow-layer.layer-medium { background-image: radial-gradient(white 1.2px, rgba(255,255,255,0) 1.2px); background-size: 10px 10px; opacity: 0.04; transform: translateZ(0); }
        .snow-layer.layer-large { background-image: radial-gradient(white 1.6px, rgba(255,255,255,0) 1.6px); background-size: 18px 18px; opacity: 0.02; transform: translateZ(0); }

        @keyframes animate-snow-slow {
          0% { background-position: 0 0; transform: translateY(-10%) }
          100% { background-position: 200px 1000px; transform: translateY(100%) }
        }
        @keyframes animate-snow-medium {
          0% { background-position: 0 0; transform: translateY(-5%) }
          100% { background-position: 400px 1000px; transform: translateY(120%) }
        }
        @keyframes animate-snow-fast {
          0% { background-position: 0 0; transform: translateY(0%) }
          100% { background-position: 600px 1200px; transform: translateY(140%) }
        }
        .animate-snow-slow { animation: animate-snow-slow 28s linear infinite; }
        .animate-snow-medium { animation: animate-snow-medium 18s linear infinite; }
        .animate-snow-fast { animation: animate-snow-fast 10s linear infinite; opacity: 0.6; }

        /* Twinkle for neon stars */
        @keyframes twinkle {
          0% { opacity: 0.2; transform: scale(0.9) }
          50% { opacity: 1; transform: scale(1.15) }
          100% { opacity: 0.2; transform: scale(0.9) }
        }
        .animate-twinkle { animation: twinkle 2.4s ease-in-out infinite; }

        /* Light flicker */
        @keyframes light-flicker {
          0% { transform: translateY(0) scale(1); opacity: 0.9; filter: drop-shadow(0 0 6px rgba(255,255,255,0.06)); }
          50% { transform: translateY(-2px) scale(1.05); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 0.9; }
        }
        .animate-light-flicker { animation: light-flicker 3s ease-in-out infinite; }

        /* Ornament sway */
        @keyframes ornament-sway {
          0% { transform: rotate(-6deg); }
          50% { transform: rotate(6deg); }
          100% { transform: rotate(-6deg); }
        }
        .animate-ornament-sway { animation: ornament-sway 4.5s ease-in-out infinite; transform-origin: 50% -6px; }

        /* small twinkle pulse used around hero */
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.85; transform: scale(1.01); }
        }
        @keyframes scanLine {
          0% { transform: translateX(-110%); }
          100% { transform: translateX(110%); }
        }
        @keyframes float {
          0% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.4; }
          25% { transform: translateY(-20px) translateX(10px) scale(1.12); opacity: 0.95; }
          50% { transform: translateY(-10px) translateX(-8px) scale(0.95); opacity: 0.35; }
          75% { transform: translateY(12px) translateX(8px) scale(1.08); opacity: 0.85; }
          100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.4; }
        }

        /* flicker + scan usage */
        .animate-[pulseGlow_6s_infinite_ease-in-out] { animation: pulseGlow 6s infinite ease-in-out; }
        .animate-[scanLine_9s_linear_infinite] { animation: scanLine 9s linear infinite; }
        .animate-[float_12s_infinite_ease-in-out] { animation: float 12s infinite ease-in-out; }

        /* button / light animations */
        @keyframes light-ping {
          0% { box-shadow: 0 0 0 rgba(80,130,255,0.12); }
          50% { box-shadow: 0 0 25px rgba(80,130,255,0.12); }
          100% { box-shadow: 0 0 0 rgba(80,130,255,0.12); }
        }
        .animate-ping-slow { animation: light-ping 4.8s infinite ease-in-out; }
        .animate-pulse-slow { animation: pulseGlow 3.6s infinite ease-in-out; }
        .animate-fade-in-slow { animation: fadeIn 1.2s ease-in-out both; }
        .animate-fade-in-soft { animation: fadeIn 0.9s ease-in-out both; }
        .animate-fade-in-delay { animation: fadeIn 1.4s ease-in-out both; }
        .animate-fade-in-slow { animation: fadeIn 1.0s ease-in-out both; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* small flicker-soft used on headings */
        .flicker-soft { text-shadow: 0 0 8px rgba(120,180,255,0.12); }

        /* glitch heading (subtle) */
        .glitch { position: relative; }
        .glitch::after {
          content: "";
          position: absolute;
          inset: 0;
          box-shadow: 0 0 18px rgba(90,160,255,0.06);
          pointer-events: none;
        }

      `}</style>
    </div>
  );
};

export default Index;
