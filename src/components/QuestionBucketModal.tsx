"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { soundEngine } from "@/lib/soundEngine";
import {
  Check,
  Plus,
  X,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Moon,
  Zap,
  Info,
} from "lucide-react";
import { GameConfirmModal } from "@/components/GameConfirmModal";
import { getMaxBucketQuestionsForLevel } from "@/lib/gameLogic";

interface QuestionBucketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuestionBucketModal({ isOpen, onClose }: QuestionBucketModalProps) {
  const { state, addCustomQuestion, setActiveQuestions, updateSettings } = useGame();
  const isEnglish = state.settings.cardLanguage === "english";
  const [selectedIds, setSelectedIds] = useState<string[]>(state.activeQuestionIds || []);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customText, setCustomText] = useState("");
  const [customPolarity, setCustomPolarity] = useState<"win_on_yes" | "slip_on_yes">("win_on_yes");
  const [customError, setCustomError] = useState("");
  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    variant?: "danger" | "warning" | "primary" | "success";
    iconType?: "warning" | "shield" | "info" | "sparkles";
  }>({
    isOpen: false,
    title: "",
    message: "",
  });

  if (!isOpen) return null;

  const maxAllowed = getMaxBucketQuestionsForLevel(state.level);
  const isMaxReached = selectedIds.length >= maxAllowed;

  const toggleQuestion = (questionId: string) => {
    if (selectedIds.includes(questionId)) {
      soundEngine.playClick();
      setSelectedIds((prev) => prev.filter((id) => id !== questionId));
    } else {
      if (isMaxReached) {
        soundEngine.playDamage();
        setAlertConfig({
          isOpen: true,
          title: `Bucket Limit (${maxAllowed}/${maxAllowed})`,
          message:
            state.level < 15
              ? `You can select up to ${maxAllowed} questions! Reach Level 15 to unlock extra question slots.`
              : `You have reached your maximum of ${maxAllowed} questions for Level ${state.level}! Uncheck an existing question first.`,
          variant: "warning",
          iconType: "warning",
        });
        return;
      }
      soundEngine.playWin();
      setSelectedIds((prev) => [...prev, questionId]);
    }
  };

  const handleSave = () => {
    if (selectedIds.length === 0) {
      soundEngine.playDamage();
      setAlertConfig({
        isOpen: true,
        title: "Empty Routine",
        message: "Please select at least 1 question (recommended: 7) for your daily willpower routine!",
        variant: "danger",
        iconType: "shield",
      });
      return;
    }
    soundEngine.playLevelUp();
    setActiveQuestions(selectedIds);
    onClose();
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) {
      setCustomError("Please enter question text!");
      return;
    }
    addCustomQuestion(customText.trim(), customPolarity);
    setCustomText("");
    setShowAddCustom(false);
    setCustomError("");
  };

  // Filter questions
  const filteredQuestions = state.questions.filter((q) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "custom") return q.isCustom;
    return q.category === activeCategory;
  });

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto select-none">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-[#fffdf7] border-4 border-game-border rounded-3xl p-5 sm:p-7 shadow-game-card text-game-dark relative my-auto max-h-[92vh] flex flex-col justify-between"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bucket-dialog-title"
      >
        {/* Close 'X' Button */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          aria-label="Close question bucket modal"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 border-2 border-stone-300 text-stone-700 flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 outline-none cursor-pointer"
        >
          <X className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />
        </button>

        {/* Modal Header */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 pr-10 mb-1">
            <h2 id="bucket-dialog-title" className="text-xl sm:text-2xl font-black text-game-dark">
              {state.level >= 15 ? "Daily Expanded Bucket" : "Daily 7 Question Bucket"}
            </h2>

            <div className="flex items-center gap-2">
              {/* Language Switcher Pill */}
              <div className="flex items-center rounded-xl bg-amber-100/90 border border-amber-300 p-0.5 shadow-xs">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    updateSettings({ cardLanguage: "hinglish" });
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    !isEnglish ? "bg-amber-600 text-white shadow-xs" : "text-amber-900 hover:text-black"
                  }`}
                  title="Hinglish"
                >
                  <span>🇮🇳 HI</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    updateSettings({ cardLanguage: "english" });
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    isEnglish ? "bg-amber-600 text-white shadow-xs" : "text-amber-900 hover:text-black"
                  }`}
                  title="English"
                >
                  <span>🇬🇧 EN</span>
                </button>
              </div>

              {/* Selection Counter Pill */}
              <div
                className={`px-3 py-1 rounded-full font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs tabular-nums ${
                  selectedIds.length === maxAllowed
                    ? "bg-game-green text-white"
                    : selectedIds.length > 0
                    ? "bg-amber-100 text-amber-900 border border-amber-300"
                    : "bg-red-100 text-red-800"
                }`}
              >
                <span>Selected:</span>
                <strong className="text-sm">{selectedIds.length} / {maxAllowed}</strong>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 font-medium">
            Pick up to <strong>{maxAllowed} focused questions</strong> from the bucket for your daily challenge.
          </p>

          {/* Level 15+ Unlock Badge */}
          {state.level >= 15 ? (
            <div className="mt-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/60 flex items-center gap-2 text-xs font-black text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 animate-pulse" />
              <span>Level {state.level} Mastery: {maxAllowed} Question Slots Unlocked!</span>
            </div>
          ) : (
            <div className="mt-2 px-3 py-1 rounded-xl bg-stone-100 border border-stone-200 flex items-center gap-1.5 text-[11px] font-bold text-stone-600">
              <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Reach Level 15 to unlock extra question slots! (7 default)</span>
            </div>
          )}

          {/* Category Filter Chips & Add Custom Button */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pb-3 border-b-2 border-stone-200">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: "all", label: "All Questions" },
                { id: "relapse", label: "Relapse Triggers" },
                { id: "control_win", label: "Control Wins" },
                { id: "habit_boost", label: "Discipline" },
                { id: "custom", label: "Custom" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setActiveCategory(cat.id);
                  }}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                    activeCategory === cat.id
                      ? "bg-game-orange text-white shadow-xs"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setShowAddCustom(!showAddCustom);
              }}
              className="py-1 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 font-black text-xs text-amber-950 flex items-center gap-1 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Custom</span>
            </button>
          </div>

          {/* Add Custom Question Accordion */}
          {showAddCustom && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              onSubmit={handleCreateCustom}
              className="mt-3 p-3.5 bg-amber-50 rounded-2xl border-2 border-amber-200 space-y-3"
            >
              <div>
                <label htmlFor="custom-input-modal" className="block text-xs font-black uppercase text-amber-950 mb-1">
                  Custom Question Text
                </label>
                <input
                  id="custom-input-modal"
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="e.g., Kya aapne bedtime phone screen lock use kiya?"
                  className="w-full px-3 py-2 rounded-xl bg-white border-2 border-amber-200 text-xs font-bold text-stone-800 focus-visible:outline-none focus-visible:border-game-orange"
                  autoFocus
                />
                {customError && <p className="text-[11px] font-bold text-red-600 mt-1">{customError}</p>}
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomPolarity("win_on_yes")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                      customPolarity === "win_on_yes"
                        ? "bg-game-green text-white border-emerald-600"
                        : "bg-white text-stone-700"
                    }`}
                  >
                    YES = Win (+XP)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomPolarity("slip_on_yes")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                      customPolarity === "slip_on_yes"
                        ? "bg-game-red text-white border-red-600"
                        : "bg-white text-stone-700"
                    }`}
                  >
                    YES = Slip (-HP)
                  </button>
                </div>

                <button
                  type="submit"
                  className="py-1.5 px-3.5 rounded-xl bg-game-orange text-white font-black text-xs uppercase tracking-wider shadow-xs"
                >
                  Add To Bucket
                </button>
              </div>
            </motion.form>
          )}
        </div>

        {/* Scrollable Questions Pool */}
        <div className="flex-1 my-3 overflow-y-auto max-h-[48vh] space-y-2 pr-1">
          {filteredQuestions.map((q) => {
            const isSelected = selectedIds.includes(q.id);
            const isFemale = state.profile.gender === "female";
            const questionText = isEnglish
              ? (isFemale ? (q.textFemaleEn || q.textFemale) : (q.textMaleEn || q.textMale))
              : (isFemale ? q.textFemale : q.textMale);
            const isWinOnYes = q.polarity === "win_on_yes";

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => toggleQuestion(q.id)}
                className={`w-full p-3 rounded-2xl border-2 text-left transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? "bg-amber-50/80 border-game-orange shadow-xs ring-1 ring-orange-200"
                    : "bg-white border-stone-200 hover:border-stone-300"
                }`}
              >
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  {/* Checkbox box */}
                  <div
                    className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isSelected
                        ? "bg-game-orange border-game-orange text-white"
                        : "border-stone-300 bg-stone-50"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  {/* Question Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.2 rounded-full ${
                          isWinOnYes
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {isWinOnYes ? "Win (+XP)" : "Slip (-HP)"}
                      </span>
                      {q.isCustom && (
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-800">
                          Custom
                        </span>
                      )}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-game-dark leading-snug break-words">
                      {questionText}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Modal Bottom: Save and Lock in Bucket */}
        <div className="pt-2 border-t-2 border-stone-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="py-3 px-5 rounded-2xl bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold text-xs uppercase tracking-wider"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-game-orange to-amber-500 hover:from-game-orangeDark hover:to-orange-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-game-orange active:translate-y-0.5 transition-all flex items-center justify-center gap-2 border-2 border-amber-200 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Lock In My Daily Questions ({selectedIds.length}/{maxAllowed})</span>
          </button>
        </div>

        {/* Custom Stylized Game Alert Modal (Replaces browser alert) */}
        <GameConfirmModal
          isOpen={alertConfig.isOpen}
          title={alertConfig.title}
          message={alertConfig.message}
          singleButton={true}
          confirmText="Understood"
          variant={alertConfig.variant || "warning"}
          iconType={alertConfig.iconType || "warning"}
          onConfirm={() => setAlertConfig((prev) => ({ ...prev, isOpen: false }))}
        />
      </motion.div>
    </div>
  );
}
