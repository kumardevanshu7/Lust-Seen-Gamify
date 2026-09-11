"use client";

import React from "react";
import { motion } from "framer-motion";

export function PixelCardSkeleton({ index }: { index: number }) {
  const isWin = index % 2 === 0;

  return (
    <div className="relative p-4 sm:p-5 rounded-none bg-[#1a0f09] border-4 border-[#5c371d] shadow-[4px_4px_0_0_#000000] overflow-hidden flex flex-col justify-between min-h-[175px]">
      <div className="absolute inset-0 pixel-scanlines opacity-40 pointer-events-none" />

      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#2b1810] border-2 border-[#b8906f] text-amber-300 font-mono font-black text-xs flex items-center justify-center shadow-[2px_2px_0_0_#000]">
              #{index}
            </div>

            <div
              className={`px-2.5 py-0.5 text-[10px] font-mono font-black uppercase tracking-wider border-2 shadow-[2px_2px_0_0_#000] ${
                isWin
                  ? "bg-emerald-950/90 text-emerald-300 border-emerald-600"
                  : "bg-rose-950/90 text-rose-300 border-rose-600"
              }`}
            >
              {isWin ? "+XP WIN HABIT" : "-HP SLIP RISK"}
            </div>
          </div>

          <div className="flex gap-1">
            <div className="w-2 h-2 bg-amber-600/70" />
            <div className="w-2 h-2 bg-amber-500/90" />
          </div>
        </div>

        <div className="space-y-2 my-2">
          <div
            className="h-4 bg-amber-950/60 border border-amber-800/40 rounded-none pixel-skeleton-shimmer"
            style={{ width: `${75 + (index % 3) * 10}%` }}
          />
          <div
            className="h-3.5 bg-amber-950/40 border border-amber-800/30 rounded-none pixel-skeleton-shimmer"
            style={{ width: `${50 + (index % 4) * 12}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 mt-4 pt-2 border-t-2 border-[#3d2414]">
        <div className="h-10 bg-emerald-950/40 border-2 border-emerald-700/50 shadow-[2px_2px_0_0_#000] flex items-center justify-center gap-1.5 pixel-skeleton-shimmer">
          <div className="w-3 h-3 bg-emerald-500/60" />
          <div className="w-14 h-3 bg-emerald-400/40" />
        </div>

        <div className="h-10 bg-rose-950/40 border-2 border-rose-700/50 shadow-[2px_2px_0_0_#000] flex items-center justify-center gap-1.5 pixel-skeleton-shimmer">
          <div className="w-3 h-3 bg-rose-500/60" />
          <div className="w-14 h-3 bg-rose-400/40" />
        </div>
      </div>
    </div>
  );
}

export function PixelGameSkeleton() {
  return (
    <div className="min-h-screen bg-[#140b06] text-amber-100 flex flex-col justify-between overflow-x-hidden select-none font-mono">
      <div className="fixed inset-0 pixel-scanlines opacity-30 pointer-events-none z-10" />

      <div
        aria-hidden="true"
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-amber-600/10 blur-[120px] pointer-events-none"
      />

      <div className="w-full max-w-5xl mx-auto flex flex-col flex-1 min-h-screen relative z-20 px-3 sm:px-6 py-3 sm:py-6">
        <header className="p-3 sm:p-4 bg-[#1f120a] border-4 border-[#5c371d] shadow-[4px_4px_0_0_#000000] mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#2b1810] border-3 border-amber-500 shadow-[2px_2px_0_0_#000] flex items-center justify-center relative overflow-hidden">
                <div className="w-7 h-7 bg-amber-500/40 border border-amber-300/80 animate-pulse" />
                <div className="absolute bottom-0 inset-x-0 h-1.5 bg-amber-400" />
              </div>

              <div className="space-y-1">
                <div className="h-4 w-28 bg-amber-900/60 border border-amber-700/50 pixel-skeleton-shimmer" />
                <div className="h-3 w-36 bg-amber-950/80 border border-amber-900/40 pixel-skeleton-shimmer" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-6">
              <div className="space-y-1 min-w-[140px]">
                <div className="flex justify-between text-[11px] font-bold text-rose-300">
                  <span>HP [HEALTH]</span>
                  <span>100 / 100</span>
                </div>
                <div className="h-3.5 bg-black border-2 border-rose-800 p-0.5 shadow-[2px_2px_0_0_#000]">
                  <div className="h-full bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 w-full pixel-skeleton-shimmer" />
                </div>
              </div>

              <div className="space-y-1 min-w-[140px]">
                <div className="flex justify-between text-[11px] font-bold text-amber-300">
                  <span>LVL 01</span>
                  <span>EXP 0 / 100</span>
                </div>
                <div className="h-3.5 bg-black border-2 border-amber-700 p-0.5 shadow-[2px_2px_0_0_#000]">
                  <div className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 w-[65%] pixel-skeleton-shimmer" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-2.5 py-1 bg-black/70 border-2 border-amber-500/80 text-amber-300 font-bold text-xs flex items-center gap-1.5 shadow-[2px_2px_0_0_#000]">
                <span>🪙</span>
                <span>---</span>
              </div>
              <div className="px-2.5 py-1 bg-black/70 border-2 border-orange-500/80 text-orange-300 font-bold text-xs flex items-center gap-1.5 shadow-[2px_2px_0_0_#000]">
                <span>🔥</span>
                <span>--D</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 bg-[#22140b] border-4 border-[#5c371d] shadow-[4px_4px_0_0_#000000] mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-block px-2 py-0.5 bg-amber-950 border border-amber-600 text-[10px] font-black uppercase tracking-wider text-amber-400 mb-1">
                QUEST LOG: ACTIVE
              </div>
              <div className="h-5 w-48 sm:w-64 bg-amber-900/50 border border-amber-700/60 pixel-skeleton-shimmer mt-1" />
              <div className="h-3 w-64 sm:w-80 bg-amber-950/80 border border-amber-900/40 pixel-skeleton-shimmer mt-1.5" />
            </div>

            <div className="flex items-center gap-2">
              <div className="h-8 w-28 bg-[#3d2414] border-2 border-[#8a532b] shadow-[2px_2px_0_0_#000] pixel-skeleton-shimmer" />
              <div className="h-8 w-24 bg-[#3d2414] border-2 border-[#8a532b] shadow-[2px_2px_0_0_#000] pixel-skeleton-shimmer" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 flex-1">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <PixelCardSkeleton key={i} index={i} />
          ))}
        </div>

        <div className="py-4 text-center">
          <motion.div
            initial={{ opacity: 0.8 }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-black/80 border-2 border-amber-500 shadow-[3px_3px_0_0_#000] text-xs font-mono font-bold text-amber-300 uppercase tracking-wider"
          >
            <span className="w-2.5 h-2.5 bg-amber-400 inline-block animate-ping" />
            <span>INITIALIZING SOUL ARENA...</span>
            <span className="text-amber-500 font-mono">[■■■■□□]</span>
          </motion.div>
        </div>
      </div>

      <footer className="w-full max-w-lg mx-auto px-4 pb-3 pt-1 z-20">
        <div className="p-2 bg-[#1f120a] border-3 border-[#5c371d] shadow-[3px_3px_0_0_#000] grid grid-cols-5 gap-2">
          {["DAILY", "SHOP", "RANKS", "CLANS", "STATS"].map((tab) => (
            <div
              key={tab}
              className="py-2 flex flex-col items-center justify-center gap-1 bg-black/40 border border-amber-900/50 pixel-skeleton-shimmer"
            >
              <div className="w-4 h-4 bg-amber-600/50" />
              <span className="text-[8px] font-mono font-bold text-stone-400">{tab}</span>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
