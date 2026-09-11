"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { soundEngine } from "@/lib/soundEngine";
import { ShieldAlert, Wind, Droplets, Dumbbell, X, Check, Flame } from "lucide-react";

interface UrgePanicModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UrgePanicModal({ isOpen, onClose }: UrgePanicModalProps) {
  const [breathPhase, setBreathPhase] = useState<"Inhale" | "Hold" | "Exhale">("Inhale");
  const [seconds, setSeconds] = useState(4);
  const [actionDone, setActionDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isOpen) return;

    // 4-7-8 breathing loop
    let currentPhase: "Inhale" | "Hold" | "Exhale" = "Inhale";
    let timer = 4;

    const interval = setInterval(() => {
      timer -= 1;
      if (timer <= 0) {
        if (currentPhase === "Inhale") {
          currentPhase = "Hold";
          timer = 7;
        } else if (currentPhase === "Hold") {
          currentPhase = "Exhale";
          timer = 8;
        } else {
          currentPhase = "Inhale";
          timer = 4;
        }
        setBreathPhase(currentPhase);
      }
      setSeconds(timer);
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleAction = (key: string) => {
    soundEngine.playClick();
    setActionDone((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none text-white">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-md bg-[#1c120c] border-[5px] border-red-600 rounded-[36px] p-6 shadow-[0_16px_0_0_#991b1b,0_25px_40px_rgba(0,0,0,0.8)] text-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="panic-dialog-title"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          aria-label="Close emergency panic modal"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white focus-visible:ring-2 focus-visible:ring-red-400 outline-none"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Header */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950 border border-red-500/60 text-red-300 text-xs font-black uppercase tracking-widest mb-2">
          <ShieldAlert className="w-4 h-4 text-red-400 animate-pulse" aria-hidden="true" />
          <span>Urge Interceptor Active</span>
        </div>

        <h2 id="panic-dialog-title" className="text-2xl sm:text-3xl font-black text-amber-100 tracking-tight">
          Breathe & Hold The Line!
        </h2>
        <p className="text-xs text-amber-200/70 font-medium mt-1">
          The urge is only a temporary chemical wave in your brain. It peaks in 90 seconds, then collapses.
        </p>

        {/* Guided 4-7-8 Breathing Circle */}
        <div className="my-6 flex flex-col items-center justify-center">
          <motion.div
            animate={{
              scale: breathPhase === "Inhale" ? 1.25 : breathPhase === "Hold" ? 1.25 : 0.85,
            }}
            transition={{
              duration: breathPhase === "Inhale" ? 4 : breathPhase === "Hold" ? 7 : 8,
              ease: "easeInOut",
            }}
            className="w-32 h-32 rounded-full bg-gradient-to-tr from-game-orange to-red-500 border-4 border-amber-200 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(255,112,51,0.6)]"
          >
            <Wind className="w-7 h-7 text-white mb-1" aria-hidden="true" />
            <span className="text-sm font-black uppercase tracking-wider">{breathPhase}</span>
            <span className="text-2xl font-black tabular-nums">{seconds}s</span>
          </motion.div>
        </div>

        {/* Immediate Physical Distraction Checklist */}
        <div className="space-y-2 text-left mb-6">
          <span className="block text-[11px] font-black uppercase text-amber-200/80 tracking-wider">
            Execute Right Now (Check off):
          </span>

          {[
            { key: "water", icon: <Droplets className="w-4 h-4 text-blue-400" />, text: "Splash cold water on face / drink chilled water" },
            { key: "pushups", icon: <Dumbbell className="w-4 h-4 text-emerald-400" />, text: "Drop and do 15-20 pushups immediately" },
            { key: "room", icon: <Flame className="w-4 h-4 text-orange-400" />, text: "Stand up and walk out of the bedroom/room" },
          ].map((item) => {
            const checked = actionDone[item.key];
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => toggleAction(item.key)}
                className={`w-full p-3 rounded-2xl border-2 text-xs font-bold flex items-center gap-3 transition-all ${
                  checked
                    ? "bg-emerald-950/80 border-emerald-500 text-emerald-200"
                    : "bg-black/30 border-stone-800 text-stone-300 hover:border-stone-700"
                }`}
              >
                <span className="shrink-0">{item.icon}</span>
                <span className="flex-1 text-left">{item.text}</span>
                <div
                  className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                    checked ? "bg-emerald-500 border-emerald-400 text-white" : "border-stone-600"
                  }`}
                >
                  {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Defeat Urge Confirmation Button */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playWin();
            onClose();
          }}
          className="w-full py-3.5 px-6 rounded-3xl bg-gradient-to-r from-game-green to-emerald-500 hover:from-game-greenDark hover:to-emerald-600 text-white font-black text-base uppercase tracking-wider shadow-game-green active:translate-y-1 transition-all border-2 border-emerald-200 focus-visible:ring-3 focus-visible:ring-green-400 outline-none"
        >
          I Defeated The Urge! (Hold The Line)
        </button>
      </motion.div>
    </div>
  );
}
