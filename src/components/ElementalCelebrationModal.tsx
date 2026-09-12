"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { ElementalSkillId } from "@/types/game";
import { ELEMENTAL_SKILLS, getSkillGifUrl } from "@/lib/gameLogic";
import { soundEngine } from "@/lib/soundEngine";
import { useGame } from "@/context/GameContext";
import {
  Sparkles,
  Flame,
  Shield,
  ArrowRight,
  CheckCircle2,
  Trophy,
  RotateCcw,
  Zap,
} from "lucide-react";

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
  const { state, setActiveView } = useGame();
  const [replayKey, setReplayKey] = useState<number>(Date.now());

  const skill =
    ELEMENTAL_SKILLS.find((s) => s.id === skillId) ||
    ELEMENTAL_SKILLS.find((s) => s.id === state.profile.elementalSkill) ||
    ELEMENTAL_SKILLS[0];

  const genderFolder = state.profile.gender === "female" ? "girls" : "boys";
  const gifUrl = getSkillGifUrl(skill.name, genderFolder);

  useEffect(() => {
    if (isOpen) {
      soundEngine.playLevelUp();
      setTimeout(() => {
        soundEngine.playSkillActivate(skill.id);
      }, 300);

      // Trigger victory confetti burst
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.55 },
          colors: ["#f59e0b", "#ef4444", "#10b981", "#3b82f6", "#ec4899", "#8b5cf6"],
        });
      } catch {
        // Safe fallback
      }
    }
  }, [isOpen, skill.id]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md select-none overflow-y-auto">
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

        {/* Floating Elemental Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {Array.from({ length: 20 }).map((_, i) => {
            const particle = skill.particles[i % skill.particles.length];
            const startX = (i * 19) % 100;
            const delay = (i * 0.12) % 1.5;
            const duration = 2.2 + ((i * 0.25) % 2);

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
          initial={{ scale: 0.75, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 24 }}
          className="relative z-10 w-full max-w-lg bg-[#180f0a] border-4 border-amber-600/90 rounded-3xl p-5 sm:p-7 shadow-[0_15px_50px_rgba(0,0,0,0.9)] text-stone-100 text-center flex flex-col items-center my-auto"
        >
          {/* Top Congratulatory Banner */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/25 via-orange-500/20 to-amber-500/25 border border-amber-400/50 text-amber-300 text-xs font-black uppercase tracking-widest mb-3 shadow-inner">
            <Trophy className="w-3.5 h-3.5 text-yellow-400" />
            <span>🎉 Day {streakDays} Completed! Congratulations!</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-white to-orange-200 font-serif leading-tight">
            {skill.name} Awakened!
          </h3>

          <p className="text-xs sm:text-sm text-amber-200/90 font-medium mt-1 max-w-sm">
            Sensational willpower, <strong className="text-white font-bold">{state.profile.name || "Warrior"}</strong>! You crushed your urge triggers today and protected your soul.
          </p>

          {/* Animated Skill Battle Avatar GIF Stage */}
          <div className="relative my-4 flex flex-col items-center">
            {/* Ambient Background Aura Glow */}
            <div
              className="w-48 h-48 sm:w-56 sm:h-56 rounded-3xl blur-2xl opacity-40 absolute top-0 pointer-events-none"
              style={{ backgroundColor: skill.color }}
            />

            {/* Avatar Frame with GIF */}
            <div
              className="w-44 h-44 sm:w-52 sm:h-52 rounded-3xl bg-black/70 border-3 flex items-center justify-center p-2 relative shadow-[0_0_35px_rgba(245,158,11,0.4)] overflow-hidden"
              style={{ borderColor: skill.color }}
            >
              <img
                key={`${skill.id}-${genderFolder}-${replayKey}`}
                src={gifUrl}
                alt={`${skill.name} battle avatar animation`}
                className="w-full h-full object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.9)]"
              />

              {/* Top Live Playing Badge */}
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/80 border border-white/20 text-[9px] font-black text-amber-300 flex items-center gap-1 backdrop-blur-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="uppercase">{skill.badge} GIF</span>
              </div>

              {/* Replay Button */}
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setReplayKey(Date.now());
                }}
                className="absolute bottom-2 right-2 p-1.5 rounded-xl bg-black/75 hover:bg-black/95 text-amber-300 border border-white/20 transition-all active:scale-95 cursor-pointer shadow-md"
                title="Restart Animation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Avatar Skill Specialty Pill */}
            <div className="mt-2 text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <span>{skill.icon}</span>
              <span>{skill.name} ({genderFolder === "girls" ? "Female" : "Male"} Avatar)</span>
              <span className="text-stone-400">·</span>
              <span className="text-stone-300">{skill.tag}</span>
            </div>
          </div>

          {/* Willpower Combat Perk Box */}
          <div className="w-full p-2.5 sm:p-3 mb-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border border-amber-400/40 text-left">
            <div className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Active Discipline Perk Triggered</span>
            </div>
            <div className="text-xs font-bold text-white mt-0.5">
              {skill.perk}
            </div>
          </div>

          {/* Rewards & Streak Breakdown */}
          <div className="w-full grid grid-cols-3 gap-2 sm:gap-2.5 mb-4">
            {/* XP Earned */}
            <div className="p-2 sm:p-2.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                XP Earned
              </span>
              <span className="text-base sm:text-lg font-black text-white tabular-nums">
                +{xpEarned}
              </span>
            </div>

            {/* HP Delta */}
            <div className="p-2 sm:p-2.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
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
            <div className="p-2 sm:p-2.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-400">
                Day Streak
              </span>
              <span className="text-base sm:text-lg font-black text-amber-200 flex items-center gap-1 tabular-nums">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span>{streakDays}</span>
              </span>
            </div>
          </div>

          {/* Lock-In Notice */}
          <div className="w-full p-2 mb-4 rounded-xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center gap-1.5 text-xs font-bold text-amber-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Today&apos;s 7 Urge Questions Locked In until Midnight</span>
          </div>

          {/* Dual Action Buttons */}
          <div className="w-full flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-game-orange via-amber-500 to-game-orangeDark hover:from-amber-500 hover:to-orange-600 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_4px_15px_rgba(249,115,22,0.5)] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 border border-amber-300/50 cursor-pointer"
            >
              <span>Continue Quest</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onClose();
                setActiveView("skills");
              }}
              className="py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-stone-200 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Skills Dojo</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
