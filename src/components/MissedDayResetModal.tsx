"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { soundEngine } from "@/lib/soundEngine";
import { AlertTriangle, Flame, ShieldAlert, Sparkles, X, Heart } from "lucide-react";

export function MissedDayResetModal() {
  const { missedDayCountdown, drinkReviveElixir, state } = useGame();

  const hasElixir = (state.inventory["revive_elixir"] || 0) > 0;
  const elixirCount = state.inventory["revive_elixir"] || 0;

  // Pulse alert tick on countdown changes
  useEffect(() => {
    if (missedDayCountdown !== null && missedDayCountdown > 0) {
      soundEngine.playDamage();
    }
  }, [missedDayCountdown]);

  if (missedDayCountdown === null) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 select-none font-sans">
        {/* Pulsating Red Vignette & Dark Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Outer Red Hazard Glow */}
        <div
          aria-hidden="true"
          className="fixed inset-0 bg-gradient-to-t from-red-950/80 via-rose-950/40 to-transparent pointer-events-none animate-pulse"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 25 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 25 }}
          className="relative w-full max-w-lg bg-gradient-to-b from-[#2b0707] via-[#1a0404] to-[#0d0101] border-3 border-red-600 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(225,29,72,0.8)] text-center text-white space-y-5 overflow-hidden z-10"
        >
          {/* Top Warning Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/30 border border-red-500/60 text-red-300 text-xs font-black uppercase tracking-widest animate-bounce">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>12:00 AM Check-In Missed</span>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-200 via-rose-300 to-amber-200 uppercase tracking-wide">
              Disciplinary Doom Countdown
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-medium">
              You failed to complete your daily log before midnight. When the timer reaches 0, your entire progress will reset to Level 1!
            </p>
          </div>

          {/* Giant Countdown Clock */}
          <div className="py-2 flex items-center justify-center">
            <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-red-950/80 border-4 border-red-500/80 flex flex-col items-center justify-center shadow-[0_0_35px_rgba(239,68,68,0.6)] animate-pulse">
              <span className="text-5xl sm:text-6xl font-black font-mono text-red-200 tabular-nums">
                {missedDayCountdown}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-red-400 mt-1">
                Seconds Left
              </span>
            </div>
          </div>

          {/* Action Section */}
          <div className="space-y-3 pt-2">
            {hasElixir ? (
              <button
                type="button"
                onClick={() => {
                  const res = drinkReviveElixir();
                  if (res.success) {
                    soundEngine.playWin();
                  }
                }}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-base sm:text-lg uppercase tracking-wider shadow-[0_6px_0_0_#065f46] active:translate-y-1 transition-all flex items-center justify-center gap-3 border-2 border-emerald-300/60 cursor-pointer animate-pulse"
              >
                <span className="text-2xl">🏺</span>
                <div className="text-left">
                  <div className="leading-tight">DRINK REVIVE ELIXIR</div>
                  <div className="text-[11px] text-emerald-200 font-normal">
                    Available: {elixirCount} · Aborts countdown & restores 100% HP
                  </div>
                </div>
              </button>
            ) : (
              <div className="p-3.5 rounded-2xl bg-red-950/50 border border-red-700/50 text-xs text-red-200 space-y-1">
                <div className="font-black text-sm text-red-300 flex items-center justify-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  <span>No Revive Elixir in Inventory!</span>
                </div>
                <p className="text-stone-300 text-[11px]">
                  Revive Elixirs are available in the Bazaar at every 10th level (Lv. 10, 20, 30...) to protect against disciplinary resets.
                </p>
              </div>
            )}

            <p className="text-[11px] font-mono text-stone-400">
              Disciplinary policy: Missed days result in complete level & streak loss unless averted with a Revive Elixir.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
