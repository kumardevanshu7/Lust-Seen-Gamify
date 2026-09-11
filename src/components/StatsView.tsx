"use client";

import React from "react";
import { useGame } from "@/context/GameContext";
import { Flame, Calendar, Award, ShieldCheck, Heart, Zap, History } from "lucide-react";

export function StatsView() {
  const { state } = useGame();

  const totalLogs = state.history.length;
  const cleanLogs = state.history.filter((h) => h.isCleanDay).length;
  const successRate = totalLogs > 0 ? Math.round((cleanLogs / totalLogs) * 100) : 100;

  return (
    <div className="space-y-5 select-none">
      {/* Overview Banner */}
      <div className="bg-[#fffbf0] border-4 border-game-border rounded-3xl p-5 shadow-game-md">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-black uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-game-green" aria-hidden="true" />
              <span>Willpower Analytics</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-game-dark mt-1">
              Warrior Progress & Badges
            </h2>
            <p className="text-xs sm:text-sm font-medium text-stone-600">
              Consistency is the mother of mastery. Every logged clean day rebuilds neural pathways.
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-2xl shadow-game-sm">
            📈
          </div>
        </div>

        {/* 4 Quick Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5">
          <div className="p-3.5 rounded-2xl bg-white border-2 border-stone-200 shadow-game-sm">
            <div className="flex items-center gap-1 text-game-orange text-xs font-black uppercase">
              <Flame className="w-4 h-4" />
              <span>Streak</span>
            </div>
            <div className="text-2xl font-black text-game-dark mt-1 tabular-nums">
              {state.streakDays} <span className="text-xs font-bold text-stone-500">Days</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border-2 border-stone-200 shadow-game-sm">
            <div className="flex items-center gap-1 text-amber-600 text-xs font-black uppercase">
              <Award className="w-4 h-4" />
              <span>Best Streak</span>
            </div>
            <div className="text-2xl font-black text-game-dark mt-1 tabular-nums">
              {state.bestStreakDays} <span className="text-xs font-bold text-stone-500">Days</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border-2 border-stone-200 shadow-game-sm">
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-black uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>Success</span>
            </div>
            <div className="text-2xl font-black text-game-dark mt-1 tabular-nums">
              {successRate}%
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border-2 border-stone-200 shadow-game-sm">
            <div className="flex items-center gap-1 text-blue-600 text-xs font-black uppercase">
              <Zap className="w-4 h-4" />
              <span>Total Logs</span>
            </div>
            <div className="text-2xl font-black text-game-dark mt-1 tabular-nums">
              {totalLogs}
            </div>
          </div>
        </div>
      </div>

      {/* History Log List */}
      <div className="bg-white border-4 border-game-border/80 rounded-3xl p-5 shadow-game-sm">
        <h3 className="text-base font-black text-game-dark flex items-center gap-2 mb-3">
          <History className="w-5 h-5 text-game-orange" />
          <span>Recent Journal Entries</span>
        </h3>

        {state.history.length === 0 ? (
          <div className="text-center py-8 text-stone-400 font-medium text-sm">
            No daily entries logged yet. Complete today’s check-in to start your streak!
          </div>
        ) : (
          <div className="space-y-2.5">
            {state.history.map((entry) => (
              <div
                key={entry.date}
                className="p-3.5 rounded-2xl bg-[#fffdfa] border-2 border-stone-200 flex items-center justify-between gap-3 shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-game-dark tabular-nums">
                      {entry.date}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        entry.isCleanDay
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-amber-100 text-amber-800 border border-amber-300"
                      }`}
                    >
                      {entry.isCleanDay ? "Clean Victory" : "Urge Experienced"}
                    </span>
                  </div>
                  <div className="text-xs text-stone-500 font-medium mt-0.5">
                    {Object.keys(entry.answers).length} questions answered
                  </div>
                </div>

                <div className="text-right tabular-nums">
                  <span className="text-xs font-black text-game-orange block">
                    +{entry.xpEarned} XP
                  </span>
                  <span
                    className={`text-[11px] font-bold ${
                      entry.hpDelta >= 0 ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {entry.hpDelta >= 0 ? `+${entry.hpDelta} HP` : `${entry.hpDelta} HP`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
