"use client";

import React, { useEffect, useState } from "react";
import { useGame } from "@/context/GameContext";
import { getTimeUntilMidnight, ELEMENTAL_SKILLS } from "@/lib/gameLogic";
import { soundEngine } from "@/lib/soundEngine";
import { Heart, Coins, Settings, AlertTriangle, Flame, ShieldAlert, Music, Clock, Zap } from "lucide-react";

interface TopNavBarProps {
  onOpenPause: () => void;
  onOpenPanic: () => void;
  onOpenProfile?: () => void;
}

export function TopNavBar({ onOpenPause, onOpenPanic, onOpenProfile }: TopNavBarProps) {
  const { state, setActiveView, updateSettings } = useGame();
  const [timeLeft, setTimeLeft] = useState(getTimeUntilMidnight());

  // Real-time countdown to 12:00 AM midnight
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilMidnight());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hpPercent = Math.max(0, Math.min(100, (state.hp / state.maxHp) * 100));
  const xpPercent = Math.max(0, Math.min(100, (state.currentXp / state.maxXp) * 100));
  const isHpCritical = hpPercent <= 25;
  const activeSkill = ELEMENTAL_SKILLS.find((s) => s.id === state.profile.elementalSkill);

  // Midnight countdown: total day seconds = 86400.
  // Reverse ("ulta") bar: depletes from 100% down to 0% as the day approaches midnight!
  const totalSecondsInDay = 86400;
  const secondsRemaining = Math.max(0, timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds);
  const dayTimerReversePercent = Math.max(0, Math.min(100, (secondsRemaining / totalSecondsInDay) * 100));

  const formattedTimeLeft = `${String(timeLeft.hours).padStart(2, "0")}:${String(timeLeft.minutes).padStart(2, "0")}:${String(timeLeft.seconds).padStart(2, "0")}`;

  const auraClass =
    state.profile.equippedAura === "solar_flare"
      ? "ring-4 ring-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.85)] animate-pulse"
      : state.profile.equippedAura === "glacial_frost"
      ? "ring-4 ring-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.85)]"
      : "";

  return (
    <header className="w-full bg-[#341e13] text-white border-b-4 border-[#24130a] px-2.5 sm:px-4 py-2 sm:py-2.5 shadow-lg select-none overflow-hidden">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        {/* Top / Main Controls Row */}
        <div className="flex items-center justify-between gap-2">
          {/* Left: Player Avatar & Level Badge (Clickable to open profile & skill ranges) */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onOpenProfile?.();
            }}
            aria-label="Open warrior profile and elemental skill progression"
            className="flex items-center gap-2 sm:gap-2.5 shrink-0 text-left hover:opacity-95 active:scale-95 transition-all cursor-pointer group focus:outline-none"
          >
            <div className="relative">
              <div
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 border-2 border-amber-200 flex items-center justify-center font-black text-lg shadow-game-sm group-hover:border-amber-300 group-hover:shadow-game-md transition-all ${
                  isHpCritical ? "ring-2 ring-red-500 animate-pulse" : ""
                } ${auraClass}`}
              >
                {activeSkill?.icon || (state.profile.gender === "female" ? "🌸" : "🥋")}
              </div>
              {/* Level badge circle */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-game-orange text-white text-[10px] font-black flex items-center justify-center border-2 border-white shadow-game-sm tabular-nums">
                {state.level}
              </div>
            </div>

            <div className="min-w-0">
              <div className="text-xs font-black tracking-wide text-amber-200 truncate max-w-[95px] sm:max-w-[130px] flex items-center gap-1 group-hover:text-amber-100 transition-colors">
                <span className="truncate">{state.profile.name || "Warrior"}</span>
              </div>
              <div className="text-[10px] font-bold text-amber-300/80 truncate max-w-[95px] sm:max-w-[130px] font-mono">
                {state.profile.username || "@warrior"}
              </div>
            </div>
          </button>

          {/* Right Action Icons on Mobile (Coins, Panic, Music, Settings) */}
          <div className="flex sm:hidden items-center gap-1.5 shrink-0">
            {/* Zen Coins (Bazaar) */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setActiveView("store");
              }}
              className="flex items-center gap-1 bg-[#24130a] hover:bg-[#381f12] px-2 py-1 rounded-xl border border-amber-500/40 text-amber-300 text-xs font-black tabular-nums shadow-inner"
            >
              <Coins className="w-3 h-3 text-yellow-400" />
              <span>{state.coins}</span>
            </button>

            {/* Panic Button */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playDamage();
                onOpenPanic();
              }}
              aria-label="Urge emergency panic button"
              className="px-2 py-1 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-xs uppercase border border-red-300 active:scale-95 transition-all flex items-center gap-1"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
            </button>

            {/* Music Toggle */}
            <button
              type="button"
              onClick={() => {
                const next = !state.settings.musicEnabled;
                soundEngine.playToggle(next);
                updateSettings({ musicEnabled: next });
              }}
              aria-label="Toggle Zen Music"
              className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${
                state.settings.musicEnabled
                  ? "bg-amber-600 text-white border-amber-300"
                  : "bg-stone-800 text-stone-400 border-stone-700"
              }`}
            >
              <Music className="w-3.5 h-3.5" />
            </button>

            {/* Pause / Settings Gear */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onOpenPause();
              }}
              aria-label="Settings and pause menu"
              className="w-8 h-8 rounded-xl bg-stone-700 hover:bg-stone-600 text-amber-200 border border-stone-500 flex items-center justify-center transition-all"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3 Game Progress Bars (HP Forward, EXP Forward, Day Timer Reverse) */}
        <div className="flex-1 w-full max-w-lg mx-auto sm:mx-2 bg-[#231209]/90 border-2 border-[#54301a] rounded-2xl p-2 sm:px-3 sm:py-2 shadow-inner space-y-1.5">
          {/* BAR 1: Health (HP) Bar (Forward Progress) */}
          <div className="flex items-center gap-2 text-[10px] font-black">
            <div className="flex items-center gap-1 w-16 sm:w-20 shrink-0 text-rose-300">
              <Heart
                className={`w-3 h-3 ${isHpCritical ? "text-red-500 animate-bounce fill-red-500" : "text-rose-400 fill-rose-400"}`}
              />
              <span className="uppercase tracking-wider">HP</span>
            </div>

            {/* HP Bar Track */}
            <div className="flex-1 bg-black/50 rounded-full h-2.5 sm:h-3 overflow-hidden p-0.5 border border-[#54301a] relative">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isHpCritical
                    ? "bg-gradient-to-r from-red-600 to-rose-500 animate-pulse"
                    : "bg-gradient-to-r from-emerald-500 to-teal-400"
                }`}
                style={{ width: `${hpPercent}%` }}
              />
            </div>

            <div className="w-14 sm:w-16 text-right tabular-nums text-emerald-300 text-[10px]">
              {state.hp}/{state.maxHp}
            </div>
          </div>

          {/* BAR 2: Experience (EXP) Bar (Forward Progress) */}
          <div className="flex items-center gap-2 text-[10px] font-black">
            <div className="flex items-center gap-1 w-16 sm:w-20 shrink-0 text-amber-300">
              <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="uppercase tracking-wider">EXP Lv.{state.level}</span>
            </div>

            {/* EXP Bar Track */}
            <div className="flex-1 bg-black/50 rounded-full h-2.5 sm:h-3 overflow-hidden p-0.5 border border-[#54301a] relative">
              <div
                className="bg-gradient-to-r from-amber-400 to-game-orange h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${xpPercent}%` }}
              />
            </div>

            <div className="w-14 sm:w-16 text-right tabular-nums text-amber-300 text-[10px]">
              {state.currentXp}/{state.maxXp}
            </div>
          </div>

          {/* BAR 3: Day Countdown Timer Bar (Reverse / "Ulta Baar" Progress: 100% -> 0%) */}
          <div className="flex items-center gap-2 text-[10px] font-black">
            <div className="flex items-center gap-1 w-16 sm:w-20 shrink-0 text-cyan-300">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span className="uppercase tracking-wider text-[9px]">Reset</span>
            </div>

            {/* Midnight Timer Bar Track (Depletes in Reverse as day ends) */}
            <div
              className="flex-1 bg-black/50 rounded-full h-2.5 sm:h-3 overflow-hidden p-0.5 border border-[#54301a] relative"
              title="Reverse countdown: Bar depletes from 100% to 0% as midnight approaches"
            >
              <div
                className="bg-gradient-to-r from-indigo-500 via-sky-400 to-cyan-300 h-full rounded-full transition-all duration-700 shadow-sm"
                style={{ width: `${dayTimerReversePercent}%` }}
              />
            </div>

            <div className="w-14 sm:w-16 text-right tabular-nums text-cyan-300 text-[10px] font-mono">
              {formattedTimeLeft}
            </div>
          </div>
        </div>

        {/* Right Action Icons on Desktop (Hidden on mobile to avoid duplicate) */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          {/* Zen Coins (Click to Open Bazaar) */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setActiveView("store");
            }}
            title="Open Willpower Bazaar & Shop"
            className="flex items-center gap-1.5 bg-[#24130a] hover:bg-[#381f12] px-2.5 py-1.5 rounded-2xl border-2 border-amber-500/40 hover:border-amber-400 text-amber-300 text-xs font-black tabular-nums shadow-inner transition-all cursor-pointer active:scale-95"
          >
            <Coins className="w-3.5 h-3.5 text-yellow-400" aria-hidden="true" />
            <span>{state.coins}</span>
            <span className="text-[9px] uppercase tracking-wider text-amber-200/90 bg-amber-950/80 px-1 py-0.5 rounded-md">
              Shop
            </span>
          </button>

          {/* Emergency Panic Button */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playDamage();
              onOpenPanic();
            }}
            aria-label="Urge emergency panic button"
            className="px-2.5 py-1.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs uppercase tracking-tight shadow-game-red border-2 border-red-300 active:translate-y-0.5 transition-all flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-red-400 outline-none"
          >
            <ShieldAlert className="w-3.5 h-3.5 animate-pulse" aria-hidden="true" />
            <span>Panic</span>
          </button>

          {/* Quick Zen Music Toggle Button */}
          <button
            type="button"
            onClick={() => {
              const next = !state.settings.musicEnabled;
              soundEngine.playToggle(next);
              updateSettings({ musicEnabled: next });
            }}
            aria-label="Toggle Zen Music"
            title={
              state.settings.musicEnabled
                ? "Zen Flute Music: Playing (Click to mute)"
                : "Zen Flute Music: Muted (Click to play)"
            }
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl border-2 flex items-center justify-center transition-all cursor-pointer shadow-game-sm active:translate-y-0.5 ${
              state.settings.musicEnabled
                ? "bg-gradient-to-b from-amber-500 to-amber-700 text-white border-amber-300 ring-2 ring-amber-400/40"
                : "bg-gradient-to-b from-stone-700 to-stone-800 text-stone-400 border-stone-600 hover:text-stone-200"
            }`}
          >
            <Music className={`w-4 h-4 ${state.settings.musicEnabled ? "animate-pulse text-yellow-200" : ""}`} aria-hidden="true" />
          </button>

          {/* Pause / Settings Gear */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onOpenPause();
            }}
            aria-label="Game settings and pause menu"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-b from-stone-600 to-stone-800 hover:from-stone-500 hover:to-stone-700 text-amber-200 border-2 border-stone-400 shadow-game-sm active:translate-y-0.5 transition-all flex items-center justify-center focus-visible:ring-2 focus-visible:ring-amber-400 outline-none"
          >
            <Settings className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
