"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { soundEngine } from "@/lib/soundEngine";
import { GAME_AUDIO_TRACKS, AudioTrack } from "@/lib/audioTracks";
import {
  Music,
  Volume2,
  VolumeX,
  Smartphone,
  Headphones,
  Home,
  X,
  Copy,
  Check,
  LifeBuoy,
  LogOut,
  ChevronDown,
  ChevronUp,
  Volume1,
  Sparkles,
  Lock,
  Coins,
  BookOpen,
} from "lucide-react";
import { GameConfirmModal } from "@/components/GameConfirmModal";
import { StoreItemEncyclopediaModal } from "@/components/StoreItemEncyclopediaModal";

interface PauseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PauseModal({ isOpen, onClose }: PauseModalProps) {
  const { state, updateSettings, logout, currentUser, loginGoogle, setActiveBgmSong, buySong, setActiveView } =
    useGame();
  const [copied, setCopied] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLinkingGoogle, setIsLinkingGoogle] = useState(false);
  const [showTrackList, setShowTrackList] = useState(false);
  const [purchasePromptTrack, setPurchasePromptTrack] = useState<AudioTrack | null>(null);
  const [showEncyclopedia, setShowEncyclopedia] = useState(false);

  if (!isOpen) return null;

  const selectedTrackId =
    state.activeBgmSongId || state.settings.selectedBgmTrack || "arena_japanese_girl_whisper";
  const activeTrack =
    GAME_AUDIO_TRACKS.find((t) => t.id === selectedTrackId) || GAME_AUDIO_TRACKS[1];

  const warriorUid = currentUser?.uid || state.profile.firebaseUid || "4d9a7e9c-6ef7-406e-9bfe-controlurge";

  const handleCopyId = () => {
    soundEngine.playClick();
    navigator.clipboard.writeText(warriorUid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLinkGoogle = async () => {
    setIsLinkingGoogle(true);
    try {
      await loginGoogle();
    } finally {
      setIsLinkingGoogle(false);
    }
  };

  const handleSelectTrack = (track: AudioTrack) => {
    soundEngine.playClick();
    const isUnlocked = (state.unlockedSongs || []).includes(track.id) || track.cost === 0;

    if (isUnlocked) {
      setActiveBgmSong(track.id);
      updateSettings({
        selectedBgmTrack: track.id,
        musicEnabled: true,
      });
      soundEngine.playBgmTrack(track.id, true);
    } else if (track.category === "other") {
      // 20-second audition preview for 'other_songs'
      updateSettings({ selectedBgmTrack: track.id, musicEnabled: true });
      soundEngine.playBgmTrack(track.id, false, () => {
        // 20-second limit reached: popup purchase modal
        setPurchasePromptTrack(track);
      });
    } else if (track.category === "premium") {
      // Premium song requires Store purchase (>1500 coins)
      setPurchasePromptTrack(track);
    }
  };

  const handleConfirmBuySong = () => {
    if (!purchasePromptTrack) return;
    const res = buySong(purchasePromptTrack.id, purchasePromptTrack.cost);
    if (res.success) {
      setActiveBgmSong(purchasePromptTrack.id);
      soundEngine.playBgmTrack(purchasePromptTrack.id, true);
    }
    setPurchasePromptTrack(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 30 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="relative w-full max-w-sm sm:max-w-md bg-[#fffdf7] border-[5px] border-[#6b4528] rounded-[32px] sm:rounded-[36px] shadow-[0_16px_0_0_#422915,0_25px_40px_rgba(0,0,0,0.5)] select-none text-game-dark overflow-visible"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pause-dialog-title"
        >
          {/* Top-Right Red Circular Close Button (Never clipped) */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            aria-label="Close pause menu"
            className="absolute -top-3.5 -right-3.5 z-40 w-11 h-11 rounded-full bg-gradient-to-b from-[#ff6161] to-[#d62828] hover:from-[#ff7373] hover:to-[#eb3b3b] text-white flex items-center justify-center border-[3.5px] border-white shadow-[0_4px_0_0_#8f1515,0_6px_12px_rgba(0,0,0,0.4)] active:translate-y-0.5 transition-all focus-visible:ring-3 focus-visible:ring-red-400 outline-none cursor-pointer"
          >
            <X className="w-6 h-6 stroke-[3]" aria-hidden="true" />
          </button>

          {/* Inner Scrollable Container */}
          <div className="max-h-[85vh] overflow-y-auto p-5 sm:p-7 custom-scrollbar rounded-[27px] sm:rounded-[31px]">
            {/* Modal Header */}
            <div className="text-center mb-6">
              <h2
                id="pause-dialog-title"
                className="text-3xl font-black tracking-wider text-[#3d2417] uppercase"
              >
                Pause
              </h2>
              <div className="h-1 w-20 mx-auto mt-1 rounded-full bg-amber-200" />
            </div>

          {/* Controls List (Music, Sound, Haptics) */}
          <div className="space-y-3.5 px-1 sm:px-3 mb-6">
            {/* 1. MUSIC TOGGLE & 10 TRACK BROWSER */}
            <div className="bg-[#fcf8f0] border-2 border-[#ecdcc7] rounded-2xl p-3 shadow-inner space-y-3">
              {/* Music On/Off Toggle Row */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[#9c6a46]">
                  <Music className="w-6 h-6" aria-hidden="true" />
                  <span className="text-xs font-black uppercase tracking-wider text-[#5a3821]">
                    Zen Flute Music
                  </span>
                </div>
                <button
                  id="music-toggle"
                  type="button"
                  onClick={() => {
                    const next = !state.settings.musicEnabled;
                    soundEngine.playToggle(next);
                    updateSettings({ musicEnabled: next });
                  }}
                  aria-pressed={state.settings.musicEnabled}
                  className="w-28 sm:w-32 h-8 rounded-full bg-[#f0e4d0] border-2 border-[#d9c5ab] p-0.5 relative flex items-center shadow-inner cursor-pointer focus-visible:ring-3 focus-visible:ring-amber-400 outline-none"
                >
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      state.settings.musicEnabled
                        ? "w-full bg-gradient-to-r from-amber-400 to-[#38b6ff]"
                        : "w-1/4 bg-stone-300"
                    }`}
                  />
                  <div
                    className={`absolute top-0.5 w-7 h-7 rounded-full bg-[#38b6ff] border-2 border-white shadow-[0_2px_4px_rgba(0,0,0,0.3)] transition-transform duration-300 flex items-center justify-center text-white ${
                      state.settings.musicEnabled
                        ? "right-1 translate-x-0"
                        : "left-1 translate-x-0 bg-stone-400"
                    }`}
                  >
                    <span className="text-[10px] font-black">
                      {state.settings.musicEnabled ? "ON" : "OFF"}
                    </span>
                  </div>
                </button>
              </div>

              {/* Current Active Track Preview & Switcher Trigger */}
              <div className="bg-white/90 border border-amber-200/90 rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-2xl">{activeTrack.icon}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-[#3a2012] truncate">
                        {activeTrack.title}
                      </span>
                      {state.settings.musicEnabled && (
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] font-bold text-amber-800/90 truncate">
                      {activeTrack.badge} · {activeTrack.category.toUpperCase()}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowTrackList(!showTrackList)}
                  className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-900 text-[11px] font-black flex items-center gap-1 transition-all cursor-pointer shrink-0 active:scale-95"
                >
                  <span>{showTrackList ? "Hide" : "Jukebox"}</span>
                  {showTrackList ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Expandable Audio Tracks Jukebox Drawer */}
              {showTrackList && (
                <div className="space-y-2 pt-1 border-t border-amber-200/70">
                  <div className="flex items-center justify-between text-[11px] font-black text-amber-900 px-1">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      Soundtrack Jukebox:
                    </span>
                    <span className="text-[10px] text-stone-500 font-medium">
                      Select · Audition · Buy
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                    {GAME_AUDIO_TRACKS.filter((t) => t.category !== "landing").map((t: AudioTrack) => {
                      const isSelected = selectedTrackId === t.id;
                      const isUnlocked =
                        (state.unlockedSongs || []).includes(t.id) || t.cost === 0;

                      return (
                        <div
                          key={t.id}
                          className={`p-2 rounded-xl border-2 transition-all flex items-center justify-between gap-2 ${
                            isSelected
                              ? "bg-amber-100/90 border-amber-500 shadow-sm"
                              : "bg-white/95 hover:bg-amber-50/70 border-stone-200"
                          }`}
                        >
                          <div
                            className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer"
                            onClick={() => handleSelectTrack(t)}
                          >
                            <span className="text-xl">{t.icon}</span>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-black text-[#3a2012] truncate">
                                  {t.title}
                                </span>
                                {isSelected && (
                                  <span className="px-1.5 py-0.2 bg-emerald-600 text-white rounded text-[9px] font-black uppercase tracking-wider">
                                    Active
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-stone-600 line-clamp-1">
                                {t.description}
                              </p>
                              <div className="flex items-center gap-2 text-[9px] font-bold text-amber-800/90">
                                <span>{t.badge}</span>
                                {!isUnlocked && (
                                  <span className="inline-flex items-center gap-0.5 text-amber-600 font-black">
                                    <Lock className="w-2.5 h-2.5" />
                                    {t.cost} Coins
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Action Button: Play, Audition (20s) or Buy */}
                          <div className="flex items-center gap-1 shrink-0">
                            {isUnlocked ? (
                              <button
                                type="button"
                                onClick={() => handleSelectTrack(t)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-amber-500 text-white shadow-xs ring-1 ring-amber-600"
                                    : "bg-stone-200 hover:bg-amber-300 text-stone-800"
                                }`}
                              >
                                {isSelected ? "Playing" : "Play"}
                              </button>
                            ) : t.category === "other" ? (
                              <button
                                type="button"
                                onClick={() => handleSelectTrack(t)}
                                title="20-second free audition before buy prompt"
                                className="px-2 py-1 rounded-lg bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-stone-950 font-black text-[10px] uppercase tracking-wider shadow-xs cursor-pointer flex items-center gap-1 active:scale-95"
                              >
                                <Volume2 className="w-3 h-3" />
                                <span>20s Audition</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  onClose();
                                  setActiveView("store");
                                }}
                                title="Visit Store to unlock"
                                className="px-2 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 font-black text-[10px] uppercase tracking-wider border border-amber-500/40 shadow-xs cursor-pointer flex items-center gap-1 active:scale-95"
                              >
                                <Coins className="w-3 h-3 text-amber-400" />
                                <span>Store</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Music Volume Slider */}
              <div className="pt-1 flex items-center gap-2 px-1">
                <Volume1 className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider shrink-0">
                  Music Vol
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={state.settings.musicVolume ?? 0.5}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    updateSettings({ musicVolume: v });
                    soundEngine.setMusicVolume(v);
                  }}
                  className="flex-1 accent-amber-500 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] font-mono text-stone-600 tabular-nums w-7 text-right shrink-0">
                  {Math.round((state.settings.musicVolume ?? 0.5) * 100)}%
                </span>
              </div>
            </div>

            {/* 2. SOUND EFFECTS TOGGLE & SFX VOLUME */}
            <div className="bg-[#fcf8f0] border-2 border-[#ecdcc7] rounded-2xl p-3 shadow-inner space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[#9c6a46]">
                  {state.settings.soundEnabled ? (
                    <Volume2 className="w-6 h-6" aria-hidden="true" />
                  ) : (
                    <VolumeX className="w-6 h-6 text-stone-400" aria-hidden="true" />
                  )}
                  <span className="text-xs font-black uppercase tracking-wider text-[#5a3821]">
                    Sound Effects
                  </span>
                </div>
                <button
                  id="sound-toggle"
                  type="button"
                  onClick={() => {
                    const next = !state.settings.soundEnabled;
                    soundEngine.playToggle(next);
                    updateSettings({ soundEnabled: next });
                  }}
                  aria-pressed={state.settings.soundEnabled}
                  className="w-28 sm:w-32 h-8 rounded-full bg-[#f0e4d0] border-2 border-[#d9c5ab] p-0.5 relative flex items-center shadow-inner cursor-pointer focus-visible:ring-3 focus-visible:ring-amber-400 outline-none"
                >
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      state.settings.soundEnabled
                        ? "w-full bg-gradient-to-r from-amber-400 to-[#38b6ff]"
                        : "w-1/4 bg-stone-300"
                    }`}
                  />
                  <div
                    className={`absolute top-0.5 w-7 h-7 rounded-full bg-[#38b6ff] border-2 border-white shadow-[0_2px_4px_rgba(0,0,0,0.3)] transition-transform duration-300 flex items-center justify-center text-white ${
                      state.settings.soundEnabled
                        ? "right-1 translate-x-0"
                        : "left-1 translate-x-0 bg-stone-400"
                    }`}
                  >
                    <span className="text-[10px] font-black">
                      {state.settings.soundEnabled ? "ON" : "OFF"}
                    </span>
                  </div>
                </button>
              </div>

              {/* SFX Volume Slider */}
              <div className="pt-1 flex items-center gap-2 px-1">
                <Volume1 className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider shrink-0">
                  SFX Vol
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={state.settings.soundVolume ?? 0.8}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    updateSettings({ soundVolume: v });
                  }}
                  className="flex-1 accent-amber-500 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] font-mono text-stone-600 tabular-nums w-7 text-right shrink-0">
                  {Math.round((state.settings.soundVolume ?? 0.8) * 100)}%
                </span>
              </div>
            </div>

            {/* 3. HAPTICS TOGGLE */}
            <div className="bg-[#fcf8f0] border-2 border-[#ecdcc7] rounded-2xl p-3 shadow-inner flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[#9c6a46]">
                <Smartphone className="w-6 h-6" aria-hidden="true" />
                <span className="text-xs font-black uppercase tracking-wider text-[#5a3821]">
                  Tactile Haptics
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const next = !state.settings.hapticsEnabled;
                  soundEngine.playToggle(next);
                  updateSettings({ hapticsEnabled: next });
                }}
                aria-pressed={state.settings.hapticsEnabled}
                className={`w-16 h-8 rounded-full border-2 p-0.5 relative transition-colors duration-300 flex items-center cursor-pointer focus-visible:ring-3 focus-visible:ring-amber-400 outline-none ${
                  state.settings.hapticsEnabled
                    ? "bg-[#38b6ff] border-[#1b7ed9]"
                    : "bg-stone-300 border-stone-400"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
                    state.settings.hapticsEnabled ? "translate-x-8" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Action Buttons (Matching Reference: SUPPORT & RESUME) */}
          <div className="space-y-3 px-2 sm:px-4">
            {/* Gold Pill: STORE ITEM GUIDE & SCENARIOS */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setShowEncyclopedia(true);
              }}
              className="w-full py-3.5 px-6 rounded-3xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-stone-950 font-black text-base uppercase tracking-wider shadow-[0_5px_0_0_#92400e] active:translate-y-1 transition-all flex items-center justify-center gap-2.5 border-2 border-amber-200/80 focus-visible:ring-3 focus-visible:ring-amber-400 outline-none cursor-pointer"
            >
              <BookOpen className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />
              <span>Store Item Guide & Scenarios</span>
            </button>

            {/* Blue Pill: SUPPORT */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setShowSupport(!showSupport);
              }}
              className="w-full py-3.5 px-6 rounded-3xl bg-gradient-to-r from-[#38b6ff] to-[#1c8ae6] hover:from-[#47beff] hover:to-[#2297f5] text-white font-black text-lg uppercase tracking-wider shadow-[0_5px_0_0_#1363a8] active:translate-y-1 transition-all flex items-center justify-center gap-3 border-2 border-white/60 focus-visible:ring-3 focus-visible:ring-blue-400 outline-none"
            >
              <Headphones className="w-6 h-6 stroke-[2.5]" aria-hidden="true" />
              <span>Support & Tips</span>
            </button>

            {/* Support Info Expandable Drawer */}
            {showSupport && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-3.5 bg-amber-50 rounded-2xl border-2 border-amber-200 text-xs font-semibold text-stone-700 space-y-2"
              >
                <p className="font-bold text-game-dark">Need help or facing an urge?</p>
                <p>• Hit the red <strong className="text-red-600">Panic</strong> button anytime for 4-7-8 box breathing.</p>
                <p>• Daily entry deadline is <strong className="text-amber-700">12:00 AM midnight</strong>.</p>
                <div className="pt-2 border-t border-amber-200 flex items-center justify-between gap-2 text-[11px] font-bold">
                  <a
                    href="/explore"
                    className="text-amber-900 hover:text-amber-700 flex items-center gap-1"
                  >
                    <img src="/arigato-single-logo.png" alt="" className="w-3.5 h-3.5 object-contain" />
                    <span>Explore Arigato Labs</span>
                  </a>
                  <div className="flex gap-2">
                    <a href="/privacy" className="text-stone-600 hover:text-stone-900 underline">
                      Privacy
                    </a>
                    <a href="/contact" className="text-amber-800 hover:text-amber-950 underline">
                      Contact
                    </a>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Orange Pill: RESUME */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="w-full py-3.5 px-6 rounded-3xl bg-gradient-to-r from-[#ff7a29] to-[#ea580c] hover:from-[#ff883d] hover:to-[#f06115] text-white font-black text-lg uppercase tracking-wider shadow-[0_5px_0_0_#a83e07] active:translate-y-1 transition-all flex items-center justify-center gap-3 border-2 border-white/60 focus-visible:ring-3 focus-visible:ring-orange-400 outline-none"
            >
              <Home className="w-6 h-6 stroke-[2.5]" aria-hidden="true" />
              <span>Resume</span>
            </button>

            {/* Red Pill: LOGOUT */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setShowLogoutConfirm(true);
              }}
              className="w-full py-3 px-6 rounded-3xl bg-gradient-to-r from-red-700 to-rose-800 hover:from-red-600 hover:to-rose-700 text-white font-black text-sm uppercase tracking-wider shadow-[0_4px_0_0_#881337] active:translate-y-1 transition-all flex items-center justify-center gap-2 border-2 border-red-300/40 focus-visible:ring-3 focus-visible:ring-red-400 outline-none cursor-pointer mt-1"
            >
              <LogOut className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
              <span>Logout / Switch Warrior</span>
            </button>
          </div>

          {/* Custom Logout Confirmation Popup */}
          <GameConfirmModal
            isOpen={showLogoutConfirm}
            title="Logout Warrior"
            message="Are you sure you want to log out? You will safely return to the cinematic landing page."
            confirmText="Logout"
            cancelText="Stay"
            variant="danger"
            iconType="logout"
            onConfirm={() => {
              setShowLogoutConfirm(false);
              logout();
              onClose();
            }}
            onCancel={() => setShowLogoutConfirm(false)}
          />

          {/* Song 20s Audition Expiration & Purchase Confirmation Modal */}
          {purchasePromptTrack && (
            <GameConfirmModal
              isOpen={true}
              title={
                purchasePromptTrack.category === "premium"
                  ? "Exclusive Master Track"
                  : "Audition Finished (20s)"
              }
              message={
                purchasePromptTrack.category === "premium"
                  ? `"${purchasePromptTrack.title}" is an epic studio master available in the RPG Bazaar for ${purchasePromptTrack.cost} coins. Visit store to unlock?`
                  : `Buy this song with ${purchasePromptTrack.cost} coins to hear full song? Your current balance is ${state.coins} coins.`
              }
              confirmText={
                purchasePromptTrack.category === "premium"
                  ? "Visit Bazaar"
                  : `Buy for ${purchasePromptTrack.cost} Coins`
              }
              cancelText="Later"
              variant="primary"
              iconType="store"
              onConfirm={() => {
                if (purchasePromptTrack.category === "premium") {
                  setPurchasePromptTrack(null);
                  onClose();
                  setActiveView("store");
                } else {
                  handleConfirmBuySong();
                }
              }}
              onCancel={() => setPurchasePromptTrack(null)}
            />
          )}

          {/* Footer build ID with copy icon (Exact match to Reference Image) */}
          <div className="mt-6 text-center text-stone-500 text-xs font-mono">
            {currentUser?.email ? (
              <div className="mb-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] font-sans font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Cloud Synced: {currentUser.email}</span>
              </div>
            ) : (
              <div className="mb-2">
                <button
                  type="button"
                  onClick={handleLinkGoogle}
                  disabled={isLinkingGoogle}
                  className="px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 text-xs font-bold inline-flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>{isLinkingGoogle ? "Connecting..." : "Sync Progress with Google"}</span>
                </button>
              </div>
            )}

            <div>
              <button
                type="button"
                onClick={handleCopyId}
                className="inline-flex items-center gap-1.5 hover:text-stone-800 transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 rounded px-1 outline-none"
                title="Copy warrior cloud ID"
              >
                <span>UID: {warriorUid.length > 22 ? `${warriorUid.slice(0, 18)}...` : warriorUid}</span>
                {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="text-[11px] font-sans font-bold text-stone-400/90 mt-0.5">
              v2.1.0 (Anime Willpower Edition · Pro7 Firestore)
            </div>
          </div>
          </div>
        </motion.div>

        {/* Store Item Encyclopedia & Scenario Codex Modal */}
        <StoreItemEncyclopediaModal
          isOpen={showEncyclopedia}
          onClose={() => setShowEncyclopedia(false)}
        />
      </div>
    </AnimatePresence>
  );
}
