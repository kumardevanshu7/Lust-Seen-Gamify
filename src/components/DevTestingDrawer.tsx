"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { soundEngine } from "@/lib/soundEngine";
import { Wrench, ChevronDown, ChevronUp, Zap, Heart, Clock, Trophy, Users, Skull, RotateCcw } from "lucide-react";

export function DevTestingDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    state,
    devAddXp,
    devDamageHp,
    devHealHp,
    devSetLevel,
    devTriggerMidnightReset,
  } = useGame();

  return (
    <div className="fixed bottom-20 right-3 z-40 select-none">
      {/* Trigger Pill */}
      <button
        type="button"
        onClick={() => {
          soundEngine.playClick();
          setIsOpen(!isOpen);
        }}
        aria-label="Toggle game testing and simulation drawer"
        className="px-3 py-1.5 rounded-full bg-stone-900/90 hover:bg-stone-900 text-amber-300 border border-amber-400/40 text-xs font-black flex items-center gap-1.5 shadow-lg backdrop-blur-sm transition-all focus-visible:ring-2 focus-visible:ring-amber-400 outline-none"
      >
        <Wrench className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Dev Simulation Drawer</span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </button>

      {/* Expanded Control Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-10 right-0 w-72 p-4 bg-[#24150e] border-3 border-amber-600/60 rounded-3xl text-white shadow-2xl text-xs space-y-2.5"
          >
            <div className="flex items-center justify-between pb-2 border-b border-amber-900">
              <span className="font-black text-amber-300 uppercase tracking-wider">
                Instant Game Sim
              </span>
              <span className="text-[10px] text-stone-400 font-mono">
                Lvl {state.level} • HP {state.hp}
              </span>
            </div>

            {/* Quick Level Jumpers */}
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => devSetLevel(10)}
                className="p-2 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/50 font-black text-amber-200 flex items-center justify-center gap-1 transition-colors"
              >
                <Trophy className="w-3 h-3" />
                <span>Jump Lvl 10</span>
              </button>
              <button
                type="button"
                onClick={() => devSetLevel(15)}
                className="p-2 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/50 font-black text-blue-200 flex items-center justify-center gap-1 transition-colors"
              >
                <Users className="w-3 h-3" />
                <span>Jump Lvl 15</span>
              </button>
            </div>

            {/* XP and HP controls */}
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => devAddXp(80)}
                className="p-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/50 font-black text-emerald-200 flex items-center justify-center gap-1 transition-colors"
              >
                <Zap className="w-3 h-3" />
                <span>+80 XP</span>
              </button>
              <button
                type="button"
                onClick={() => devHealHp(30)}
                className="p-2 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 border border-rose-500/50 font-black text-rose-200 flex items-center justify-center gap-1 transition-colors"
              >
                <Heart className="w-3 h-3" />
                <span>+30 HP Heal</span>
              </button>
            </div>

            {/* Damage and Game Over Simulators */}
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => devDamageHp(35)}
                className="p-2 rounded-xl bg-red-800/40 hover:bg-red-800/60 border border-red-500/50 font-black text-red-200 flex items-center justify-center gap-1 transition-colors"
              >
                <Heart className="w-3 h-3" />
                <span>-35 HP Hit</span>
              </button>
              <button
                type="button"
                onClick={() => devDamageHp(state.hp)}
                className="p-2 rounded-xl bg-red-950 hover:bg-red-900 border border-red-600 font-black text-red-300 flex items-center justify-center gap-1 transition-colors"
              >
                <Skull className="w-3 h-3" />
                <span>HP = 0 Over</span>
              </button>
            </div>

            {/* Midnight Reset Simulator */}
            <button
              type="button"
              onClick={devTriggerMidnightReset}
              className="w-full p-2.5 rounded-xl bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-600 hover:to-orange-600 text-white font-black flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Simulate 12:00 AM Missed Day</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
