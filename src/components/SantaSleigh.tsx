import { useState, useEffect } from "react";

/**
 * SantaSleigh - Reusable Christmas Santa sleigh flying effect component
 * 
 * Creates a Santa sleigh that flies across the screen periodically with:
 * - Background layer placement (behind content)
 * - Subtle opacity so it's present but not distracting
 * - Smooth animation from right to left (or left to right)
 * - Repeats every 30-45 seconds with randomized parameters
 * - Respects reduced motion preferences
 */
export function SantaSleigh() {
  const [sleighDuration, setSleighDuration] = useState<number>(() => {
    // Random duration between 30-45 seconds
    return Math.floor(Math.random() * (45 - 30 + 1)) + 30;
  });
  const [sleighDelay, setSleighDelay] = useState<number>(() => {
    return Math.floor(Math.random() * 10);
  });
  const [sleighTopOffset, setSleighTopOffset] = useState<number>(() => {
    // Random vertical position between 6% and 28% of viewport
    return Math.floor(Math.random() * (28 - 6 + 1)) + 6;
  });
  const [sleighDirection, setSleighDirection] = useState<"ltr" | "rtl">(() => {
    return Math.random() > 0.5 ? "ltr" : "rtl";
  });

  useEffect(() => {
    let sleighTimeout: NodeJS.Timeout;
    const scheduleNextSleigh = () => {
      const nextDuration = Math.floor(Math.random() * (45 - 30 + 1)) + 30;
      const nextDelay = Math.floor(Math.random() * 10);
      const nextTop = Math.floor(Math.random() * (28 - 6 + 1)) + 6;
      const nextDir = Math.random() > 0.5 ? "ltr" : "rtl";
      
      sleighTimeout = setTimeout(() => {
        setSleighDuration(nextDuration);
        setSleighDelay(nextDelay);
        setSleighTopOffset(nextTop);
        setSleighDirection(nextDir as "ltr" | "rtl");
        scheduleNextSleigh();
      }, (sleighDuration + Math.floor(Math.random() * 8)) * 1000);
    };
    
    scheduleNextSleigh();

    return () => {
      if (sleighTimeout) clearTimeout(sleighTimeout);
    };
  }, [sleighDuration]);

  return (
    <>
      <div
        className={`santa-container ${sleighDirection === "rtl" ? "rtl" : "ltr"}`}
        style={{
          top: `${sleighTopOffset}vh`,
          animationDuration: `${sleighDuration}s`,
          animationDelay: `${sleighDelay}s`,
        }}
      >
        <div className="santa-sleigh" style={{ width: 180 }}>
          <div className="sleigh-trail" />
          <svg
            viewBox="0 0 640 256"
            xmlns="http://www.w3.org/2000/svg"
            className="santa-svg"
            aria-hidden
            width="180"
            height="72"
          >
            <g fill="none" stroke="none">
              {/* Santa head */}
              <g transform="translate(0,0)" fill="#f8f2e8" opacity="0.95">
                <path d="M72 28c-2 0-4 3-4 6 0 4 2 7 4 7 3 0 5-3 5-7 0-3-2-6-5-6z" />
                <path d="M90 20c-6 0-12 6-12 12v8c0 8 8 14 16 14 9 0 16-6 16-14v-8c0-6-6-12-12-12h-8z" />
                <path d="M96 18c4-2 10-6 14-6 2 0 4 2 4 4 0 4-6 8-10 10-6 2-20 6-20 6" opacity="0.9" />
              </g>
              {/* Sleigh body */}
              <g transform="translate(180,36) scale(0.9)" fill="#ff6b6b">
                <rect x="0" y="0" rx="10" ry="10" width="120" height="28" />
                <path d="M0 24 q18 12 40 12 h32 q20 0 40 -12 v-4 h-112 z" fill="#9f2b2b" opacity="0.9"/>
              </g>
              {/* Santa hat */}
              <g transform="translate(150,10) scale(0.45)" fill="#fff">
                <circle cx="36" cy="36" r="20" fill="#fff" />
                <path d="M12 12 q36 -18 60 0 q-8 2 -24 2 q-24 0 -36 -2 z" fill="#e53e3e" />
              </g>
              {/* Shadow */}
              <g transform="translate(0,0)" opacity="0.35" fill="#ffffff">
                <ellipse cx="320" cy="40" rx="150" ry="12" />
              </g>
            </g>
          </svg>
        </div>
      </div>

      <style>{`
        .santa-container {
          position: fixed;
          left: -220px;
          z-index: 1;
          pointer-events: none;
          will-change: transform;
          transform: translate3d(0, 0, 0);
        }

        .santa-container.rtl {
          left: auto;
          right: -220px;
        }

        .santa-container.ltr {
          animation-name: sleigh-fly-ltr;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-fill-mode: forwards;
        }

        .santa-container.rtl {
          animation-name: sleigh-fly-rtl;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-fill-mode: forwards;
        }

        @keyframes sleigh-fly-ltr {
          0% { transform: translateX(-8vw) translateY(0) rotate(0deg); opacity: 0; }
          5% { opacity: 0.6; }
          50% { transform: translateX(110vw) translateY(6vh) rotate(0.5deg); opacity: 0.6; }
          95% { opacity: 0.6; }
          100% { transform: translateX(125vw) translateY(12vh) rotate(1deg); opacity: 0; }
        }

        @keyframes sleigh-fly-rtl {
          0% { transform: translateX(8vw) translateY(0) rotate(0deg); opacity: 0; }
          5% { opacity: 0.6; }
          50% { transform: translateX(-110vw) translateY(6vh) rotate(-0.5deg); opacity: 0.6; }
          95% { opacity: 0.6; }
          100% { transform: translateX(-125vw) translateY(12vh) rotate(-1deg); opacity: 0; }
        }

        .santa-sleigh {
          position: relative;
          display: inline-block;
          transform-origin: center center;
          filter: drop-shadow(0 6px 10px rgba(0,0,0,0.45));
        }

        .santa-svg {
          display: block;
          transform-origin: center center;
        }

        .sleigh-trail {
          position: absolute;
          left: -40px;
          top: 18px;
          width: 260px;
          height: 24px;
          border-radius: 999px;
          background: linear-gradient(90deg, rgba(255,255,255,0.12), rgba(160,220,255,0.06), rgba(255,255,255,0.08));
          filter: blur(6px) saturate(1.2);
          opacity: 0.85;
          transform-origin: left center;
          pointer-events: none;
          mix-blend-mode: screen;
          background-size: 200% 100%;
          animation: trail-shimmer 3.6s linear infinite;
        }

        @keyframes trail-shimmer {
          0% { background-position: 0% 50%; opacity: 0.9; transform: scaleX(0.95) translateY(0px) }
          50% { background-position: 100% 50%; opacity: 1; transform: scaleX(1.05) translateY(-3px) }
          100% { background-position: 0% 50%; opacity: 0.9; transform: scaleX(0.95) translateY(0px) }
        }

        .sleigh-trail::before,
        .sleigh-trail::after {
          content: '';
          position: absolute;
          right: 8px;
          top: -6px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,1), rgba(255,255,255,0.1));
          filter: blur(2px);
          opacity: 0.9;
          transform: translateX(0) translateY(0);
        }

        .sleigh-trail::after {
          right: 60px;
          top: 2px;
          width: 10px;
          height: 10px;
          opacity: 0.7;
        }

        @media (max-width: 640px) {
          .santa-sleigh { width: 120px !important; }
          .sleigh-trail { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .santa-container, .sleigh-trail, .santa-sleigh {
            animation: none !important;
            display: none;
          }
        }
      `}</style>
    </>
  );
}
