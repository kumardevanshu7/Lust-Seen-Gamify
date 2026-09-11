"use client";

import React from "react";
import Link from "next/link";
import { LegalLayout } from "@/components/LegalLayout";
import { ArrowRight, CheckCircle, Flame, Shield, Sparkles, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <LegalLayout
      title="About Arigato Labs"
      subtitle="Crafting purposeful willpower software and modern discipline tools."
    >
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-amber-300 font-serif font-black text-lg">
          <Sparkles className="w-5 h-5 text-game-orange" />
          <h2>The Product: Control Urge</h2>
        </div>
        <p>
          <strong className="text-white">Control Urge</strong> is an innovative, gamified habit-tracking
          and willpower RPG platform built by <strong className="text-amber-400">Arigato Labs</strong>.
          Designed to tackle modern hyper-stimuli, compulsions, and cheap dopamine loops, it arms warriors
          with an intuitive <strong>Daily 7 Question Bucket</strong>, anime-inspired elemental disciplines,
          accountability comrades, and an emergency 4-7-8 breathing panic button.
        </p>
      </section>

      <section className="space-y-4 border-t border-white/10 pt-6">
        <div className="flex items-center gap-2 text-amber-300 font-serif font-black text-lg">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <h2>Founder & Vision</h2>
        </div>
        <p>
          Built by <strong className="text-white font-bold">Kumar Devanshu</strong>, founder of{" "}
          <strong className="text-amber-400 font-bold">Arigato Labs</strong> in 2026.
        </p>
        <blockquote className="p-4 rounded-2xl bg-black/40 border-l-4 border-game-orange italic text-amber-100/90 font-serif text-sm">
          &ldquo;We build sleek, modern, high-performance tools that help people get things done with
          clarity and calm. Software should feel fast, natural, and carefully designed.&rdquo;
        </blockquote>
      </section>

      <section className="space-y-4 border-t border-white/10 pt-6">
        <div className="flex items-center gap-2 text-amber-300 font-serif font-black text-lg">
          <Shield className="w-5 h-5 text-cyan-400" />
          <h2>The Arigato Labs Philosophy</h2>
        </div>
        <p>
          We reject clunky bloatware and intrusive tracking. Every app from Arigato Labs is crafted to:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-stone-400 font-medium">
          <li>
            <strong className="text-stone-200">Operate client-side first:</strong> Your personal habit
            records remain strictly on your device.
          </li>
          <li>
            <strong className="text-stone-200">Respect your attention:</strong> Gamification designed to
            strengthen real-world grit, not hook you onto another screen addiction.
          </li>
          <li>
            <strong className="text-stone-200">Deliver uncompromising aesthetic excellence:</strong> Inspired
            by rich anime narratives, tactile physics, and buttery 60fps animations.
          </li>
        </ul>
      </section>

      <div className="border-t border-white/10 pt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs text-stone-400 font-medium">
          Have a question or collaboration proposal for the founder?
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 py-2.5 px-5 rounded-2xl bg-gradient-to-r from-game-orange to-amber-500 hover:from-game-orangeDark text-white font-black text-xs uppercase tracking-wider shadow-sm transition-all"
        >
          <span>Contact Kumar Devanshu</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </LegalLayout>
  );
}
