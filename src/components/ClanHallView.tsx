"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { ANIME_CLANS, ELEMENTAL_SKILLS } from "@/lib/gameLogic";
import { soundEngine } from "@/lib/soundEngine";
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
} from "lucide-react";
import { GameConfirmModal } from "@/components/GameConfirmModal";
import { Comrade } from "@/types/game";

export function ClanHallView() {
  const {
    state,
    joinClan,
    sendChakraToClan,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
  } = useGame();

  const [activeTab, setActiveTab] = useState<"clans" | "social">("social");
  const [searchQuery, setSearchQuery] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [customUserSearch, setCustomUserSearch] = useState("");
  const [requestStatusMsg, setRequestStatusMsg] = useState("");
  const [friendToRemove, setFriendToRemove] = useState<Comrade | null>(null);
  const [chakraSentMap, setChakraSentMap] = useState<Record<string, boolean>>({});
  const [chakraSentClan, setChakraSentClan] = useState<Record<string, boolean>>({});

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

  const handleAddFriendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) return;
    sendFriendRequest(newUsername.trim());
    setNewUsername("");
  };

  // Filtered friends
  const activeFriends = state.friends.filter((f) => f.status === "friend");
  const pendingReceived = state.friends.filter((f) => f.status === "pending_received");
  const pendingSent = state.friends.filter((f) => f.status === "pending_sent");

  const filteredFriends = activeFriends.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5 select-none">
      {/* Top Banner & Tab Switcher */}
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
              Add friends, share daily willpower chakra, and pledge allegiance to an Anime Clan!
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center bg-amber-100/80 p-1.5 rounded-2xl border-2 border-amber-300 shrink-0">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setActiveTab("social");
              }}
              className={`px-3.5 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
                activeTab === "social"
                  ? "bg-game-orange text-white shadow-game-sm"
                  : "text-stone-700 hover:text-stone-900"
              }`}
            >
              Comrades ({activeFriends.length})
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setActiveTab("clans");
              }}
              className={`px-3.5 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
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

      {/* TAB 1: COMRADES & SOCIAL NETWORK */}
      {activeTab === "social" && (
        <div className="space-y-4">
          {/* Add Friend Form Bar */}
          <form
            onSubmit={handleAddFriendSubmit}
            className="p-3.5 bg-white border-3 border-game-border/80 rounded-2xl shadow-game-sm flex flex-col sm:flex-row items-center gap-2.5"
          >
            <div className="relative flex-1 w-full">
              <span className="absolute left-3.5 top-2.5 text-stone-400 font-bold text-sm">@</span>
              <input
                type="text"
                value={newUsername.replace(/^@/, "")}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Enter comrade @username to add…"
                className="w-full pl-8 pr-4 py-2 rounded-xl bg-stone-50 border-2 border-stone-200 font-bold text-xs focus-visible:outline-none focus-visible:border-game-orange"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-game-orange hover:bg-game-orangeDark text-white font-black text-xs uppercase tracking-wider shadow-game-sm flex items-center justify-center gap-1.5 active:translate-y-0.5 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Send Friend Request</span>
            </button>
          </form>

          {/* Pending Friend Requests Notice */}
          {pendingReceived.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-2">
              <span className="text-xs font-black uppercase text-amber-900 tracking-wider flex items-center gap-1">
                <span>📬</span> Incoming Friend Requests ({pendingReceived.length})
              </span>
              <div className="space-y-2">
                {pendingReceived.map((req) => (
                  <div
                    key={req.id}
                    className="p-2.5 bg-white rounded-xl border border-amber-200 flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="font-black text-xs text-game-dark">
                        {req.name}{" "}
                        <span className="text-[11px] font-mono text-stone-400">
                          {req.username}
                        </span>
                      </div>
                      <div className="text-[10px] text-stone-500 font-medium">
                        Streak: {req.streakDays} Days • {req.animeTitle}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => acceptFriendRequest(req.id)}
                        className="p-1.5 px-3 rounded-lg bg-game-green text-white font-black text-xs flex items-center gap-1 shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => declineFriendRequest(req.id)}
                        className="p-1.5 px-2.5 rounded-lg bg-stone-200 text-stone-700 font-bold text-xs"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Friends Search & Filter */}
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search comrades by name or handle…"
                className="w-full pl-9 pr-4 py-2 rounded-2xl bg-white border-2 border-stone-200 font-bold text-xs focus-visible:outline-none focus-visible:border-game-orange shadow-inner"
              />
            </div>
            <span className="text-xs font-black text-stone-500 tabular-nums shrink-0">
              {filteredFriends.length} Comrades
            </span>
          </div>

          {/* Comrades Card Grid or Clean Empty State */}
          {filteredFriends.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white border-3 border-dashed border-amber-200 text-center space-y-3 shadow-game-sm">
              <div className="w-14 h-14 rounded-2xl bg-amber-100/80 border-2 border-amber-300 flex items-center justify-center mx-auto text-3xl shadow-inner">
                🛡️
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="text-base font-black text-game-dark">
                  {searchQuery ? "No Matching Comrades Found" : "Your Guild Squad is Ready to Assemble"}
                </h3>
                <p className="text-xs text-stone-500 font-medium mt-1 leading-relaxed">
                  {searchQuery
                    ? `No comrades found matching "${searchQuery}". Check the handle spelling or clear search.`
                    : "No fake demo data! Only real registered warriors will appear here. Send a friend request by handle above to connect with fellow warriors."}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredFriends.map((friend) => {
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
                      className="w-full py-2.5 px-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 border-2 border-amber-300 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-game-sm active:translate-y-0.5 transition-all"
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

      {/* TAB 2: ANIME CLANS & GUILD BANNERS */}
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
                        : "bg-stone-100 hover:bg-stone-200 text-stone-700 border-2 border-stone-300 shadow-game-sm active:translate-y-0.5"
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
                      className="w-full py-2.5 px-4 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 border-2 border-amber-300 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-game-sm active:translate-y-0.5 transition-all"
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
