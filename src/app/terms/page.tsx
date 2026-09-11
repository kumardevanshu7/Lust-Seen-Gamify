"use client";

import React from "react";
import Link from "next/link";
import { LegalLayout } from "@/components/LegalLayout";
import { FileText, Shield, AlertTriangle } from "lucide-react";

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms & Conditions"
      subtitle="Standard agreement for using Control Urge by Arigato Labs."
    >
      <section className="space-y-3">
        <h2 className="text-base font-black text-amber-300 uppercase tracking-wider font-serif">
          1. Agreement to Terms
        </h2>
        <p>
          By accessing or using <strong>Control Urge</strong>, you agree to be bound by these Terms
          and Conditions and all applicable laws. If you disagree with any portion of these terms,
          please discontinue use of the platform immediately.
        </p>
      </section>

      <section className="space-y-3 border-t border-white/10 pt-5">
        <h2 className="text-base font-black text-amber-300 uppercase tracking-wider font-serif">
          2. The Service
        </h2>
        <p>
          Control Urge is provided by <strong>Arigato Labs</strong> (founded by Kumar Devanshu, 2026) as
          a gamified willpower self-improvement companion. It provides habit tracking, streak recording,
          RPG mechanics, and panic breathing aids for voluntary personal lifestyle betterment.
        </p>
      </section>

      <section className="space-y-3 border-t border-white/10 pt-5">
        <h2 className="text-base font-black text-amber-300 uppercase tracking-wider font-serif">
          3. Accounts & Warrior Handles
        </h2>
        <p>
          You are responsible for maintaining the confidentiality of your device and any alias handles
          or custom questions created. You agree not to adopt handles that infringe trademarks or contain
          harassing, unlawful, or sexually abusive content.
        </p>
      </section>

      <section className="space-y-3 border-t border-white/10 pt-5">
        <h2 className="text-base font-black text-amber-300 uppercase tracking-wider font-serif">
          4. Acceptable Use
        </h2>
        <p>You agree not to:</p>
        <ul className="list-disc pl-5 space-y-1.5 text-stone-400 font-medium">
          <li>Attempt to reverse-engineer, exploit, or disrupt client application code or servers.</li>
          <li>Distribute malicious code, automated bots, or spam through comrade requests.</li>
          <li>Misrepresent association with Arigato Labs or its founders.</li>
        </ul>
      </section>

      <section className="space-y-3 border-t border-white/10 pt-5">
        <h2 className="text-base font-black text-amber-300 uppercase tracking-wider font-serif">
          5. Intellectual Property
        </h2>
        <p>
          All trademarks, service marks, trade names, and logos relating to <strong>Arigato Labs</strong>{" "}
          and <strong>Control Urge</strong> (including graphic marks, anime persona stylizations, and
          branding assets) are the sole property of Arigato Labs. Unauthorized reproduction or commercial
          exploitation is strictly prohibited.
        </p>
      </section>

      <section className="space-y-3 border-t border-white/10 pt-5">
        <h2 className="text-base font-black text-amber-300 uppercase tracking-wider font-serif">
          6. Availability & &ldquo;As Is&rdquo; Provision
        </h2>
        <p>
          The service is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis without
          warranties of any kind. Arigato Labs does not warrant that the application will be error-free
          or uninterrupted.
        </p>
      </section>

      <section className="space-y-3 border-t border-white/10 pt-5">
        <h2 className="text-base font-black text-amber-300 uppercase tracking-wider font-serif">
          7. Termination
        </h2>
        <p>
          You may cease using Control Urge at any time by clearing your browser data or invoking the
          in-app Logout / Reset functions.
        </p>
      </section>

      <section className="space-y-3 border-t border-white/10 pt-5">
        <h2 className="text-base font-black text-amber-300 uppercase tracking-wider font-serif">
          8. Governing Law & Contact
        </h2>
        <p>
          These terms are governed by the laws of India. For formal legal notices or queries, reach
          us at:{" "}
          <a href="mailto:kumardevanshu3001@gmail.com" className="text-amber-400 underline font-bold">
            kumardevanshu3001@gmail.com
          </a>.
        </p>
      </section>
    </LegalLayout>
  );
}
