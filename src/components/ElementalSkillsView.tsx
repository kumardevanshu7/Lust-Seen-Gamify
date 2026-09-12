"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { ELEMENTAL_SKILLS, getSkillGifUrl } from "@/lib/gameLogic";
import { soundEngine } from "@/lib/soundEngine";
import { ElementalSkill, ElementalSkillId } from "@/types/game";
import {
  Zap,
  Play,
  RotateCcw,
  Sparkles,
  Shield,
  CheckCircle2,
  ShoppingBag,
  Flame,
  Info,
  ChevronRight,
} from "lucide-react";

export function ElementalSkillsView() {
  const { state, setActiveView } = useGame();

  // Gender toggle: default to user's registered gender, allow instant switching
  const initialGender = state.profile.gender === "female" ? "girls" : "boys";
  const [gender, setGender] = useState<"boys" | "girls">(initialGender);

  // Selected skill to inspect and play: default to user's chosen skill
  const currentSkillId = state.profile.elementalSkill || "fire";
  const [selectedSkillId, setSelectedSkillId] = useState<ElementalSkillId>(currentSkillId);

  // Key to force GIF re-render / replay animation from frame 0
  const [replayKey, setReplayKey] = useState<number>(Date.now());
  const spotlightRef = useRef<HTMLDivElement>(null);

  const selectedSkill =
    ELEMENTAL_SKILLS.find((s) => s.id === selectedSkillId) || ELEMENTAL_SKILLS[0];

  const handleSelectSkill = (skill: ElementalSkill) => {
    soundEngine.playLevelUp();
    setSelectedSkillId(skill.id);
    setReplayKey(Date.now());

    // On mobile, scroll smoothly up to the spotlight stage
    if (window.innerWidth < 640 && spotlightRef.current) {
      spotlightRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleGenderToggle = (newGender: "boys" | "girls") => {
    if (newGender === gender) return;
    soundEngine.playToggle(newGender === "boys");
    setGender(newGender);
    setReplayKey(Date.now());
  };

  const handleReplay = () => {
    soundEngine.playClick();
    setReplayKey(Date.now());
  };

  const isCurrentEquipped = state.profile.elementalSkill === selectedSkill.id;
  const currentGifUrl = getSkillGifUrl(selectedSkill.name, gender);

  return (
    <div className="space-y-5 select-none pb-8">
      {/* ── 1. TOP HEADER BANNER ── */}
      <div className="bg-[#fffbf0] border-4 border-game-border rounded-3xl p-4 sm:p-6 shadow-game-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-950 text-xs font-black uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-game-orange" aria-hidden="true" />
              <span>Avatar Battle Dojo · 10 Elemental Skills</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-game-dark mt-1 flex items-center gap-2">
              <span>Elemental Disciplines & Battle GIFs</span>
            </h2>
            <p className="text-xs sm:text-sm font-medium text-stone-600 max-w-2xl">
              Each discipline channels unique neuroscience willpower perks to shatter urges. Click any skill below to awaken and play its animated avatar GIF!
            </p>
          </div>

          {/* Gender Switcher Capsule */}
          <div className="flex items-center self-start sm:self-center bg-[#23130a] p-1 rounded-2xl border-2 border-[#54301a] shadow-inner shrink-0">
            <button
              type="button"
              onClick={() => handleGenderToggle("boys")}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                gender === "boys"
                  ? "bg-gradient-to-r from-game-orange to-amber-500 text-white shadow-game-sm ring-1 ring-amber-300"
                  : "text-amber-200/70 hover:text-white"
              }`}
            >
              <span>🥋 Boys (10)</span>
            </button>
            <button
              type="button"
              onClick={() => handleGenderToggle("girls")}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                gender === "girls"
                  ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-game-sm ring-1 ring-pink-300"
                  : "text-amber-200/70 hover:text-white"
              }`}
            >
              <span>🌸 Girls (10)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. FEATURED HERO SPOTLIGHT & LIVE GIF PLAYER ── */}
      <div
        ref={spotlightRef}
        className="rounded-3xl bg-gradient-to-b from-[#24130a] via-[#1b0e07] to-[#140b06] border-4 border-amber-900/60 p-4 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-white relative overflow-hidden"
      >
        {/* Ambient Elemental Background Aura */}
        <div
          aria-hidden="true"
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-[100px] opacity-35 pointer-events-none transition-colors duration-700"
          style={{ backgroundColor: selectedSkill.color }}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          {/* Left: HD GIF Animation Stage */}
          <div className="relative shrink-0 flex flex-col items-center">
            {/* Glowing Bordered Frame */}
            <div
              className="w-56 h-56 sm:w-64 sm:h-64 rounded-3xl bg-black/60 border-3 flex items-center justify-center p-3 relative shadow-[0_15px_35px_rgba(0,0,0,0.7)] group overflow-hidden"
              style={{ borderColor: selectedSkill.color }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={`${selectedSkill.id}-${gender}-${replayKey}`}
                  src={currentGifUrl}
                  alt={`${selectedSkill.name} battle avatar`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.9)]"
                />
              </AnimatePresence>

              {/* Top Corner Playing Pill */}
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/80 border border-white/20 text-[10px] font-black text-amber-300 flex items-center gap-1 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="uppercase">Animated GIF</span>
              </div>

              {/* Replay Button Overlay */}
              <button
                type="button"
                onClick={handleReplay}
                aria-label="Replay animation"
                className="absolute bottom-2.5 right-2.5 p-2 rounded-xl bg-black/70 hover:bg-black/90 border border-white/25 text-white shadow-md active:scale-95 transition-all cursor-pointer backdrop-blur-md"
                title="Restart GIF animation"
              >
                <RotateCcw className="w-4 h-4 text-amber-300" />
              </button>
            </div>

            {/* Avatar Gender Label */}
            <div className="mt-2.5 flex items-center gap-1.5 text-xs font-bold text-stone-300 font-mono">
              <span>{gender === "boys" ? "🥋 Male Warrior Avatar" : "🌸 Female Warrior Avatar"}</span>
            </div>
          </div>

          {/* Right: Skill Lore, Combat Perk & Details */}
          <div className="flex-1 min-w-0 space-y-3.5 text-center md:text-left">
            {/* Header info */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-black uppercase tracking-wider mb-2">
                <span className="text-base">{selectedSkill.icon}</span>
                <span className="text-amber-300">{selectedSkill.badge} Element</span>
                <span className="text-stone-400">·</span>
                <span className="text-stone-200">{selectedSkill.tag}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center md:justify-start gap-2">
                <span>{selectedSkill.name}</span>
                {isCurrentEquipped && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-black uppercase tracking-wide">
                    ✓ Your Chosen Discipline
                  </span>
                )}
              </h3>

              <p className="text-xs sm:text-sm text-stone-300 font-medium mt-1 leading-relaxed">
                {selectedSkill.description}
              </p>
            </div>

            {/* Willpower Combat Perk Card */}
            <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border-2 border-amber-500/40 text-left">
              <div className="text-[11px] font-black uppercase tracking-widest text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Special Willpower Combat Perk</span>
              </div>
              <div className="text-xs sm:text-sm font-black text-white mt-1">
                {selectedSkill.perk}
              </div>
            </div>

            {/* Particle Auras & Tags */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
              <span className="text-xs font-bold text-stone-400">Elemental Aura:</span>
              {selectedSkill.particles.map((p, idx) => (
                <span
                  key={idx}
                  className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-sm shadow-inner"
                >
                  {p}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              {isCurrentEquipped ? (
                <div className="px-4 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-black uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Equipped & Channeling Chakra</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setActiveView("store");
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-game-orange to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-game-sm active:scale-95 transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Respec Discipline in Bazaar</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleReplay}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-stone-200 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>Play Animation</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. 10 SKILLS INTERACTIVE SELECTION GRID ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="text-xs font-black uppercase tracking-widest text-amber-950 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-game-orange" />
            <span>Select Any Skill to Play Battle GIF (10 Total)</span>
          </div>
          <span className="text-[11px] font-bold text-stone-500 font-mono">
            Showing {gender === "boys" ? "Boys" : "Girls"}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {ELEMENTAL_SKILLS.map((skill) => {
            const isSelected = skill.id === selectedSkillId;
            const isEquipped = skill.id === state.profile.elementalSkill;
            const skillGif = getSkillGifUrl(skill.name, gender);

            return (
              <motion.button
                key={skill.id}
                type="button"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSelectSkill(skill)}
                className={`p-3 rounded-2xl border-3 text-left transition-all relative flex flex-col justify-between overflow-hidden cursor-pointer shadow-game-sm ${
                  isSelected
                    ? "bg-[#25140b] text-white border-amber-400 ring-3 ring-amber-400/40 shadow-game-md"
                    : "bg-[#fffbf0] hover:bg-amber-50/70 text-game-dark border-game-border"
                }`}
              >
                {/* Active Player Skill Badge */}
                {isEquipped && (
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wide z-10 shadow-sm">
                    Mine
                  </span>
                )}

                {/* Animated Mini Thumbnail Preview */}
                <div className="w-full aspect-square rounded-xl bg-black/40 border border-white/10 p-1.5 flex items-center justify-center mb-2 relative overflow-hidden group">
                  <img
                    src={skillGif}
                    alt={skill.name}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                  {/* Subtle Play Overlay */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Play className="w-5 h-5 text-amber-300 fill-amber-300 drop-shadow" />
                  </div>
                </div>

                {/* Skill Title & Details */}
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{skill.icon}</span>
                    <span
                      className={`font-black text-xs truncate ${
                        isSelected ? "text-amber-200" : "text-game-dark"
                      }`}
                    >
                      {skill.name}
                    </span>
                  </div>

                  <div
                    className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 truncate ${
                      isSelected ? "text-stone-300" : "text-stone-500"
                    }`}
                  >
                    {skill.tag}
                  </div>

                  {/* Play Action Prompt */}
                  <div
                    className={`mt-2 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                      isSelected ? "text-amber-300" : "text-game-orange"
                    }`}
                  >
                    <Play className="w-2.5 h-2.5 fill-current" />
                    <span>{isSelected ? "Now Playing" : "Play GIF"}</span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
