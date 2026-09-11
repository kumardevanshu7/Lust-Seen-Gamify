"use client";

import React from "react";
import Link from "next/link";
import { LegalLayout } from "@/components/LegalLayout";
import { AlertOctagon, HeartHandshake, ShieldAlert } from "lucide-react";

export default function DisclaimerPage() {
  return (
    <LegalLayout
      title="Disclaimer"
      subtitle="Important limits of liability and health guidance for Control Urge."
    >
      <div className="p-4 rounded-2xl bg-amber-500/15 border-2 border-amber-400/40 text-amber-200 text-xs font-semibold flex items-center gap-3">
        <AlertOctagon className="w-5 h-5 text-amber-400 shrink-0" />
        <span>
          <strong>Self-Help Tool Notice:</strong> Control Urge is designed as an educational,
          gamified lifestyle habit tracker. It is NOT a clinical psychological or medical treatment.
        </span>
      </div>

      <section className="space-y-3">
        <h2 className="text-base font-black text-amber-300 uppercase tracking-wider font-serif">
          1. No Professional Medical Advice
        </h2>
        <p>
          The content, streak mechanics, panic breathing simulations, and habit suggestions provided
          in <strong>Control Urge</strong> are for informational, motivational, and self-discipline
          purposes only. None of the materials constitute professional psychiatric, psychological, or
          medical diagnosis, advice, or treatment.
        </p>
        <p className="text-stone-400">
          If you are struggling with severe compulsive sexual behavior, clinical addiction, depression,
          or severe distress, please seek immediate consultation from a licensed psychotherapist,
          physician, or relevant mental health professional.
        </p>
      </section>

      <section className="space-y-3 border-t border-white/10 pt-5">
        <h2 className="text-base font-black text-amber-300 uppercase tracking-wider font-serif">
          2. Limitation of Liability
        </h2>
        <p>
          To the maximum extent permitted by applicable law, <strong>Arigato Labs</strong>, its founder
          <strong> Kumar Devanshu</strong>, and its contributors shall not be held liable for any direct,
          indirect, incidental, special, consequential, or punitive damages arising out of your access
          to or use of (or inability to use) Control Urge.
        </p>
        <p className="text-stone-400">
          This includes, but is not limited to, loss of personal data, device malfunctions, or reliance
          on habit scores and gamified outcomes.
        </p>
      </section>

      <section className="space-y-3 border-t border-white/10 pt-5">
        <h2 className="text-base font-black text-amber-300 uppercase tracking-wider font-serif">
          3. Third-Party Services
        </h2>
        <p>
          Hosting, domain resolution, and network delivery are supported by third parties (such as
          Vercel). Each third-party vendor maintains their own independent terms and policies.
        </p>
      </section>

      <div className="border-t border-white/10 pt-5 text-center text-xs text-stone-500 font-mono">
        Copyright © 2026 Arigato Labs. All Rights Reserved. Contact: kumardevanshu3001@gmail.com
      </div>
    </LegalLayout>
  );
}
