"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { soundEngine } from "@/lib/soundEngine";
import { ELEMENTAL_SKILLS, ANIME_CLANS, getSkillGifUrl } from "@/lib/gameLogic";
import {
  X,
  Compass,
  Flame,
  Shield,
  BookOpen,
  Lock,
  Sparkles,
  CheckCircle2,
  Clock,
  Heart,
  Zap,
  Coins,
  Users,
  ArrowRight,
  ChevronRight,
  ShieldAlert,
  Award,
  Play,
  RotateCcw,
} from "lucide-react";

export type CodexTab = "overview" | "skills" | "clans" | "rules";

interface LandingCodexModalProps {
  isOpen: boolean;
  initialTab?: CodexTab;
  onClose: () => void;
  onStartOnboarding: () => void;
  onGoogleSignIn: () => Promise<void>;
  isLoggingIn: boolean;
  currentUser: any;
  isOnboarded?: boolean;
}

export function LandingCodexModal({
  isOpen,
  initialTab = "overview",
  onClose,
  onStartOnboarding,
  onGoogleSignIn,
  isLoggingIn,
  currentUser,
  isOnboarded = false,
}: LandingCodexModalProps) {
  const [activeTab, setActiveTab] = useState<CodexTab>(initialTab);
  const [landingGender, setLandingGender] = useState<"boys" | "girls">("boys");
  const [selectedCodexSkill, setSelectedCodexSkill] = useState<string>("fire");
  const [gifReplayKey, setGifReplayKey] = useState<number>(Date.now());

  if (!isOpen) return null;

  const handleTabChange = (tab: CodexTab) => {
    soundEngine.playClick();
    setActiveTab(tab);
  };

  const handleCta = async () => {
    soundEngine.playClick();
    if (currentUser) {
      if (!isOnboarded) {
        onStartOnboarding();
      }
      onClose();
      return;
    }
    // Launch Google sign in, then proceed to onboarding if needed
    await onGoogleSignIn();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 25 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 25 }}
          transition={{ type: "spring", stiffness: 360, damping: 26 }}
          className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-[#160d08] border-[3px] border-[#6b3e21] rounded-3xl sm:rounded-[36px] shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_40px_rgba(235,90,30,0.2)] text-stone-100 overflow-hidden select-none font-sans"
          role="dialog"
          aria-modal="true"
          aria-labelledby="codex-dialog-title"
        >
          {/* Top Corner Red Circular Close Button */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            aria-label="Close dialog"
            className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-9 h-9 rounded-full bg-stone-800/80 hover:bg-rose-600 border border-stone-600 hover:border-rose-400 text-white flex items-center justify-center transition-colors z-20 cursor-pointer shadow-md"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Modal Header */}
          <div className="px-5 sm:px-7 pt-5 sm:pt-6 pb-3 border-b border-amber-900/40 bg-gradient-to-b from-[#24130b] to-[#160d08]">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-black uppercase tracking-widest">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Willpower RPG Codex</span>
            </div>
            <h2
              id="codex-dialog-title"
              className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-stone-200 to-rose-200 font-serif tracking-tight mt-0.5"
            >
              The Realm of Control Urge
            </h2>
            <p className="text-xs text-stone-400 mt-1 max-w-lg">
              A gamified psychological RPG designed to master sexual cravings, dopamine receptors, and awaken your Shonen discipline.
            </p>

            {/* 4 Navigation Tabs */}
            <div className="flex items-center gap-1.5 sm:gap-2 mt-4 overflow-x-auto pb-1 no-scrollbar">
              <button
                type="button"
                onClick={() => handleTabChange("overview")}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "overview"
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md ring-2 ring-amber-400/50"
                    : "bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10"
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Overview</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange("skills")}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "skills"
                    ? "bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md ring-2 ring-rose-400/50"
                    : "bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10"
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Elemental Skills (10)</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange("clans")}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "clans"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md ring-2 ring-indigo-400/50"
                    : "bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10"
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Anime Clans</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange("rules")}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "rules"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md ring-2 ring-emerald-400/50"
                    : "bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Rules & Bucket Path</span>
              </button>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-4 space-y-4 text-xs sm:text-sm text-stone-300">
            {/* ========================================================
                TAB 1: OVERVIEW (50% Visible + 50% Gated)
            ======================================================== */}
            {activeTab === "overview" && (
              <div className="space-y-4">
                {/* 50% VISIBLE CONTENT */}
                <div className="p-4 rounded-2xl bg-[#221309] border border-amber-900/60 space-y-2.5">
                  <div className="flex items-center gap-2 text-amber-400 font-black text-sm">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span>Dopamine Detox & Transmutation Engine</span>
                  </div>
                  <p className="text-stone-300 leading-relaxed text-xs">
                    Sexual desire is the most potent biological energy in human nature. When squandered on compulsive pixels, it depletes motivation, fogging your cognitive drive. Control Urge turns habit recovery into an authentic Shonen RPG battle.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                    <div className="text-amber-400 font-black text-xs flex items-center gap-1.5 mb-1">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      Daily 7 Bucket
                    </div>
                    <p className="text-[11px] text-stone-400 leading-normal">
                      Handpick 7 custom questions to audit your day before the 12 AM midnight lock.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                    <div className="text-rose-400 font-black text-xs flex items-center gap-1.5 mb-1">
                      <span className="w-2 h-2 rounded-full bg-rose-400" />
                      Vitality (HP) Pool
                    </div>
                    <p className="text-[11px] text-stone-400 leading-normal">
                      Slips damage your HP bar. 0 HP triggers Game Over & Phoenix Rebirth.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                    <div className="text-emerald-400 font-black text-xs flex items-center gap-1.5 mb-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Zen Coin Economy
                    </div>
                    <p className="text-[11px] text-stone-400 leading-normal">
                      Clean streaks reward coins for buying Streak Shields and Phoenix Elixirs.
                    </p>
                  </div>
                </div>

                {/* 50% LOCKED CONTENT (FROSTED GLASS BLUR WITH GOOGLE LOGIN) */}
                <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 p-4 pt-5 bg-gradient-to-b from-white/[0.03] to-transparent">
                  {/* Blurred Background Dummy Content */}
                  <div className="filter blur-[3.5px] opacity-40 select-none space-y-2 pointer-events-none">
                    <div className="h-4 bg-amber-200/50 rounded w-3/4" />
                    <p className="text-xs">
                      Advanced Emergency Urge Protocol: 4-7-8 Parasympathetic Box Breathing, cold hydrotherapy stimulation, and binaural 432Hz theta waves immediately reduce ventral tegmental dopamine spikes within 180 seconds.
                    </p>
                    <div className="h-3 bg-stone-500/50 rounded w-1/2" />
                    <p className="text-xs">
                      Custom Routine Builder: Craft your personalized polarity matrix, weighted slip penalties, and collaborative guild accountability pacts with up to 10 comrades.
                    </p>
                  </div>

                  {/* Frosted Glass Overlay */}
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center mb-2 shadow-inner">
                      <Lock className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">
                      50% Advanced Codex Locked
                    </h3>
                    <p className="text-[11px] text-stone-300 max-w-sm mt-1 mb-3">
                      Sign in with Google to reveal neurobiology relapse guides, custom bucket builder & community live data.
                    </p>
                    <button
                      type="button"
                      onClick={onGoogleSignIn}
                      disabled={isLoggingIn}
                      className="py-2 px-5 rounded-full bg-white hover:bg-stone-100 text-stone-900 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer transition-all active:scale-95"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      <span>{isLoggingIn ? "Connecting..." : "Sign in with Google to Unlock"}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================
                TAB 2: ELEMENTAL SKILLS (5 Visible + 5 Locked)
            ======================================================== */}
            {activeTab === "skills" && (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between text-xs font-bold text-stone-400">
                  <span>10 Avatar Battle Disciplines</span>
                  {/* Gender toggle */}
                  <div className="flex items-center bg-black/50 p-0.5 rounded-xl border border-white/10 text-[10px]">
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playToggle(true);
                        setLandingGender("boys");
                        setGifReplayKey(Date.now());
                      }}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        landingGender === "boys"
                          ? "bg-game-orange text-white shadow-sm font-black"
                          : "text-stone-400 hover:text-white"
                      }`}
                    >
                      🥋 Boys
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playToggle(false);
                        setLandingGender("girls");
                        setGifReplayKey(Date.now());
                      }}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        landingGender === "girls"
                          ? "bg-rose-500 text-white shadow-sm font-black"
                          : "text-stone-400 hover:text-white"
                      }`}
                    >
                      🌸 Girls
                    </button>
                  </div>
                </div>

                {/* Featured Live GIF Spotlight */}
                {(() => {
                  const activeSkillObj =
                    ELEMENTAL_SKILLS.find((s) => s.id === selectedCodexSkill) ||
                    ELEMENTAL_SKILLS[0];
                  return (
                    <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-[#2a170d] via-[#1c0f08] to-black border-2 border-amber-500/40 flex items-center gap-3.5 shadow-lg relative overflow-hidden">
                      <div
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-black/60 border-2 flex items-center justify-center p-1 relative shrink-0 shadow-inner overflow-hidden"
                        style={{ borderColor: activeSkillObj.color }}
                      >
                        <img
                          key={`${activeSkillObj.id}-${landingGender}-${gifReplayKey}`}
                          src={getSkillGifUrl(activeSkillObj.name, landingGender)}
                          alt={activeSkillObj.name}
                          className="w-full h-full object-contain drop-shadow"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            soundEngine.playClick();
                            setGifReplayKey(Date.now());
                          }}
                          className="absolute bottom-1 right-1 p-1 rounded-md bg-black/70 hover:bg-black/90 text-amber-300 border border-white/20 transition-all active:scale-95 cursor-pointer"
                          title="Restart GIF"
                        >
                          <RotateCcw className="w-2.5 h-2.5" />
                        </button>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-white">
                            {activeSkillObj.icon} {activeSkillObj.name}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase">
                            {activeSkillObj.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-300 line-clamp-2 mt-0.5">
                          {activeSkillObj.description}
                        </p>
                        <div className="text-[10px] text-emerald-400 font-bold mt-1">
                          Perk: {activeSkillObj.perk}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* 5 Visible Starter Disciplines (Click to Play GIF in Spotlight) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {ELEMENTAL_SKILLS.slice(0, 4).map((skill) => {
                    const isSelected = skill.id === selectedCodexSkill;
                    return (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => {
                          soundEngine.playClick();
                          setSelectedCodexSkill(skill.id);
                          setGifReplayKey(Date.now());
                        }}
                        className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#2d180d] border-amber-400 ring-2 ring-amber-400/30"
                            : "bg-[#22130a] hover:bg-[#2a170e] border-amber-900/50"
                        }`}
                      >
                        <span className="text-2xl p-2 rounded-xl bg-black/40 border border-white/10 shrink-0">
                          {skill.icon}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-sm text-white truncate">
                              {skill.name}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase">
                              {skill.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-300 line-clamp-2 mt-0.5">
                            {skill.description}
                          </p>
                          <div className="text-[10px] text-amber-300 font-bold mt-1 flex items-center gap-1">
                            <Play className="w-2.5 h-2.5 fill-current text-amber-400" />
                            <span>Click to play GIF</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* 5th Skill (Shinobi) */}
                {(() => {
                  const shinobi = ELEMENTAL_SKILLS.find((s) => s.id === "wind") || ELEMENTAL_SKILLS[4];
                  const isSelected = selectedCodexSkill === shinobi.id;
                  return (
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playClick();
                        setSelectedCodexSkill(shinobi.id);
                        setGifReplayKey(Date.now());
                      }}
                      className={`w-full p-3 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#2d180d] border-amber-400 ring-2 ring-amber-400/30"
                          : "bg-[#22130a] hover:bg-[#2a170e] border-amber-900/50"
                      }`}
                    >
                      <span className="text-2xl p-2 rounded-xl bg-black/40 border border-white/10 shrink-0">
                        {shinobi.icon}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-white">{shinobi.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase">
                            {shinobi.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-300 mt-0.5">
                          {shinobi.description}
                        </p>
                        <div className="text-[10px] text-amber-300 font-bold mt-1 flex items-center gap-1">
                          <Play className="w-2.5 h-2.5 fill-current text-amber-400" />
                          <span>Click to play GIF</span>
                        </div>
                      </div>
                    </button>
                  );
                })()}

                {/* 50% LOCKED ADVANCED CLASSES */}
                <div className="relative rounded-2xl overflow-hidden border border-rose-500/40 p-4 bg-gradient-to-b from-white/[0.02] to-transparent">
                  <div className="filter blur-[4px] opacity-35 select-none pointer-events-none grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-xl bg-stone-900">
                      <div className="font-bold">🐉 Dragon Knight</div>
                      <div className="text-xs">Draconic Fury: +25% XP bonus when resisting 10/10 cravings</div>
                    </div>
                    <div className="p-3 rounded-xl bg-stone-900">
                      <div className="font-bold">🌑 Shadow Assassin</div>
                      <div className="text-xs">Vanish Urges: Eliminates midnight trigger penalties</div>
                    </div>
                    <div className="p-3 rounded-xl bg-stone-900">
                      <div className="font-bold">❄️ Frost Warden</div>
                      <div className="text-xs">Absolute Zero: 1 emergency auto-freeze per week</div>
                    </div>
                    <div className="p-3 rounded-xl bg-stone-900">
                      <div className="font-bold">☀️ Solar Paladin</div>
                      <div className="text-xs">Solar Flare: +10% bonus coins on all daily logs</div>
                    </div>
                  </div>

                  {/* Lock Banner */}
                  <div className="absolute inset-0 bg-black/65 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-300 flex items-center justify-center mb-2 shadow-inner">
                      <Lock className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">
                      5 Legendary Disciplines & Auras Locked
                    </h3>
                    <p className="text-[11px] text-stone-300 max-w-sm mt-1 mb-3">
                      Sign in with Google to awaken Dragon Knight, Shadow Assassin, Frost Warden & equip glowing persona auras!
                    </p>
                    <button
                      type="button"
                      onClick={onGoogleSignIn}
                      disabled={isLoggingIn}
                      className="py-2 px-5 rounded-full bg-gradient-to-r from-rose-600 to-red-600 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer transition-all active:scale-95"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>{isLoggingIn ? "Connecting..." : "Google Login to Unlock All 10"}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================
                TAB 3: ANIME CLANS (3 Visible + 3 Locked)
            ======================================================== */}
            {activeTab === "clans" && (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between text-xs font-bold text-stone-400">
                  <span>3 Starter Clan Halls Open</span>
                  <span className="text-indigo-400 font-extrabold">Clan Wars Locked</span>
                </div>

                {/* 3 Visible Clan Halls */}
                <div className="space-y-2.5">
                  {ANIME_CLANS.slice(0, 3).map((clan) => (
                    <div
                      key={clan.id}
                      className="p-3 sm:p-3.5 rounded-2xl bg-[#1e120a] border border-amber-900/50 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-3xl p-2 rounded-2xl bg-black/40 border border-white/10 shrink-0">
                          {clan.badgeEmoji}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-sm text-white truncate">
                              {clan.name}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                              {clan.membersCount} Warriors
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-300 italic mt-0.5 truncate">
                            "{clan.motto}"
                          </p>
                          <div className="text-[10px] text-emerald-400 font-bold mt-0.5">
                            Buff: {clan.perk}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 50% LOCKED CLAN WARS & ELITE GUILDS */}
                <div className="relative rounded-2xl overflow-hidden border border-indigo-500/40 p-4 bg-gradient-to-b from-white/[0.02] to-transparent">
                  <div className="filter blur-[4px] opacity-35 select-none pointer-events-none space-y-2">
                    <div className="p-3 rounded-xl bg-stone-900 flex justify-between">
                      <span>👁️ Uchiha Clan (Sharingan Focus)</span>
                      <span>1,980 Warriors</span>
                    </div>
                    <div className="p-3 rounded-xl bg-stone-900 flex justify-between">
                      <span>🌙 Shadow Garden (Eminence Protocol)</span>
                      <span>3,120 Warriors</span>
                    </div>
                  </div>

                  {/* Lock Banner */}
                  <div className="absolute inset-0 bg-black/65 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 flex items-center justify-center mb-2 shadow-inner">
                      <Lock className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">
                      Clan Wars & Chakra Raids Locked
                    </h3>
                    <p className="text-[11px] text-stone-300 max-w-sm mt-1 mb-3">
                      Sign in with Google to join a clan hall, send daily chakra, and unlock the global warrior leaderboard.
                    </p>
                    <button
                      type="button"
                      onClick={onGoogleSignIn}
                      disabled={isLoggingIn}
                      className="py-2 px-5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer transition-all active:scale-95"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>{isLoggingIn ? "Connecting..." : "Google Login to Join Clans"}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================
                TAB 4: RULES & BUCKET (SNAKE-TYPE SCROLLING FLOW)
            ======================================================== */}
            {activeTab === "rules" && (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    Follow the <strong>Snake Progression Path</strong> below. Rules 1–3 are open; Rules 4–6 unlock upon Google login.
                  </span>
                </div>

                {/* THE SNAKE PATH CONTAINER */}
                <div className="relative py-2 px-1 sm:px-3">
                  {/* The Glowing Winding Central Energy Snake Line */}
                  <div
                    aria-hidden="true"
                    className="absolute left-6 sm:left-1/2 top-4 bottom-4 w-1 -translate-x-1/2 bg-gradient-to-b from-rose-500 via-amber-400 to-emerald-500 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.6)]"
                  />

                  {/* 6 SNAKE NODES */}
                  <div className="space-y-6 relative">
                    {/* NODE 1: The Daily 7 Bucket (Visible) */}
                    <div className="flex items-start gap-4 sm:gap-6 sm:flex-row flex-row">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-orange-500 text-white font-black text-base flex items-center justify-center border-2 border-amber-200 shadow-[0_4px_10px_rgba(225,29,72,0.5)] shrink-0 z-10">
                        1
                      </div>
                      <div className="flex-1 p-3.5 rounded-2xl bg-[#22130a] border-2 border-rose-900/60 shadow-md">
                        <div className="flex items-center gap-1.5 text-rose-400 font-black text-sm mb-1">
                          <span>🎋 The Daily 7 Bucket System</span>
                        </div>
                        <p className="text-xs text-stone-300 leading-relaxed">
                          Aapko random questions nahi milenge. Aap master bucket mein se <strong>apne 7 personalized questions</strong> choose karoge jo aapke specific urges se match karein. Har din inhi 7 ko honestly check karna hai.
                        </p>
                        <span className="inline-block mt-2 px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-extrabold uppercase">
                          Custom Habit Curation
                        </span>
                      </div>
                    </div>

                    {/* NODE 2: Midnight 12 AM Reset (Visible) */}
                    <div className="flex items-start gap-4 sm:gap-6 sm:flex-row flex-row">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-stone-950 font-black text-base flex items-center justify-center border-2 border-amber-100 shadow-[0_4px_10px_rgba(245,158,11,0.5)] shrink-0 z-10">
                        2
                      </div>
                      <div className="flex-1 p-3.5 rounded-2xl bg-[#22130a] border-2 border-amber-900/60 shadow-md">
                        <div className="flex items-center gap-1.5 text-amber-400 font-black text-sm mb-1">
                          <Clock className="w-4 h-4 text-amber-400" />
                          <span>12:00 AM Midnight Strict Lockdown</span>
                        </div>
                        <p className="text-xs text-stone-300 leading-relaxed">
                          Daily check-in raat <strong>12:00 AM midnight sharp</strong> se pehle lock karna zaroori hai. Once locked, answers non-editable ho jaate hain aur aapke skill ki celebration animation trigger hoti hai. Agar miss hua, toh streak freeze ya HP penalty lagti hai.
                        </p>
                        <span className="inline-block mt-2 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-extrabold uppercase">
                          Strict Accountability
                        </span>
                      </div>
                    </div>

                    {/* NODE 3: Health (HP) & Phoenix Rebirth (Visible) */}
                    <div className="flex items-start gap-4 sm:gap-6 sm:flex-row flex-row">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-base flex items-center justify-center border-2 border-emerald-200 shadow-[0_4px_10px_rgba(16,185,129,0.5)] shrink-0 z-10">
                        3
                      </div>
                      <div className="flex-1 p-3.5 rounded-2xl bg-[#22130a] border-2 border-emerald-900/60 shadow-md">
                        <div className="flex items-center gap-1.5 text-emerald-400 font-black text-sm mb-1">
                          <Heart className="w-4 h-4 text-emerald-400" />
                          <span>Vitality (HP) & Phoenix Rebirth</span>
                        </div>
                        <p className="text-xs text-stone-300 leading-relaxed">
                          Clean check-ins aapki HP heal karte hain aur XP grant karte hain. Slips se HP damage hoti hai. Agar HP 0 pe aagayi, toh Game Over ho jaata hai aur Phoenix Rebirth se streak reset hoti hai.
                        </p>
                        <span className="inline-block mt-2 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase">
                          Survival Gaming Mechanics
                        </span>
                      </div>
                    </div>

                    {/* 50% GATED NODES 4, 5, 6 (FROSTED GLASS BLUR WITH GOOGLE LOGIN) */}
                    <div className="relative rounded-2xl overflow-hidden border border-amber-500/40 p-2 sm:p-3">
                      {/* Blurred Dummy Content for Nodes 4, 5, 6 */}
                      <div className="filter blur-[4px] opacity-30 select-none pointer-events-none space-y-4">
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-xl bg-purple-600 font-black flex items-center justify-center">4</div>
                          <div>
                            <div className="font-bold text-purple-300">⚡ 10 Elemental Disciplines & XP Multipliers</div>
                            <div className="text-xs">Level 1 se 50 tak XP level curve, anime personas, aur dynamic aura animations.</div>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-xl bg-yellow-600 font-black flex items-center justify-center">5</div>
                          <div>
                            <div className="font-bold text-yellow-300">🪙 Zen Coins & Willpower Bazaar</div>
                            <div className="text-xs">Streak bonuses se coins earn karke Aegis Shields aur Potions buy karo.</div>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-xl bg-cyan-600 font-black flex items-center justify-center">6</div>
                          <div>
                            <div className="font-bold text-cyan-300">⛩️ Comrade Bonds & Clan Accountability</div>
                            <div className="text-xs">Comrades add karo aur daily chakra exchange karke collective streak boost lo.</div>
                          </div>
                        </div>
                      </div>

                      {/* Frosted Glass Overlay */}
                      <div className="absolute inset-0 bg-black/65 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center">
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center mb-2 shadow-inner">
                          <Lock className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-black text-white uppercase tracking-wider">
                          Rules 4, 5 & 6 Locked (50% Gated)
                        </h3>
                        <p className="text-[11px] text-stone-300 max-w-sm mt-1 mb-3">
                          Sign in with Google to reveal the full rulebook, Bazaar item catalog & Clan war mechanics!
                        </p>
                        <button
                          type="button"
                          onClick={onGoogleSignIn}
                          disabled={isLoggingIn}
                          className="py-2.5 px-6 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer transition-all active:scale-95"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                          </svg>
                          <span>{isLoggingIn ? "Connecting..." : "Google Login to Unlock All Rules"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Bottom CTA Footer */}
          <div className="p-4 sm:p-5 border-t border-amber-950/60 bg-[#140b07] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-stone-400 text-center sm:text-left">
              {currentUser ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Authenticated as {currentUser.displayName || currentUser.email}
                </span>
              ) : (
                <span>Ready to start your willpower streak?</span>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleCta}
                disabled={isLoggingIn}
                className="flex-1 sm:flex-none py-3 px-6 rounded-2xl bg-gradient-to-r from-[#e11d48] to-[#ea580c] hover:from-[#f43f5e] hover:to-[#f97316] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_5px_15px_rgba(225,29,72,0.5)] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 border border-rose-300/40 cursor-pointer"
              >
                <span>
                  {currentUser
                    ? isOnboarded
                      ? "Enter Arena"
                      : "Continue to Onboarding"
                    : "Google Sign In & Enter Arena"}
                </span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              {!currentUser && (
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    onStartOnboarding();
                    onClose();
                  }}
                  className="px-3 py-2 text-stone-400 hover:text-white text-xs font-bold underline cursor-pointer"
                >
                  Guest
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
