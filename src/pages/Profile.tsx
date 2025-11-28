<div
  style="
    background: radial-gradient(circle at 20% 15%, #020b1a 0%, #00040b 85%);
    color: #d9ecff;
    font-family: 'Courier New', monospace;
    border: 1px solid #0d2540;
    border-radius: 14px;
    padding: 36px;
    max-width: 720px;
    margin: 60px auto;
    box-shadow:
      0 0 45px rgba(0, 140, 255, 0.18),
      0 0 120px rgba(0, 80, 150, 0.25),
      inset 0 0 40px rgba(0, 110, 200, 0.12);
    position: relative;
    overflow: hidden;
  "
>
  <!-- SNOWFALL BACKDROP -->
  <div
    style="
      position: absolute;
      inset: 0;
      background-image:
        radial-gradient(white 1px, transparent 1px),
        radial-gradient(white 1.2px, transparent 1.2px),
        radial-gradient(white 1.5px, transparent 1.5px);
      background-size: 6px 6px, 10px 10px, 14px 14px;
      opacity: 0.09;
      animation: snowfallBG 22s linear infinite;
      z-index: 0;
    "
  ></div>

  <!-- AURORA GLOW -->
  <div
    style="
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at center, rgba(120,200,255,0.15), transparent 70%);
      animation: auroraGlow 9s ease-in-out infinite alternate;
      z-index: 0;
      filter: blur(40px);
    "
  ></div>

  <!-- ORNAMENTS TOP -->
  <div
    style="
      position: absolute;
      top: -10px;
      left: 20px;
      width: 26px;
      height: 26px;
      background: radial-gradient(circle, #7ed4ff, #1f6fa3);
      border-radius: 50%;
      border: 2px solid rgba(255,255,255,0.2);
      box-shadow: 0 0 12px rgba(150,220,255,0.4);
      animation: ornamentBob 6s ease-in-out infinite;
      z-index: 2;
    "
  ></div>

  <div
    style="
      position: absolute;
      top: -6px;
      right: 40px;
      width: 30px;
      height: 30px;
      background: radial-gradient(circle, #ffe9a6, #d4a338);
      border-radius: 50%;
      border: 2px solid rgba(255,255,255,0.15);
      box-shadow: 0 0 14px rgba(255,230,140,0.35);
      animation: ornamentBob 7s ease-in-out infinite reverse;
      z-index: 2;
    "
  ></div>

  <!-- HEADER -->
  <h2
    style="
      color: #9fdcff;
      font-size: 22px;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 1.6px;
      border-bottom: 1px dashed #1c395c;
      padding-bottom: 14px;
      margin-bottom: 30px;
      text-shadow: 0 0 15px #8ad0ff, 0 0 30px rgba(140,220,255,0.4);
      position: relative;
      z-index: 3;
      animation: headerPulse 4s ease-in-out infinite;
    "
  >
    [ SYSTEM NODE // SCP_CTF_CORE_07A :: WINTER OPS ]
  </h2>

  <!-- TERMINAL TEXT -->
  <p
    style="
      color: #c8e6ff;
      font-size: 14px;
      line-height: 1.8;
      position: relative;
      z-index: 3;
    "
  >
    <span style="color: #9ffcff;">&gt; INITIALIZING SECURE CONTAINMENT PROTOCOL...</span><br /><br />
    Neural access pattern detected.<br />
    Frost-entropy signature calibrated.<br />
    <span style="color: #9fffe0;">Cognitive Hash Integrity: ACCEPTABLE</span><br /><br />
    You have reached the encrypted perimeter of the <strong>SCP_CTF_MAINFRAME</strong>.<br />
    Gateway status: <span style="color: #ffd67f;">LOCKED</span><br /><br />
    <span style="color: #afffff;">Engage identity vector verification to gain winter access.</span>
  </p>

  <!-- BUTTON (ICY CYAN — OPTION B) -->
  <p style="text-align: center; margin: 55px 0; position: relative; z-index: 3;">
    <a
      href="{{ .ConfirmationURL }}&redirect_to=https://scpctp.vercel.app"
      style="
        display: inline-block;
        padding: 18px 55px;
        color: #00121e;
        background: linear-gradient(180deg, #bdf1ff 0%, #78d7ff 100%);
        border-radius: 10px;
        border: 2px solid #e0f9ff;
        text-decoration: none;
        text-transform: uppercase;
        font-weight: bold;
        letter-spacing: 1.5px;
        position: relative;
        overflow: hidden;
        box-shadow:
          0 0 35px rgba(160,230,255,0.7),
          inset 0 0 18px rgba(210,245,255,0.5);
        transition: 0.2s ease-in-out;
        animation: cyanButtonGlow 3s ease-in-out infinite alternate;
      "
      onmouseover="this.style.transform='translateY(-2px) scale(1.06)'; this.style.boxShadow='0 0 55px rgba(190,240,255,0.95), inset 0 0 25px rgba(255,255,255,0.8)';"
      onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 0 35px rgba(160,230,255,0.7), inset 0 0 18px rgba(210,245,255,0.5)';"
      onmousedown="this.style.transform='translateY(1px) scale(0.97)'; this.style.boxShadow='0 0 25px rgba(190,240,255,1), inset 0 0 30px rgba(255,255,255,0.9)';"
      onmouseup="this.style.transform='translateY(-1px) scale(1.03)';"
    >
      [ VERIFY IDENTITY VECTOR ]
      <span
        style="
          position: absolute;
          top: 0;
          left: -75%;
          width: 50%;
          height: 100%;
          background: linear-gradient(120deg, rgba(255,255,255,0.55), rgba(255,255,255,0));
          transform: skewX(-25deg);
          animation: buttonShine 4s linear infinite;
        "
      ></span>
    </a>
  </p>

  <!-- REDIRECT INFO -->
  <p
    style="
      color: #b9ddff;
      font-size: 13px;
      text-align: center;
      margin-bottom: 20px;
      position: relative;
      z-index: 3;
    "
  >
    Transmission endpoint:<br />
    <strong style="color: #b7f4ff;">SCP Foundation — Winter Archive Node</strong><br />
    <span style="color: #ff7a9d;">Data channel: ACTIVE</span>
  </p>

  <!-- ASCII DIVIDER -->
  <pre
    style="
      color: #0e3858;
      text-align: center;
      font-size: 12px;
      margin: 35px 0;
      position: relative;
      z-index: 3;
    "
  >
[===[ CORE INTERFACE SEQUENCE STABILIZED // FROST-LAYER 02 ]===]
  </pre>

  <!-- WARNING -->
  <p
    style="
      font-size: 12px;
      color: #a9c8e8;
      text-align: center;
      line-height: 1.7;
      position: relative;
      z-index: 3;
    "
  >
    <strong style="color: #ff6480;">ALERT:</strong> Unauthorized winter-node access will trigger
    containment subroutines (Protocol-9B-Frost).<br />
    System anomalies are logged, indexed, and monitored.<br />
    <span style="color: #afffff;">Proceed only if your encryption vector is verified.</span>
  </p>

  <!-- FOOTER -->
  <div
    style="
      border-top: 1px solid #102b44;
      margin-top: 40px;
      padding-top: 14px;
      font-size: 11px;
      color: #6aa0c8;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 1px;
      position: relative;
      z-index: 3;
    "
  >
    <strong style="color: #b4f5ff;">Secure • Contain • Protect</strong><br />
    <span style="color: #6d9ec9;">SCP_CTF NODE v7a — Winter Signal Channel 09</span>
  </div>

  <!-- ANIMATIONS -->
  <style>
    @keyframes snowfallBG {
      0% { background-position: 0 0, 0 0, 0 0; }
      100% { background-position: 0 200px, 0 300px, 0 400px; }
    }

    @keyframes auroraGlow {
      0% { transform: scale(1) translate(0,0); opacity: 0.5; }
      50% { transform: scale(1.1) translate(1%, -2%); opacity: 0.8; }
      100% { transform: scale(1) translate(-1%, 2%); opacity: 0.5; }
    }

    @keyframes ornamentBob {
      0% { transform: translateY(0); }
      50% { transform: translateY(6px); }
      100% { transform: translateY(0); }
    }

    @keyframes headerPulse {
      0%,100% { text-shadow: 0 0 10px #88d4ff; }
      50% { text-shadow: 0 0 25px #b8eaff, 0 0 55px rgba(180,240,255,0.4); }
    }

    @keyframes buttonShine {
      0% { left: -75%; }
      50% { left: 125%; }
      100% { left: 125%; }
    }

    @keyframes cyanButtonGlow {
      0%,100% {
        box-shadow: 0 0 25px rgba(150,230,255,0.65), inset 0 0 12px rgba(220,245,255,0.4);
      }
      50% {
        box-shadow: 0 0 45px rgba(200,245,255,1), inset 0 0 20px rgba(255,255,255,0.7);
      }
    }
  </style>
</div>
