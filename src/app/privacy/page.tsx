"use client";

import React from "react";
import Link from "next/link";
import { LegalLayout } from "@/components/LegalLayout";
import { Lock, ShieldCheck, Database, EyeOff, Server, AlertCircle } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      subtitle="How Control Urge and Arigato Labs safeguard your personal habit data."
    >
      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 text-emerald-200 text-xs font-semibold flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
        <span>
          <strong>100% Anonymous First:</strong> Control Urge does not require phone numbers, government
          IDs, or social media logins. Your habit answers are stored locally on your device.
        </span>
      </div>

      <section className="space-y-3">
        <h2 className="text-base font-black text-amber-300 uppercase tracking-wider font-serif">
          1. Who We Are
        </h2>
        <p>
          This policy applies to <strong>Control Urge</strong>, a product engineered by{" "}
          <strong>Arigato Labs</strong>, founded by Kumar Devanshu in 2026. For questions regarding
          privacy practices, contact us directly at:{" "}
          <a href="mailto:kumardevanshu3001@gmail.com" className="text-amber-400 underline font-bold">
            kumardevanshu3001@gmail.com
          </a>.
        </p>
      </section>

      <section className="space-y-3 border-t border-white/10 pt-5">
        <h2 className="text-base font-black text-amber-300 uppercase tracking-wider font-serif">
          2. What We Collect
        </h2>
        <p>
          We deliberately minimize all data collection to the bare essentials necessary to power the
          RPG game mechanics:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-stone-400 font-medium">
          <li>
            <strong className="text-stone-200">Warrior Profile:</strong> Chosen display alias,
            public @handle (e.g., <code>@ronin_warrior</code>), gender selection, relationship status,
            and elemental discipline class.
          </li>
          <li>
            <strong className="text-stone-200">Daily Accountability Logs:</strong> Answers to your
            chosen 7 bucket questions, daily clean checks, XP, HP delta, and streak counts.
          </li>
          <li>
            <strong className="text-stone-200">App Settings:</strong> Sound effects and haptics preferences.
          </li>
        </ul>
      </section>

      <section className="space-y-3 border-t border-white/10 pt-5">
        <h2 className="text-base font-black text-amber-300 uppercase tracking-wider font-serif">
          3. How We Use Data
        </h2>
        <p>
          Your data is used solely to render your gamified experience: calculating health points (HP),
          level progression (XP), awarding anime titles, managing clan affiliations, and locking your
          daily accountability log.
        </p>
      </section>

      <section className="space-y-3 border-t border-white/10 pt-5">
        <h2 className="text-base font-black text-amber-300 uppercase tracking-wider font-serif">
          4. Third Parties & Zero Data Selling
        </h2>
        <p>
          <strong className="text-white">We do not sell, rent, or trade your personal data</strong> to
          advertisers, data brokers, or marketing syndicates. The app is statically hosted on Vercel
          with standard network transmission encryption (HTTPS/TLS).
        </p>
      </section>

      <section className="space-y-3 border-t border-white/10 pt-5">
        <h2 className="text-base font-black text-amber-300 uppercase tracking-wider font-serif">
          5. Storage, Retention & Deletion
        </h2>
        <p>
          All habit logs, XP, and warrior attributes are retained in your local browser storage
          (<code>localStorage</code>). You retain absolute control over your records:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-stone-400 font-medium">
          <li>Clearing browser storage or cache permanently erases all session records.</li>
          <li>
            The in-app <strong>Logout / Reset</strong> button cleanly resets all profile data back to
            initial factory state immediately.
          </li>
        </ul>
      </section>

      <section className="space-y-3 border-t border-white/10 pt-5">
        <h2 className="text-base font-black text-amber-300 uppercase tracking-wider font-serif">
          6. Security Safeguards
        </h2>
        <p>
          We employ sensible client-side isolation and encryption practices. However, no digital system
          or device transmission is 100% immune to local unauthorized physical access; we encourage
          locking your personal device.
        </p>
      </section>

      <section className="space-y-3 border-t border-white/10 pt-5">
        <h2 className="text-base font-black text-amber-300 uppercase tracking-wider font-serif">
          7. Children&apos;s Privacy
        </h2>
        <p>
          Control Urge is not intended for or directed toward children under 13 years of age. If you
          become aware that a child under 13 has provided personal information, please notify us so we
          can ensure its prompt deletion.
        </p>
      </section>

      <section className="space-y-3 border-t border-white/10 pt-5">
        <h2 className="text-base font-black text-amber-300 uppercase tracking-wider font-serif">
          8. Policy Updates
        </h2>
        <p>
          We may occasionally update this Privacy Policy to reflect app enhancements or statutory
          amendments. Continued usage of Control Urge constitutes acceptance of any revised terms.
        </p>
        <p className="text-xs text-stone-500 font-mono mt-3">
          Last Updated: 2026 · Arigato Labs Compliance
        </p>
      </section>
    </LegalLayout>
  );
}
