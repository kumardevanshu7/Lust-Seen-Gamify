"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, ExternalLink, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#180f0a] via-[#120a06] to-[#080402] text-stone-200 flex flex-col justify-between selection:bg-amber-400 selection:text-black">
      {/* Top Navigation */}
      <header className="w-full border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-black uppercase tracking-wider text-amber-200 transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 outline-none"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Arena</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center p-1 rounded-lg bg-white/10 border border-white/15">
              <img
                src="/arigato-single-logo.png"
                alt="Arigato Labs"
                className="w-[18px] h-[18px] object-contain"
              />
            </span>
            <span className="font-serif font-black text-sm text-white tracking-wider uppercase">
              Arigato Labs
            </span>
          </div>

          <Link
            href="/contact"
            className="py-1.5 px-4 rounded-full bg-gradient-to-r from-game-orange to-amber-500 hover:from-game-orangeDark text-white font-black text-xs uppercase tracking-wider shadow-sm transition-all"
          >
            Get In Touch
          </Link>
        </div>
      </header>

      {/* Explore Content Body (Directly matching ARIGATO_BRANDING_SETUP.md) */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center space-y-8">
        <header className="space-y-3">
          <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight font-serif">
            Our Company
          </h1>
          <p className="text-base sm:text-lg text-amber-200/80 font-medium max-w-xl mx-auto">
            Redefining willpower, dopamine management, and habit tracking for the modern era.
          </p>
        </header>

        {/* Big Main Logo Display */}
        <div className="py-4 sm:py-6 flex items-center justify-center">
          <img
            src="/arigato-labs-logo.png"
            alt="Arigato Labs Logo"
            className="max-w-[650px] w-full object-contain drop-shadow-[0_8px_30px_rgba(0,0,0,0.7)]"
          />
        </div>

        {/* Founder & Mission Section */}
        <div className="max-w-2xl mx-auto space-y-5 text-center">
          {/* Verified Founder Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-black uppercase tracking-wider">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Verified Founder · 2026</span>
          </div>

          <p className="text-lg sm:text-xl text-stone-200 font-semibold leading-relaxed">
            <strong className="text-amber-300 font-black">Control Urge</strong> is proudly developed by{" "}
            <strong className="text-white font-black">Kumar Devanshu</strong>, the founder of{" "}
            <strong className="text-amber-400 font-black">Arigato Labs</strong> in 2026.
          </p>

          <p className="text-sm sm:text-base text-stone-400 font-medium leading-relaxed">
            Our mission is to build sleek, modern, and high-performance tools that empower individuals
            and teams to achieve their goals with elegance and ease. We believe software should feel
            natural, fast, and distinctly beautiful.
          </p>

          {/* Quick Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/"
              className="py-3 px-6 rounded-full bg-gradient-to-r from-game-orange to-amber-500 hover:from-game-orangeDark text-white font-black text-xs uppercase tracking-wider shadow-game-orange flex items-center gap-2"
            >
              <span>Play Control Urge</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </Link>
            <Link
              href="/contact"
              className="py-3 px-6 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black text-xs uppercase tracking-wider"
            >
              Contact Founder
            </Link>
          </div>
        </div>
      </main>

      {/* Symmetrical Legal Footer per ARIGATO_BRANDING_SETUP.md */}
      <footer className="w-full border-t border-white/10 bg-black/60 py-10 px-4 text-center text-xs text-stone-500 space-y-4">
        <h4 className="font-serif font-black text-sm uppercase tracking-widest text-stone-300">
          ARIGATO LABS
        </h4>
        <p className="text-stone-400 font-bold">
          Copyright © 2026 Arigato Labs. All Rights Reserved.
        </p>
        <p className="text-stone-400/90 max-w-md mx-auto leading-relaxed">
          <strong className="text-stone-200">Control Urge</strong> is a product of Arigato Labs, founded by Kumar Devanshu.
          Brand name and logos may not be reused outside Arigato Labs apps without permission.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 text-stone-400 font-bold uppercase tracking-wider text-[11px] pt-1">
          <Link href="/about" className="hover:text-white transition-colors">
            About
          </Link>
          <span>·</span>
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy
          </Link>
          <span>·</span>
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms
          </Link>
          <span>·</span>
          <Link href="/disclaimer" className="hover:text-white transition-colors">
            Disclaimer
          </Link>
          <span>·</span>
          <Link href="/contact" className="hover:text-white transition-colors">
            Contact: kumardevanshu3001@gmail.com
          </Link>
        </div>
      </footer>
    </div>
  );
}
