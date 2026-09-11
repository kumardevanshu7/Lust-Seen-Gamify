"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { STORE_ITEMS } from "@/lib/storeItems";
import { STORE_ITEM_SCENARIOS } from "@/lib/storeItemScenarios";
import { StoreItem } from "@/types/game";
import { soundEngine } from "@/lib/soundEngine";
import {
  BookOpen,
  X,
  Search,
  Sparkles,
  Shield,
  Zap,
  Heart,
  Music,
  Lock,
  Coins,
  CheckCircle2,
  Sword,
  Compass,
} from "lucide-react";
import { useGame } from "@/context/GameContext";

interface StoreItemEncyclopediaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FilterCategory = "all" | "potion" | "shield" | "booster" | "aura" | "title" | "music";

export function StoreItemEncyclopediaModal({ isOpen, onClose }: StoreItemEncyclopediaModalProps) {
  const { state } = useGame();
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const categories: { id: FilterCategory; label: string; icon: string }[] = [
    { id: "all", label: "All Items", icon: "💎" },
    { id: "potion", label: "Potions & Revives", icon: "🧪" },
    { id: "shield", label: "Shields & Defense", icon: "🛡️" },
    { id: "booster", label: "XP & Level Skips", icon: "⚡" },
    { id: "aura", label: "Auras & Ki", icon: "✨" },
    { id: "title", label: "Titles", icon: "👑" },
    { id: "music", label: "Jukebox Tracks", icon: "🎵" },
  ];

  const filteredItems = STORE_ITEMS.filter((item: StoreItem) => {
    // Category match
    if (activeCategory !== "all" && item.category !== activeCategory) {
      return false;
    }
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchBadge = (item.badge || "").toLowerCase().includes(q);
      const scenario = STORE_ITEM_SCENARIOS[item.id];
      const matchScenario = scenario ? scenario.scenario.toLowerCase().includes(q) : false;
      return matchName || matchDesc || matchBadge || matchScenario;
    }
    return true;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 select-none font-sans">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 15 }}
          className="relative w-full max-w-3xl max-h-[88vh] bg-gradient-to-b from-[#2a170d] via-[#1c0f08] to-[#120703] border-2 border-amber-600/60 rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.8)] text-stone-100 flex flex-col overflow-hidden z-10"
        >
          {/* Top Header Bar */}
          <div className="px-5 py-4 border-b border-amber-800/40 bg-black/40 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-500 border border-amber-300 text-stone-950 flex items-center justify-center shadow-md shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-amber-200 tracking-wide truncate">
                    Bazaar Item Codex & Scenarios
                  </h2>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase border border-amber-500/30">
                    {STORE_ITEMS.length} Total Items
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 truncate">
                  Master all operational mechanics and real-world usage scenarios
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search & Category Filter Sub-Bar */}
          <div className="p-3.5 sm:px-5 border-b border-amber-900/30 bg-black/20 space-y-2.5 shrink-0">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/70" />
              <input
                type="text"
                placeholder="Search items, effects, or scenario keywords (e.g. revive, surpass, streak)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/50 border border-amber-700/40 text-xs text-amber-100 placeholder:text-stone-500 focus:border-amber-400 focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {categories.map((cat) => {
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      setActiveCategory(cat.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md ring-1 ring-amber-300"
                        : "bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scrollable Items List */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-3.5">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12 text-stone-400 space-y-2">
                <Compass className="w-10 h-10 text-amber-500/40 mx-auto" />
                <p className="font-bold text-sm">No Bazaar items match your search.</p>
                <p className="text-xs text-stone-500">Try clearing the search query or selecting 'All Items'.</p>
              </div>
            ) : (
              filteredItems.map((item: StoreItem) => {
                const scenarioInfo = STORE_ITEM_SCENARIOS[item.id];
                const itemMinLevel = item.minLevel ?? 1;
                const isLevelUnlocked = state.level >= itemMinLevel;
                const ownedCount = state.inventory[item.id] || 0;

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-stone-950/60 border border-amber-800/40 hover:border-amber-600/70 transition-all space-y-3"
                  >
                    {/* Item Top Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-[#2d1b11] border-2 border-amber-700/50 flex items-center justify-center text-2xl shadow-inner shrink-0">
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm sm:text-base font-black text-amber-100">
                              {item.name}
                            </h3>
                            {item.badge && (
                              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-black uppercase">
                                {item.badge}
                              </span>
                            )}
                            {ownedCount > 0 && (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-black uppercase">
                                Owned: {ownedCount}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-[11px] font-bold text-stone-400 mt-0.5">
                            <span className="text-amber-400 flex items-center gap-1 font-black">
                              <Coins className="w-3 h-3 text-yellow-400" />
                              {item.cost} Coins
                            </span>
                            <span>•</span>
                            <span className={isLevelUnlocked ? "text-emerald-400" : "text-rose-400"}>
                              {isLevelUnlocked ? `Unlocked (Lv. ${itemMinLevel}+)` : `Requires Lv. ${itemMinLevel}`}
                            </span>
                            <span>•</span>
                            <span className="text-stone-300 uppercase text-[10px] font-mono">
                              {item.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* How It Works Section */}
                    <div className="p-3 rounded-xl bg-black/40 border border-amber-900/30 space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-black text-amber-300 uppercase tracking-wider">
                        <Zap className="w-3 h-3 text-amber-400" />
                        <span>How It Works (Operational Mechanics):</span>
                      </div>
                      <p className="text-xs text-stone-200 leading-relaxed">
                        {scenarioInfo?.howItWorks || item.description}
                      </p>
                      <p className="text-[11px] text-amber-400/90 font-mono font-bold pt-0.5">
                        Primary Benefit: <span className="text-white">{item.benefit}</span>
                      </p>
                    </div>

                    {/* Tactical Scenario Section */}
                    <div className="p-3 rounded-xl bg-gradient-to-r from-amber-950/30 to-stone-900/40 border border-amber-600/30 space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-black text-emerald-300 uppercase tracking-wider">
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                        <span>Real Gameplay Scenario:</span>
                      </div>
                      <p className="text-xs text-stone-300 leading-relaxed italic">
                        "{scenarioInfo?.scenario || `Scenario: During high pressure, activate ${item.name} to receive ${item.benefit} and preserve your progress.`}"
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-5 py-3 border-t border-amber-800/40 bg-black/50 flex items-center justify-between text-xs text-stone-400 shrink-0">
            <span>Your Current Level: <strong className="text-amber-300">Lv. {state.level}</strong></span>
            <span>Your Balance: <strong className="text-yellow-400">{state.coins} Coins</strong></span>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-black text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Back to Settings
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
