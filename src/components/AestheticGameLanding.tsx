"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { soundEngine } from "@/lib/soundEngine";
import {
  Volume2,
  VolumeX,
  Play,
  ArrowRight,
  Sparkles,
  Shield,
  Flame,
  Globe,
  Menu,
  X,
  Maximize,
  Award,
  Zap,
  CheckCircle2,
  FileText,
  Info,
  Lock,
  AlertOctagon,
  Mail,
  ChevronRight,
  Compass,
  LogIn,
} from "lucide-react";
import { useGame } from "@/context/GameContext";
import { WaterDropsOverlay } from "@/components/WaterDropsOverlay";
import { LandingCodexModal, CodexTab } from "@/components/LandingCodexModal";

interface AestheticGameLandingProps {
  onStartOnboarding: () => void;
}

export function AestheticGameLanding({ onStartOnboarding }: AestheticGameLandingProps) {
  const { state, currentUser, loginGoogle, setLandingBackgroundVideo, updateSettings, setActiveBgmSong } = useGame();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const currentVideo = state.landingBackgroundVideo || "video-2";
  const [isMuted, setIsMuted] = useState(false);
  const [videoTime, setVideoTime] = useState("0:00");
  const [videoDuration, setVideoDuration] = useState("0:16");
  const [codexModalOpen, setCodexModalOpen] = useState(false);
  const [codexTab, setCodexTab] = useState<CodexTab>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // isTransitioning: true when Enter Arena clicked — triggers slow rain + fade-out
  const [isTransitioning, setIsTransitioning] = useState(false);

  const openCodex = (tab: CodexTab) => {
    soundEngine.playClick();
    setCodexTab(tab);
    setCodexModalOpen(true);
  };

  const audioUnlockedRef = useRef(false);
  // Start as true — music is always pending until first user gesture fires it
  const audioPendingRef = useRef(true);

  // Audio state sync effect - runs whenever video or mute state changes
  // IMPORTANT: Only actually plays audio if user has already interacted (audioUnlockedRef)
  // This prevents the AudioContext/autoplay browser policy errors on page load
  useEffect(() => {
    if (isMuted) {
      soundEngine.stopLandingTheme();
      if (videoRef.current) {
        videoRef.current.muted = true;
      }
      audioPendingRef.current = false;
      return;
    }

    if (currentVideo === "video-1") {
      soundEngine.stopLandingTheme();
      if (videoRef.current) {
        videoRef.current.muted = false;
        // Video elements can autoplay with muted=false after user gesture
        if (audioUnlockedRef.current) {
          videoRef.current.play().catch(() => {});
        }
      }
      audioPendingRef.current = false;
    } else {
      // Video 2: mute the video element, play landing BGM via HTML5 Audio
      if (videoRef.current) {
        videoRef.current.muted = true;
        videoRef.current.play().catch(() => {});
      }
      if (audioUnlockedRef.current) {
        soundEngine.playLandingTheme();
        audioPendingRef.current = false;
      } else {
        // Mark audio as pending - will play on first user interaction
        audioPendingRef.current = true;
      }
    }
  }, [currentVideo, isMuted]);

  // NOTE: No unmount cleanup for stopLandingTheme — music intentionally continues
  // when user navigates to /about, /privacy etc. It stops only when arena BGM starts.

  // Universal gesture unlock - fires on first user interaction anywhere on page
  // This is the ONLY place where audio actually starts playing after mount
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (audioUnlockedRef.current) return;
      audioUnlockedRef.current = true;

      if (!isMuted) {
        if (currentVideo === "video-2" && audioPendingRef.current) {
          soundEngine.playLandingTheme();
          audioPendingRef.current = false;
        } else if (currentVideo === "video-1" && videoRef.current) {
          videoRef.current.muted = false;
          videoRef.current.play().catch(() => {});
        }
      }
    };

    const events = ["pointerdown", "touchstart", "click", "keydown", "scroll"];
    events.forEach((ev) => {
      window.addEventListener(ev, handleFirstInteraction, { once: true, passive: true });
    });

    return () => {
      events.forEach((ev) => {
        window.removeEventListener(ev, handleFirstInteraction);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentVideo, isMuted]);

  const handleToggleBackground = (targetVid: "video-1" | "video-2") => {
    soundEngine.playClick();
    setLandingBackgroundVideo(targetVid);
  };

  const toggleMute = () => {
    soundEngine.playClick();
    setIsMuted((prev) => !prev);
  };

  const handleGoogleSignIn = async () => {
    soundEngine.playClick();
    setIsLoggingIn(true);
    try {
      const res = await loginGoogle();
      if (res.success) {
        if (!res.isOnboarded) {
          onStartOnboarding();
        } else {
          updateSettings({ selectedBgmTrack: "arena_japanese_girl_whisper", musicEnabled: true });
        }
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleEnterArena = async () => {
    soundEngine.playClick();

    // Slow the rain and begin fade transition
    setIsTransitioning(true);

    // Wait 2 seconds with slow rain, then proceed
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (currentUser) {
      if (!state.isOnboarded) {
        onStartOnboarding();
      } else {
        updateSettings({ selectedBgmTrack: "arena_japanese_girl_whisper", musicEnabled: true });
      }
      return;
    }

    try {
      const res = await loginGoogle();
      if (res.success) {
        if (!res.isOnboarded) {
          onStartOnboarding();
        } else {
          updateSettings({ selectedBgmTrack: "arena_japanese_girl_whisper", musicEnabled: true });
        }
      } else {
        onStartOnboarding();
      }
    } catch {
      onStartOnboarding();
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Track video progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const cur = Math.floor(video.currentTime);
      const dur = Math.floor(video.duration || 16);
      const curStr = `0:${String(cur).padStart(2, "0")}`;
      const durStr = `0:${String(dur).padStart(2, "0")}`;
      setVideoTime(curStr);
      setVideoDuration(durStr);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, [currentVideo]);

  return (
    <div className="relative w-full min-h-[100dvh] bg-black text-white flex flex-col overflow-x-hidden overflow-y-auto select-none font-sans">
      {/* Cinematic fade-out overlay — activates on Enter Arena (2s transition) */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            key="fade-overlay"
            className="fixed inset-0 z-[200] bg-black pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>

      {/* 1. BACKGROUND VIDEO LAYER WITH ZOOM-OUT (16:9) & 9:16 ROTATION FOR VIDEO 2 */}
      <div className="absolute inset-0 z-0 bg-[#050201] flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          key={currentVideo}
          src={currentVideo === "video-1" ? "/vids/video-1.mp4" : "/vids/video-2.mp4"}
          autoPlay
          loop
          muted={currentVideo === "video-2" ? true : isMuted}
          playsInline
          preload="auto"
          className={`transition-all duration-700 pointer-events-none ${
            currentVideo === "video-2"
              ? "w-[100vh] h-[100vw] max-w-none object-cover rotate-90 origin-center sm:rotate-0 sm:w-full sm:h-full sm:object-cover sm:scale-100"
              : "w-full h-full object-cover object-center scale-[1.02] sm:scale-100"
          }`}
        />

        {/* Upper Atmospheric Black Fog (Masks 16:9 upper empty space seamlessly) */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-48 sm:h-64 bg-gradient-to-b from-black via-black/90 via-45% to-transparent pointer-events-none z-1"
        />

        {/* Ambient Low-Opacity Water Drops & Rain Layer — slows on Enter Arena */}
        <WaterDropsOverlay slow={isTransitioning} />


        {/* Lower Atmospheric Black Fog (Blends video into hero text and controls) */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-64 sm:h-80 bg-gradient-to-t from-black via-black/90 via-35% to-transparent pointer-events-none z-1"
        />

        {/* Cinematic Vignette & Moody Lighting Overlays */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent pointer-events-none z-1"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-rose-950/15 mix-blend-color pointer-events-none z-1"
        />
      </div>

      {/* 2. TOP NAVIGATION BAR */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-4 flex flex-col gap-2 sm:gap-0 sm:flex-row sm:items-center sm:justify-between">

        {/* ── ROW 1 / LEFT: Brand Logo + Menu Pill + (Mobile-only CTA) ── */}
        <div className="w-full flex items-center justify-between sm:w-auto gap-2 sm:gap-4 shrink-0">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 shrink-0">
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
                aria-expanded={mobileMenuOpen}
                aria-label="Open navigation and legal menu"
                className="px-2.5 sm:px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-[11px] sm:text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 outline-none cursor-pointer shadow-sm active:scale-95 shrink-0"
              >
                {mobileMenuOpen ? (
                  <X className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
                ) : (
                  <Menu className="w-3.5 h-3.5" aria-hidden="true" />
                )}
                <span>Menu</span>
              </button>

              {/* Dropdown Menu Overlay & Box */}
              <AnimatePresence>
                {mobileMenuOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      onClick={() => setMobileMenuOpen(false)}
                      className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs"
                    />

                    {/* Menu Dropdown Container */}
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.18 }}
                      className="absolute top-full left-0 mt-2.5 w-72 sm:w-80 rounded-3xl bg-[#180e08]/95 border-2 border-amber-800/80 shadow-[0_15px_40px_rgba(0,0,0,0.85)] p-4 text-stone-200 z-50 backdrop-blur-xl space-y-3"
                    >
                      {/* 1. Explore Arigato Labs Featured Pill */}
                      <Link
                        href="/explore"
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-transparent border border-amber-400/40 hover:border-amber-300 flex items-center justify-between transition-all group shadow-sm"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="p-1.5 rounded-xl bg-white/10 border border-white/15 group-hover:bg-white/20 transition-colors">
                            <img
                              src="/arigato-single-logo.png"
                              alt="Arigato Labs"
                              className="w-[17px] h-[17px] object-contain"
                            />
                          </span>
                          <div>
                            <div className="text-xs font-black text-white group-hover:text-amber-200 transition-colors uppercase tracking-wider">
                              Explore Arigato Labs
                            </div>
                            <div className="text-[10px] text-amber-300/90 font-bold">
                              Company · Founder · 2026
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                      </Link>

                      {/* 2. Core Legal & Company Pages */}
                      <div className="space-y-1">
                        <div className="text-[10px] font-black uppercase tracking-widest text-stone-400 px-2 py-0.5">
                          Company & Legal
                        </div>

                        <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-stone-300 hover:text-white hover:bg-white/10 transition-colors">
                          <Info className="w-4 h-4 text-cyan-400" />
                          <span>About Arigato Labs</span>
                        </Link>
                        <Link href="/privacy" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-stone-300 hover:text-white hover:bg-white/10 transition-colors">
                          <Lock className="w-4 h-4 text-emerald-400" />
                          <span>Privacy Policy (Anonymous)</span>
                        </Link>
                        <Link href="/terms" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-stone-300 hover:text-white hover:bg-white/10 transition-colors">
                          <FileText className="w-4 h-4 text-amber-400" />
                          <span>Terms & Conditions</span>
                        </Link>
                        <Link href="/disclaimer" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-stone-300 hover:text-white hover:bg-white/10 transition-colors">
                          <AlertOctagon className="w-4 h-4 text-rose-400" />
                          <span>Disclaimer & Limits</span>
                        </Link>
                        <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 transition-colors">
                          <Mail className="w-4 h-4 text-amber-400" />
                          <span>Direct Founder Contact</span>
                        </Link>
                      </div>

                      {/* 3. Game Codex Tabs Access */}
                      <div className="pt-2 border-t border-white/10 space-y-1">
                        <div className="text-[10px] font-black uppercase tracking-widest text-stone-400 px-2 py-0.5">
                          Game Guides
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          {[
                            { label: "📖 Overview", tab: "overview" as CodexTab },
                            { label: "⚡ 10 Skills", tab: "skills" as CodexTab },
                            { label: "⛩️ Anime Clans", tab: "clans" as CodexTab },
                            { label: "📜 Snake Rules", tab: "rules" as CodexTab },
                          ].map(({ label, tab }) => (
                            <button
                              key={tab}
                              type="button"
                              onClick={() => { setMobileMenuOpen(false); openCodex(tab); }}
                              className="text-left px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-semibold text-stone-300 cursor-pointer"
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 4. Mini Brand Footer */}
                      <div className="pt-2 border-t border-white/10 text-center text-[10px] text-stone-400 font-mono">
                        Control Urge · Arigato Labs © 2026
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Stylized Gothic Title Logo */}
            <h1 className="text-sm sm:text-lg lg:text-xl font-black tracking-tight sm:tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-stone-200 to-rose-200 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] font-serif uppercase whitespace-nowrap shrink-0">
              Control Urge
            </h1>
          </div>

          {/* Mobile-Only Top Right "Enter Arena" Button (Always 100% visible, never cut off) */}
          <div className="flex sm:hidden items-center shrink-0">
            <button
              type="button"
              onClick={handleEnterArena}
              className="py-1.5 px-3 rounded-full bg-gradient-to-r from-[#e11d48] to-[#be123c] text-white font-black text-[11px] uppercase tracking-wide shadow-[0_4px_15px_rgba(225,29,72,0.5)] active:translate-y-0.5 transition-all border border-rose-300/40 outline-none cursor-pointer whitespace-nowrap shrink-0"
            >
              Enter Arena
            </button>
          </div>
        </div>

        {/* ── CENTER: Nav Links (Visible only on xl: to prevent overlap on laptops & tablets) ── */}
        <nav
          aria-label="Landing site navigation"
          className="hidden xl:flex items-center gap-6 lg:gap-8 text-xs font-bold tracking-wider text-stone-300 uppercase"
        >
          {[
            { label: "Overview", tab: "overview" as CodexTab },
            { label: "Elemental Skills", tab: "skills" as CodexTab },
            { label: "Anime Clans", tab: "clans" as CodexTab },
            { label: "Rules & Bucket", tab: "rules" as CodexTab },
          ].map(({ label, tab }) => (
            <button key={tab} type="button" onClick={() => openCodex(tab)} className="hover:text-white transition-colors cursor-pointer">
              {label}
            </button>
          ))}
        </nav>

        {/* ── RIGHT (Desktop & Tablet): Media Switcher + Audio + Google + Enter Arena ── */}
        <div className="hidden sm:flex items-center gap-2 lg:gap-3 shrink-0">
          {/* Video Switcher */}
          <div className="flex items-center rounded-full bg-black/70 border border-white/25 p-0.5 backdrop-blur-md shadow-lg">
            <button
              type="button"
              onClick={() => handleToggleBackground("video-1")}
              className={`px-2.5 lg:px-3 py-1 rounded-full text-[10px] lg:text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                currentVideo === "video-1"
                  ? "bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md ring-1 ring-rose-300/40"
                  : "text-stone-300 hover:text-white"
              }`}
            >
              <span>🎬 V1</span>
              <span className="text-[9px] text-stone-400 font-mono hidden md:inline">(16:9)</span>
            </button>
            <button
              type="button"
              onClick={() => handleToggleBackground("video-2")}
              className={`px-2.5 lg:px-3 py-1 rounded-full text-[10px] lg:text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                currentVideo === "video-2"
                  ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md ring-1 ring-amber-300/40"
                  : "text-stone-300 hover:text-white"
              }`}
            >
              <span>🌸 V2</span>
              <span className="text-[9px] text-amber-200 font-mono hidden md:inline">(9:16)</span>
            </button>
          </div>

          {/* Audio Mute/Unmute */}
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute sound" : "Mute sound"}
            className={`px-2.5 lg:px-3 py-1.5 rounded-full border backdrop-blur-md text-[10px] lg:text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-md ${
              !isMuted
                ? "bg-emerald-950/80 border-emerald-500/60 text-emerald-300"
                : "bg-black/70 border-white/25 text-stone-400 hover:text-white"
            }`}
          >
            {!isMuted ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="hidden md:inline">Audio ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden md:inline">Muted</span>
              </>
            )}
          </button>

          {/* Language Flag (hidden on smaller tablet screens) */}
          <div className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-stone-300">
            <Globe className="w-3.5 h-3.5 text-rose-400" />
            <span>EN</span>
          </div>

          {/* Google Auth Pill */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-xs font-bold text-emerald-300 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="max-w-[100px] truncate">{currentUser.displayName || "Synced"}</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoggingIn}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-md text-xs font-bold text-white transition-all cursor-pointer shadow-sm active:scale-95"
              title="Sign in with Google"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span className="hidden lg:inline">{isLoggingIn ? "..." : "Google Login"}</span>
            </button>
          )}

          {/* Desktop Enter Arena CTA */}
          <button
            type="button"
            onClick={handleEnterArena}
            className="py-1.5 sm:py-2 px-4 lg:px-5 rounded-full bg-gradient-to-r from-[#e11d48] to-[#be123c] hover:from-[#f43f5e] hover:to-[#e11d48] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_4px_15px_rgba(225,29,72,0.5)] active:translate-y-0.5 transition-all border border-rose-300/40 outline-none cursor-pointer whitespace-nowrap shrink-0"
          >
            Enter Arena
          </button>
        </div>

        {/* ── ROW 2 (mobile only): Full-width frosted HUD control bar ── */}
        <div className="sm:hidden w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md shadow-inner">
          {/* Video Switcher */}
          <div className="flex items-center rounded-full bg-white/5 border border-white/15 p-0.5 gap-0.5">
            <button
              type="button"
              onClick={() => handleToggleBackground("video-1")}
              className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                currentVideo === "video-1"
                  ? "bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-sm"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              <span>🎬</span>
              <span>V1</span>
              <span className="text-[8px] font-mono opacity-70">16:9</span>
            </button>
            <button
              type="button"
              onClick={() => handleToggleBackground("video-2")}
              className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                currentVideo === "video-2"
                  ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-sm"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              <span>🌸</span>
              <span>V2</span>
              <span className="text-[8px] font-mono opacity-70">9:16</span>
            </button>
          </div>

          {/* Audio Toggle */}
          <button
            type="button"
            onClick={toggleMute}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all active:scale-95 cursor-pointer ${
              !isMuted
                ? "bg-emerald-950/80 border-emerald-500/50 text-emerald-300"
                : "bg-white/5 border-white/15 text-stone-400"
            }`}
          >
            {!isMuted ? (
              <><Volume2 className="w-3 h-3 text-emerald-400 animate-pulse" /><span>Audio ON</span></>
            ) : (
              <><VolumeX className="w-3 h-3 text-rose-400" /><span>Muted</span></>
            )}
          </button>
        </div>

      </header>

      {/* 3. HERO CONTENT SECTION - Bottom-left, cinematic movie-poster style */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-10 flex-1 flex flex-col justify-end pb-8 sm:pb-16">
        <div className="max-w-xl">
          {/* Sub-Kicker Tag */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-stone-300/90 mb-1.5 font-serif"
          >
            Enter The
          </motion.div>

          {/* Giant Stylized Fantasy Title (Matching Image 2: "WORLD OF RANDOM") */}
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight leading-[0.95] font-serif drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]"
          >
            World <br />
            Of Control
          </motion.h2>

          {/* Decorative Swirl Flourish Line (Replicating Image 2's ornate underline flourish) */}
          <div className="my-4 sm:my-5 flex items-center gap-2 max-w-xs sm:max-w-sm">
            <svg
              viewBox="0 0 240 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-4 text-rose-400/80 stroke-current"
            >
              <path
                d="M4 8 C30 8, 45 3, 70 8 C95 13, 115 4, 140 8 C165 12, 185 5, 210 8 C225 10, 236 8, 236 8"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="120" cy="8" r="3" fill="currentColor" />
              <circle cx="4" cy="8" r="2.5" fill="currentColor" />
              <circle cx="236" cy="8" r="2.5" fill="currentColor" />
            </svg>
          </div>

          <p className="text-xs sm:text-sm text-stone-300 font-medium leading-relaxed max-w-md drop-shadow mb-6">
            Master your mind, conquer cheap dopamine spikes, pick your <strong>Daily 7 Bucket Questions</strong>, and awaken your Shonen discipline partner.
          </p>

          {/* Action Buttons (Matching Image 2: "Buy" & "Watch Trailer") */}
          {/* Action Buttons (Matching Image 2: "Buy" & "Watch Trailer") */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-4">
            {/* Primary Crimson Coral Pill */}
            <button
              type="button"
              onClick={handleEnterArena}
              className="py-3 px-5 sm:py-3.5 sm:px-7 rounded-full bg-gradient-to-r from-[#e11d48] to-[#be123c] hover:from-[#f43f5e] hover:to-[#e11d48] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_6px_20px_rgba(225,29,72,0.6)] active:translate-y-0.5 transition-all border border-rose-300/50 flex items-center gap-2 focus-visible:ring-3 focus-visible:ring-rose-400 outline-none cursor-pointer whitespace-nowrap"
            >
              <span>Begin Journey</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
            </button>

            {/* Google Cloud Sync Sign-In Pill */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoggingIn}
              className="py-3 px-4 sm:py-3.5 sm:px-6 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md active:translate-y-0.5 transition-all flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-white outline-none cursor-pointer whitespace-nowrap"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{isLoggingIn ? "Connecting..." : "Google Sync"}</span>
            </button>

            {/* Frosted Secondary Pill */}
            <button
              type="button"
              onClick={() => openCodex("rules")}
              className="py-3 px-4 sm:py-3.5 sm:px-6 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md active:translate-y-0.5 transition-all flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-amber-400 outline-none cursor-pointer whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Rules</span>
            </button>
          </div>
        </div>

        {/* 4. BOTTOM-RIGHT ACCOLADES & CONTROLS (Matching Image 2's Laurel Badges & Audio) */}
        <div className="hidden sm:flex absolute right-5 sm:right-10 bottom-8 sm:bottom-12 flex-col items-end gap-3 z-10">
          {/* Laurel Accolade Badges (Like Tribeca Festival laurels in Image 2) */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Laurel 1 */}
            <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 text-center min-w-[100px]">
              <div className="flex items-center text-amber-300 text-xs">
                <span>🌿</span>
                <span className="font-serif font-bold text-[10px] uppercase tracking-wider px-1">
                  10K+ Clean
                </span>
                <span className="scale-x-[-1]">🌿</span>
              </div>
              <span className="text-[9px] text-stone-400 font-semibold">Streaks Logged</span>
            </div>

            {/* Laurel 2 */}
            <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 text-center min-w-[100px]">
              <div className="flex items-center text-rose-300 text-xs">
                <span>🌿</span>
                <span className="font-serif font-bold text-[10px] uppercase tracking-wider px-1">
                  Iron Will
                </span>
                <span className="scale-x-[-1]">🌿</span>
              </div>
              <span className="text-[9px] text-stone-400 font-semibold">Guild Approved</span>
            </div>
          </div>

          {/* Bottom Audio & Video Controls with Change Background Switcher */}
          <div className="flex flex-wrap items-center justify-end gap-2">
            {/* Change Background Switcher Pill */}
            <div className="flex items-center rounded-full bg-black/60 border border-white/20 p-0.5 backdrop-blur-md shadow-lg">
              <button
                type="button"
                onClick={() => handleToggleBackground("video-1")}
                className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentVideo === "video-1"
                    ? "bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md ring-1 ring-rose-300/40"
                    : "text-stone-300 hover:text-white"
                }`}
              >
                <span>🎬 Video 1</span>
                <span className="text-[9px] text-rose-200">(Audio)</span>
              </button>
              <button
                type="button"
                onClick={() => handleToggleBackground("video-2")}
                className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentVideo === "video-2"
                    ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md ring-1 ring-amber-300/40"
                    : "text-stone-300 hover:text-white"
                }`}
              >
                <span>🌸 Video 2</span>
                <span className="text-[9px] text-amber-200">(BGM)</span>
              </button>
            </div>

            {/* Time indicator (Matching Image 2: "0:03 / 0:16") */}
            <div className="px-2.5 py-1 rounded-full bg-black/50 border border-white/10 text-[11px] font-mono font-bold text-stone-300 tabular-nums">
              {videoTime} / {videoDuration}
            </div>

            {/* Audio Mute/Unmute Toggle */}
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute background video" : "Mute background video"}
              className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 flex items-center justify-center text-white transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 outline-none cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-rose-400" />}
            </button>
          </div>
        </div>
        {/* Symmetrical Bottom Legal Footer per Important integration.md */}
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 text-center text-[11px] text-stone-400 font-semibold hidden md:flex items-center gap-3 backdrop-blur-md bg-black/40 px-4 py-1.5 rounded-full border border-white/10">
          <Link href="/explore" className="hover:text-amber-300 transition-colors">
            Explore Arigato Labs
          </Link>
          <span className="opacity-40">·</span>
          <Link href="/about" className="hover:text-white transition-colors">
            About
          </Link>
          <span className="opacity-40">·</span>
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy
          </Link>
          <span className="opacity-40">·</span>
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms
          </Link>
          <span className="opacity-40">·</span>
          <Link href="/disclaimer" className="hover:text-white transition-colors">
            Disclaimer
          </Link>
          <span className="opacity-40">·</span>
          <Link href="/contact" className="hover:text-white transition-colors">
            Contact
          </Link>
        </div>
      </div>

      {/* 5. WILLPOWER CODEX & SNAKE RULES MODAL */}
      <LandingCodexModal
        isOpen={codexModalOpen}
        initialTab={codexTab}
        onClose={() => setCodexModalOpen(false)}
        onStartOnboarding={onStartOnboarding}
        onGoogleSignIn={handleGoogleSignIn}
        isLoggingIn={isLoggingIn}
        currentUser={currentUser}
        isOnboarded={state.isOnboarded}
      />
    </div>
  );
}
