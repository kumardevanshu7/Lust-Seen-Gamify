"use client";

import React from "react";
import { motion } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { getAchieversForGender } from "@/lib/gameLogic";
import { soundEngine } from "@/lib/soundEngine";
import { Sparkles, Check, Trophy, Quote, Zap, Star } from "lucide-react";

export function AnimeAchieversView() {
  const { state, equipAchiever } = useGame();
  const achievers = getAchieversForGender(state.profile.gender);

  return (
    <div className="space-y-5 select-none">
      {/* Top Banner */}
      <div className="bg-[#fffbf0] border-4 border-game-border rounded-3xl p-4 sm:p-6 shadow-game-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 border border-orange-300 text-orange-900 text-xs font-black uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5 text-game-orange" aria-hidden="true" />
              <span>Anime Collab & Hero Personas (Unlocked)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-game-dark mt-1">
              Channel Legendary Anime Willpower
            </h2>
            <p className="text-xs sm:text-sm font-medium text-stone-600">
              Pick your active Shonen spirit partner anytime! Equip titles to empower your habits with passive discipline buffs.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1.5 rounded-2xl bg-amber-100 border-2 border-amber-300 font-black text-xs text-amber-950">
              Active: {state.profile.equippedAnimeAchieverId ? "1 Equipped" : "None"}
            </span>
          </div>
        </div>
      </div>

      {/* Unlocked Achievers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        {achievers.map((hero) => {
          const isEquipped = state.profile.equippedAnimeAchieverId === hero.id;

          return (
            <motion.div
              key={hero.id}
              whileHover={{ y: -2 }}
              className={`p-4 sm:p-5 rounded-3xl border-3 sm:border-4 transition-all shadow-game-sm flex flex-col justify-between ${
                isEquipped
                  ? "bg-amber-50 border-game-orange ring-2 ring-orange-300 shadow-game-md"
                  : "bg-white border-game-border/80"
              }`}
            >
              <div>
                {/* Top Bar: Hero name & Anime */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                      {hero.anime}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-game-dark mt-0.5">
                      {hero.name}
                    </h3>
                  </div>

                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white text-base shadow-game-sm shrink-0"
                    style={{ backgroundColor: hero.avatarColor }}
                  >
                    {hero.name.charAt(0)}
                  </div>
                </div>

                {/* Title */}
                <div className="inline-block text-xs font-black text-game-orange bg-orange-100/70 px-2.5 py-1 rounded-xl mb-3">
                  ⚔️ {hero.title}
                </div>

                {/* Motivational Quote */}
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs font-semibold text-stone-700 italic mb-3 flex items-start gap-2">
                  <Quote className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>&ldquo;{hero.quote}&rdquo;</span>
                </div>

                {/* Passive Buff Perk */}
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 mb-4">
                  <Zap className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                  <span>Perk: {hero.perk}</span>
                </div>
              </div>

              {/* Equip / Unequip Button */}
              <button
                type="button"
                onClick={() => equipAchiever(isEquipped ? "" : hero.id)}
                className={`w-full py-3 px-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isEquipped
                    ? "bg-game-green text-white shadow-game-green border-2 border-emerald-300"
                    : "bg-stone-100 hover:bg-stone-200 text-stone-700 border-2 border-stone-300 shadow-game-sm active:translate-y-0.5"
                }`}
              >
                {isEquipped ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" aria-hidden="true" />
                    <span>Equipped Persona (Tap To Unequip)</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" aria-hidden="true" />
                    <span>Collab & Equip Title</span>
                  </>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
