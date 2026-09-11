"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { ANIME_CLANS, ELEMENTAL_SKILLS } from "@/lib/gameLogic";
import { soundEngine } from "@/lib/soundEngine";
import { searchPublicProfiles } from "@/lib/firebase";
import {
  Users,
  Shield,
  Sparkles,
  Zap,
  Check,
  HeartHandshake,
  UserPlus,
  UserMinus,
  Search,
  CheckCircle2,
  XCircle,
  Flame,
  Clock,
  Loader2,
  X,
  Mail,
  UserCheck,
} from "lucide-react";
import { GameConfirmModal } from "@/components/GameConfirmModal";
import { Comrade, PublicWarriorProfile } from "@/types/game";

export function ClanHallView() {
  const {
    state,
    joinClan,
    sendChakraToClan,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
    currentUser,
  } = useGame();

  const [activeTab, setActiveTab] = useState<"social" | "clans" | "requests">("social");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchingCloud, setIsSearchingCloud] = useState(false);
  const [cloudSearchResults, setCloudSearchResults] = useState<PublicWarriorProfile[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [requestNoticeMsg, setRequestNoticeMsg] = useState("");
  const [friendToRemove, setFriendToRemove] = useState<Comrade | null>(null);
  const [chakraSentMap, setChakraSentMap] = useState<Record<string, boolean>>({});
  const [chakraSentClan, setChakraSentClan] = useState<Record<string, boolean>>({});

  const searchBoxRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Google-style debounced autocomplete search by @username or Name
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setCloudSearchResults([]);
      setIsDropdownOpen(false);
      setIsSearchingCloud(false);
      return;
    }

    setIsSearchingCloud(true);
    setIsDropdownOpen(true);

    const debounceTimer = setTimeout(async () => {
      try {
        const results = await searchPublicProfiles(trimmed, currentUser?.uid, 8);
        setCloudSearchResults(results);
      } catch (err) {
        console.warn("Search error:", err);
      } finally {
        setIsSearchingCloud(false);
      }
    }, 180);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, currentUser?.uid]);

  const handleSendFriendChakra = (friendId: string) => {
    soundEngine.playWin();
    setChakraSentMap((prev) => ({ ...prev, [friendId]: true }));
    setTimeout(() => {
      setChakraSentMap((prev) => ({ ...prev, [friendId]: false }));
    }, 4000);
  };

  const handleSendClanChakra = (clanId: string) => {
    sendChakraToClan(clanId);
    setChakraSentClan((prev) => ({ ...prev, [clanId]: true }));
    setTimeout(() => {
      setChakraSentClan((prev) => ({ ...prev, [clanId]: false }));
    }, 4000);
  };

  // Filtered friends
  const activeFriends = state.friends.filter((f) => f.status === "friend");
  const pendingReceived = state.friends.filter((f) => f.status === "pending_received");
  const pendingSent = state.friends.filter((f) => f.status === "pending_sent");
  const totalPending = pendingReceived.length + pendingSent.length;

  const filteredComrades = activeFriends.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper to check comrade status for any user
  const getComradeStatus = (warriorHandle: string, warriorUid?: string) => {
    const handleClean = warriorHandle.toLowerCase();
    const existing = state.friends.find(
      (f) =>
        f.username.toLowerCase() === handleClean ||
        (warriorUid && f.firebaseUid === warriorUid) ||
        (warriorUid && f.id === `user_${warriorUid}`)
    );
    return existing ? existing.status : null;
  };

  const handleAddWarrior = (warrior: PublicWarriorProfile) => {
    soundEngine.playClick();
    sendFriendRequest(warrior);
    setRequestNoticeMsg(`Friend request sent to ${warrior.name} (${warrior.username})!`);
    setTimeout(() => setRequestNoticeMsg(""), 4000);
  };

  return (
    <div className="space-y-5 select-none">
      {/* Top Banner & 3-Tab Switcher */}
      <div className="bg-[#fffbf0] border-4 border-game-border rounded-3xl p-4 sm:p-6 shadow-game-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 border border-blue-300 text-blue-900 text-xs font-black uppercase tracking-wider">
              <Users className="w-3.5 h-3.5 text-game-blue" aria-hidden="true" />
              <span>Guild & Social Comrades</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-game-dark mt-1">
              Never Fight The Urge Alone
            </h2>
            <p className="text-xs sm:text-sm font-medium text-stone-600">
              Search warriors by @username or name, manage friend requests, and pledge to an Anime Clan!
            </p>
          </div>

          {/* 3 Dedicated Tabs: Comrades, Requests, Anime Clans */}
          <div className="flex items-center bg-amber-100/80 p-1.5 rounded-2xl border-2 border-amber-300 shrink-0 gap-1 overflow-x-auto">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setActiveTab("social");
              }}
              className={`px-3 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "social"
                  ? "bg-game-orange text-white shadow-game-sm"
                  : "text-stone-700 hover:text-stone-900"
              }`}
            >
              Comrades ({activeFriends.length})
            </button>

            {/* Requests Tab with Alert Badge */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setActiveTab("requests");
              }}
              className={`px-3 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer relative whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === "requests"
                  ? "bg-game-orange text-white shadow-game-sm"
                  : "text-stone-700 hover:text-stone-900"
              }`}
            >
              <span>Requests</span>
              {totalPending > 0 ? (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    pendingReceived.length > 0
                      ? "bg-red-500 text-white animate-pulse"
                      : "bg-amber-200 text-amber-900"
                  }`}
                >
                  {totalPending}
                </span>
              ) : (
                <span className="text-stone-400 text-[10px]">0</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setActiveTab("clans");
              }}
              className={`px-3 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "clans"
                  ? "bg-game-orange text-white shadow-game-sm"
                  : "text-stone-700 hover:text-stone-900"
              }`}
            >
              Anime Clans
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification Notice */}
      {requestNoticeMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-3 rounded-2xl bg-emerald-100 border-2 border-emerald-300 text-emerald-900 text-xs font-black flex items-center justify-between gap-2 shadow-game-sm"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{requestNoticeMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setRequestNoticeMsg("")}
            className="text-emerald-700 hover:text-emerald-900"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* TAB 1: COMRADES & GOOGLE-STYLE AUTOCOMPLETE SEARCH */}
      {activeTab === "social" && (
        <div className="space-y-4">
          {/* Google-Style Live Autocomplete Search Bar */}
          <div ref={searchBoxRef} className="relative z-30">
            <div className="p-2.5 bg-white border-3 border-game-border/80 rounded-2xl shadow-game-sm flex items-center gap-2 relative">
              <Search className="w-5 h-5 text-stone-400 ml-1 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => {
                  if (searchQuery.trim()) setIsDropdownOpen(true);
                }}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type any letter to search warriors by name or @username…"
                className="w-full py-1.5 px-2 bg-transparent font-bold text-xs sm:text-sm text-game-dark placeholder:text-stone-400 focus:outline-none"
              />

              {isSearchingCloud && (
                <Loader2 className="w-4 h-4 animate-spin text-game-orange shrink-0 mr-1" />
              )}

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setIsDropdownOpen(false);
                  }}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Floating Google-Style Autocomplete Dropdown */}
            <AnimatePresence>
              {isDropdownOpen && searchQuery.trim().length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.99 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 right-0 top-full mt-2 bg-[#fdfbf7] border-3 border-game-border rounded-2xl shadow-2xl overflow-hidden max-h-96 overflow-y-auto z-40"
                >
                  {/* Dropdown Header */}
                  <div className="px-3.5 py-2 bg-amber-50/80 border-b border-amber-200/80 flex items-center justify-between text-[11px] font-black text-amber-900 uppercase tracking-wider">
                    <span>
                      {isSearchingCloud ? "Searching warriors…" : `Found ${cloudSearchResults.length} Warriors`}
                    </span>
                    <span className="text-[10px] text-stone-500 font-medium">Google Live Discovery</span>
                  </div>

                  {/* Dropdown Results List */}
                  {cloudSearchResults.length === 0 && !isSearchingCloud ? (
                    <div className="p-6 text-center text-stone-500 text-xs font-medium space-y-1">
                      <div>No registered warriors match &ldquo;{searchQuery}&rdquo;</div>
                      <div className="text-[11px] text-stone-400">
                        Check the @handle spelling or try searching by warrior display name.
                      </div>
                    </div>
                  ) : (
                    <div className="divide-y divide-stone-100">
                      {cloudSearchResults.map((warrior) => {
                        const skillObj = ELEMENTAL_SKILLS.find((s) => s.id === warrior.elementalSkill);
                        const status = getComradeStatus(warrior.username, warrior.uid);

                        return (
                          <div
                            key={warrior.uid}
                            className="p-3 hover:bg-amber-50/60 transition-colors flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {/* Avatar */}
                              <div
                                className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white text-base shadow-sm shrink-0"
                                style={{ backgroundColor: warrior.avatarColor || skillObj?.color || "#ff7033" }}
                              >
                                {skillObj?.icon || "⚔️"}
                              </div>

                              {/* Warrior Details */}
                              <div className="min-w-0">
                                <div className="font-black text-xs sm:text-sm text-game-dark truncate flex items-center gap-1.5">
                                  <span>{warrior.name}</span>
                                  <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                                    {warrior.username}
                                  </span>
                                </div>
                                <div className="text-[10px] font-bold text-stone-500 flex items-center gap-2 mt-0.5">
                                  <span className="flex items-center gap-0.5 text-orange-600">
                                    <Flame className="w-3 h-3" /> {warrior.streakDays}d Streak
                                  </span>
                                  <span>•</span>
                                  <span>Lv.{warrior.level}</span>
                                  <span>•</span>
                                  <span>{skillObj?.name || "Fire Warrior"}</span>
                                </div>
                              </div>
                            </div>

                            {/* 1-Click Action Button */}
                            <div className="shrink-0">
                              {status === "friend" ? (
                                <span className="px-2.5 py-1 rounded-xl bg-stone-100 border border-stone-200 text-stone-500 font-black text-[11px] flex items-center gap-1">
                                  <UserCheck className="w-3 h-3 text-emerald-600" />
                                  <span>Comrade</span>
                                </span>
                              ) : status === "pending_sent" ? (
                                <span className="px-2.5 py-1 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 font-bold text-[11px] flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>Sent</span>
                                </span>
                              ) : status === "pending_received" ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const friendObj = state.friends.find(
                                      (f) => f.username === warrior.username || f.firebaseUid === warrior.uid
                                    );
                                    if (friendObj) acceptFriendRequest(friendObj.id);
                                  }}
                                  className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] flex items-center gap-1 shadow-sm"
                                >
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Accept</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleAddWarrior(warrior)}
                                  className="px-3 py-1.5 rounded-xl bg-game-orange hover:bg-game-orangeDark text-white font-black text-xs uppercase tracking-wider shadow-game-sm active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                                >
                                  <UserPlus className="w-3.5 h-3.5" />
                                  <span>Add</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Comrades Count & Filter Status */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase tracking-wider text-stone-600">
              Active Circle Comrades
            </span>
            <span className="text-xs font-black text-stone-500 tabular-nums">
              {filteredComrades.length} / {activeFriends.length} Comrades
            </span>
          </div>

          {/* Comrades Card Grid or Clean Empty State */}
          {filteredComrades.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white border-3 border-dashed border-amber-200 text-center space-y-3 shadow-game-sm">
              <div className="w-14 h-14 rounded-2xl bg-amber-100/80 border-2 border-amber-300 flex items-center justify-center mx-auto text-3xl shadow-inner">
                🛡️
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="text-base font-black text-game-dark">
                  {searchQuery ? "No Matching Comrades in Your Circle" : "Your Guild Squad is Ready to Assemble"}
                </h3>
                <p className="text-xs text-stone-500 font-medium mt-1 leading-relaxed">
                  {searchQuery
                    ? `No comrades in your friend list matched "${searchQuery}". Check the global search bar above to invite new warriors!`
                    : "No fake demo data! Only authentic registered warriors connect here. Use the Google search bar above to find friends by @username or name."}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredComrades.map((friend) => {
                const hasSentChakra = chakraSentMap[friend.id];
                const skillObj = ELEMENTAL_SKILLS.find((s) => s.id === friend.elementalSkill);

                return (
                  <div
                    key={friend.id}
                    className="p-4 rounded-3xl bg-white border-3 border-game-border/80 shadow-game-sm flex flex-col justify-between"
                  >
                    <div>
                      {/* Header with Avatar, Name, Handle, and Remove */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white text-base shadow-game-sm shrink-0"
                            style={{ backgroundColor: friend.avatarColor }}
                          >
                            {skillObj?.icon || "⚔️"}
                          </div>
                          <div>
                            <div className="font-black text-sm text-game-dark">
                              {friend.name}
                            </div>
                            <div className="text-xs font-mono font-bold text-stone-400">
                              {friend.username}
                            </div>
                          </div>
                        </div>

                        {/* Remove Friend Button */}
                        <button
                          type="button"
                          onClick={() => {
                            soundEngine.playClick();
                            setFriendToRemove(friend);
                          }}
                          aria-label={`Remove ${friend.name}`}
                          className="p-1.5 rounded-xl text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Remove comrade"
                        >
                          <UserMinus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Meta info: Streak and Title */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-3 text-[11px] font-bold">
                        <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200 flex items-center gap-1">
                          <Flame className="w-3 h-3 text-game-orange" />
                          <span>Streak: {friend.streakDays} Days</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                          {friend.animeTitle}
                        </span>
                      </div>
                    </div>

                    {/* Send Ki / Chakra Button */}
                    <button
                      type="button"
                      onClick={() => handleSendFriendChakra(friend.id)}
                      disabled={hasSentChakra}
                      className="w-full py-2.5 px-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 border-2 border-amber-300 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-game-sm active:translate-y-0.5 transition-all cursor-pointer"
                    >
                      <HeartHandshake className="w-4 h-4 text-amber-700" />
                      <span>
                        {hasSentChakra ? "Chakra Shared! (+10 Ki)" : "Send Willpower Chakra"}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SEPARATE DEDICATED REQUESTS & ACCEPT SECTION */}
      {activeTab === "requests" && (
        <div className="space-y-6">
          {/* SECTION 1: INCOMING FRIEND REQUESTS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-red-100 text-red-600">
                  <Mail className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-black uppercase tracking-wider text-game-dark">
                  Incoming Requests ({pendingReceived.length})
                </h3>
              </div>
              <span className="text-xs font-bold text-stone-500">
                Awaiting your response
              </span>
            </div>

            {pendingReceived.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white border-2 border-dashed border-stone-300 text-center text-stone-500 text-xs font-medium">
                No incoming friend requests. When fellow warriors invite you to their circle, they will appear here!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pendingReceived.map((req) => {
                  const skillObj = ELEMENTAL_SKILLS.find((s) => s.id === req.elementalSkill);

                  return (
                    <div
                      key={req.id}
                      className="p-4 bg-white rounded-3xl border-3 border-amber-300 shadow-game-sm space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-11 h-11 rounded-2xl flex items-center justify-center text-lg font-black text-white shadow-sm shrink-0"
                          style={{ backgroundColor: req.avatarColor || skillObj?.color || "#ff7033" }}
                        >
                          {skillObj?.icon || "⚔️"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-black text-sm text-game-dark truncate">
                            {req.name}
                          </div>
                          <div className="text-xs font-mono font-bold text-amber-800">
                            {req.username}
                          </div>
                          <div className="text-[11px] text-stone-500 font-bold mt-0.5 flex items-center gap-1">
                            <Flame className="w-3 h-3 text-orange-600" />
                            <span>Streak: {req.streakDays} Days</span>
                            <span>•</span>
                            <span>{req.animeTitle}</span>
                          </div>
                        </div>
                      </div>

                      {/* Prominent Action Buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => acceptFriendRequest(req.id)}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider shadow-game-sm active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Accept Request</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => declineFriendRequest(req.id)}
                          className="py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs uppercase transition-all cursor-pointer"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* SECTION 2: OUTGOING / SENT REQUESTS */}
          <div className="space-y-3 pt-4 border-t-2 border-stone-200">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-amber-100 text-amber-700">
                  <Clock className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-black uppercase tracking-wider text-game-dark">
                  Sent Requests ({pendingSent.length})
                </h3>
              </div>
              <span className="text-xs font-bold text-stone-500">
                Pending comrade acceptance
              </span>
            </div>

            {pendingSent.length === 0 ? (
              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 text-center text-stone-500 text-xs font-medium">
                No active pending requests sent.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pendingSent.map((req) => (
                  <div
                    key={req.id}
                    className="p-3.5 bg-white rounded-2xl border-2 border-stone-200 flex items-center justify-between gap-3 shadow-sm"
                  >
                    <div className="min-w-0">
                      <div className="font-black text-xs sm:text-sm text-game-dark truncate">
                        {req.name}
                      </div>
                      <div className="text-[11px] font-mono text-stone-400">
                        {req.username}
                      </div>
                      <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <Clock className="w-3 h-3" /> Awaiting Response
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => declineFriendRequest(req.id)}
                      className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold text-xs shrink-0 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ANIME CLANS & GUILD BANNERS */}
      {activeTab === "clans" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ANIME_CLANS.map((clan) => {
            const isMember = state.profile.clanId === clan.id;
            const hasSentClanKi = chakraSentClan[clan.id];

            return (
              <motion.div
                key={clan.id}
                whileHover={{ y: -2 }}
                className={`p-5 rounded-3xl border-3 sm:border-4 transition-all shadow-game-sm flex flex-col justify-between ${
                  isMember
                    ? "bg-blue-50/50 border-game-blue ring-2 ring-blue-300 shadow-game-md"
                    : "bg-white border-game-border/80"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-stone-100 border-2 border-stone-300 flex items-center justify-center text-2xl shadow-game-sm">
                        {clan.badgeEmoji}
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                          {clan.anime}
                        </span>
                        <h3 className="text-lg font-black text-game-dark mt-0.5">
                          {clan.name}
                        </h3>
                      </div>
                    </div>

                    {isMember && (
                      <span className="px-2.5 py-1 rounded-xl bg-game-blue text-white font-black text-xs uppercase shadow-game-sm">
                        Joined
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-bold text-stone-600 italic mb-3">
                    &ldquo;{clan.motto}&rdquo;
                  </p>

                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs font-bold text-amber-900 mb-3 flex items-start gap-2">
                    <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Perk: {clan.perk}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-extrabold text-stone-500 mb-4 px-1 tabular-nums">
                    <span>Active Comrades: {clan.membersCount + (isMember ? 1 : 0)}</span>
                    <span>Chakra Shared: {clan.totalChakraSent} Ki</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => joinClan(clan.id)}
                    className={`w-full py-3 px-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                      isMember
                        ? "bg-game-blue text-white shadow-game-blue border-2 border-blue-300 cursor-default"
                        : "bg-stone-100 hover:bg-stone-200 text-stone-700 border-2 border-stone-300 shadow-game-sm active:translate-y-0.5 cursor-pointer"
                    }`}
                  >
                    {isMember ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" aria-hidden="true" />
                        <span>Current Clan Oath</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4" aria-hidden="true" />
                        <span>Join This Clan</span>
                      </>
                    )}
                  </button>

                  {isMember && (
                    <button
                      type="button"
                      onClick={() => handleSendClanChakra(clan.id)}
                      disabled={hasSentClanKi}
                      className="w-full py-2.5 px-4 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 border-2 border-amber-300 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-game-sm active:translate-y-0.5 transition-all cursor-pointer"
                    >
                      <HeartHandshake className="w-4 h-4 text-amber-700" aria-hidden="true" />
                      <span>{hasSentClanKi ? "Chakra Sent! (+15 Zen Coins)" : "Send Chakra To Comrades"}</span>
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Remove Comrade Confirmation Dialog */}
      <GameConfirmModal
        isOpen={Boolean(friendToRemove)}
        title="Remove Comrade"
        message={`Are you sure you want to remove ${friendToRemove?.name || "this warrior"} from your comrades list?`}
        confirmText="Remove"
        cancelText="Keep"
        variant="danger"
        iconType="shield"
        onConfirm={() => {
          if (friendToRemove) {
            removeFriend(friendToRemove.id);
            setFriendToRemove(null);
          }
        }}
        onCancel={() => setFriendToRemove(null)}
      />
    </div>
  );
}
