"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { soundEngine } from "@/lib/soundEngine";
import { Skull, RotateCcw, ShieldAlert, Sparkles, HeartCrack } from "lucide-react";

export function GameOverModal() {
  const { state, rebirthPhoenix } = useGame();
  const [isRebirthing, setIsRebirthing] = useState(false);

  if (!state.isGameOver) return null;

  const handleRebirth = () => {
    setIsRebirthing(true);
    soundEngine.playLevelUp();
    setTimeout(() => {
      rebirthPhoenix();
      setIsRebirthing(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-red-950/85 backdrop-blur-lg select-none">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotate: -2 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-full max-w-md bg-[#1f0e0c] border-[5px] border-red-600 rounded-[36px] p-6 sm:p-8 shadow-[0_16px_0_0_#991b1b,0_25px_40px_rgba(0,0,0,0.8)] text-white text-center relative overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-over-title"
      >
        {/* Ambient Dark Aura */}
        <div
          aria-hidden="true"
          className="absolute -top-20 -left-20 w-60 h-60 bg-red-600/25 rounded-full blur-3xl pointer-events-none"
        />

        {/* Heart Broken / Skull Badge */}
        <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-b from-red-600 to-red-800 border-3 border-red-300 flex items-center justify-center shadow-[0_6px_0_0_#7f1d1d] animate-bounce">
          <HeartCrack className="w-11 h-11 text-white" aria-hidden="true" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full bg-red-950 border border-red-500/50 text-red-400 text-xs font-black uppercase tracking-widest mb-2">
          Health Depleted (HP = 0)
        </span>

        <h2 id="game-over-title" className="text-3xl sm:text-4xl font-black tracking-tight text-red-200">
          Inner Urge Won…
        </h2>

        <p className="mt-2 text-sm text-red-200/80 font-medium leading-relaxed">
          Your willpower barrier collapsed today. Your current streak has been lost and the run has ended.
        </p>

        {/* Motivational Shonen Message */}
        <div className="my-5 p-4 rounded-2xl bg-black/40 border-2 border-red-800/80 text-xs text-amber-200/90 font-medium italic">
          &ldquo;Fall seven times, stand up eight. A true warrior is not one who never slips, but one who rises stronger from the ashes.&rdquo;
        </div>

        {/* Phoenix Rebirth Button */}
        <button
          type="button"
          onClick={handleRebirth}
          disabled={isRebirthing}
          className="w-full py-4 px-6 rounded-3xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-black text-lg uppercase tracking-wider shadow-[0_6px_0_0_#c2410c] active:translate-y-1 transition-all flex items-center justify-center gap-3 border-2 border-amber-200 focus-visible:ring-3 focus-visible:ring-amber-400 outline-none"
        >
          {isRebirthing ? (
            <>
              <Sparkles className="w-6 h-6 animate-spin" aria-hidden="true" />
              <span>Awakening Phoenix Will…</span>
            </>
          ) : (
            <>
              <RotateCcw className="w-6 h-6 stroke-[2.5]" aria-hidden="true" />
              <span>Phoenix Rebirth (Restart Run)</span>
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}
