"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, LogOut, ShieldAlert, X, Info, Sparkles, ShoppingBag, CheckCircle2 } from "lucide-react";
import { soundEngine } from "@/lib/soundEngine";

interface GameConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  singleButton?: boolean;
  variant?: "danger" | "warning" | "primary" | "success";
  iconType?: "logout" | "warning" | "shield" | "info" | "sparkles" | "store" | "success";
  onConfirm: () => void;
  onCancel?: () => void;
}

export function GameConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  singleButton = false,
  variant = "danger",
  iconType = "warning",
  onConfirm,
  onCancel,
}: GameConfirmModalProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    soundEngine.playClick();
    onConfirm();
  };

  const handleCancel = () => {
    soundEngine.playClick();
    if (onCancel) onCancel();
    else onConfirm();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 15 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="w-full max-w-sm bg-[#fffdfa] border-4 border-[#5a3821] rounded-3xl p-6 shadow-[0_16px_35px_rgba(0,0,0,0.6)] text-stone-900 relative"
        >
          {/* Close X button */}
          <button
            type="button"
            onClick={handleCancel}
            aria-label="Close modal"
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Icon Badge */}
          <div className="flex flex-col items-center text-center">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md mb-3 border-2 ${
                variant === "danger"
                  ? "bg-rose-100 border-rose-300 text-rose-600"
                  : variant === "warning"
                  ? "bg-amber-100 border-amber-300 text-amber-600"
                  : variant === "success"
                  ? "bg-emerald-100 border-emerald-300 text-emerald-600"
                  : "bg-blue-100 border-blue-300 text-blue-600"
              }`}
            >
              {iconType === "logout" ? (
                <LogOut className="w-7 h-7 stroke-[2.5]" />
              ) : iconType === "shield" ? (
                <ShieldAlert className="w-7 h-7 stroke-[2.5]" />
              ) : iconType === "info" ? (
                <Info className="w-7 h-7 stroke-[2.5]" />
              ) : iconType === "sparkles" ? (
                <Sparkles className="w-7 h-7 stroke-[2.5]" />
              ) : iconType === "store" ? (
                <ShoppingBag className="w-7 h-7 stroke-[2.5]" />
              ) : iconType === "success" ? (
                <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
              ) : (
                <AlertTriangle className="w-7 h-7 stroke-[2.5]" />
              )}
            </div>

            <h3 className="text-xl font-black tracking-tight text-[#3d2417] mb-2">
              {title}
            </h3>

            <p className="text-xs sm:text-sm text-stone-600 font-semibold leading-relaxed mb-6">
              {message}
            </p>

            {/* Action Buttons */}
            {singleButton ? (
              <button
                type="button"
                onClick={handleConfirm}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-black text-sm uppercase tracking-wider transition-all shadow-[0_4px_0_0_#9a3412] active:translate-y-0.5 cursor-pointer border-2 border-amber-200"
              >
                {confirmText}
              </button>
            ) : (
              <div className="w-full grid grid-cols-2 gap-3">
                {/* Cancel Button */}
                <button
                  type="button"
                  onClick={handleCancel}
                  className="py-3 px-4 rounded-2xl bg-stone-200 hover:bg-stone-300 text-stone-700 font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-sm active:translate-y-0.5 cursor-pointer"
                >
                  {cancelText}
                </button>

                {/* Confirm Action Button */}
                <button
                  type="button"
                  onClick={handleConfirm}
                  className={`py-3 px-4 rounded-2xl text-white font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-game-sm active:translate-y-0.5 cursor-pointer border-2 ${
                    variant === "danger"
                      ? "bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 border-rose-300 shadow-[0_4px_0_0_#9f1239]"
                      : variant === "warning"
                      ? "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 border-amber-300 shadow-[0_4px_0_0_#b45309]"
                      : variant === "success"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 border-emerald-300 shadow-[0_4px_0_0_#065f46]"
                      : "bg-gradient-to-r from-game-orange to-amber-500 hover:from-game-orangeDark border-amber-200 shadow-[0_4px_0_0_#9a3412]"
                  }`}
                >
                  {confirmText}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
