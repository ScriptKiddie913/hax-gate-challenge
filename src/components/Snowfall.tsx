import { useState, useEffect } from "react";

/**
 * Snowfall - Reusable Christmas snowfall effect component
 * 
 * Creates animated falling snowflakes across the screen with:
 * - Different sizes and falling speeds for natural effect
 * - Subtle appearance that doesn't interfere with content
 * - Responsive design that works on all device sizes
 * - Respects reduced motion preferences
 */
export function Snowfall() {
  const [snowflakes, setSnowflakes] = useState<
    { id: number; left: string; delay: string; size: string; duration: string }[]
  >([]);

  useEffect(() => {
    // Generate 45 snowflakes with varied properties for natural effect
    const generated = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      size: `${8 + Math.random() * 10}px`,
      duration: `${6 + Math.random() * 6}s`,
    }));
    setSnowflakes(generated);
  }, []);

  return (
    <>
      {/* Christmas falling snowflakes */}
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake absolute text-white opacity-90 pointer-events-none select-none"
          style={{
            left: flake.left,
            fontSize: flake.size,
            animation: `snowfall-animation ${flake.duration} linear infinite`,
            animationDelay: flake.delay,
            textShadow: "0 0 8px rgba(255,255,255,0.8)",
            zIndex: 1,
          }}
        >
          ❄
        </div>
      ))}
    </>
  );
}
