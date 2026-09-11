"use client";

import React, { useMemo } from "react";

interface WaterDropsOverlayProps {
  slow?: boolean;
}

export function WaterDropsOverlay({ slow = false }: WaterDropsOverlayProps) {
  const speedMultiplier = slow ? 4 : 1; // 4x slower when slowing down

  const rainStreaks = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => ({
      id: `rain-${i}`,
      left: `${(i * 3.6 + (i % 5) * 1.5) % 98}%`,
      top: `${-(i * 8) % 30}%`,
      height: `${35 + (i % 4) * 20}px`,
      baseDuration: 1.1 + (i % 6) * 0.28,
      delay: `${(i * 0.17) % 2.2}s`,
      opacity: 0.18 + (i % 3) * 0.08,
    }));
  }, []);

  const glassDroplets = useMemo(() => {
    return [
      { top: "14%", left: "12%", size: 6, opacity: 0.28 },
      { top: "22%", left: "34%", size: 8, opacity: 0.32 },
      { top: "18%", left: "68%", size: 5, opacity: 0.25 },
      { top: "35%", left: "82%", size: 9, opacity: 0.35 },
      { top: "42%", left: "18%", size: 7, opacity: 0.3 },
      { top: "58%", left: "28%", size: 6, opacity: 0.26 },
      { top: "65%", left: "74%", size: 10, opacity: 0.35 },
      { top: "78%", left: "48%", size: 7, opacity: 0.28 },
      { top: "84%", left: "88%", size: 8, opacity: 0.32 },
      { top: "28%", left: "52%", size: 5, opacity: 0.22 },
      { top: "72%", left: "15%", size: 9, opacity: 0.3 },
      { top: "88%", left: "38%", size: 6, opacity: 0.25 },
    ];
  }, []);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-[1] pointer-events-none overflow-hidden select-none"
    >
      <style>{`
        @keyframes fallRain {
          0%   { transform: translateY(-40px) skewX(-7deg); opacity: 0; }
          20%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: translateY(105vh) skewX(-7deg); opacity: 0; }
        }
        @keyframes trickleDown {
          0%   { transform: translateY(0); opacity: 0.35; }
          70%  { opacity: 0.35; }
          100% { transform: translateY(80px); opacity: 0; }
        }
      `}</style>

      {/* 1. Falling Slanted Rain Streaks */}
      {rainStreaks.map((r) => (
        <div
          key={r.id}
          className="absolute w-[1.5px] rounded-full"
          style={{
            left: r.left,
            top: r.top,
            height: r.height,
            animationName: "fallRain",
            animationDuration: `${r.baseDuration * speedMultiplier}s`,
            animationDelay: r.delay,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(200,235,255,0.7) 70%, rgba(255,255,255,0.9) 100%)",
            opacity: slow ? r.opacity * 0.5 : r.opacity,
            filter: "blur(0.4px)",
            transition: "animation-duration 1s ease",
          }}
        />
      ))}

      {/* 2. Realistic Glass Window Condensation Droplets */}
      {glassDroplets.map((d, idx) => (
        <div
          key={`droplet-${idx}`}
          className="absolute rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
          style={{
            top: d.top,
            left: d.left,
            width: `${d.size}px`,
            height: `${d.size * 1.15}px`,
            opacity: d.opacity,
            background:
              "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.85) 0%, rgba(220,240,255,0.4) 45%, rgba(10,15,25,0.6) 100%)",
            border: "0.5px solid rgba(255,255,255,0.35)",
            backdropFilter: "blur(0.5px)",
          }}
        />
      ))}

      {/* 3. Occasional Trickling Droplets rolling down windowpane */}
      <div
        className="absolute top-[20%] left-[24%] w-[6px] h-[9px] rounded-full shadow-sm"
        style={{
          animationName: "trickleDown",
          animationDuration: `${7 * speedMultiplier}s`,
          animationTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          animationIterationCount: "infinite",
          background:
            "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.9) 0%, rgba(200,230,255,0.5) 50%, rgba(20,20,30,0.7) 100%)",
          border: "0.5px solid rgba(255,255,255,0.4)",
        }}
      />
      <div
        className="absolute top-[30%] left-[62%] w-[7px] h-[10px] rounded-full shadow-sm"
        style={{
          animationName: "trickleDown",
          animationDuration: `${7 * speedMultiplier}s`,
          animationDelay: "3.5s",
          animationTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          animationIterationCount: "infinite",
          background:
            "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.9) 0%, rgba(200,230,255,0.5) 50%, rgba(20,20,30,0.7) 100%)",
          border: "0.5px solid rgba(255,255,255,0.4)",
        }}
      />

      {/* 4. Subtle Ambient Vignette Tone */}
      <div className="absolute inset-0 bg-blue-950/[0.04] mix-blend-screen pointer-events-none" />
    </div>
  );
}

