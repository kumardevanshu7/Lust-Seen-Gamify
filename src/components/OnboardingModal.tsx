"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ElementalSkillId, Gender, RelationshipStatus } from "@/types/game";
import { ELEMENTAL_SKILLS } from "@/lib/gameLogic";
import { soundEngine } from "@/lib/soundEngine";
import { User, Heart, ArrowRight, Check, Shield, Sparkles, AtSign, Zap, X, Lock, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useGame } from "@/context/GameContext";
import { checkUsernameAvailable, formatCleanUsername } from "@/lib/firebase";

interface OnboardingModalProps {
  onComplete: (
    name: string,
    username: string,
    gender: Gender,
    relationship: RelationshipStatus,
    elementalSkill: ElementalSkillId
  ) => void;
  onClose?: () => void;
}

export function OnboardingModal({ onComplete, onClose }: OnboardingModalProps) {
  const { currentUser } = useGame();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState(currentUser?.displayName || "");
  const [username, setUsername] = useState(
    currentUser?.email
      ? `@${currentUser.email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "")}`
      : ""
  );
  const [gender, setGender] = useState<Gender>("male");
  const [relationship, setRelationship] = useState<RelationshipStatus>("single");
  const [elementalSkill, setElementalSkill] = useState<ElementalSkillId>("fire");
  const [animatingSkillId, setAnimatingSkillId] = useState<ElementalSkillId | null>(null);
  const [formError, setFormError] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle");
  const [usernameStatusMsg, setUsernameStatusMsg] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Debounced live Firestore uniqueness check
  useEffect(() => {
    const clean = formatCleanUsername(username);
    if (!clean) {
      setUsernameStatus("idle");
      setUsernameStatusMsg("");
      return;
    }

    if (clean.length < 3) {
      setUsernameStatus("invalid");
      setUsernameStatusMsg("Handle must be at least 3 characters");
      return;
    }

    if (clean.length > 20) {
      setUsernameStatus("invalid");
      setUsernameStatusMsg("Handle must be 20 characters or fewer");
      return;
    }

    setUsernameStatus("checking");
    const timeout = setTimeout(async () => {
      const res = await checkUsernameAvailable(clean, currentUser?.uid);
      if (res.available) {
        setUsernameStatus("available");
        setUsernameStatusMsg(`@${res.cleanUsername} is available!`);
      } else {
        setUsernameStatus("taken");
        setUsernameStatusMsg(res.reason || "Username is already taken");
      }
    }, 280);

    return () => clearTimeout(timeout);
  }, [username, currentUser?.uid]);

  const handleNextFromStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError("Please enter your warrior name!");
      soundEngine.playDamage();
      return;
    }

    const clean = formatCleanUsername(username);
    if (!clean || clean.length < 3) {
      setFormError("Please enter a valid @username handle (at least 3 characters)!");
      soundEngine.playDamage();
      return;
    }

    setIsVerifying(true);
    try {
      const res = await checkUsernameAvailable(clean, currentUser?.uid);
      if (!res.available) {
        setUsernameStatus("taken");
        setUsernameStatusMsg(res.reason || "Username is already taken");
        setFormError(res.reason || "This username is already taken. Please choose another.");
        soundEngine.playDamage();
        return;
      }

      setUsernameStatus("available");
      setFormError("");
      soundEngine.playClick();
      setStep(2);
    } catch {
      setStep(2);
    } finally {
      setIsVerifying(false);
    }
  };


  const handleGenderSelect = (selectedGender: Gender) => {
    soundEngine.playClick();
    setGender(selectedGender);
  };

  const handleRelationshipSelect = (selectedRel: RelationshipStatus) => {
    soundEngine.playClick();
    setRelationship(selectedRel);
  };

  const handleNextFromStep2 = () => {
    soundEngine.playClick();
    setStep(3);
  };

  const handleSkillSelect = (skillId: ElementalSkillId) => {
    setElementalSkill(skillId);
    setAnimatingSkillId(skillId);
    soundEngine.playSkillActivate(skillId);
    setTimeout(() => {
      setAnimatingSkillId(null);
    }, 600);
  };

  const handleFinalSubmit = () => {
    onComplete(name.trim(), username.trim(), gender, relationship, elementalSkill);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="w-full max-w-lg bg-[#fdfbf7] border-4 border-game-border rounded-3xl p-5 sm:p-7 shadow-game-card text-game-dark relative my-auto max-h-[95vh] overflow-y-auto"
      >
        {onClose && (
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            aria-label="Close modal"
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors cursor-pointer z-10"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Top Progress Bar */}
        <div className="flex items-center justify-between mb-5 pr-8">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-game-orange text-white font-black text-sm flex items-center justify-center shadow-game-sm">
              {step}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-game-border">
              Step {step} of 3
            </span>
          </div>
          <div className="flex gap-1.5" aria-hidden="true">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  s === step ? "w-7 bg-game-orange" : s < step ? "w-3 bg-game-green" : "w-3 bg-stone-300"
                }`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: NAME & USERNAME */}
          {step === 1 && (
            <motion.form
              key="step-1"
              onSubmit={handleNextFromStep1}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center">
                <div className="w-16 h-16 shrink-0 mx-auto mb-3 rounded-2xl bg-amber-100 border-3 border-amber-300 flex items-center justify-center text-game-orange shadow-game-sm">
                  <User className="w-8 h-8 stroke-[2.5]" aria-hidden="true" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-game-dark">
                  Create Your Warrior Profile
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 font-medium">
                  Choose your name and social @username handle for clan discovery.
                </p>
              </div>

              <div>
                <label htmlFor="warrior-name" className="block text-xs font-black uppercase tracking-wider text-stone-700 mb-1">
                  Full Name / Alias
                </label>
                <input
                  id="warrior-name"
                  name="warriorName"
                  type="text"
                  autoComplete="name"
                  spellCheck={false}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (formError) setFormError("");
                  }}
                  placeholder="e.g., Arjun Sharma…"
                  className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-stone-300 focus:border-game-orange font-bold text-game-dark text-sm placeholder:text-stone-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 transition-all shadow-inner"
                  autoFocus
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="warrior-username" className="block text-xs font-black uppercase tracking-wider text-stone-700">
                    Unique Username Handle (@handle)
                  </label>
                  {usernameStatus === "checking" && (
                    <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" /> Checking…
                    </span>
                  )}
                  {usernameStatus === "available" && (
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Available
                    </span>
                  )}
                  {usernameStatus === "taken" && (
                    <span className="text-[11px] font-bold text-red-600 flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> Taken
                    </span>
                  )}
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-stone-400 font-bold text-sm">@</span>
                  <input
                    id="warrior-username"
                    name="warriorUsername"
                    type="text"
                    autoComplete="username"
                    spellCheck={false}
                    value={username.replace(/^@/, "")}
                    onChange={(e) => {
                      setUsername(e.target.value.toLowerCase().replace(/\s+/g, "_"));
                      if (formError) setFormError("");
                    }}
                    placeholder="shadow_monk…"
                    className={`w-full pl-8 pr-10 py-3 rounded-2xl bg-white border-2 font-bold text-game-dark text-sm placeholder:text-stone-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 transition-all shadow-inner ${
                      usernameStatus === "taken"
                        ? "border-red-400 bg-red-50/20"
                        : usernameStatus === "available"
                        ? "border-emerald-400 bg-emerald-50/20"
                        : "border-stone-300 focus:border-game-orange"
                    }`}
                  />
                  <div className="absolute right-3.5 top-3.5">
                    {usernameStatus === "checking" && <Loader2 className="w-4 h-4 animate-spin text-amber-500" />}
                    {usernameStatus === "available" && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    {usernameStatus === "taken" && <XCircle className="w-4 h-4 text-red-500" />}
                  </div>
                </div>

                {usernameStatusMsg && usernameStatus !== "idle" && (
                  <p
                    className={`text-[11px] font-bold mt-1 flex items-center gap-1 ${
                      usernameStatus === "available"
                        ? "text-emerald-600"
                        : usernameStatus === "taken"
                        ? "text-red-600"
                        : "text-stone-500"
                    }`}
                  >
                    {usernameStatus === "available" ? "✓" : "⚠"} {usernameStatusMsg}
                  </p>
                )}
              </div>

              {/* Permanent Handle Lock Notice */}
              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 text-[11px] font-semibold leading-relaxed">
                <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Permanent Handle:</strong> Your @username cannot be changed after registration. It will be your permanent warrior ID across clans.
                </span>
              </div>

              {formError && (
                <p className="text-xs font-bold text-game-red flex items-center gap-1" role="alert">
                  <span>⚠</span> {formError}
                </p>
              )}

              <button
                type="submit"
                disabled={isVerifying || usernameStatus === "taken"}
                className={`w-full mt-2 py-3.5 px-6 rounded-2xl font-black text-sm sm:text-base uppercase tracking-wider shadow-game-orange active:translate-y-1 transition-all flex items-center justify-center gap-2 border-2 border-amber-200 focus-visible:ring-3 focus-visible:ring-orange-400 outline-none ${
                  isVerifying || usernameStatus === "taken"
                    ? "bg-stone-300 text-stone-500 cursor-not-allowed border-stone-200 shadow-none"
                    : "bg-gradient-to-r from-game-orange to-amber-500 hover:from-game-orangeDark hover:to-orange-500 text-white"
                }`}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Verifying Handle…</span>
                  </>
                ) : (
                  <>
                    <span>Continue To Path</span>
                    <ArrowRight className="w-5 h-5" aria-hidden="true" />
                  </>
                )}
              </button>
            </motion.form>
          )}

          {/* STEP 2: GENDER & RELATIONSHIP */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-game-dark">
                  Discipline Path & Status
                </h2>
                <p className="text-xs text-stone-600 font-medium mt-0.5">
                  Tailors Hinglish grammar and social companion titles.
                </p>
              </div>

              {/* Gender selector */}
              <div>
                <span className="block text-xs font-black uppercase text-stone-700 mb-1.5">
                  Select Discipline Path:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: "male", title: "Male Path", icon: "⚔️" },
                    { key: "female", title: "Female Path", icon: "🌸" },
                    { key: "other", title: "Diverse", icon: "✨" },
                  ].map((g) => (
                    <button
                      key={g.key}
                      type="button"
                      onClick={() => handleGenderSelect(g.key as Gender)}
                      className={`p-2.5 rounded-2xl border-2 font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                        gender === g.key
                          ? "bg-amber-100 border-game-orange text-game-dark shadow-game-sm ring-2 ring-orange-200"
                          : "bg-white border-stone-300 text-stone-600 hover:border-stone-400"
                      }`}
                    >
                      <span className="text-xl">{g.icon}</span>
                      <span>{g.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Relationship status */}
              <div>
                <span className="block text-xs font-black uppercase text-stone-700 mb-1.5">
                  Relationship Status:
                </span>
                <div className="space-y-1.5">
                  {[
                    { key: "single", title: "Single (Solo Hermit)", desc: "100% focused on mental discipline", icon: "🐺" },
                    { key: "married", title: "Married / Committed", desc: "Devoted partner fidelity", icon: "💍" },
                    { key: "imaginary_spouse", title: "Imaginary Wife / Husband", desc: "Waifu/Husbando protector otaku heart", icon: "💖" },
                  ].map((r) => (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => handleRelationshipSelect(r.key as RelationshipStatus)}
                      className={`w-full p-2.5 rounded-2xl border-2 text-left flex items-center gap-2.5 transition-all ${
                        relationship === r.key
                          ? "bg-orange-50 border-game-orange text-game-dark shadow-game-sm"
                          : "bg-white border-stone-300 text-stone-700 hover:border-stone-400"
                      }`}
                    >
                      <span className="text-xl">{r.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-black text-xs">{r.title}</div>
                        <div className="text-[10px] text-stone-500 font-medium">{r.desc}</div>
                      </div>
                      {relationship === r.key && <Check className="w-4 h-4 text-game-orange stroke-[3]" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-3 px-4 rounded-2xl bg-stone-200 text-stone-700 font-bold text-xs uppercase"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNextFromStep2}
                  className="flex-1 py-3 px-6 rounded-2xl bg-game-orange hover:bg-game-orangeDark text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-game-orange"
                >
                  Next: Choose Elemental Skill →
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: ELEMENTAL SKILL / CLASS SELECTION (10 Simple Skills with Tap Animation) */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-game-dark">
                  Select Your Elemental Skill
                </h2>
                <p className="text-xs text-stone-600 font-medium">
                  Choose your willpower discipline from 10 elemental starter classes.
                </p>
              </div>

              {/* Active Selected Skill Animation Banner */}
              {(() => {
                const activeSkill = ELEMENTAL_SKILLS.find((s) => s.id === elementalSkill);
                if (!activeSkill) return null;
                return (
                  <motion.div
                    key={activeSkill.id}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-2.5 rounded-2xl bg-gradient-to-r from-amber-100/90 via-orange-100/80 to-amber-100/90 border-2 border-amber-300 flex items-center justify-between shadow-sm overflow-hidden relative"
                  >
                    <div className="flex items-center gap-2.5 z-10">
                      <motion.span
                        key={`icon-${activeSkill.id}`}
                        initial={{ scale: 0.5, rotate: -20 }}
                        animate={{ scale: [1, 1.25, 1], rotate: [0, 8, 0] }}
                        transition={{ duration: 0.35 }}
                        className="text-2xl drop-shadow-sm"
                      >
                        {activeSkill.icon}
                      </motion.span>
                      <div>
                        <div className="text-xs font-black text-game-dark flex items-center gap-1.5">
                          <span>{activeSkill.name}</span>
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-200/80 text-orange-950">
                            Awakened
                          </span>
                        </div>
                        <div className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                          <span>✨ Specialty: {activeSkill.tag}</span>
                        </div>
                      </div>
                    </div>

                    {/* Animated Floating Particles */}
                    <div className="flex gap-1.5 z-10" aria-hidden="true">
                      {activeSkill.particles.map((p, i) => (
                        <motion.span
                          key={`${activeSkill.id}-part-${i}`}
                          initial={{ y: 8, opacity: 0, scale: 0.7 }}
                          animate={{ y: [-2, -10, -2], opacity: [0.6, 1, 0.6], scale: [0.9, 1.2, 0.9] }}
                          transition={{
                            duration: 1.2,
                            delay: i * 0.12,
                            repeat: Infinity,
                            repeatType: "reverse",
                          }}
                          className="text-base select-none"
                        >
                          {p}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                );
              })()}

              {/* Compact 10-Skills Grid (Simple, Fast, No Walls of Text) */}
              <div className="grid grid-cols-2 gap-2 max-h-[42vh] overflow-y-auto pr-1">
                {ELEMENTAL_SKILLS.map((skill) => {
                  const isSelected = elementalSkill === skill.id;
                  const isAnimating = animatingSkillId === skill.id;

                  return (
                    <motion.button
                      key={skill.id}
                      type="button"
                      whileTap={{ scale: 0.94 }}
                      animate={
                        isAnimating
                          ? {
                              scale: [1, 1.08, 1],
                              boxShadow: [
                                "0 0 0px rgba(249, 115, 22, 0)",
                                "0 0 16px rgba(249, 115, 22, 0.6)",
                                "0 0 0px rgba(249, 115, 22, 0)",
                              ],
                            }
                          : {}
                      }
                      transition={{ duration: 0.35 }}
                      onClick={() => handleSkillSelect(skill.id)}
                      className={`p-2.5 rounded-2xl border-2 text-left transition-all relative flex items-center gap-2.5 cursor-pointer select-none ${
                        isSelected
                          ? "bg-amber-50 border-game-orange ring-2 ring-orange-300/80 shadow-game-sm"
                          : "bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                      }`}
                    >
                      {/* Skill Icon */}
                      <div className="relative shrink-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-xs border ${
                            isSelected
                              ? "bg-gradient-to-tr from-amber-200 to-amber-100 border-amber-300"
                              : "bg-stone-100 border-stone-200"
                          }`}
                        >
                          <motion.span
                            animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
                            transition={{ duration: 0.3 }}
                          >
                            {skill.icon}
                          </motion.span>
                        </div>
                        {isSelected && (
                          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-game-orange text-white flex items-center justify-center text-[9px] font-black shadow-xs">
                            ✓
                          </span>
                        )}
                      </div>

                      {/* Name & 1-Line Tag (Clean & Simple) */}
                      <div className="min-w-0 flex-1">
                        <div className="font-black text-xs text-game-dark truncate">
                          {skill.name}
                        </div>
                        <div className="text-[10px] font-bold text-stone-500 truncate mt-0.5">
                          {skill.tag}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Navigation Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="py-3.5 px-4 rounded-2xl bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold text-xs uppercase transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-game-green to-emerald-500 hover:from-game-greenDark hover:to-emerald-600 text-white font-black text-sm uppercase tracking-wider shadow-game-green active:translate-y-1 transition-all flex items-center justify-center gap-2 border-2 border-emerald-200 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  <span>Awaken Warrior & Enter</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
