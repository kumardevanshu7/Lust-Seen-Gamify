"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { soundEngine } from "@/lib/soundEngine";
import { Zap, ShieldCheck, Flame, RotateCcw, ArrowRight, Trophy } from "lucide-react";

interface KnifeShotGameProps {
  onStartOnboarding: () => void;
}

interface StuckKnife {
  angle: number; // Angle relative to target wheel
}

interface FlyingKnife {
  x: number;
  y: number;
  vy: number;
  active: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export function KnifeShotGame({ onStartOnboarding }: KnifeShotGameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Game state
  const [score, setScore] = useState(0);
  const [stage, setStage] = useState(1);
  const [knivesLeft, setKnivesLeft] = useState(6);
  const [bossDefeated, setBossDefeated] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Physics refs
  const wheelAngleRef = useRef(0);
  const wheelSpeedRef = useRef(0.025);
  const stuckKnivesRef = useRef<StuckKnife[]>([
    { angle: 0 },
    { angle: Math.PI * 0.75 },
  ]);
  const flyingKnifeRef = useRef<FlyingKnife | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const screenShakeRef = useRef(0);
  const lastTimeRef = useRef(0);
  const directionTimerRef = useRef(0);

  const targetLabels = [
    "MIDNIGHT LUST",
    "DOPAMINE TRAP",
    "PORN TRIGGER",
    "DOOMSCROLL",
    "WEAK WILL",
  ];

  const currentBossName = targetLabels[(stage - 1) % targetLabels.length];

  // Spawn particle spark
  const createSparks = useCallback((x: number, y: number, color: string, count = 16) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: Math.random() * 20 + 15,
        color,
        size: Math.random() * 3 + 2,
      });
    }
  }, []);

  // Throw knife handler
  const throwKnife = useCallback(() => {
    if (gameOver || bossDefeated || flyingKnifeRef.current || knivesLeft <= 0) return;

    soundEngine.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;

    flyingKnifeRef.current = {
      x: canvas.width / 2,
      y: canvas.height - 70,
      vy: -18,
      active: true,
    };
    setKnivesLeft((prev) => prev - 1);
  }, [gameOver, bossDefeated, knivesLeft]);

  // Restart / Next stage
  const resetStage = useCallback((nextStage = false) => {
    if (nextStage) {
      setStage((s) => s + 1);
      setKnivesLeft(6 + Math.min(stage, 4));
    } else {
      setScore(0);
      setStage(1);
      setKnivesLeft(6);
    }
    stuckKnivesRef.current = nextStage
      ? [{ angle: Math.random() * Math.PI }]
      : [{ angle: 0 }, { angle: Math.PI * 0.75 }];
    flyingKnifeRef.current = null;
    particlesRef.current = [];
    setBossDefeated(false);
    setGameOver(false);
    wheelSpeedRef.current = (0.025 + stage * 0.005) * (Math.random() > 0.5 ? 1 : -1);
  }, [stage]);

  // Main Canvas animation & physics loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const render = (time: number) => {
      const dt = time - lastTimeRef.current;
      lastTimeRef.current = time;

      // Wheel rotation logic with direction alternation
      directionTimerRef.current += 1;
      if (directionTimerRef.current > 180 + Math.random() * 120) {
        directionTimerRef.current = 0;
        wheelSpeedRef.current *= -1; // Reverse spin!
      }
      wheelAngleRef.current += wheelSpeedRef.current;

      // Screen shake decay
      if (screenShakeRef.current > 0) {
        screenShakeRef.current *= 0.85;
      }

      // Clear Canvas
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (screenShakeRef.current > 0.5) {
        ctx.translate(
          (Math.random() - 0.5) * screenShakeRef.current,
          (Math.random() - 0.5) * screenShakeRef.current
        );
      }

      const centerX = canvas.width / 2;
      const centerY = 145;
      const wheelRadius = 65;

      // 1. Draw Rotating Urge Wheel (Target Boss)
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(wheelAngleRef.current);

      // Wheel Outer Glow
      ctx.shadowColor = "#ff7033";
      ctx.shadowBlur = 18;

      // Wood/Iron Rim
      ctx.beginPath();
      ctx.arc(0, 0, wheelRadius + 8, 0, Math.PI * 2);
      ctx.fillStyle = "#5c2b14";
      ctx.fill();

      // Inner Core
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(0, 0, wheelRadius, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(0, 0, 10, 0, 0, wheelRadius);
      grad.addColorStop(0, "#d97706");
      grad.addColorStop(0.7, "#9a3412");
      grad.addColorStop(1, "#451a03");
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#fed7aa";
      ctx.stroke();

      // Concentric rings
      ctx.beginPath();
      ctx.arc(0, 0, wheelRadius * 0.6, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(254, 215, 170, 0.4)";
      ctx.stroke();

      // Center Flame Emblem
      ctx.fillStyle = "#fff";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🔥", 0, 0);

      // Draw Stuck Knives rotating with wheel
      stuckKnivesRef.current.forEach((k) => {
        ctx.save();
        ctx.rotate(k.angle);
        // Blade stuck inside wheel
        ctx.beginPath();
        ctx.moveTo(-4, wheelRadius - 10);
        ctx.lineTo(4, wheelRadius - 10);
        ctx.lineTo(3, wheelRadius + 36);
        ctx.lineTo(-3, wheelRadius + 36);
        ctx.closePath();
        ctx.fillStyle = "#e2e8f0";
        ctx.fill();

        // Handle
        ctx.fillStyle = "#ea580c";
        ctx.fillRect(-5, wheelRadius + 36, 10, 16);
        ctx.fillStyle = "#fde047";
        ctx.beginPath();
        ctx.arc(0, wheelRadius + 52, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      ctx.restore(); // Restore wheel transform

      // 2. Update and Draw Flying Knife
      const flying = flyingKnifeRef.current;
      if (flying && flying.active) {
        flying.y += flying.vy;

        // Trailing particles
        if (Math.random() > 0.3) {
          particlesRef.current.push({
            x: flying.x + (Math.random() - 0.5) * 6,
            y: flying.y + 20,
            vx: (Math.random() - 0.5) * 1.5,
            vy: Math.random() * 2 + 1,
            life: 1,
            maxLife: 12,
            color: "#fde047",
            size: 2.5,
          });
        }

        // Draw flying knife blade
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(flying.x - 4, flying.y);
        ctx.lineTo(flying.x, flying.y - 18);
        ctx.lineTo(flying.x + 4, flying.y);
        ctx.lineTo(flying.x + 3, flying.y + 24);
        ctx.lineTo(flying.x - 3, flying.y + 24);
        ctx.closePath();
        ctx.fillStyle = "#f8fafc";
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 10;
        ctx.fill();

        // Flying knife handle
        ctx.fillStyle = "#ff7033";
        ctx.fillRect(flying.x - 5, flying.y + 24, 10, 14);
        ctx.restore();

        // Check Collision with Wheel Edge
        const distToCenter = Math.hypot(flying.x - centerX, flying.y - centerY);
        if (distToCenter <= wheelRadius + 22) {
          // Calculate hit angle relative to current wheel rotation
          // Standard angle: from center to knife
          const globalHitAngle = Math.atan2(flying.y - centerY, flying.x - centerX);
          const relativeAngle = (globalHitAngle - wheelAngleRef.current + Math.PI * 4) % (Math.PI * 2);

          // Check collision against all stuck knives
          let hasClashed = false;
          for (const stuck of stuckKnivesRef.current) {
            let diff = Math.abs(stuck.angle - relativeAngle);
            if (diff > Math.PI) diff = Math.PI * 2 - diff;

            if (diff < 0.28) {
              // CLASH COLLISION!
              hasClashed = true;
              break;
            }
          }

          if (hasClashed) {
            // Deflected!
            soundEngine.playDamage();
            screenShakeRef.current = 12;
            createSparks(flying.x, flying.y, "#ef4444", 25);
            flyingKnifeRef.current = null;
            setGameOver(true);
          } else {
            // SUCCESSFUL STICK!
            soundEngine.playWin();
            screenShakeRef.current = 6;
            createSparks(flying.x, flying.y, "#fde047", 18);

            stuckKnivesRef.current.push({ angle: relativeAngle });
            flyingKnifeRef.current = null;
            setScore((s) => s + 50);

            // Check if stage cleared
            if (knivesLeft <= 1) {
              soundEngine.playLevelUp();
              screenShakeRef.current = 16;
              createSparks(centerX, centerY, "#38bdf8", 40);
              setBossDefeated(true);
              setScore((s) => s + 300);
            }
          }
        }
      }

      // 3. Draw Ready/Bottom Knife
      if (!flyingKnifeRef.current && knivesLeft > 0 && !gameOver && !bossDefeated) {
        ctx.save();
        const startX = centerX;
        const startY = canvas.height - 60;
        ctx.beginPath();
        ctx.moveTo(startX - 4, startY);
        ctx.lineTo(startX, startY - 18);
        ctx.lineTo(startX + 4, startY);
        ctx.lineTo(startX + 3, startY + 24);
        ctx.lineTo(startX - 3, startY + 24);
        ctx.closePath();
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#f59e0b";
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.fillStyle = "#ea580c";
        ctx.fillRect(startX - 5, startY + 24, 10, 14);
        ctx.restore();
      }

      // 4. Update & Draw Sparks
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // Gravity
        p.life += 1;

        if (p.life >= p.maxLife) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - p.life / p.maxLife), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [bossDefeated, gameOver, knivesLeft, createSparks]);

  // Spacebar trigger
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        throwKnife();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [throwKnife]);

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center select-none text-white px-3 py-2">
      {/* Target Urge Boss Banner */}
      <div className="w-full flex items-center justify-between bg-black/40 border-2 border-orange-500/40 rounded-2xl px-3.5 py-2 mb-2 backdrop-blur-sm shadow-inner">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-orange-400 flex items-center gap-1">
            <Flame className="w-3 h-3 text-orange-500" />
            <span>Target #{stage}:</span>
          </span>
          <span className="text-sm font-black text-amber-200 tracking-wide">
            {currentBossName}
          </span>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-black uppercase text-stone-400">Score</span>
          <div className="text-base font-black text-amber-300 tabular-nums">{score}</div>
        </div>
      </div>

      {/* Interactive Arcade Canvas */}
      <div className="relative w-full aspect-[4/5] max-h-[360px] bg-gradient-to-b from-[#1c0f08] via-[#241209] to-[#120804] border-4 border-amber-800 rounded-3xl overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.7)] flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={360}
          height={420}
          onClick={throwKnife}
          className="w-full h-full cursor-pointer touch-none"
        />

        {/* Floating Knife Stock Indicators on Left */}
        <div className="absolute left-3 bottom-4 flex flex-col gap-1.5 pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-6 rounded-full border transition-all duration-300 ${
                i < knivesLeft
                  ? "bg-amber-400 border-amber-200 shadow-sm"
                  : "bg-stone-800/60 border-stone-700"
              }`}
            />
          ))}
        </div>

        {/* Overlay when Target Shattered */}
        {bossDefeated && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-game-green border-2 border-emerald-300 flex items-center justify-center text-2xl shadow-lg mb-2">
              💥
            </div>
            <h3 className="text-xl font-black text-emerald-300">
              URGE TARGET DESTROYED!
            </h3>
            <p className="text-xs text-amber-200/80 mb-3">+300 Mastery Bonus XP</p>
            <button
              type="button"
              onClick={() => resetStage(true)}
              className="py-2.5 px-5 rounded-2xl bg-game-orange hover:bg-game-orangeDark font-black text-xs uppercase tracking-wider shadow-game-orange active:translate-y-0.5 transition-all"
            >
              Next Urge Boss →
            </button>
          </div>
        )}

        {/* Overlay when Knife Clashed (Game Over) */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-600 border-2 border-red-300 flex items-center justify-center text-2xl shadow-lg mb-2">
              ⚔️
            </div>
            <h3 className="text-xl font-black text-red-400">
              BLADE CLASHED!
            </h3>
            <p className="text-xs text-stone-300 mb-3">
              Don’t let your focus waver. Reset and strike again!
            </p>
            <button
              type="button"
              onClick={() => resetStage(false)}
              className="py-2.5 px-5 rounded-2xl bg-stone-700 hover:bg-stone-600 text-amber-200 font-black text-xs uppercase tracking-wider shadow-game-sm active:translate-y-0.5 transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Target</span>
            </button>
          </div>
        )}
      </div>

      {/* Tap / Click Prompt */}
      <p className="text-[11px] font-bold text-amber-300/80 mt-2 mb-3 text-center">
        ⚡ Tap target area or press <kbd className="px-1.5 py-0.5 rounded bg-black/40 border border-stone-600 text-[10px] font-mono text-white">SPACE</kbd> to throw Kunai blade!
      </p>

      {/* Primary CTA: Launch Onboarding into the Real App */}
      <button
        type="button"
        onClick={onStartOnboarding}
        className="w-full py-4 px-6 rounded-3xl bg-gradient-to-r from-game-orange via-amber-500 to-game-yellow hover:from-game-orangeDark hover:to-orange-500 text-white font-black text-base sm:text-lg uppercase tracking-wider shadow-[0_6px_0_0_#9a3412,0_12px_20px_rgba(0,0,0,0.35)] active:translate-y-1 transition-all flex items-center justify-center gap-3 border-2 border-amber-200 focus-visible:ring-3 focus-visible:ring-orange-400 outline-none cursor-pointer"
      >
        <span>Enter Control Urge Arena</span>
        <ArrowRight className="w-5 h-5 stroke-[3]" aria-hidden="true" />
      </button>
    </div>
  );
}
