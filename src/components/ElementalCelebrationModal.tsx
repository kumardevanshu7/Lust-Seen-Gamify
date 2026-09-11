"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ElementalSkillId } from "@/types/game";
import { ELEMENTAL_SKILLS } from "@/lib/gameLogic";
import { soundEngine } from "@/lib/soundEngine";
import { Sparkles, Flame, Shield, ArrowRight, CheckCircle2 } from "lucide-react";

interface ElementalCelebrationModalProps {
  isOpen: boolean;
  skillId: ElementalSkillId;
  xpEarned: number;
  hpDelta: number;
  isClean: boolean;
  streakDays: number;
  onClose: () => void;
}

export function ElementalCelebrationModal({
  isOpen,
  skillId,
  xpEarned,
  hpDelta,
  isClean,
  streakDays,
  onClose,
}: ElementalCelebrationModalProps) {
  const skill = ELEMENTAL_SKILLS.find((s) => s.id === skillId) || ELEMENTAL_SKILLS[0];

  useEffect(() => {
    if (isOpen) {
      soundEngine.playSkillActivate(skill.id);
      setTimeout(() => {
        soundEngine.playLevelUp();
      }, 250);
    }
  }, [isOpen, skill.id]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none overflow-hidden">
        {/* Ambient Elemental Glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: [0.8, 1.4, 1.1], opacity: [0, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            className={`w-[450px] h-[450px] rounded-full blur-[110px] ${
              skill.id === "fire" || skill.id === "dragon"
                ? "bg-orange-600/40"
                : skill.id === "aqua" || skill.id === "frost"
                ? "bg-cyan-500/40"
                : skill.id === "lightning" || skill.id === "light"
                ? "bg-amber-400/40"
                : skill.id === "wind"
                ? "bg-emerald-500/40"
                : skill.id === "shadow"
                ? "bg-purple-950/60"
                : "bg-purple-600/40"
            }`}
          />
        </div>

        {/* 20 Floating Elemental Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {Array.from({ length: 24 }).map((_, i) => {
            const particle = skill.particles[i % skill.particles.length];
            const startX = (i * 17) % 100;
            const delay = (i * 0.1) % 1.5;
            const duration = 2 + ((i * 0.3) % 2);

            return (
              <motion.div
                key={i}
                initial={{
                  x: `${startX}vw`,
                  y: "110vh",
                  opacity: 0,
                  scale: 0.5,
                  rotate: 0,
                }}
                animate={{
                  y: "-10vh",
                  opacity: [0, 1, 1, 0],
                  scale: [0.5, 1.3, 0.8],
                  rotate: i % 2 === 0 ? 180 : -180,
                }}
                transition={{
                  duration,
                  delay,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
                className="absolute text-xl sm:text-2xl"
              >
                {particle}
              </motion.div>
            );
          })}
        </div>

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 22 }}
          className="relative z-10 w-full max-w-md bg-[#180f0a] border-4 border-amber-600/80 rounded-3xl p-6 sm:p-7 shadow-[0_10px_40px_rgba(0,0,0,0.8)] text-stone-100 text-center flex flex-col items-center"
        >
          {/* Animated Elemental Crest */}
          <div className="relative mb-3 flex items-center justify-center">
            {/* Spinning Aura Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 rounded-full border-2 border-dashed border-amber-400/60 absolute"
            />
            {/* Pulsing Aura Circle */}
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className={`w-20 h-20 rounded-2xl bg-gradient-to-tr ${skill.gradient} flex items-center justify-center text-4xl shadow-[0_0_25px_rgba(245,158,11,0.5)] border-2 border-white/60`}
            >
              {skill.icon}
            </motion.div>
          </div>

          {/* Elemental Class Activation Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] font-black uppercase tracking-widest mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Elemental Discipline Unleashed</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-orange-200 font-serif leading-none mt-1">
              {skill.name} Aura!
            </h3>

            <p className="text-xs text-amber-200/80 font-medium mt-1.5 max-w-xs">
              Today&apos;s 7 Urge Questions Locked In. Specialty: <strong>{skill.tag}</strong>!
            </p>
          </motion.div>

          {/* Rewards & Streak Breakdown */}
          <div className="w-full grid grid-cols-3 gap-2.5 my-5">
            {/* XP Earned */}
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                XP Earned
              </span>
              <span className="text-base sm:text-lg font-black text-white tabular-nums">
                +{xpEarned}
              </span>
            </div>

            {/* HP Delta */}
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                HP Change
              </span>
              <span
                className={`text-base sm:text-lg font-black tabular-nums ${
                  hpDelta >= 0 ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {hpDelta >= 0 ? `+${hpDelta}` : hpDelta}
              </span>
            </div>

            {/* Streak */}
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-400">
                Day Streak
              </span>
              <span className="text-base sm:text-lg font-black text-amber-200 flex items-center gap-1 tabular-nums">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span>{streakDays}</span>
              </span>
            </div>
          </div>

          {/* Read-Only Notice */}
          <div className="w-full p-2.5 mb-5 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center gap-2 text-xs font-bold text-amber-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Today&apos;s answers locked until 12:00 AM Midnight</span>
          </div>

          {/* Dismiss CTA Button */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-game-orange via-amber-500 to-game-orangeDark hover:from-amber-500 hover:to-orange-600 text-white font-black text-sm uppercase tracking-wider shadow-[0_4px_15px_rgba(249,115,22,0.5)] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 border border-amber-300/50 cursor-pointer"
          >
            <span>Continue Willpower Quest</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
