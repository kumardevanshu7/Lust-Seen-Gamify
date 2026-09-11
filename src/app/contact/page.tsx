"use client";

import React, { useState } from "react";
import { LegalLayout } from "@/components/LegalLayout";
import { Mail, Send, CheckCircle2, AlertCircle, Sparkles, User, AtSign, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage("Please fill in your name, email, and message.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // Structured payload per Arigato Labs guidelines
      const structuredBody = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n  ARIGATO LABS · CONTACT\n  Product: Control Urge\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nFrom:     ${formData.name}\nEmail:    ${formData.email}\nSubject:  ${formData.subject || "Control Urge Inquiry"}\n\nMessage\n-------\n${formData.message}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nSent from Control Urge contact form\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "web3forms-direct-arigato",
          from_name: "Arigato Labs · Control Urge",
          subject: `[Control Urge Contact] ${formData.subject || "User Message"}`,
          name: formData.name,
          email: formData.email,
          message: structuredBody,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
      } else {
        // Graceful fallback: Open pre-filled mailto
        const mailtoUrl = `mailto:kumardevanshu3001@gmail.com?subject=${encodeURIComponent(
          `[Control Urge] ${formData.subject || "Message"}`
        )}&body=${encodeURIComponent(structuredBody)}`;
        window.location.href = mailtoUrl;
        setIsSuccess(true);
      }
    } catch {
      // On network failure, fallback to native mailto directly to founder
      const structuredBody = `From: ${formData.name} (${formData.email})\n\n${formData.message}`;
      const mailtoUrl = `mailto:kumardevanshu3001@gmail.com?subject=${encodeURIComponent(
        `[Control Urge] ${formData.subject || "Message"}`
      )}&body=${encodeURIComponent(structuredBody)}`;
      window.location.href = mailtoUrl;
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LegalLayout
      title="Contact Arigato Labs"
      subtitle="Questions about Control Urge or Arigato Labs? Send a message — it goes directly to the founder."
    >
      {/* Contact Info Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-black/40 border border-white/10">
        <div>
          <div className="text-xs font-black uppercase tracking-wider text-amber-300">
            Founder Direct Inbox
          </div>
          <div className="text-base font-mono font-bold text-white mt-0.5">
            kumardevanshu3001@gmail.com
          </div>
        </div>
        <a
          href="mailto:kumardevanshu3001@gmail.com"
          className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-black uppercase text-stone-200 transition-colors shrink-0"
        >
          <Mail className="w-3.5 h-3.5 text-amber-400" />
          <span>Email Founder Directly</span>
        </a>
      </div>

      {isSuccess ? (
        <div className="p-8 text-center space-y-4 rounded-2xl bg-emerald-500/15 border-2 border-emerald-400/40 text-emerald-100">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/30 flex items-center justify-center text-emerald-300">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black font-serif text-white">Message Dispatched!</h3>
          <p className="text-sm max-w-md mx-auto text-emerald-200/90 leading-relaxed font-medium">
            Your message has been delivered to <strong>Kumar Devanshu</strong>. We will get back to
            you via email as soon as possible.
          </p>
          <button
            type="button"
            onClick={() => {
              setIsSuccess(false);
              setFormData({ name: "", email: "", subject: "", message: "" });
            }}
            className="py-2.5 px-6 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-black uppercase tracking-wider text-white transition-colors"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-xs font-black uppercase tracking-wider text-stone-300 mb-1">
                Your Name *
              </label>
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Alex Vance"
                  className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/15 focus:border-amber-400 text-stone-100 placeholder-stone-500 text-sm font-medium outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-black uppercase tracking-wider text-stone-300 mb-1">
                Your Email *
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@domain.com"
                  className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/15 focus:border-amber-400 text-stone-100 placeholder-stone-500 text-sm font-medium outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-xs font-black uppercase tracking-wider text-stone-300 mb-1">
              Subject
            </label>
            <input
              id="subject"
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="e.g., Feedback on Control Urge RPG mechanics"
              className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/15 focus:border-amber-400 text-stone-100 placeholder-stone-500 text-sm font-medium outline-none transition-colors"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-xs font-black uppercase tracking-wider text-stone-300 mb-1">
              Your Message *
            </label>
            <textarea
              id="message"
              rows={5}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us what's on your mind or how we can improve your willpower journey..."
              className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/15 focus:border-amber-400 text-stone-100 placeholder-stone-500 text-sm font-medium outline-none transition-colors resize-y"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-game-orange via-amber-500 to-game-orangeDark hover:from-amber-500 hover:to-orange-600 text-white font-black text-sm uppercase tracking-wider shadow-[0_4px_15px_rgba(249,115,22,0.4)] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 border border-amber-300/40 cursor-pointer disabled:opacity-60"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
            <span>{isSubmitting ? "Sending Message..." : "Send Message to Founder"}</span>
          </button>
        </form>
      )}
    </LegalLayout>
  );
}
