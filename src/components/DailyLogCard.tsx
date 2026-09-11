"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { soundEngine } from "@/lib/soundEngine";
import { getTodayDateString } from "@/lib/gameLogic";
import { QuestionBucketModal } from "@/components/QuestionBucketModal";
import { ElementalCelebrationModal } from "@/components/ElementalCelebrationModal";
import {
  CheckCircle2,
  XCircle,
  Plus,
  Flame,
  Award,
  AlertCircle,
  Sparkles,
  SlidersHorizontal,
  Lock,
  Languages,
} from "lucide-react";

export function DailyLogCard() {
  const { state, submitDailyLog, addCustomQuestion, updateSettings } = useGame();
  const today = getTodayDateString();
  const isEnglish = state.settings.cardLanguage === "english";

  // Find if already submitted today
  const existingTodaySubmission = state.history.find((h) => h.date === today);

  // Local answer state
  const [answers, setAnswers] = useState<Record<string, boolean>>(
    existingTodaySubmission?.answers || {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBucketOpen, setIsBucketOpen] = useState(false);
  const [showSkillCelebration, setShowSkillCelebration] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [submissionResult, setSubmissionResult] = useState<{
    xp: number;
    hpDelta: number;
    isClean: boolean;
  } | null>(
    existingTodaySubmission
      ? {
          xp: existingTodaySubmission.xpEarned,
          hpDelta: existingTodaySubmission.hpDelta,
          isClean: existingTodaySubmission.isCleanDay,
        }
      : null
  );

  // Custom question dialog state
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customText, setCustomText] = useState("");
  const [customPolarity, setCustomPolarity] = useState<"win_on_yes" | "slip_on_yes">("win_on_yes");
  const [customError, setCustomError] = useState("");

  const isTodayLocked = Boolean(existingTodaySubmission || submissionResult);

  const handleAnswerSelect = (questionId: string, value: boolean) => {
    if (isTodayLocked) return;
    soundEngine.playClick();
    if (validationError) setValidationError("");
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleLogSubmit = () => {
    if (isTodayLocked) return;

    const answeredCount = Object.keys(answers).length;
    if (answeredCount === 0) {
      soundEngine.playDamage();
      setValidationError("Please answer your daily questions before locking in today!");
      return;
    }

    setIsSubmitting(true);
    const result = submitDailyLog(answers);
    const resultPayload = {
      xp: result.xpEarned,
      hpDelta: result.hpDelta,
      isClean: result.isClean,
    };
    setSubmissionResult(resultPayload);
    setIsSubmitting(false);
    setValidationError("");
    setShowSkillCelebration(true);
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) {
      setCustomError("Please enter question text!");
      return;
    }
    addCustomQuestion(customText.trim(), customPolarity);
    setCustomText("");
    setIsAddingCustom(false);
    setCustomError("");
  };

  // Filter only the 7 active questions chosen from the bucket!
  const activeIds =
    state.activeQuestionIds && state.activeQuestionIds.length > 0
      ? state.activeQuestionIds
      : state.questions.slice(0, 7).map((q) => q.id);

  const displayQuestions = state.questions.filter((q) => activeIds.includes(q.id));
  const totalQuestions = displayQuestions.length;
  const answeredQuestionsCount = displayQuestions.filter((q) => answers[q.id] !== undefined).length;

  return (
    <div className="space-y-5 select-none">
      {/* Today's Mission Header Banner */}
      <div className="bg-[#fffbf0] border-4 border-game-border rounded-3xl p-4 sm:p-6 shadow-game-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-game-orange" aria-hidden="true" />
              <span>Streak: {state.streakDays} Days</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-game-dark mt-1.5 tracking-tight">
              Daily Accountability Log
            </h2>
            <p className="text-xs sm:text-sm font-medium text-stone-600 mt-0.5">
              Answer your <strong>Daily 7 Bucket Questions</strong> honestly before 12:00 AM midnight.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Language Switcher Pill (Hinglish ↔ English) */}
            <div className="flex items-center rounded-2xl bg-amber-100/90 border-2 border-amber-300 p-0.5 shadow-game-sm">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  updateSettings({ cardLanguage: "hinglish" });
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                  !isEnglish
                    ? "bg-amber-600 text-white shadow-xs"
                    : "text-amber-900 hover:text-amber-950"
                }`}
                title="Cards Hinglish mein dekhein"
              >
                <span>🇮🇳 Hinglish</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  updateSettings({ cardLanguage: "english" });
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                  isEnglish
                    ? "bg-amber-600 text-white shadow-xs"
                    : "text-amber-900 hover:text-amber-950"
                }`}
                title="Switch cards to English"
              >
                <span>🇬🇧 English</span>
              </button>
            </div>

            {/* Manage 7 Bucket Button */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setIsBucketOpen(true);
              }}
              className="py-2 px-3.5 rounded-2xl bg-amber-200 hover:bg-amber-300 border-2 border-amber-400 text-amber-950 font-black text-xs uppercase tracking-wider shadow-game-sm active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-amber-400 outline-none cursor-pointer"
              title="Select or swap questions from the bucket"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Manage Daily 7 ({totalQuestions}/7)</span>
            </button>

            {/* Add Custom Question Button */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setIsAddingCustom(true);
              }}
              className="py-2 px-3 rounded-2xl bg-amber-100 hover:bg-amber-200 border-2 border-amber-300 text-amber-900 font-black text-xs uppercase tracking-wider shadow-game-sm active:translate-y-0.5 transition-all flex items-center justify-center gap-1 focus-visible:ring-2 focus-visible:ring-amber-400 outline-none cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" aria-hidden="true" />
              <span>New Custom</span>
            </button>
          </div>
        </div>

        {/* Answer Progress Tracker */}
        <div className="mt-4 pt-3.5 border-t-2 border-amber-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold text-stone-600">
          <span>
            Daily Questions Answered:{" "}
            <strong className="text-game-orange text-sm tabular-nums">{answeredQuestionsCount}</strong> of{" "}
            <strong className="text-sm tabular-nums">{totalQuestions}</strong>
          </span>
          <div className="w-full sm:w-48 bg-stone-200 h-3 rounded-full overflow-hidden border border-stone-300">
            <div
              className="bg-gradient-to-r from-game-orange to-game-green h-full rounded-full transition-all duration-300"
              style={{
                width: `${totalQuestions > 0 ? (answeredQuestionsCount / totalQuestions) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Submission Success Toast Card */}
      {submissionResult && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: -10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className={`p-4 sm:p-5 rounded-3xl border-3 shadow-game-md flex items-center justify-between gap-3 ${
            submissionResult.isClean
              ? "bg-emerald-50 border-game-green text-emerald-950"
              : "bg-amber-50 border-game-orange text-amber-950"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black shadow-game-sm shrink-0 ${
                submissionResult.isClean ? "bg-game-green" : "bg-game-orange"
              }`}
            >
              {submissionResult.isClean ? <Sparkles className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            </div>
            <div>
              <div className="font-black text-sm sm:text-base">
                {submissionResult.isClean
                  ? "Daily 7 Victory Logged!"
                  : "Check-in Recorded. Stay Strong!"}
              </div>
              <div className="text-xs font-semibold opacity-90 tabular-nums">
                +{submissionResult.xp} XP Earned •{" "}
                {submissionResult.hpDelta >= 0
                  ? `+${submissionResult.hpDelta} HP Healed`
                  : `${submissionResult.hpDelta} HP Damage`}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSubmissionResult(null)}
            className="text-xs font-black uppercase text-stone-500 hover:text-stone-800 px-3 py-1.5 rounded-xl border border-stone-300 hover:bg-stone-100 transition-colors shrink-0 cursor-pointer"
          >
            Dismiss
          </button>
        </motion.div>
      )}

      {/* Validation Error Alert (No browser native alert) */}
      {validationError && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 text-xs font-bold flex items-center justify-between gap-2 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{validationError}</span>
          </div>
          <button
            type="button"
            onClick={() => setValidationError("")}
            className="text-stone-400 hover:text-stone-700 text-xs font-black px-2 py-1 cursor-pointer"
          >
            ✕
          </button>
        </motion.div>
      )}

      {/* Today Locked In Notice Banner */}
      {isTodayLocked && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 flex items-center justify-between gap-3 text-amber-950 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black shrink-0 shadow-xs">
              <Lock className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wide text-amber-950">
                Today&apos;s Urge Log is Locked In
              </div>
              <div className="text-[11px] font-medium text-amber-800">
                Your answers are saved and non-editable. Resets at 12:00 AM midnight.
              </div>
            </div>
          </div>
          <span className="text-[11px] font-bold text-amber-900 bg-amber-200/90 px-2.5 py-1 rounded-full shrink-0">
            Day Locked ✓
          </span>
        </div>
      )}

      {/* Questions Deck: Displaying the Selected 7 Questions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        {displayQuestions.map((question, index) => {
          const answer = answers[question.id];
          const isFemale = state.profile.gender === "female";
          const questionText = isEnglish
            ? (isFemale ? (question.textFemaleEn || question.textFemale) : (question.textMaleEn || question.textMale))
            : (isFemale ? question.textFemale : question.textMale);

          const isWinOnYes = question.polarity === "win_on_yes";

          return (
            <div
              key={question.id}
              className={`p-4 sm:p-5 rounded-3xl border-3 sm:border-4 transition-all shadow-game-sm flex flex-col justify-between ${
                answer !== undefined
                  ? "bg-white border-game-border/90 ring-1 ring-amber-200"
                  : "bg-[#fffdfa] border-stone-200 hover:border-stone-300"
              }`}
            >
              <div>
                {/* Top Row: Index and Polarity Tag */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 text-[11px] font-black flex items-center justify-center tabular-nums shadow-xs">
                      #{index + 1}
                    </span>
                    <span
                      className={`text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        isWinOnYes
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-rose-100 text-rose-800 border border-rose-300"
                      }`}
                    >
                      {isWinOnYes ? "Win Habit (+XP)" : "Slip Risk (-HP)"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Quick Card Language Switcher */}
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playClick();
                        updateSettings({ cardLanguage: isEnglish ? "hinglish" : "english" });
                      }}
                      className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 hover:bg-amber-100 text-stone-600 hover:text-amber-900 border border-stone-200 transition-colors flex items-center gap-1 cursor-pointer"
                      title={isEnglish ? "Hinglish mein badlein" : "Switch to English"}
                    >
                      <Languages className="w-2.5 h-2.5 text-amber-600" />
                      <span>{isEnglish ? "EN" : "HI"}</span>
                    </button>
                    {isTodayLocked && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Locked</span>
                      </span>
                    )}
                    {question.isCustom && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300">
                        Custom
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Text */}
                <h3 className="text-base sm:text-lg font-black text-game-dark leading-snug break-words">
                  {questionText}
                </h3>
              </div>

              {/* Yes / No Buttons (Non-editable once locked) */}
              <div className="grid grid-cols-2 gap-2.5 mt-4 pt-1">
                {/* YES Button */}
                <button
                  type="button"
                  disabled={isTodayLocked}
                  onClick={() => handleAnswerSelect(question.id, true)}
                  aria-pressed={answer === true}
                  className={`py-3 px-3 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-amber-400 outline-none ${
                    isTodayLocked ? "cursor-not-allowed" : "cursor-pointer"
                  } ${
                    answer === true
                      ? isWinOnYes
                        ? "bg-game-green text-white shadow-game-green border-2 border-emerald-300 scale-[1.02]"
                        : "bg-game-red text-white shadow-game-red border-2 border-rose-300 scale-[1.02]"
                      : isTodayLocked
                      ? "bg-stone-100 text-stone-400 border-2 border-stone-200 opacity-60"
                      : "bg-stone-100 hover:bg-stone-200 text-stone-700 border-2 border-stone-300 shadow-game-sm active:translate-y-0.5"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{isEnglish ? "Yes" : "Haan (Yes)"} {isTodayLocked && answer === true ? "✓" : ""}</span>
                </button>

                {/* NO Button */}
                <button
                  type="button"
                  disabled={isTodayLocked}
                  onClick={() => handleAnswerSelect(question.id, false)}
                  aria-pressed={answer === false}
                  className={`py-3 px-3 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-amber-400 outline-none ${
                    isTodayLocked ? "cursor-not-allowed" : "cursor-pointer"
                  } ${
                    answer === false
                      ? !isWinOnYes
                        ? "bg-game-green text-white shadow-game-green border-2 border-emerald-300 scale-[1.02]"
                        : "bg-game-red text-white shadow-game-red border-2 border-rose-300 scale-[1.02]"
                      : isTodayLocked
                      ? "bg-stone-100 text-stone-400 border-2 border-stone-200 opacity-60"
                      : "bg-stone-100 hover:bg-stone-200 text-stone-700 border-2 border-stone-300 shadow-game-sm active:translate-y-0.5"
                  }`}
                >
                  <XCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{isEnglish ? "No" : "Nahi (No)"} {isTodayLocked && answer === false ? "✓" : ""}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Submission Bar / Locked Indicator */}
      <div className="pt-4">
        {isTodayLocked ? (
          <button
            type="button"
            disabled
            className="w-full py-4 px-6 rounded-3xl bg-stone-800 border-2 border-stone-700 text-stone-300 font-black text-base sm:text-lg uppercase tracking-wider shadow-md flex items-center justify-center gap-3 cursor-not-allowed select-none"
          >
            <Lock className="w-6 h-6 text-amber-400 stroke-[2.5]" aria-hidden="true" />
            <span>Today&apos;s Urge Log Locked In ({answeredQuestionsCount}/{totalQuestions})</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleLogSubmit}
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-3xl bg-gradient-to-r from-game-orange to-amber-500 hover:from-game-orangeDark hover:to-orange-500 text-white font-black text-base sm:text-lg uppercase tracking-wider shadow-[0_6px_0_0_#9a3412,0_12px_20px_rgba(0,0,0,0.25)] active:translate-y-1 transition-all flex items-center justify-center gap-3 border-2 border-amber-200 focus-visible:ring-3 focus-visible:ring-orange-400 outline-none cursor-pointer"
          >
            <Award className="w-6 h-6 stroke-[2.5]" aria-hidden="true" />
            <span>Lock In Today’s Urge Log ({answeredQuestionsCount}/{totalQuestions})</span>
          </button>
        )}
      </div>

      {/* Question Bucket Selection Modal */}
      <QuestionBucketModal
        isOpen={isBucketOpen}
        onClose={() => setIsBucketOpen(false)}
      />

      {/* Custom Question Modal */}
      {isAddingCustom && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-white border-4 border-game-border rounded-3xl p-6 shadow-game-card text-game-dark"
          >
            <h3 className="text-xl font-black text-game-dark mb-1">Add Custom Question</h3>
            <p className="text-xs text-stone-600 mb-4 font-medium">
              Create your own personal trigger or discipline habit to add to your bucket.
            </p>

            <form onSubmit={handleCreateCustom} className="space-y-4">
              <div>
                <label htmlFor="custom-q-text" className="block text-xs font-black uppercase text-stone-700 mb-1">
                  Question in Hinglish / English
                </label>
                <input
                  id="custom-q-text"
                  type="text"
                  value={customText}
                  onChange={(e) => {
                    setCustomText(e.target.value);
                    if (customError) setCustomError("");
                  }}
                  placeholder="e.g., Kya aapne bedtime phone lock use kiya?"
                  className="w-full px-4 py-3 rounded-2xl bg-stone-50 border-2 border-stone-300 focus:border-game-orange font-bold text-sm focus-visible:outline-none"
                  autoFocus
                />
                {customError && (
                  <p className="mt-1 text-xs text-game-red font-bold">{customError}</p>
                )}
              </div>

              <div>
                <span className="block text-xs font-black uppercase text-stone-700 mb-1.5">
                  Is answering &ldquo;YES&rdquo; a Win or a Slip?
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomPolarity("win_on_yes")}
                    className={`p-3 rounded-2xl border-2 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 ${
                      customPolarity === "win_on_yes"
                        ? "bg-game-green text-white border-emerald-600 shadow-game-sm"
                        : "bg-stone-100 text-stone-700 border-stone-300"
                    }`}
                  >
                    <span>YES = Win (+XP)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomPolarity("slip_on_yes")}
                    className={`p-3 rounded-2xl border-2 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 ${
                      customPolarity === "slip_on_yes"
                        ? "bg-game-red text-white border-rose-600 shadow-game-sm"
                        : "bg-stone-100 text-stone-700 border-stone-300"
                    }`}
                  >
                    <span>YES = Slip (-HP)</span>
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingCustom(false)}
                  className="flex-1 py-3 rounded-2xl bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-game-orange hover:bg-game-orangeDark text-white font-black text-xs uppercase tracking-wider shadow-game-orange"
                >
                  Save Question
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Theatrical Elemental Skill Celebration Modal */}
      <ElementalCelebrationModal
        isOpen={showSkillCelebration}
        skillId={state.profile.elementalSkill}
        xpEarned={submissionResult?.xp || 0}
        hpDelta={submissionResult?.hpDelta || 0}
        isClean={submissionResult?.isClean ?? true}
        streakDays={state.streakDays}
        onClose={() => setShowSkillCelebration(false)}
      />
    </div>
  );
}
