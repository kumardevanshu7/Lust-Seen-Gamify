"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, ShieldCheck, Zap } from "lucide-react";
import { soundEngine } from "@/lib/soundEngine";

interface SplashIntroProps {
  onComplete: () => void;
}

export function SplashIntro({ onComplete }: SplashIntroProps) {
  const [phase, setPhase] = useState<"enter" | "zoomOut" | "exit">("enter");

  useEffect(() => {
    // Sound effect on start
    soundEngine.playWin();

    // 1.5s in enter state -> trigger zoom out
    const zoomTimer = setTimeout(() => {
      setPhase("zoomOut");
    }, 1500);

    // 2.3s total -> complete intro
    const exitTimer = setTimeout(() => {
      setPhase("exit");
      setTimeout(onComplete, 400);
    }, 2400);

    return () => {
      clearTimeout(zoomTimer);
      clearTimeout(exitTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "exit" && (
        <motion.div
          key="splash-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#1e100a] via-[#2c1810] to-[#0f0a07] text-white select-none overflow-hidden"
          role="status"
          aria-live="polite"
        >
          {/* Ambient Glow Orbs */}
          <div
            aria-hidden="true"
            className="absolute -top-24 -left-24 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-24 -right-24 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl pointer-events-none"
          />

          {/* Central Animated Hero Container */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={
              phase === "enter"
                ? { scale: [0.7, 1.08, 1], opacity: 1 }
                : { scale: 0.88, opacity: 0.9, y: -20 }
            }
            transition={{
              duration: phase === "enter" ? 1.4 : 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative flex flex-col items-center text-center px-6"
          >
            {/* Playful Floating Shield Icon */}
            <motion.div
              animate={{ rotate: [0, -4, 4, 0], y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-game-orange to-game-yellow flex items-center justify-center shadow-[0_10px_0_0_#9a3412] mb-6 border-4 border-amber-200"
            >
              <ShieldCheck className="w-14 h-14 sm:w-16 sm:h-16 text-white drop-shadow-md" aria-hidden="true" />
            </motion.div>

            {/* Glowing Text: TIME TO CONTROL */}
            <motion.div
              initial={{ letterSpacing: "0.05em" }}
              animate={{ letterSpacing: "0.15em" }}
              transition={{ duration: 1.8, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/20 border border-orange-400/40 text-orange-300 text-xs sm:text-sm font-black uppercase mb-3 shadow-inner"
            >
              <Flame className="w-4 h-4 text-orange-400" aria-hidden="true" />
              <span>Awaken The Iron Will</span>
              <Zap className="w-4 h-4 text-yellow-400" aria-hidden="true" />
            </motion.div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-300 to-amber-100 drop-shadow-[0_4px_12px_rgba(255,112,51,0.5)]">
              Time To Control
            </h1>

            <p className="mt-3 text-sm sm:text-base text-amber-200/80 font-medium max-w-xs sm:max-w-md">
              Level up your discipline, join legendary anime clans & master your mind.
            </p>

            {/* Pulsing Energy Ring */}
            <div
              aria-hidden="true"
              className="mt-8 flex items-center gap-1.5 text-xs text-orange-300/80 font-semibold"
            >
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
              <span>Initializing Willpower Engine…</span>
            </div>
          </motion.div>

          {/* Quick Skip button for immediate user control */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onComplete();
            }}
            aria-label="Skip introductory splash animation"
            className="absolute bottom-6 px-4 py-2 text-xs font-bold text-amber-200/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 outline-none"
          >
            Skip Intro →
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
