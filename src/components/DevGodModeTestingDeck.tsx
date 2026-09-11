"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { soundEngine } from "@/lib/soundEngine";
import { getMaxBucketQuestionsForLevel, ELEMENTAL_SKILLS } from "@/lib/gameLogic";
import { ElementalSkillId } from "@/types/game";
import {
  Wrench,
  ChevronDown,
  ChevronUp,
  Zap,
  Heart,
  Clock,
  Trophy,
  Users,
  Skull,
  Coins,
  Shield,
  Sparkles,
  Music,
  ShoppingBag,
  RotateCcw,
  Check,
  Flame,
  ArrowRight,
  Lock,
  Unlock,
  ShieldAlert,
  Minimize2,
  Maximize2,
  Calendar,
} from "lucide-react";

export const TARGET_DEV_UID = "CHan2MohYMWJTHLlAlanNrZvq6b2";

export function DevGodModeTestingDeck() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [customLevelInput, setCustomLevelInput] = useState<string>("");
  const {
    state,
    currentUser,
    devAddXp,
    devDamageHp,
    devHealHp,
    devSetLevel,
    devTriggerMidnightReset,
    devAddCoins,
    devUnlockAllItems,
    devUnlockAllSongs,
    devBypassStoreLocks,
    devToggleBypassStoreLocks,
    devSetStreak,
    devSetElementalSkill,
    devResetDailyLog,
    setActiveView,
  } = useGame();

  // STRICT ACCESS CONTROL: Only visible if UID matches TARGET_DEV_UID
  const isAuthorized =
    currentUser?.uid === TARGET_DEV_UID ||
    state.profile.firebaseUid === TARGET_DEV_UID;

  if (!isAuthorized) {
    return null;
  }

  const maxBucketAllowed = getMaxBucketQuestionsForLevel(state.level);

  const handleCustomLevelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lvl = parseInt(customLevelInput, 10);
    if (!isNaN(lvl) && lvl >= 1 && lvl <= 100) {
      devSetLevel(lvl);
      setCustomLevelInput("");
    }
  };

  // Minimized Tiny Floating Bubble
  if (isMinimized) {
    return (
      <div className="fixed bottom-24 right-3 z-40 select-none">
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          title="Expand Dev God Mode Deck"
          className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-red-600 border-2 border-amber-300 text-yellow-200 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer animate-pulse"
        >
          <Sparkles className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-24 right-3 z-40 select-none font-sans">
      {/* God Mode Trigger Button */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            setIsOpen(!isOpen);
          }}
          aria-label="Toggle God Mode Testing Deck"
          className="px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-[#991b1b] via-[#b45309] to-[#78350f] text-amber-200 border-2 border-amber-400 text-xs font-black flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.6)] backdrop-blur-md transition-all active:scale-95 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" aria-hidden="true" />
          <span className="tracking-wide text-[11px]">TESTING DECK (UID MODE)</span>
          {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>

        <button
          type="button"
          onClick={() => setIsMinimized(true)}
          title="Minimize to tiny bubble"
          className="w-7 h-7 rounded-xl bg-black/60 border border-amber-500/50 text-amber-300 flex items-center justify-center hover:bg-black/90 transition-all text-xs"
        >
          <Minimize2 className="w-3 h-3" />
        </button>
      </div>

      {/* Expanded God Mode Control Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="absolute bottom-11 right-0 w-[340px] sm:w-[390px] max-h-[75vh] overflow-y-auto custom-scrollbar p-4 bg-[#1b0d06] border-3 border-amber-500 rounded-3xl text-white shadow-[0_20px_50px_rgba(0,0,0,0.95)] text-xs space-y-3"
          >
            {/* Header: Authorized Banner */}
            <div className="pb-2.5 border-b border-amber-900/80">
              <div className="flex items-center justify-between">
                <span className="font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5 text-sm">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  God Mode Testing Phase
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-300 font-mono text-[10px] font-bold">
                  UID AUTHORIZED
                </span>
              </div>
              <div className="text-[10px] text-stone-400 font-mono mt-1 truncate">
                UID: {TARGET_DEV_UID}
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] font-bold text-amber-200/90">
                <span>Lv. {state.level}</span>
                <span>•</span>
                <span>HP: {state.hp}/{state.maxHp}</span>
                <span>•</span>
                <span className="text-yellow-400">{state.coins} Coins</span>
                <span>•</span>
                <span>{state.streakDays}d Streak</span>
                <span>•</span>
                <span className="text-cyan-300">Bucket: {maxBucketAllowed} Qs</span>
              </div>
            </div>

            {/* 1. LEVEL TELEPORTER */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-black text-amber-300 uppercase tracking-wider flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-yellow-400" />
                  <span>Level Teleporter</span>
                </div>
                <span className="text-[9px] text-amber-400 font-normal">Lv.15+ unlocks extra bucket slots</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { lvl: 1, label: "Lv.1 (7 Qs)" },
                  { lvl: 5, label: "Lv.5 (7 Qs)" },
                  { lvl: 10, label: "Lv.10 (7 Qs)" },
                  { lvl: 15, label: "Lv.15 ★ 8 Qs" },
                  { lvl: 20, label: "Lv.20 ★ 9 Qs" },
                  { lvl: 22, label: "Lv.22 (Respec)" },
                  { lvl: 25, label: "Lv.25 ★ 10 Qs" },
                  { lvl: 30, label: "Lv.30 ★ 11 Qs" },
                  { lvl: 40, label: "Lv.40 ★ 12 Qs" },
                  { lvl: 50, label: "Lv.50 (Max)" },
                ].map(({ lvl, label }) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => devSetLevel(lvl)}
                    className={`py-1.5 rounded-xl border text-[10px] font-black transition-all active:scale-95 ${
                      state.level === lvl
                        ? "bg-amber-500 text-stone-950 border-amber-300"
                        : "bg-[#2d180e] hover:bg-[#3d2013] text-amber-200 border-amber-800/70"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Custom Level Input */}
              <form onSubmit={handleCustomLevelSubmit} className="flex gap-1.5 pt-1">
                <input
                  type="number"
                  min="1"
                  max="100"
                  placeholder="Custom Lvl (1-100)"
                  value={customLevelInput}
                  onChange={(e) => setCustomLevelInput(e.target.value)}
                  className="flex-1 bg-black/50 border border-amber-800 rounded-xl px-2.5 py-1 text-xs text-white placeholder-stone-500 outline-none focus:border-amber-400 font-mono"
                />
                <button
                  type="submit"
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-stone-950 font-black rounded-xl text-xs active:scale-95 transition-all cursor-pointer"
                >
                  Teleport
                </button>
              </form>
            </div>

            {/* 2. ELEMENTAL SKILL SWITCHER (TEST DISCIPLINES) */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] font-black text-amber-300 uppercase tracking-wider flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Flame className="w-3 h-3 text-orange-400" />
                  <span>Elemental Skill Switcher</span>
                </div>
                <span className="text-[10px] text-amber-300 font-mono">Current: {state.profile.elementalSkill}</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1">
                {ELEMENTAL_SKILLS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => devSetElementalSkill(s.id as ElementalSkillId)}
                    className={`p-1.5 rounded-xl border text-[10px] font-black flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 ${
                      state.profile.elementalSkill === s.id
                        ? "bg-amber-500 text-stone-950 border-amber-200 ring-2 ring-amber-400/40"
                        : "bg-[#27140b] hover:bg-[#381f12] text-stone-200 border-amber-900/60"
                    }`}
                  >
                    <span className="text-base">{s.icon}</span>
                    <span className="truncate max-w-[55px] text-[9px]">{s.badge}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. STORE TESTING & LEVEL LOCK BYPASS */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] font-black text-amber-300 uppercase tracking-wider flex items-center gap-1">
                <ShoppingBag className="w-3 h-3 text-amber-400" />
                <span>Shop Items & Bypass Controls</span>
              </div>
              
              {/* Bypass Toggle */}
              <button
                type="button"
                onClick={devToggleBypassStoreLocks}
                className={`w-full p-2 rounded-xl border flex items-center justify-between text-xs font-black transition-all cursor-pointer ${
                  devBypassStoreLocks
                    ? "bg-emerald-950/80 border-emerald-500 text-emerald-300"
                    : "bg-[#2a170d] border-amber-800/60 text-stone-300 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {devBypassStoreLocks ? <Unlock className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-amber-400" />}
                  <span>Bypass Shop Level Requirements</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase ${devBypassStoreLocks ? "bg-emerald-500 text-stone-950" : "bg-stone-800 text-stone-400"}`}>
                  {devBypassStoreLocks ? "ACTIVE (ALL UNLOCKED)" : "OFF"}
                </span>
              </button>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={devUnlockAllItems}
                  className="p-2 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/60 text-purple-200 font-black flex items-center justify-center gap-1 text-[11px] transition-all active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Give All 42 Items (x10)</span>
                </button>

                <button
                  type="button"
                  onClick={devUnlockAllSongs}
                  className="p-2 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-500/60 text-indigo-200 font-black flex items-center justify-center gap-1 text-[11px] transition-all active:scale-95 cursor-pointer"
                >
                  <Music className="w-3 h-3" />
                  <span>Unlock All 10 Songs</span>
                </button>
              </div>

              {/* Jump to Store Button */}
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setActiveView("store");
                }}
                className="w-full py-1.5 rounded-xl bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-600 hover:to-orange-600 text-amber-100 font-black text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <span>Open Bazaar to Check Items</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* 4. COIN SPAWNER */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] font-black text-amber-300 uppercase tracking-wider flex items-center gap-1">
                <Coins className="w-3 h-3 text-yellow-400" />
                <span>Coin Spawner</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={() => devAddCoins(1000)}
                  className="p-1.5 rounded-xl bg-[#2b180f] hover:bg-[#3d2215] border border-amber-700 text-amber-300 font-black text-[10px] active:scale-95 cursor-pointer"
                >
                  +1,000
                </button>
                <button
                  type="button"
                  onClick={() => devAddCoins(10000)}
                  className="p-1.5 rounded-xl bg-[#2b180f] hover:bg-[#3d2215] border border-amber-700 text-amber-300 font-black text-[10px] active:scale-95 cursor-pointer"
                >
                  +10,000
                </button>
                <button
                  type="button"
                  onClick={() => devAddCoins(50000)}
                  className="p-1.5 rounded-xl bg-[#2b180f] hover:bg-[#3d2215] border border-amber-700 text-amber-300 font-black text-[10px] active:scale-95 cursor-pointer"
                >
                  +50,000
                </button>
                <button
                  type="button"
                  onClick={() => devAddCoins(999999)}
                  className="p-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-black text-[10px] active:scale-95 cursor-pointer"
                >
                  999K Max
                </button>
              </div>
            </div>

            {/* 5. COMBAT, HEALTH & DAILY RESET SIMULATOR */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] font-black text-amber-300 uppercase tracking-wider flex items-center gap-1">
                <Heart className="w-3 h-3 text-rose-400" />
                <span>Combat, Health & Daily Sim</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => devHealHp(state.maxHp)}
                  className="p-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-500/50 text-emerald-300 font-black flex items-center justify-center gap-1 text-[11px] active:scale-95 cursor-pointer"
                >
                  <Heart className="w-3 h-3 text-emerald-400" />
                  <span>100% Full Heal</span>
                </button>
                <button
                  type="button"
                  onClick={() => devDamageHp(30)}
                  className="p-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/70 border border-red-500/50 text-red-300 font-black flex items-center justify-center gap-1 text-[11px] active:scale-95 cursor-pointer"
                >
                  <ShieldAlert className="w-3 h-3 text-red-400" />
                  <span>-30 HP Hit</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => devDamageHp(state.hp)}
                  className="p-1.5 rounded-xl bg-red-950 hover:bg-red-900 border border-red-600 text-red-200 font-black flex items-center justify-center gap-1 text-[11px] active:scale-95 cursor-pointer"
                >
                  <Skull className="w-3 h-3 text-red-400" />
                  <span>Force HP = 0 (Over)</span>
                </button>
                <button
                  type="button"
                  onClick={devTriggerMidnightReset}
                  className="p-1.5 rounded-xl bg-gradient-to-r from-red-950 to-stone-900 hover:from-red-900 hover:to-stone-800 border border-red-500/70 text-red-200 font-black flex items-center justify-center gap-1 text-[11px] active:scale-95 cursor-pointer shadow-sm"
                >
                  <Clock className="w-3 h-3 text-red-400 animate-pulse" />
                  <span>Missed Day (10s Countdown)</span>
                </button>
              </div>
              {/* Reset Daily Log Button */}
              <button
                type="button"
                onClick={() => {
                  devResetDailyLog();
                  soundEngine.playWin();
                }}
                className="w-full py-1.5 rounded-xl bg-sky-950/70 hover:bg-sky-900 border border-sky-600/50 text-sky-200 font-black text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-sky-400" />
                <span>Reset Today's Log (Test Answering Again)</span>
              </button>
            </div>

            {/* 6. QUICK STREAK CONTROLS */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] font-black text-amber-300 uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-3 h-3 text-orange-400" />
                <span>Streak Controls</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => devSetStreak(7)}
                  className="p-1.5 rounded-xl bg-[#24130a] hover:bg-[#341b0e] border border-amber-800 text-amber-300 font-black text-[10px] active:scale-95 cursor-pointer"
                >
                  7d Streak
                </button>
                <button
                  type="button"
                  onClick={() => devSetStreak(30)}
                  className="p-1.5 rounded-xl bg-[#24130a] hover:bg-[#341b0e] border border-amber-800 text-amber-300 font-black text-[10px] active:scale-95 cursor-pointer"
                >
                  30d Streak
                </button>
                <button
                  type="button"
                  onClick={() => devSetStreak(100)}
                  className="p-1.5 rounded-xl bg-[#24130a] hover:bg-[#341b0e] border border-amber-800 text-amber-300 font-black text-[10px] active:scale-95 cursor-pointer"
                >
                  100d Streak
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
