"use client";

import React from "react";
import { useGame } from "@/context/GameContext";
import { soundEngine } from "@/lib/soundEngine";
import { CheckSquare, Trophy, Users, BarChart3, ShoppingBag } from "lucide-react";

export function BottomNavBar() {
  const { state, setActiveView } = useGame();

  const navItems = [
    {
      id: "daily" as const,
      label: "Daily Log",
      icon: <CheckSquare className="w-5 h-5" />,
      locked: false,
    },
    {
      id: "store" as const,
      label: "Bazaar",
      icon: <ShoppingBag className="w-5 h-5" />,
      locked: false,
    },
    {
      id: "achievers" as const,
      label: "Collab Titles",
      icon: <Trophy className="w-5 h-5" />,
      locked: false,
    },
    {
      id: "clans" as const,
      label: "Guild",
      icon: <Users className="w-5 h-5" />,
      locked: false,
    },
    {
      id: "stats" as const,
      label: "Stats",
      icon: <BarChart3 className="w-5 h-5" />,
      locked: false,
    },
  ];

  return (
    <nav
      aria-label="Bottom primary navigation"
      className="fixed bottom-0 left-0 right-0 z-30 bg-[#2b1810] border-t-4 border-[#1c0f0a] px-3 py-2 shadow-2xl safe-area-bottom"
    >
      <div className="max-w-lg mx-auto flex items-center justify-around gap-1 sm:gap-2">
        {navItems.map((item) => {
          const isActive = state.activeView === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                soundEngine.playNavClick();
                setActiveView(item.id);
              }}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              className={`flex-1 py-1.5 px-2 rounded-2xl flex flex-col items-center justify-center relative transition-all focus-visible:ring-2 focus-visible:ring-amber-400 outline-none ${
                isActive
                  ? "bg-game-orange text-white shadow-game-sm -translate-y-1"
                  : "text-amber-100/70 hover:text-white hover:bg-white/5"
              }`}
            >
              {/* Icon */}
              <div className="relative">
                {item.icon}
              </div>

              {/* Label */}
              <span className="text-[11px] font-black tracking-wide mt-0.5 whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
