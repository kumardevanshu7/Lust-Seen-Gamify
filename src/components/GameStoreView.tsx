"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { STORE_ITEMS } from "@/lib/storeItems";
import { StoreItem, ElementalSkillId } from "@/types/game";
import { soundEngine } from "@/lib/soundEngine";
import { ELEMENTAL_SKILLS } from "@/lib/gameLogic";
import { GameConfirmModal } from "@/components/GameConfirmModal";
import {
  Coins,
  Shield,
  Zap,
  Sparkles,
  ShoppingBag,
  Package,
  Check,
  Flame,
  Crown,
  Heart,
  ArrowRight,
  Info,
  Lock,
  Skull,
  UserMinus,
  RefreshCw,
} from "lucide-react";

export function GameStoreView() {
  const {
    state,
    buyStoreItem,
    useInventoryItem,
    equipAura,
    useSurpassLevelsItem,
    useSkillChangeItem,
    useAttackGuildMateItem,
    devBypassStoreLocks,
  } = useGame();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedItemForPurchase, setSelectedItemForPurchase] = useState<StoreItem | null>(null);
  const [showSurpassModal, setShowSurpassModal] = useState(false);
  const [showRespecModal, setShowRespecModal] = useState(false);
  const [showAttackModal, setShowAttackModal] = useState(false);
  const [targetComradeInput, setTargetComradeInput] = useState("");

  const [feedbackModal, setFeedbackModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    variant?: "danger" | "warning" | "primary" | "success";
    iconType?: "warning" | "shield" | "info" | "sparkles" | "store" | "success";
  }>({
    isOpen: false,
    title: "",
    message: "",
  });

  const categories = [
    { id: "all", label: "All Relics" },
    { id: "potion", label: "🧪 Elixirs & Health" },
    { id: "shield", label: "🛡️ Shields" },
    { id: "booster", label: "⚡ XP & Level Boosters" },
    { id: "title", label: "👑 Legendary Titles" },
    { id: "aura", label: "✨ Avatar Auras" },
    { id: "music", label: "🎵 Studio Masters" },
  ];

  const filteredItems = STORE_ITEMS.filter((item) => {
    if (selectedCategory === "all") return true;
    return item.category === selectedCategory;
  });

  // Calculate total owned consumable items
  const totalConsumablesOwned = Object.entries(state.inventory || {}).reduce((acc, [id, count]) => {
    const item = STORE_ITEMS.find((it) => it.id === id);
    if (item?.isConsumable) return acc + count;
    return acc;
  }, 0);

  const handleBuyClick = (item: StoreItem) => {
    soundEngine.playClick();

    if (item.minLevel && state.level < item.minLevel) {
      soundEngine.playDamage();
      setFeedbackModal({
        isOpen: true,
        title: "Level Requirement Locked",
        message: `This item requires Level ${item.minLevel} or higher! Your current rank is Level ${state.level}.`,
        variant: "warning",
        iconType: "warning",
      });
      return;
    }

    if (state.coins < item.cost) {
      soundEngine.playDamage();
      setFeedbackModal({
        isOpen: true,
        title: "Insufficient Coins",
        message: `You need ${item.cost - state.coins} more coins! Earn coins by completing your Daily 7 streak and leveling up.`,
        variant: "warning",
        iconType: "warning",
      });
      return;
    }

    if (!item.isConsumable && (state.inventory[item.id] || 0) > 0) {
      setFeedbackModal({
        isOpen: true,
        title: "Already Unlocked",
        message: `You already own ${item.name}! Check your profile to equip it.`,
        variant: "primary",
        iconType: "info",
      });
      return;
    }

    setSelectedItemForPurchase(item);
  };

  const confirmPurchase = () => {
    if (!selectedItemForPurchase) return;
    const res = buyStoreItem(selectedItemForPurchase.id);
    setSelectedItemForPurchase(null);

    setFeedbackModal({
      isOpen: true,
      title: res.success ? "Purchase Successful!" : "Purchase Failed",
      message: res.message,
      variant: res.success ? "success" : "danger",
      iconType: res.success ? "store" : "warning",
    });
  };

  const handleInventoryUseClick = (itemId: string) => {
    soundEngine.playClick();
    if (itemId === "item_surpass_2_levels") {
      setShowSurpassModal(true);
      return;
    }
    if (itemId === "item_skill_respec") {
      setShowRespecModal(true);
      return;
    }
    if (itemId === "item_attack_guild") {
      setShowAttackModal(true);
      return;
    }

    const res = useInventoryItem(itemId);
    setFeedbackModal({
      isOpen: true,
      title: res.success ? "Item Activated!" : "Cannot Activate",
      message: res.message,
      variant: res.success ? "success" : "danger",
      iconType: res.success ? "sparkles" : "warning",
    });
  };

  const confirmSurpassLevels = () => {
    setShowSurpassModal(false);
    const res = useSurpassLevelsItem();
    setFeedbackModal({
      isOpen: true,
      title: res.success ? "2 Levels Surpassed!" : "Surpass Failed",
      message: res.message,
      variant: res.success ? "success" : "danger",
      iconType: res.success ? "sparkles" : "warning",
    });
  };

  const confirmRespecSkill = (skillId: ElementalSkillId) => {
    setShowRespecModal(false);
    const res = useSkillChangeItem(skillId);
    setFeedbackModal({
      isOpen: true,
      title: res.success ? "Affinity Transfigured!" : "Respec Failed",
      message: res.message,
      variant: res.success ? "success" : "danger",
      iconType: res.success ? "sparkles" : "warning",
    });
  };

  const confirmAttackGuildMate = (comradeName: string) => {
    if (!comradeName.trim()) return;
    setShowAttackModal(false);
    setTargetComradeInput("");
    const res = useAttackGuildMateItem(comradeName.trim());
    setFeedbackModal({
      isOpen: true,
      title: res.success ? "Death Note Executed!" : "Strike Failed",
      message: res.message,
      variant: res.success ? "danger" : "warning",
      iconType: res.success ? "warning" : "info",
    });
  };

  return (
    <div className="space-y-6 select-none animate-fadeIn pb-12">
      {/* 1. TOP HEADER & COIN ECONOMY BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#3d2417] via-[#2d180e] to-[#1a0c06] border-4 border-[#6b4226] p-5 sm:p-6 shadow-[0_10px_25px_rgba(0,0,0,0.5)] text-stone-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-[11px] font-black uppercase tracking-wider text-amber-300">
                Willpower Bazaar
              </span>
              <span className="text-xs text-stone-400 font-semibold hidden sm:inline">
                • 42 RPG Relics & Level-Gated Armory
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase font-serif">
              Shonen Armory
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 font-medium mt-0.5">
              Acquire scrolls, shields, studio soundtracks, and powerful Level 20+ relics.
            </p>
          </div>

          {/* User Coin Balance & Rank Deck */}
          <div className="flex items-center gap-3 bg-black/40 border-2 border-amber-500/40 rounded-2xl px-4 py-2.5 shadow-inner">
            <div className="text-right">
              <div className="text-[10px] font-black uppercase tracking-wider text-stone-400">
                Rank Lv. {state.level}
              </div>
              <div className="flex items-center gap-1.5 text-xl font-black text-amber-300 tabular-nums">
                <Coins className="w-5 h-5 text-yellow-400 drop-shadow" />
                <span>{state.coins}</span>
                <span className="text-xs font-bold text-amber-400/80">Coins</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PLAYER INVENTORY QUICK STRIP (Consumables Ready to Activate) */}
      <div className="bg-[#1f110a] border-3 border-[#4a2b18] rounded-3xl p-4 shadow-game-sm">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-stone-200">
            <Package className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-black uppercase tracking-wider">
              Warrior&apos;s Bag ({totalConsumablesOwned} Ready)
            </span>
          </div>
          <span className="text-[11px] font-bold text-stone-400">
            Click &apos;Use&apos; to trigger anytime
          </span>
        </div>

        {totalConsumablesOwned === 0 ? (
          <div className="p-4 rounded-2xl bg-black/20 border border-stone-800 text-center text-xs font-bold text-stone-400">
            Your bag is empty! Purchase potions, shields, or scrolls below to prepare for high-stress days.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {Object.entries(state.inventory || {}).map(([itemId, count]) => {
              if (count <= 0) return null;
              const it = STORE_ITEMS.find((item) => item.id === itemId);
              if (!it || !it.isConsumable) return null;

              return (
                <div
                  key={itemId}
                  className="p-2.5 rounded-2xl bg-[#28150c] border border-amber-800/60 hover:border-amber-500/80 flex items-center justify-between gap-2 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-2xl">{it.icon}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-black text-white truncate max-w-[85px]">
                        {it.name.replace("Title: ", "")}
                      </div>
                      <div className="text-[10px] font-bold text-amber-400 tabular-nums">
                        x{count} owned
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleInventoryUseClick(it.id)}
                    className="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-[11px] uppercase tracking-wider transition-transform active:scale-95 shadow-sm cursor-pointer shrink-0"
                  >
                    Use
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. CATEGORY PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setSelectedCategory(cat.id);
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? "bg-game-orange text-white shadow-game-sm -translate-y-0.5"
                  : "bg-[#2b180f] text-stone-300 hover:bg-[#3d2417] border border-stone-800"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 4. STORE ITEM CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const ownedCount = state.inventory[item.id] || 0;
          const isOwned = !item.isConsumable && ownedCount > 0;
          const isEquippedTitle = item.effectType === "equip_title" && state.profile.title === item.effectValue;
          const isEquippedAura = item.effectType === "equip_aura" && state.profile.equippedAura === item.effectValue;
          const isLevelLocked = !devBypassStoreLocks && Boolean(item.minLevel && state.level < item.minLevel);
          const canAfford = state.coins >= item.cost;

          return (
            <motion.div
              key={item.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.15 }}
              className={`relative rounded-3xl p-5 flex flex-col justify-between border-3 transition-all ${
                isOwned
                  ? "bg-[#28170e] border-emerald-800/60 shadow-md"
                  : isLevelLocked
                  ? "bg-[#1f1008] border-stone-800/90 opacity-80"
                  : "bg-[#25150d] border-[#4a2b18] hover:border-amber-600/70 shadow-[0_6px_16px_rgba(0,0,0,0.4)]"
              }`}
            >
              {/* Card Top: Icon & Badge */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#1c0f0a] border-2 border-[#54301a] flex items-center justify-center text-3xl shadow-inner relative">
                    {item.icon}
                    {isLevelLocked && (
                      <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-red-950 border border-red-500 flex items-center justify-center text-xs">
                        <Lock className="w-3 h-3 text-red-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    {item.minLevel && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border flex items-center gap-1 ${
                          isLevelLocked
                            ? "bg-red-950/60 border-red-500/50 text-red-300"
                            : "bg-emerald-950/60 border-emerald-500/50 text-emerald-300"
                        }`}
                      >
                        {isLevelLocked ? <Lock className="w-2.5 h-2.5" /> : <Check className="w-2.5 h-2.5" />}
                        <span>Lv. {item.minLevel} Req</span>
                      </span>
                    )}

                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-[10px] font-black uppercase tracking-wider text-amber-300">
                        {item.badge}
                      </span>
                    )}

                    {item.isConsumable && ownedCount > 0 && (
                      <span className="text-[11px] font-bold text-stone-400">
                        Bag: x{ownedCount}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-black text-white leading-tight mb-1">
                  {item.name}
                </h3>

                <div className="inline-block px-2.5 py-0.5 rounded-full bg-white/10 text-[11px] font-extrabold text-amber-300 mb-2">
                  {item.benefit}
                </div>

                <p className="text-xs text-stone-300 font-medium leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              {/* Card Bottom: Price and Buy / Equip Button */}
              <div className="pt-3 border-t border-[#3a2012] flex items-center justify-between gap-3">
                <div className="flex items-center gap-1 text-amber-300 font-black text-base tabular-nums">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span>{item.cost}</span>
                </div>

                {/* Dynamic Action Button */}
                {isOwned ? (
                  item.effectType === "equip_aura" ? (
                    <button
                      type="button"
                      onClick={() => equipAura(String(item.effectValue))}
                      className={`py-2 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                        isEquippedAura
                          ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
                          : "bg-stone-700 hover:bg-stone-600 text-stone-200"
                      }`}
                    >
                      {isEquippedAura ? "✓ Equipped" : "Equip"}
                    </button>
                  ) : item.effectType === "equip_title" ? (
                    <button
                      type="button"
                      disabled={isEquippedTitle}
                      onClick={() => handleInventoryUseClick(item.id)}
                      className={`py-2 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                        isEquippedTitle
                          ? "bg-emerald-600/60 text-emerald-200 cursor-default"
                          : "bg-amber-600 hover:bg-amber-500 text-white"
                      }`}
                    >
                      {isEquippedTitle ? "✓ Active Title" : "Set Active"}
                    </button>
                  ) : (
                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                      <Check className="w-4 h-4" />
                      <span>Unlocked</span>
                    </div>
                  )
                ) : isLevelLocked ? (
                  <button
                    type="button"
                    disabled
                    className="py-2 px-4 rounded-xl font-black text-xs uppercase tracking-wider bg-stone-900/90 text-stone-500 border border-stone-800 cursor-not-allowed flex items-center gap-1.5"
                  >
                    <Lock className="w-3 h-3" />
                    <span>Locked (Lv. {item.minLevel})</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleBuyClick(item)}
                    className={`py-2 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-sm active:translate-y-0.5 cursor-pointer border ${
                      canAfford
                        ? "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white border-amber-300"
                        : "bg-stone-800 text-stone-500 border-stone-700 hover:bg-stone-700"
                    }`}
                  >
                    Buy Item
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 5. CONFIRM PURCHASE MODAL */}
      {selectedItemForPurchase && (
        <GameConfirmModal
          isOpen={true}
          title={`Purchase ${selectedItemForPurchase.name}?`}
          message={`Cost: ${selectedItemForPurchase.cost} Zen Coins. Your remaining balance will be ${
            state.coins - selectedItemForPurchase.cost
          } coins.`}
          confirmText="Confirm Buy"
          cancelText="Nevermind"
          variant="primary"
          iconType="store"
          onConfirm={confirmPurchase}
          onCancel={() => setSelectedItemForPurchase(null)}
        />
      )}

      {/* 6. SURPASS 2 LEVELS ACTIVATION MODAL */}
      {showSurpassModal && (
        <GameConfirmModal
          isOpen={true}
          title="Ascend 2 Full Levels?"
          message={`Activate Heaven's Scroll: Surpass 2 Levels? You will immediately leap from Level ${
            state.level
          } to Level ${state.level + 2} and collect +70 bonus coins!`}
          confirmText="Ascend Now (+2 Levels)"
          cancelText="Cancel"
          variant="primary"
          iconType="sparkles"
          onConfirm={confirmSurpassLevels}
          onCancel={() => setShowSurpassModal(false)}
        />
      )}

      {/* 7. ELEMENTAL SKILL RESPEC MODAL (Level 22+ Item) */}
      <AnimatePresence>
        {showRespecModal && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#1e1008] border-4 border-[#8c5028] rounded-[32px] p-5 sm:p-7 shadow-2xl text-stone-200 select-none"
            >
              <div className="text-center mb-4">
                <div className="inline-flex p-3 rounded-2xl bg-purple-950/80 border border-purple-500/40 text-3xl mb-2">
                  🔮
                </div>
                <h2 className="text-2xl font-black text-white uppercase font-serif">
                  Transfigure Elemental Skill
                </h2>
                <p className="text-xs text-stone-300 font-medium max-w-sm mx-auto">
                  Consume 1 Elemental Respec Soul Orb to change your willpower class path. Choose your new discipline:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {ELEMENTAL_SKILLS.map((s) => {
                  const isCurrent = state.profile.elementalSkill === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => confirmRespecSkill(s.id)}
                      className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                        isCurrent
                          ? "bg-purple-950/60 border-purple-400 shadow-md"
                          : "bg-[#2c170c] border-amber-900/60 hover:border-amber-400 hover:bg-[#381e0f]"
                      }`}
                    >
                      <span className="text-2xl">{s.icon}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-black text-white">{s.name}</span>
                          {isCurrent && (
                            <span className="text-[9px] font-black uppercase text-purple-300 bg-purple-900/60 px-1.5 py-0.2 rounded">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-stone-300 line-clamp-2 mt-0.5">{s.perk}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowRespecModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs uppercase cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8. ATTACK GUILD MATE MODAL (Level 25+ Death Note Item) */}
      <AnimatePresence>
        {showAttackModal && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-[#160a06] border-4 border-red-900/80 rounded-[32px] p-5 sm:p-7 shadow-2xl text-stone-200 select-none"
            >
              <div className="text-center mb-4">
                <div className="inline-flex p-3 rounded-2xl bg-red-950/80 border border-red-600/40 text-3xl mb-2">
                  📓
                </div>
                <h2 className="text-2xl font-black text-red-400 uppercase font-serif">
                  Death Note: Guild Strike
                </h2>
                <p className="text-xs text-stone-300 font-medium max-w-xs mx-auto">
                  Write the name of a guild comrade to unleash an untraceable strike that slashes 250 XP from their rank!
                </p>
              </div>

              {state.friends.length > 0 ? (
                <div className="space-y-1.5 max-h-48 overflow-y-auto mb-4 pr-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-stone-400">
                    Select from Active Comrades:
                  </span>
                  {state.friends.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => confirmAttackGuildMate(f.name)}
                      className="w-full p-2.5 rounded-2xl bg-[#281109] border border-red-900/50 hover:border-red-500 flex items-center justify-between text-left transition-all cursor-pointer"
                    >
                      <span className="text-xs font-black text-white">{f.name} ({f.username})</span>
                      <span className="text-[10px] font-bold text-red-400 uppercase">Strike (-250 XP)</span>
                    </button>
                  ))}
                </div>
              ) : null}

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-stone-400">
                  Or enter guild comrade name / handle:
                </label>
                <input
                  type="text"
                  value={targetComradeInput}
                  onChange={(e) => setTargetComradeInput(e.target.value)}
                  placeholder="e.g. ShadowWarrior"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-black/50 border border-stone-700 text-white font-bold text-xs focus:border-red-500 outline-none shadow-inner"
                />
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowAttackModal(false);
                    setTargetComradeInput("");
                  }}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!targetComradeInput.trim()}
                  onClick={() => confirmAttackGuildMate(targetComradeInput)}
                  className={`px-5 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-sm ${
                    targetComradeInput.trim()
                      ? "bg-red-700 hover:bg-red-600 text-white cursor-pointer"
                      : "bg-stone-800 text-stone-600 cursor-not-allowed"
                  }`}
                >
                  Execute Strike
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 9. GENERAL RESULT / ALERT MODAL */}
      <GameConfirmModal
        isOpen={feedbackModal.isOpen}
        title={feedbackModal.title}
        message={feedbackModal.message}
        singleButton={true}
        confirmText="Understood"
        variant={feedbackModal.variant || "primary"}
        iconType={feedbackModal.iconType || "store"}
        onConfirm={() => setFeedbackModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
