"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Mail, ShieldCheck } from "lucide-react";

interface LegalLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function LegalLayout({ title, subtitle, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1c100a] via-[#140b07] to-[#0a0503] text-stone-200 flex flex-col justify-between selection:bg-amber-400 selection:text-black">
      {/* Top Header */}
      <header className="w-full border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-black uppercase tracking-wider text-amber-200 transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 outline-none"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Arena</span>
          </Link>

          {/* Arigato Labs Brand Mark */}
          <Link href="/explore" className="flex items-center gap-2 group">
            <span className="inline-flex items-center justify-center p-1 rounded-lg bg-white/10 border border-white/15 group-hover:bg-white/20 transition-colors">
              <img
                src="/arigato-single-logo.png"
                alt="Arigato Labs"
                className="w-[18px] h-[18px] object-contain"
              />
            </span>
            <span className="font-serif font-black text-sm text-white tracking-wider uppercase group-hover:text-amber-200 transition-colors">
              Arigato Labs
            </span>
          </Link>

          {/* Quick Legal Nav (Hidden on smallest screens) */}
          <nav className="hidden sm:flex items-center gap-4 text-xs font-bold text-stone-400 uppercase tracking-wider">
            <Link href="/explore" className="hover:text-white transition-colors">
              Explore
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              About
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/contact" className="hover:text-amber-300 transition-colors text-amber-400 font-black">
              Contact
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-widest mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Arigato Labs Official</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight font-serif">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm sm:text-base text-stone-400 font-medium mt-2 max-w-xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Paper Container for Article Content */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[#1f130c]/90 border-2 border-amber-900/60 shadow-2xl space-y-6 text-stone-300 text-sm leading-relaxed">
          {children}
        </div>
      </main>

      {/* Standard Arigato Labs Footer */}
      <footer className="w-full border-t border-white/10 bg-black/60 py-8 px-4 text-center text-xs text-stone-500 space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-bold uppercase tracking-wider text-stone-400">
          <Link href="/explore" className="hover:text-white transition-colors">
            Explore
          </Link>
          <span>·</span>
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
            Contact
          </Link>
        </div>

        <div className="max-w-xl mx-auto text-stone-400/80 leading-relaxed font-medium">
          <p className="font-bold text-stone-300">
            Control Urge is a product of Arigato Labs, founded by Kumar Devanshu.
          </p>
          <p className="text-[11px] text-stone-500 mt-1">
            Copyright © 2026 Arigato Labs. All Rights Reserved. Contact: kumardevanshu3001@gmail.com
          </p>
        </div>
      </footer>
    </div>
  );
}
