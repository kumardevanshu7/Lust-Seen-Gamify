"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { ELEMENTAL_SKILLS, getXpRequiredForLevel, getMaxHpForLevel, getSkillGifUrl } from "@/lib/gameLogic";
import { soundEngine } from "@/lib/soundEngine";
import {
  X,
  Lock,
  Flame,
  Zap,
  Coins,
  Heart,
  Shield,
  Sparkles,
  Award,
  ChevronRight,
  CheckCircle2,
  Crown,
  Compass,
  Play,
  RotateCcw,
} from "lucide-react";
import { ElementalSkillId } from "@/types/game";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 5 Skill Progression Tiers with level ranges and unlocked mastery perks
export const SKILL_PROGRESSION_TIERS = [
  {
    tier: 1,
    name: "Novice",
    minLevel: 1,
    maxLevel: 5,
    tag: "Initiate Will",
    perk: "Basic urge deflection, unlocks Daily 7 Log & Zen Coins collection.",
    badgeColor: "from-stone-500 to-stone-600",
    glowColor: "rgba(120, 113, 108, 0.4)",
  },
  {
    tier: 2,
    name: "Adept",
    minLevel: 6,
    maxLevel: 15,
    tag: "Elemental Armor",
    perk: "+15 Max HP, unlocks RPG Store Potions & Streak Shield activations.",
    badgeColor: "from-blue-600 to-indigo-600",
    glowColor: "rgba(59, 130, 246, 0.4)",
  },
  {
    tier: 3,
    name: "Master",
    minLevel: 16,
    maxLevel: 30,
    tag: "Zen Aura",
    perk: "+25% XP multiplier, unlocks custom Urge Bucket questions & Anime Clan Raids.",
    badgeColor: "from-purple-600 to-violet-700",
    glowColor: "rgba(168, 85, 247, 0.4)",
  },
  {
    tier: 4,
    name: "Grandmaster",
    minLevel: 31,
    maxLevel: 50,
    tag: "Overdrive Mind",
    perk: "Double Willpower Chakra sharing with Comrades & Death Note Guild Strike immunity.",
    badgeColor: "from-amber-500 to-orange-600",
    glowColor: "rgba(245, 158, 11, 0.4)",
  },
  {
    tier: 5,
    name: "Archon Sovereign",
    minLevel: 51,
    maxLevel: 100,
    tag: "Immortal Will",
    perk: "Legendary God Aura, auto-healing Phoenix Rebirth upon critical relapse trigger.",
    badgeColor: "from-emerald-500 to-teal-600",
    glowColor: "rgba(16, 185, 129, 0.4)",
  },
];

export function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
  const { state } = useGame();
  const [activeTab, setActiveTab] = useState<"profile" | "skills">("profile");
  const [selectedSkillPreview, setSelectedSkillPreview] = useState<ElementalSkillId>(
    state.profile.elementalSkill || "fire"
  );
  const currentSkill =
    ELEMENTAL_SKILLS.find((s) => s.id === state.profile.elementalSkill) || ELEMENTAL_SKILLS[0];
  const previewSkillObj =
    ELEMENTAL_SKILLS.find((s) => s.id === selectedSkillPreview) || currentSkill;
  const initialGender = state.profile.gender === "female" ? "girls" : "boys";
  const [genderPreview, setGenderPreview] = useState<"boys" | "girls">(initialGender);
  const [previewReplayKey, setPreviewReplayKey] = useState<number>(Date.now());

  // Determine current tier from level
  const currentTier =
    SKILL_PROGRESSION_TIERS.find(
      (t) => state.level >= t.minLevel && state.level <= t.maxLevel
    ) || SKILL_PROGRESSION_TIERS[SKILL_PROGRESSION_TIERS.length - 1];

  const nextTier = SKILL_PROGRESSION_TIERS.find((t) => t.tier === currentTier.tier + 1);

  // Tier progress percentage
  const tierRange = currentTier.maxLevel - currentTier.minLevel + 1;
  const currentProgressInTier = Math.max(0, state.level - currentTier.minLevel);
  const tierPercent = Math.min(100, Math.round((currentProgressInTier / tierRange) * 100));

  const relationshipLabel =
    state.profile.relationship === "single"
      ? "Single Warrior"
      : state.profile.relationship === "married"
      ? "Married Companion"
      : "Imaginary Spouse";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto select-none">
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="w-full max-w-xl bg-[#fdfbf7] border-4 border-game-border rounded-3xl p-4 sm:p-6 shadow-game-card text-game-dark relative my-auto max-h-[92vh] overflow-y-auto"
          >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            aria-label="Close warrior profile"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors cursor-pointer z-20 shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Banner */}
          <div className="flex items-center gap-2 mb-4">
            <span className="p-1.5 rounded-xl bg-amber-100 border border-amber-300 text-game-orange shadow-game-sm">
              <Crown className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-game-dark">
                Warrior Dossier
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                Identity, permanent registration & skill mastery ranges
              </p>
            </div>
          </div>

          {/* Sub-Tab Navigation */}
          <div className="flex bg-stone-200/80 p-1 rounded-2xl mb-4 border border-stone-300">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setActiveTab("profile");
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "profile"
                  ? "bg-game-orange text-white shadow-game-sm"
                  : "text-stone-700 hover:text-stone-900 cursor-pointer"
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Warrior Card</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setActiveTab("skills");
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "skills"
                  ? "bg-game-orange text-white shadow-game-sm"
                  : "text-stone-700 hover:text-stone-900 cursor-pointer"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Skill Ranges & Codex</span>
            </button>
          </div>

          {/* TAB 1: WARRIOR PROFILE & ATTRIBUTES */}
          {activeTab === "profile" && (
            <div className="space-y-4">
              {/* Profile Card Header */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/80 border-3 border-amber-200/90 shadow-game-sm relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  {/* Large Avatar with Elemental Badge */}
                  <div className="relative shrink-0">
                    <div
                      className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-game-md border-3 border-white ring-4 ring-amber-300"
                      style={{ backgroundColor: currentSkill.color }}
                    >
                      {currentSkill.icon}
                    </div>
                    <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-game-orange text-white text-[11px] font-black border-2 border-white shadow-game-sm">
                      Lv.{state.level}
                    </div>
                  </div>

                  {/* Name & Permanent Username */}
                  <div className="flex-1 text-center sm:text-left min-w-0">
                    <div className="text-xl sm:text-2xl font-black text-game-dark truncate">
                      {state.profile.name || "Nameless Warrior"}
                    </div>

                    {/* Permanent Username Badge */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-900 text-amber-300 font-mono font-bold text-xs mt-1 border border-amber-400/40 shadow-inner">
                      <Lock className="w-3 h-3 text-amber-400" />
                      <span>{state.profile.username || "@warrior"}</span>
                      <span className="text-[10px] uppercase font-sans text-amber-200/70 ml-1">
                        (Locked)
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 mt-2.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold flex items-center gap-1">
                        <span>{currentSkill.icon}</span>
                        <span>{currentSkill.name}</span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-300 text-[11px] font-bold">
                        {relationshipLabel}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200 text-[11px] font-bold">
                        {state.profile.title || "Path of Willpower"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Permanent Username Immutable Explanatory Bar */}
                <div className="mt-4 pt-3 border-t border-amber-200/80 flex items-center gap-2 text-[11px] text-stone-600 font-medium">
                  <Lock className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                  <span>
                    Your handle <strong className="font-mono text-stone-900">{state.profile.username}</strong> is permanently bonded to your soul and cannot be altered.
                  </span>
                </div>
              </div>

              {/* Core Attributes Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* Streak */}
                <div className="p-3 rounded-2xl bg-white border-2 border-stone-200 shadow-game-sm text-center">
                  <Flame className="w-5 h-5 text-game-orange mx-auto mb-1" />
                  <div className="text-lg font-black text-game-dark tabular-nums">
                    {state.streakDays} <span className="text-xs font-bold text-stone-500">Days</span>
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Streak (Best: {state.bestStreakDays})
                  </div>
                </div>

                {/* Level & Tier */}
                <div className="p-3 rounded-2xl bg-white border-2 border-stone-200 shadow-game-sm text-center">
                  <Crown className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                  <div className="text-lg font-black text-game-dark tabular-nums">
                    {currentTier.name}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Tier {currentTier.tier} (Lv.{state.level})
                  </div>
                </div>

                {/* Coins */}
                <div className="p-3 rounded-2xl bg-white border-2 border-stone-200 shadow-game-sm text-center">
                  <Coins className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
                  <div className="text-lg font-black text-game-dark tabular-nums">
                    {state.coins}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Zen Coins
                  </div>
                </div>

                {/* Health HP */}
                <div className="p-3 rounded-2xl bg-white border-2 border-stone-200 shadow-game-sm text-center">
                  <Heart className="w-5 h-5 text-rose-500 mx-auto mb-1" />
                  <div className="text-lg font-black text-game-dark tabular-nums">
                    {state.hp}/{state.maxHp}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Willpower HP
                  </div>
                </div>
              </div>

              {/* Progress to Next Tier Bar */}
              <div className="p-4 rounded-2xl bg-white border-2 border-stone-200 shadow-game-sm space-y-2">
                <div className="flex items-center justify-between text-xs font-black text-game-dark">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-game-orange" />
                    <span>Progression in {currentTier.name} Range</span>
                  </div>
                  <span className="text-stone-500 tabular-nums">
                    {state.level} / {currentTier.maxLevel} (Next Tier at Lv.{currentTier.maxLevel + 1})
                  </span>
                </div>

                <div className="w-full bg-stone-100 rounded-full h-3.5 overflow-hidden p-0.5 border border-stone-300">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-game-orange to-amber-500 transition-all duration-500 shadow-sm"
                    style={{ width: `${tierPercent}%` }}
                  />
                </div>

                <p className="text-[11px] text-stone-500 font-medium">
                  {nextTier
                    ? `Level up ${currentTier.maxLevel - state.level + 1} more times to unlock Tier ${nextTier.tier} (${nextTier.name}) perks!`
                    : "You have attained the legendary Archon Sovereign tier!"}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: SKILL LEVEL RANGES & 10 DISCIPLINES CODEX */}
          {activeTab === "skills" && (
            <div className="space-y-4">
              {/* Skill Progression Tiers List (Novice -> Archon) */}
              <div className="space-y-2">
                <div className="text-xs font-black uppercase tracking-wider text-stone-700 flex items-center justify-between">
                  <span>Elemental Skill Mastery Ranges</span>
                  <span className="text-[11px] font-bold text-game-orange">
                    Your Current: Tier {currentTier.tier}
                  </span>
                </div>

                <div className="space-y-2">
                  {SKILL_PROGRESSION_TIERS.map((tier) => {
                    const isCurrent = currentTier.tier === tier.tier;
                    const isUnlocked = state.level >= tier.minLevel;

                    return (
                      <div
                        key={tier.tier}
                        className={`p-3 sm:p-3.5 rounded-2xl border-2 transition-all ${
                          isCurrent
                            ? "bg-amber-50/90 border-game-orange shadow-game-sm ring-2 ring-amber-300"
                            : isUnlocked
                            ? "bg-white border-stone-300"
                            : "bg-stone-100/70 border-stone-200 opacity-70"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`w-8 h-8 rounded-xl text-white font-black text-xs flex items-center justify-center bg-gradient-to-br ${tier.badgeColor} shadow-sm`}
                            >
                              T{tier.tier}
                            </span>
                            <div>
                              <div className="font-black text-sm text-game-dark flex items-center gap-1.5">
                                <span>{tier.name}</span>
                                <span className="text-xs font-bold text-stone-500">
                                  (Levels {tier.minLevel}–{tier.maxLevel})
                                </span>
                                {isCurrent && (
                                  <span className="px-1.5 py-0.5 rounded bg-game-orange text-white text-[9px] font-black uppercase">
                                    Active
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] font-bold text-stone-600">
                                {tier.tag}
                              </div>
                            </div>
                          </div>

                          <div>
                            {isUnlocked ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            ) : (
                              <span className="text-xs font-mono font-bold text-stone-400">
                                Lv.{tier.minLevel}+
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Perk Details */}
                        <div className="mt-2 text-xs text-stone-600 font-medium pl-10">
                          {tier.perk}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 10 Disciplines Preview Switcher & Animated Avatar GIF Player */}
              <div className="pt-2 border-t-2 border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-black uppercase tracking-wider text-stone-700">
                    Preview 10 Elemental Disciplines
                  </div>

                  {/* Boys / Girls Toggle */}
                  <div className="flex items-center bg-stone-200 p-0.5 rounded-xl border border-stone-300 text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playToggle(true);
                        setGenderPreview("boys");
                        setPreviewReplayKey(Date.now());
                      }}
                      className={`px-2 py-1 rounded-lg transition-all ${
                        genderPreview === "boys"
                          ? "bg-game-orange text-white shadow-sm font-black"
                          : "text-stone-600 hover:text-stone-900"
                      }`}
                    >
                      🥋 Boys
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playToggle(false);
                        setGenderPreview("girls");
                        setPreviewReplayKey(Date.now());
                      }}
                      className={`px-2 py-1 rounded-lg transition-all ${
                        genderPreview === "girls"
                          ? "bg-rose-500 text-white shadow-sm font-black"
                          : "text-stone-600 hover:text-stone-900"
                      }`}
                    >
                      🌸 Girls
                    </button>
                  </div>
                </div>

                {/* Horizontal chips */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {ELEMENTAL_SKILLS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        soundEngine.playClick();
                        setSelectedSkillPreview(s.id);
                        setPreviewReplayKey(Date.now());
                      }}
                      className={`px-3 py-1.5 rounded-xl font-black text-xs shrink-0 flex items-center gap-1 border-2 transition-all cursor-pointer ${
                        selectedSkillPreview === s.id
                          ? "bg-game-orange text-white border-game-orange shadow-game-sm ring-2 ring-amber-300"
                          : "bg-white text-stone-700 border-stone-200 hover:border-stone-400"
                      }`}
                    >
                      <span>{s.icon}</span>
                      <span>{s.name}</span>
                    </button>
                  ))}
                </div>

                {/* Selected Discipline Details Card with Animated Battle GIF */}
                <div className="p-4 rounded-2xl bg-gradient-to-b from-[#22130a] to-[#150b06] border-2 border-amber-900/60 shadow-game-sm text-stone-100 flex flex-col sm:flex-row items-center gap-4">
                  {/* GIF Container */}
                  <div
                    className="w-36 h-36 sm:w-40 sm:h-40 rounded-2xl bg-black/60 border-2 flex items-center justify-center p-2 relative shrink-0 shadow-inner overflow-hidden"
                    style={{ borderColor: previewSkillObj.color }}
                  >
                    <img
                      key={`${previewSkillObj.id}-${genderPreview}-${previewReplayKey}`}
                      src={getSkillGifUrl(previewSkillObj.name, genderPreview)}
                      alt={`${previewSkillObj.name} battle avatar`}
                      className="w-full h-full object-contain drop-shadow"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playClick();
                        setPreviewReplayKey(Date.now());
                      }}
                      className="absolute bottom-1.5 right-1.5 p-1.5 rounded-lg bg-black/70 hover:bg-black/90 text-amber-300 border border-white/20 transition-all active:scale-95"
                      title="Replay animation"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Lore & Perk */}
                  <div className="flex-1 min-w-0 space-y-2 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <span className="text-xl">{previewSkillObj.icon}</span>
                      <div className="font-black text-sm text-white">
                        {previewSkillObj.name}
                        {previewSkillObj.id === state.profile.elementalSkill && (
                          <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 font-bold uppercase">
                            Chosen
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase">
                        {previewSkillObj.tag}
                      </span>
                    </div>

                    <p className="text-xs text-stone-300 font-medium leading-relaxed">
                      {previewSkillObj.description}
                    </p>

                    <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-bold text-left">
                      ⚡ Combat Perk: {previewSkillObj.perk}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="mt-5 pt-3 border-t-2 border-stone-200 flex items-center justify-end">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="py-2.5 px-5 rounded-xl bg-game-orange hover:bg-game-orangeDark text-white font-black text-xs uppercase tracking-wider shadow-game-sm active:translate-y-0.5 transition-all cursor-pointer"
            >
              Close Dossier
            </button>
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}

