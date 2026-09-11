"use client";

import React, { useState, useEffect } from "react";
import { useGame } from "@/context/GameContext";
import { SplashIntro } from "@/components/SplashIntro";
import { OnboardingModal } from "@/components/OnboardingModal";
import { TopNavBar } from "@/components/TopNavBar";
import { BottomNavBar } from "@/components/BottomNavBar";
import { DailyLogCard } from "@/components/DailyLogCard";
import { AnimeAchieversView } from "@/components/AnimeAchieversView";
import { ClanHallView } from "@/components/ClanHallView";
import { StatsView } from "@/components/StatsView";
import { PauseModal } from "@/components/PauseModal";
import { UrgePanicModal } from "@/components/UrgePanicModal";
import { GameOverModal } from "@/components/GameOverModal";
import { MissedDayResetModal } from "@/components/MissedDayResetModal";
import { DevGodModeTestingDeck } from "@/components/DevGodModeTestingDeck";
import { AestheticGameLanding } from "@/components/AestheticGameLanding";
import { GameStoreView } from "@/components/GameStoreView";
import { PixelGameSkeleton } from "@/components/PixelGameSkeleton";
import { UserProfileModal } from "@/components/UserProfileModal";

export default function HomePage() {
  const { state, isLoaded, completeIntro, submitOnboarding, currentUser } = useGame();
  const [isPauseOpen, setIsPauseOpen] = useState(false);
  const [isPanicOpen, setIsPanicOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // 0. RETRO PIXEL GAME SKELETON LOADING (While hydrating local/cloud game state)
  if (!isLoaded) {
    return <PixelGameSkeleton />;
  }

  // Mandatory onboarding gating: If logged in with Google but not yet onboarded, automatically open onboarding modal
  useEffect(() => {
    if (isLoaded && currentUser && !state.isOnboarded) {
      setShowOnboarding(true);
    }
  }, [isLoaded, currentUser, state.isOnboarded]);

  // Dismiss onboarding modal once onboarding is completed
  useEffect(() => {
    if (state.isOnboarded) {
      setShowOnboarding(false);
    }
  }, [state.isOnboarded]);

  // 1. AESTHETIC GAME LANDING PAGE (Lost in Random / Moody Cinematic Style with Video)
  if (!state.isOnboarded) {
    return (
      <main className="w-full h-full min-h-screen">
        <AestheticGameLanding onStartOnboarding={() => setShowOnboarding(true)} />

        {/* Onboarding Dialog */}
        {showOnboarding && (
          <OnboardingModal
            onClose={() => setShowOnboarding(false)}
            onComplete={(name, username, gender, relationship, elementalSkill) => {
              submitOnboarding(name, username, gender, relationship, elementalSkill);
              setShowOnboarding(false);
            }}
          />
        )}
      </main>
    );
  }

  // 3. MAIN LOGGED-IN GAME DASHBOARD
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#22130a] via-[#1b0e07] to-[#110804] text-stone-900 flex flex-col justify-between overflow-x-hidden selection:bg-amber-400">
      {/* Background Ambient Glows */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-600/10 blur-[140px] pointer-events-none"
      />

      {/* Main Auto-Responsive Game Shell (Fluid on Mobile, Tablet & Desktop) */}
      <div className="w-full max-w-5xl mx-auto flex flex-col flex-1 min-h-screen relative">
        {/* Top Status & Level Bar */}
        <TopNavBar
          onOpenPause={() => setIsPauseOpen(true)}
          onOpenPanic={() => setIsPanicOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
        />

        {/* Content Deck - Expands smoothly across all screen sizes */}
        <main className="flex-1 w-full px-3 sm:px-6 lg:px-8 py-3.5 sm:py-6 pb-28 sm:pb-32 overflow-y-auto overflow-x-hidden">
          {state.activeView === "daily" && <DailyLogCard />}
          {state.activeView === "store" && <GameStoreView />}
          {state.activeView === "achievers" && <AnimeAchieversView />}
          {state.activeView === "clans" && <ClanHallView />}
          {state.activeView === "stats" && <StatsView />}
        </main>

        {/* Bottom Navigation Dock */}
        <BottomNavBar />
      </div>

      {/* Player Profile & Elemental Skill Ranges Modal */}
      <UserProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

      {/* Pause & Sound Menu (Exact match to Reference Image) */}
      <PauseModal isOpen={isPauseOpen} onClose={() => setIsPauseOpen(false)} />

      {/* Emergency Urge Panic Modal (4-7-8 Breathing & Interception) */}
      <UrgePanicModal isOpen={isPanicOpen} onClose={() => setIsPanicOpen(false)} />

      {/* Game Over Breakdown Modal (When HP reaches 0) */}
      <GameOverModal />

      {/* Missed Day 10-Second Disciplinary Countdown Modal */}
      <MissedDayResetModal />

      {/* God Mode Testing Deck (Exclusively visible to UID CHan2MohYMWJTHLlAlanNrZvq6b2) */}
      <DevGodModeTestingDeck />
    </div>
  );
}
