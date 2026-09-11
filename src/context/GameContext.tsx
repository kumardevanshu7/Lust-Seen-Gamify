"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import confetti from "canvas-confetti";
import {
  GameState,
  UserProfile,
  DailyLogSubmission,
  Question,
  GameSettings,
  ElementalSkillId,
  Comrade,
  PublicWarriorProfile,
} from "@/types/game";
import { DEFAULT_QUESTIONS } from "@/lib/defaultQuestions";
import {
  getXpRequiredForLevel,
  getMaxHpForLevel,
  getStreakMultiplier,
  getTodayDateString,
  INITIAL_COMRADES,
  getMaxBucketQuestionsForLevel,
} from "@/lib/gameLogic";
import { soundEngine } from "@/lib/soundEngine";
import { STORE_ITEMS } from "@/lib/storeItems";
import {
  auth,
  signInWithGoogle,
  signInAsGuest,
  logOutFirebase,
  saveGameStateToCloud,
  loadGameStateFromCloud,
  onAuthStateChanged,
  User,
  claimUsernameAndPublishProfile,
  formatCleanUsername,
  sendCloudFriendRequest,
  respondCloudFriendRequest,
  subscribeToIncomingFriendRequests,
} from "@/lib/firebase";

interface GameContextType {
  state: GameState;
  isLoaded: boolean;
  currentUser: User | null;
  isAuthLoading: boolean;
  loginGoogle: () => Promise<{ success: boolean; isOnboarded: boolean }>;
  loginGuest: () => Promise<boolean>;
  completeIntro: () => void;
  submitOnboarding: (
    name: string,
    username: string,
    gender: UserProfile["gender"],
    relationship: UserProfile["relationship"],
    elementalSkill: ElementalSkillId
  ) => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
  submitDailyLog: (answers: Record<string, boolean>) => { xpEarned: number; hpDelta: number; isClean: boolean };
  addCustomQuestion: (text: string, polarity: "win_on_yes" | "slip_on_yes") => void;
  equipAchiever: (achieverId: string) => void;
  joinClan: (clanId: string) => void;
  sendChakraToClan: (clanId: string) => void;
  sendFriendRequest: (target: string | PublicWarriorProfile) => void;
  acceptFriendRequest: (comradeId: string) => void;
  declineFriendRequest: (comradeId: string) => void;
  removeFriend: (comradeId: string) => void;
  setActiveQuestions: (questionIds: string[]) => void;
  buyStoreItem: (itemId: string) => { success: boolean; message: string };
  useInventoryItem: (itemId: string) => { success: boolean; message: string };
  equipAura: (auraId: string) => void;
  rebirthPhoenix: () => void;
  setLandingBackgroundVideo: (vid: "video-1" | "video-2") => void;
  setActiveBgmSong: (songId: string) => void;
  buySong: (songId: string, cost: number) => { success: boolean; message: string };
  useSurpassLevelsItem: () => { success: boolean; message: string };
  useSkillChangeItem: (newSkillId: ElementalSkillId) => { success: boolean; message: string };
  useAttackGuildMateItem: (targetComradeName: string) => { success: boolean; message: string };
  logout: () => Promise<void>;
  setActiveView: (view: GameState["activeView"]) => void;
  // Dev tools & God Mode
  devAddXp: (amount: number) => void;
  devDamageHp: (amount: number) => void;
  devHealHp: (amount: number) => void;
  devSetLevel: (level: number) => void;
  devTriggerMidnightReset: () => void;
  devAddCoins: (amount: number) => void;
  devUnlockAllItems: () => void;
  devUnlockAllSongs: () => void;
  devBypassStoreLocks: boolean;
  devToggleBypassStoreLocks: () => void;
  devSetStreak: (days: number) => void;
  devAuthorizeTesterUID: () => void;
  devSetElementalSkill: (skillId: ElementalSkillId) => void;
  devResetDailyLog: () => void;
  missedDayCountdown: number | null;
  triggerMissedDayPenalty: () => void;
  drinkReviveElixir: () => { success: boolean; message: string };
}

const STORAGE_KEY = "control_urge_game_state_v2";

const DEFAULT_7_ACTIVE_QUESTIONS = [
  "q1_relapse_masturbation",
  "q2_watch_explicit",
  "q4_desire_to_watch",
  "q5_lust_control_now",
  "q8_controlling_urges_status",
  "q13_effort_to_control",
  "q19_discipline_emergency_action",
];

const initialDefaultState: GameState = {
  hasCompletedIntro: true,
  isOnboarded: false,
  profile: {
    name: "",
    username: "",
    gender: "male",
    relationship: "single",
    elementalSkill: "fire",
    avatarSeed: "avatar_1",
    createdAt: new Date().toISOString(),
    title: "Novice Willpower Monk",
  },
  level: 1,
  currentXp: 0,
  maxXp: 100,
  hp: 100,
  maxHp: 100,
  coins: 50,
  streakDays: 0,
  bestStreakDays: 0,
  lastActiveDate: "",
  isGameOver: false,
  history: [],
  settings: {
    soundEnabled: true,
    soundVolume: 0.8,
    musicEnabled: false,
    musicVolume: 0.5,
    hapticsEnabled: true,
    selectedBgmTrack: "arena_japanese_girl_whisper",
    cardLanguage: "hinglish",
  },
  questions: DEFAULT_QUESTIONS,
  unlockedAchievers: [],
  friends: [],
  activeQuestionIds: DEFAULT_7_ACTIVE_QUESTIONS,
  inventory: {},
  activeStreakShields: 0,
  doubleXpDaysRemaining: 0,
  activeView: "daily",
  unlockedSongs: ["arena_japanese_girl_whisper", "arena_midnight_rain"],
  landingBackgroundVideo: "video-2",
  activeBgmSongId: "arena_japanese_girl_whisper",
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(initialDefaultState);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [devBypassStoreLocks, setDevBypassStoreLocks] = useState(false);
  const [missedDayCountdown, setMissedDayCountdown] = useState<number | null>(null);

  // 1. Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as GameState;
        // Merge and enrich questions with textMaleEn and textFemaleEn
        const mergedQuestions = (parsed.questions || DEFAULT_QUESTIONS).map((q) => {
          const dq = DEFAULT_QUESTIONS.find((item) => item.id === q.id);
          if (dq) {
            return {
              ...dq,
              ...q,
              textMaleEn: dq.textMaleEn,
              textFemaleEn: dq.textFemaleEn,
            };
          }
          return q;
        });
        const existingIds = new Set(mergedQuestions.map((q) => q.id));
        DEFAULT_QUESTIONS.forEach((dq) => {
          if (!existingIds.has(dq.id)) {
            mergedQuestions.push(dq);
          }
        });
        const realFriends = (parsed.friends || []).filter((f) => !f.id.startsWith("comrade_"));
        const mergedSongs = Array.from(
          new Set(["arena_japanese_girl_whisper", "arena_midnight_rain", ...(parsed.unlockedSongs || [])])
        );

        const hasLocalOnboardedFlag =
          Boolean(parsed.isOnboarded) &&
          Boolean(parsed.profile?.username && parsed.profile.username.startsWith("@"));

        setState({
          ...parsed,
          isOnboarded: hasLocalOnboardedFlag,
          settings: {
            ...initialDefaultState.settings,
            ...(parsed.settings || {}),
            cardLanguage: parsed.settings?.cardLanguage || "hinglish",
          },
          questions: mergedQuestions,
          friends: realFriends,
          unlockedSongs: mergedSongs,
          landingBackgroundVideo: parsed.landingBackgroundVideo || "video-2",
          activeBgmSongId: parsed.activeBgmSongId || "arena_japanese_girl_whisper",
          activeQuestionIds:
            parsed.activeQuestionIds && parsed.activeQuestionIds.length > 0
              ? parsed.activeQuestionIds
              : DEFAULT_7_ACTIVE_QUESTIONS,
          inventory: parsed.inventory || {},
          activeStreakShields: parsed.activeStreakShields || 0,
          doubleXpDaysRemaining: parsed.doubleXpDaysRemaining || 0,
        });
      }
    } catch (e) {
      console.error("Failed to load local game state:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 2. Firebase Auth State Listener & Cloud State Hydration
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);

      if (user) {
        try {
          const cloudState = await loadGameStateFromCloud(user.uid);
          const hasUserCompletedOnboarding =
            (Boolean(cloudState?.isOnboarded) && Boolean(cloudState?.profile?.username)) ||
            (typeof window !== "undefined" &&
              localStorage.getItem(`control_urge_user_onboarded_${user.uid}`) === "true" &&
              Boolean(localStorage.getItem(`control_urge_user_username_${user.uid}`)));

          if (cloudState && hasUserCompletedOnboarding) {
            // Restore cloud game state
            setState((prev) => ({
              ...prev,
              ...cloudState,
              isOnboarded: true,
              profile: {
                ...prev.profile,
                ...cloudState.profile,
                firebaseUid: user.uid,
                email: user.email || prev.profile.email,
                photoURL: user.photoURL || prev.profile.photoURL,
              },
            }));
          } else {
            // Brand new or uncompleted user: strictly enforce isOnboarded = false so onboarding is mandatory
            setState((prev) => ({
              ...prev,
              isOnboarded: false,
              profile: {
                ...prev.profile,
                firebaseUid: user.uid,
                name: user.displayName || prev.profile.name || "",
                email: user.email || prev.profile.email,
                photoURL: user.photoURL || prev.profile.photoURL,
              },
            }));
          }
        } catch (err) {
          console.warn("Error fetching cloud game data:", err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // 2.1 Subscribe to Real-Time Cloud Friend Requests
  useEffect(() => {
    if (!currentUser) return;
    const unsub = subscribeToIncomingFriendRequests(currentUser.uid, (cloudReqs) => {
      if (!cloudReqs || cloudReqs.length === 0) return;
      setState((prev) => {
        const existingIds = new Set(prev.friends.map((f) => f.id));
        const newComrades: Comrade[] = cloudReqs
          .filter((req) => !existingIds.has(req.id))
          .map((req) => ({
            id: req.id,
            name: req.fromName,
            username: req.fromUsername,
            gender: req.fromGender,
            elementalSkill: req.fromSkill,
            streakDays: req.fromStreak,
            animeTitle: req.fromAnimeTitle,
            avatarColor: req.fromAvatarColor,
            status: "pending_received",
            lastActive: "Just now",
            firebaseUid: req.fromUid,
          }));

        if (newComrades.length === 0) return prev;
        return {
          ...prev,
          friends: [...newComrades, ...prev.friends],
        };
      });
    });

    return () => unsub();
  }, [currentUser]);

  // 3. Save to localStorage on change (Offline Resilience)
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to persist game state:", e);
    }
  }, [state, isLoaded]);

  // 4. Auto-Sync Game State to Cloud Firestore (debounced 1200ms for high performance)
  useEffect(() => {
    if (!isLoaded || !currentUser) return;
    const debounceTimeout = setTimeout(() => {
      saveGameStateToCloud(currentUser.uid, state);
    }, 1200);

    return () => clearTimeout(debounceTimeout);
  }, [state, isLoaded, currentUser]);

  // Sync sound settings to soundEngine
  useEffect(() => {
    soundEngine.setSoundSettings(
      state.settings.soundEnabled,
      state.settings.soundVolume,
      state.settings.hapticsEnabled
    );
    if (state.settings.musicVolume !== undefined) {
      soundEngine.setMusicVolume(state.settings.musicVolume);
    }
    // Strict isolation: ONLY play Arena BGM if user is onboarded and inside the game!
    if (!state.isOnboarded) {
      soundEngine.stopBGM();
      return;
    }
    const currentTrack = state.activeBgmSongId || state.settings.selectedBgmTrack || "arena_japanese_girl_whisper";
    const isSongUnlocked = (state.unlockedSongs || []).includes(currentTrack);
    soundEngine.toggleBGM(
      state.settings.musicEnabled,
      currentTrack,
      isSongUnlocked
    );
  }, [
    state.isOnboarded,
    state.settings.soundEnabled,
    state.settings.soundVolume,
    state.settings.hapticsEnabled,
    state.settings.musicEnabled,
    state.settings.musicVolume,
    state.settings.selectedBgmTrack,
    state.activeBgmSongId,
    state.unlockedSongs,
  ]);

  const triggerConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#ff7033", "#38a5ff", "#2ecc71", "#ffbe1a"],
      });
    } catch {}
  }, []);

  const triggerMissedDayPenalty = useCallback(() => {
    // 1. Check if user has active streak shields
    if (state.activeStreakShields > 0) {
      setState((prev) => ({
        ...prev,
        activeStreakShields: prev.activeStreakShields - 1,
        lastActiveDate: getTodayDateString(),
      }));
      soundEngine.playWin();
      return;
    }

    // 2. Start urgent 10-second Disciplinary Doom countdown
    setMissedDayCountdown(10);
    soundEngine.playDamage();
  }, [state.activeStreakShields]);

  // Decrement Missed Day Countdown every 1000ms
  useEffect(() => {
    if (missedDayCountdown === null) return;

    if (missedDayCountdown <= 0) {
      // Countdown expired: DISCIPLINARY ACCOUNT PURGE (Reset to Level 1)
      setMissedDayCountdown(null);
      setState((prev) => ({
        ...prev,
        level: 1,
        currentXp: 0,
        maxXp: 100,
        hp: 100,
        maxHp: 100,
        streakDays: 0,
        coins: 50,
        isGameOver: false,
        lastActiveDate: getTodayDateString(),
      }));
      soundEngine.playGameOver();
      return;
    }

    const timer = setTimeout(() => {
      setMissedDayCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [missedDayCountdown]);

  // Drink Revive Elixir: Aborts 10s countdown, cancels disciplinary reset, restores 100% HP
  const drinkReviveElixir = useCallback((): { success: boolean; message: string } => {
    const count = state.inventory["revive_elixir"] || 0;
    if (count <= 0) {
      return {
        success: false,
        message: "No Revive Elixir in inventory! Buy one in the Bazaar (available every 10th level).",
      };
    }

    setMissedDayCountdown(null);
    setState((prev) => ({
      ...prev,
      hp: prev.maxHp,
      isGameOver: false,
      inventory: {
        ...prev.inventory,
        revive_elixir: Math.max(0, (prev.inventory["revive_elixir"] || 1) - 1),
      },
      lastActiveDate: getTodayDateString(),
    }));
    soundEngine.playWin();
    triggerConfetti();
    return {
      success: true,
      message: "Revive Elixir consumed! Disciplinary doom averted and HP restored to 100%!",
    };
  }, [state.inventory, triggerConfetti]);

  // Automatic 12:00 AM Midnight Check
  useEffect(() => {
    if (!isLoaded || !state.isOnboarded) return;

    const checkMidnight = () => {
      const today = getTodayDateString();
      if (state.lastActiveDate && state.lastActiveDate !== today) {
        const lastDate = new Date(state.lastActiveDate);
        const currDate = new Date(today);
        const diffDays = Math.floor((currDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

        if (diffDays >= 1) {
          triggerMissedDayPenalty();
        }
      }
    };

    checkMidnight();
    const interval = setInterval(checkMidnight, 60000);
    return () => clearInterval(interval);
  }, [isLoaded, state.isOnboarded, state.lastActiveDate, triggerMissedDayPenalty]);

  const completeIntro = useCallback(() => {
    soundEngine.playClick();
    setState((prev) => ({ ...prev, hasCompletedIntro: true }));
  }, []);

  // Submit Onboarding with Username and Elemental Skill
  const submitOnboarding = useCallback(
    (
      name: string,
      username: string,
      gender: UserProfile["gender"],
      relationship: UserProfile["relationship"],
      elementalSkill: ElementalSkillId
    ) => {
      soundEngine.playWin();
      triggerConfetti();

      // Clean formatted username with @
      const cleanHandle = formatCleanUsername(username);
      const formattedUsername = `@${cleanHandle}`;
      const targetUid = currentUser?.uid || `warrior_${Date.now()}`;

      // Claim username in Firestore & publish public profile for global search
      claimUsernameAndPublishProfile(targetUid, {
        name: name.trim(),
        username: formattedUsername,
        gender,
        relationship,
        elementalSkill,
        level: 1,
        streakDays: 0,
        animeTitle: gender === "female" ? "Valkyrie of Willpower" : "Monk of Iron Resolve",
        avatarColor: "#ff7033",
        clanName: "Survey Corps",
        photoURL: currentUser?.photoURL || "",
      }).catch((e) => console.warn("Error claiming username in cloud:", e));

      if (typeof window !== "undefined") {
        if (currentUser?.uid) {
          localStorage.setItem(`control_urge_user_onboarded_${currentUser.uid}`, "true");
          localStorage.setItem(`control_urge_user_username_${currentUser.uid}`, formattedUsername);
        }
      }

      setState((prev) => {
        const nextState: GameState = {
          ...prev,
          isOnboarded: true,
          hasCompletedIntro: true,
          profile: {
            ...prev.profile,
            name: name.trim(),
            username: formattedUsername,
            gender,
            relationship,
            elementalSkill,
            firebaseUid: targetUid,
            email: currentUser?.email || prev.profile.email,
            photoURL: currentUser?.photoURL || prev.profile.photoURL,
            createdAt: new Date().toISOString(),
            title: gender === "female" ? "Valkyrie of Willpower" : "Monk of Iron Resolve",
          },
        };

        if (currentUser?.uid) {
          saveGameStateToCloud(currentUser.uid, nextState);
        }

        return nextState;
      });
    },
    [triggerConfetti, currentUser]
  );

  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  }, []);

  // Submit Daily Log & Calculate Game Mechanics
  const submitDailyLog = useCallback(
    (answers: Record<string, boolean>) => {
      let totalXp = 0;
      let totalHpDelta = 0;
      let hasSlips = false;

      const activeIds = state.activeQuestionIds?.length
        ? state.activeQuestionIds
        : DEFAULT_7_ACTIVE_QUESTIONS;

      state.questions
        .filter((q) => activeIds.includes(q.id))
        .forEach((q) => {
        const isYes = answers[q.id];
        if (isYes === undefined) return;

        if (q.polarity === "win_on_yes") {
          if (isYes) {
            totalXp += q.xpGain;
            totalHpDelta += q.hpHeal;
          } else {
            totalHpDelta -= q.hpDamage;
            if (q.hpDamage > 0) hasSlips = true;
          }
        } else {
          if (isYes) {
            totalHpDelta -= q.hpDamage;
            hasSlips = true;
          } else {
            totalXp += q.xpGain;
            totalHpDelta += q.hpHeal;
          }
        }
      });

      // Elemental Skill Perk: Fire grants +20% streak XP multiplier
      let streakMultiplier = getStreakMultiplier(hasSlips ? 0 : state.streakDays + 1);
      if (state.profile.elementalSkill === "fire") {
        streakMultiplier *= 1.2;
      }
      // Scroll of Twin Flow: 2x XP active
      if (state.doubleXpDaysRemaining > 0) {
        streakMultiplier *= 2;
      }

      const currentStreak = hasSlips ? 0 : state.streakDays + 1;
      const finalXp = Math.round(totalXp * streakMultiplier);
      const coinsEarned = hasSlips ? 10 : 35 + currentStreak * 5;

      const today = getTodayDateString();
      const submission: DailyLogSubmission = {
        date: today,
        submittedAt: new Date().toISOString(),
        answers,
        xpEarned: finalXp,
        hpDelta: totalHpDelta,
        isCleanDay: !hasSlips,
      };

      setState((prev) => {
        const nextHp = Math.max(0, Math.min(prev.maxHp, prev.hp + totalHpDelta));
        const isGameOver = nextHp <= 0;

        let newLevel = prev.level;
        let newCurrentXp = prev.currentXp + finalXp;
        let newMaxXp = prev.maxXp;
        let didLevelUp = false;

        while (newCurrentXp >= newMaxXp) {
          newCurrentXp -= newMaxXp;
          newLevel += 1;
          newMaxXp = getXpRequiredForLevel(newLevel);
          didLevelUp = true;
        }

        const newMaxHp = getMaxHpForLevel(newLevel);
        const levelBonusCoins = didLevelUp ? (newLevel - prev.level) * 35 : 0;

        if (isGameOver) {
          soundEngine.playGameOver();
        } else if (didLevelUp) {
          soundEngine.playLevelUp();
          triggerConfetti();
        } else if (!hasSlips) {
          soundEngine.playWin();
          triggerConfetti();
        } else {
          soundEngine.playDamage();
        }

        return {
          ...prev,
          level: newLevel,
          currentXp: newCurrentXp,
          maxXp: newMaxXp,
          hp: nextHp,
          maxHp: newMaxHp,
          coins: prev.coins + coinsEarned + levelBonusCoins,
          doubleXpDaysRemaining: Math.max(0, prev.doubleXpDaysRemaining - 1),
          streakDays: currentStreak,
          bestStreakDays: Math.max(prev.bestStreakDays, currentStreak),
          lastActiveDate: today,
          isGameOver,
          history: [submission, ...prev.history.filter((h) => h.date !== today)],
        };
      });

      return { xpEarned: finalXp, hpDelta: totalHpDelta, isClean: !hasSlips };
    },
    [state.questions, state.streakDays, state.profile.elementalSkill, triggerConfetti]
  );

  const addCustomQuestion = useCallback(
    (text: string, polarity: "win_on_yes" | "slip_on_yes") => {
      soundEngine.playClick();
      const newQuestion: Question = {
        id: `custom_${Date.now()}`,
        textMale: text.trim(),
        textFemale: text.trim(),
        textMaleEn: text.trim(),
        textFemaleEn: text.trim(),
        polarity,
        category: polarity === "win_on_yes" ? "control_win" : "trigger",
        hpDamage: polarity === "slip_on_yes" ? 20 : 15,
        xpGain: 30,
        hpHeal: 10,
        isCustom: true,
      };

      setState((prev) => ({
        ...prev,
        questions: [...prev.questions, newQuestion],
      }));
    },
    []
  );

  // Equip Anime Achiever Title (No level restriction!)
  const equipAchiever = useCallback((achieverId: string) => {
    soundEngine.playWin();
    setState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        equippedAnimeAchieverId: achieverId,
      },
    }));
  }, []);

  const joinClan = useCallback((clanId: string) => {
    soundEngine.playLevelUp();
    setState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        clanId,
      },
    }));
  }, []);

  const sendChakraToClan = useCallback((clanId: string) => {
    soundEngine.playWin();
    setState((prev) => ({
      ...prev,
      coins: prev.coins + 15,
    }));
  }, []);

  // Social Comrades: Send Friend Request
  const sendFriendRequest = useCallback(
    (target: string | PublicWarriorProfile) => {
      soundEngine.playClick();
      if (typeof target === "string") {
        const cleanRaw = target.replace(/^@/, "").trim();
        const cleanHandle = `@${cleanRaw.toLowerCase()}`;
        const newComrade: Comrade = {
          id: `user_${Date.now()}`,
          name: cleanRaw,
          username: cleanHandle,
          gender: "other",
          elementalSkill: "fire",
          streakDays: 1,
          animeTitle: "Path of Willpower",
          avatarColor: "#ff7033",
          status: "pending_sent",
          lastActive: "Just now",
          clanName: "Survey Corps",
        };

        setState((prev) => ({
          ...prev,
          friends: [newComrade, ...prev.friends.filter((f) => f.username !== cleanHandle)],
        }));
      } else {
        const cleanHandle = target.username;
        const newComrade: Comrade = {
          id: `user_${target.uid}`,
          name: target.name,
          username: cleanHandle,
          gender: target.gender,
          elementalSkill: target.elementalSkill,
          streakDays: target.streakDays,
          animeTitle: target.animeTitle,
          avatarColor: target.avatarColor,
          status: "pending_sent",
          lastActive: "Just now",
          clanName: target.clanName || "Survey Corps",
          firebaseUid: target.uid,
        };

        // If current user is logged in, send real-time cloud request
        if (currentUser) {
          const currentComrade: Comrade = {
            id: currentUser.uid,
            name: state.profile.name || "Warrior",
            username: state.profile.username || `@warrior_${currentUser.uid.slice(0, 5)}`,
            gender: state.profile.gender,
            elementalSkill: state.profile.elementalSkill,
            streakDays: state.streakDays,
            animeTitle: state.profile.title || "Path of Willpower",
            avatarColor: "#ff7033",
            status: "pending_sent",
            lastActive: "Just now",
            firebaseUid: currentUser.uid,
          };
          sendCloudFriendRequest(currentComrade, target).catch((e) =>
            console.warn("Cloud friend request note:", e)
          );
        }

        setState((prev) => ({
          ...prev,
          friends: [newComrade, ...prev.friends.filter((f) => f.username !== cleanHandle && f.id !== newComrade.id)],
        }));
      }
    },
    [currentUser, state.profile, state.streakDays]
  );

  // Accept Friend Request
  const acceptFriendRequest = useCallback((comradeId: string) => {
    soundEngine.playWin();
    respondCloudFriendRequest(comradeId, "accepted").catch(() => {});
    setState((prev) => ({
      ...prev,
      friends: prev.friends.map((f) => (f.id === comradeId ? { ...f, status: "friend" as const } : f)),
    }));
  }, []);

  // Decline Friend Request
  const declineFriendRequest = useCallback((comradeId: string) => {
    soundEngine.playClick();
    respondCloudFriendRequest(comradeId, "declined").catch(() => {});
    setState((prev) => ({
      ...prev,
      friends: prev.friends.filter((f) => f.id !== comradeId),
    }));
  }, []);

  // Remove Friend
  const removeFriend = useCallback((comradeId: string) => {
    soundEngine.playDamage();
    setState((prev) => ({
      ...prev,
      friends: prev.friends.filter((f) => f.id !== comradeId),
    }));
  }, []);

  // Set Active Questions from Bucket (Dynamic Capacity expanding after Level 15)
  const setActiveQuestions = useCallback(
    (questionIds: string[]) => {
      soundEngine.playWin();
      const maxAllowed = getMaxBucketQuestionsForLevel(state.level);
      setState((prev) => ({
        ...prev,
        activeQuestionIds: questionIds.slice(0, maxAllowed),
      }));
    },
    [state.level]
  );

  // Buy Item from RPG Bazaar
  const buyStoreItem = useCallback(
    (itemId: string): { success: boolean; message: string } => {
      const item = STORE_ITEMS.find((it) => it.id === itemId);
      if (!item) return { success: false, message: "Item not found in Bazaar!" };

      if (!devBypassStoreLocks && item.minLevel && state.level < item.minLevel) {
        soundEngine.playDamage();
        return {
          success: false,
          message: `Requires Level ${item.minLevel} or higher! Your current level is ${state.level}.`,
        };
      }

      if (state.coins < item.cost) {
        soundEngine.playDamage();
        return { success: false, message: `Need ${item.cost - state.coins} more coins to purchase!` };
      }

      if (!item.isConsumable && (state.inventory[itemId] || 0) > 0) {
        return { success: false, message: "You already own this item!" };
      }

      soundEngine.playWin();
      triggerConfetti();

      setState((prev) => {
        const nextInv = { ...prev.inventory, [itemId]: (prev.inventory[itemId] || 0) + 1 };
        let nextProfile = { ...prev.profile };
        const nextUnlockedSongs = [...(prev.unlockedSongs || ["arena_japanese_girl_whisper", "arena_midnight_rain"])];

        // Auto-equip titles and auras on initial purchase
        if (item.effectType === "equip_title") {
          nextProfile.title = String(item.effectValue);
        }
        if (item.effectType === "equip_aura") {
          nextProfile.equippedAura = String(item.effectValue);
        }
        if (item.effectType === "unlock_premium_song") {
          const songId = String(item.effectValue || item.id);
          if (!nextUnlockedSongs.includes(songId)) {
            nextUnlockedSongs.push(songId);
          }
        }

        return {
          ...prev,
          coins: prev.coins - item.cost,
          inventory: nextInv,
          profile: nextProfile,
          unlockedSongs: nextUnlockedSongs,
        };
      });

      return { success: true, message: `Acquired ${item.name}!` };
    },
    [state.coins, state.level, state.inventory, devBypassStoreLocks, triggerConfetti]
  );

  // Background Video Switcher for Landing Page
  const setLandingBackgroundVideo = useCallback((vid: "video-1" | "video-2") => {
    soundEngine.playClick();
    setState((prev) => ({ ...prev, landingBackgroundVideo: vid }));
  }, []);

  // Set Active BGM Song
  const setActiveBgmSong = useCallback((songId: string) => {
    soundEngine.playClick();
    setState((prev) => ({
      ...prev,
      activeBgmSongId: songId,
      settings: { ...prev.settings, selectedBgmTrack: songId, musicEnabled: true },
    }));
  }, []);

  // Buy Song with 100 Coins (e.g. Other Songs audition prompt)
  const buySong = useCallback(
    (songId: string, cost: number): { success: boolean; message: string } => {
      if (state.coins < cost) {
        soundEngine.playDamage();
        return { success: false, message: `Need ${cost - state.coins} more coins to purchase this track!` };
      }

      if ((state.unlockedSongs || []).includes(songId)) {
        return { success: true, message: "Track already unlocked!" };
      }

      soundEngine.playWin();
      triggerConfetti();

      setState((prev) => ({
        ...prev,
        coins: prev.coins - cost,
        unlockedSongs: [...(prev.unlockedSongs || []), songId],
        activeBgmSongId: songId,
        settings: { ...prev.settings, selectedBgmTrack: songId, musicEnabled: true },
      }));

      return { success: true, message: "Track permanently unlocked!" };
    },
    [state.coins, state.unlockedSongs, triggerConfetti]
  );

  // Use Surpass 2 Levels Item
  const useSurpassLevelsItem = useCallback((): { success: boolean; message: string } => {
    const owned = state.inventory["item_surpass_2_levels"] || 0;
    if (owned <= 0) {
      soundEngine.playDamage();
      return { success: false, message: "You don't own any Heaven's Scroll: Surpass 2 Levels!" };
    }

    soundEngine.playLevelUp();
    triggerConfetti();

    setState((prev) => {
      const nextLevel = prev.level + 2;
      const nextMaxXp = getXpRequiredForLevel(nextLevel);
      const nextMaxHp = getMaxHpForLevel(nextLevel);
      const bonusCoins = 70; // 35 coins per skipped level

      const nextInv = {
        ...prev.inventory,
        item_surpass_2_levels: Math.max(0, (prev.inventory["item_surpass_2_levels"] || 1) - 1),
      };

      return {
        ...prev,
        level: nextLevel,
        currentXp: 0,
        maxXp: nextMaxXp,
        maxHp: nextMaxHp,
        hp: nextMaxHp,
        coins: prev.coins + bonusCoins,
        inventory: nextInv,
      };
    });

    return { success: true, message: "Ascended 2 full levels and gained +70 coins!" };
  }, [state.inventory, triggerConfetti]);

  // Use Skill Change Item
  const useSkillChangeItem = useCallback(
    (newSkillId: ElementalSkillId): { success: boolean; message: string } => {
      const owned = state.inventory["item_skill_respec"] || 0;
      if (owned <= 0) {
        soundEngine.playDamage();
        return { success: false, message: "You don't own an Elemental Respec Soul Orb!" };
      }

      soundEngine.playSkillActivate(newSkillId);
      triggerConfetti();

      setState((prev) => {
        const nextInv = {
          ...prev.inventory,
          item_skill_respec: Math.max(0, (prev.inventory["item_skill_respec"] || 1) - 1),
        };

        return {
          ...prev,
          inventory: nextInv,
          profile: {
            ...prev.profile,
            elementalSkill: newSkillId,
          },
        };
      });

      return { success: true, message: `Elemental affinity transfigured to ${newSkillId.toUpperCase()}!` };
    },
    [state.inventory, triggerConfetti]
  );

  // Use Attack Guild Mate Item
  const useAttackGuildMateItem = useCallback(
    (targetComradeName: string): { success: boolean; message: string } => {
      const owned = state.inventory["item_attack_guild"] || 0;
      if (owned <= 0) {
        soundEngine.playDamage();
        return { success: false, message: "You don't own a Death Note: Guild Mate Strike!" };
      }

      soundEngine.playDamage();

      setState((prev) => {
        const nextInv = {
          ...prev.inventory,
          item_attack_guild: Math.max(0, (prev.inventory["item_attack_guild"] || 1) - 1),
        };

        const nextFriends = prev.friends.map((f) => {
          if (
            f.name.toLowerCase() === targetComradeName.toLowerCase() ||
            f.username.toLowerCase() === targetComradeName.toLowerCase()
          ) {
            return {
              ...f,
              streakDays: Math.max(0, f.streakDays - 1),
              lastActive: "Struck by Guild Mate (-250 XP)",
            };
          }
          return f;
        });

        return {
          ...prev,
          inventory: nextInv,
          friends: nextFriends,
        };
      });

      return { success: true, message: `Death Note struck ${targetComradeName}! Slashed 250 XP!` };
    },
    [state.inventory]
  );

  // Use Consumable Item from Inventory
  const useInventoryItem = useCallback(
    (itemId: string): { success: boolean; message: string } => {
      const currentCount = state.inventory[itemId] || 0;
      if (currentCount <= 0) {
        soundEngine.playDamage();
        return { success: false, message: "You don't have any of this item!" };
      }

      const item = STORE_ITEMS.find((it) => it.id === itemId);
      if (!item) return { success: false, message: "Item not found!" };

      if (item.effectType === "surpass_levels") {
        return useSurpassLevelsItem();
      }

      soundEngine.playLevelUp();
      triggerConfetti();

      setState((prev) => {
        const nextInv = { ...prev.inventory, [itemId]: Math.max(0, (prev.inventory[itemId] || 1) - 1) };
        let nextHp = prev.hp;
        let nextShields = prev.activeStreakShields;
        let nextDoubleXp = prev.doubleXpDaysRemaining;
        let nextXp = prev.currentXp;
        let nextLevel = prev.level;
        let nextMaxXp = prev.maxXp;
        let nextProfile = { ...prev.profile };
        let nextIsGameOver = prev.isGameOver;

        if (item.effectType === "heal_hp") {
          nextHp = Math.min(prev.maxHp, prev.hp + Number(item.effectValue || 35));
          if (nextHp > 0) nextIsGameOver = false;
        } else if (item.effectType === "revive_hp") {
          nextHp = Math.min(prev.maxHp, Math.round((prev.maxHp * Number(item.effectValue || 50)) / 100));
          nextIsGameOver = false;
          if (item.id === "revive_stone") {
            nextShields += 1;
          }
        } else if (item.effectType === "smoke_bomb") {
          nextHp = Math.min(prev.maxHp, prev.hp + 15);
        } else if (item.effectType === "streak_shield") {
          nextShields = prev.activeStreakShields + Number(item.effectValue || 1);
        } else if (item.effectType === "double_xp") {
          nextDoubleXp = prev.doubleXpDaysRemaining + Number(item.effectValue || 2);
        } else if (item.effectType === "gain_xp") {
          nextXp += Number(item.effectValue || 100);
          while (nextXp >= nextMaxXp) {
            nextXp -= nextMaxXp;
            nextLevel += 1;
            nextMaxXp = getXpRequiredForLevel(nextLevel);
          }
        } else if (item.effectType === "equip_title") {
          nextProfile.title = String(item.effectValue);
        } else if (item.effectType === "equip_aura") {
          nextProfile.equippedAura = String(item.effectValue);
        }

        return {
          ...prev,
          hp: nextHp,
          isGameOver: nextIsGameOver,
          activeStreakShields: nextShields,
          doubleXpDaysRemaining: nextDoubleXp,
          currentXp: nextXp,
          level: nextLevel,
          maxXp: nextMaxXp,
          maxHp: getMaxHpForLevel(nextLevel),
          inventory: nextInv,
          profile: nextProfile,
        };
      });

      return { success: true, message: `Activated ${item.name}!` };
    },
    [state.inventory, triggerConfetti, useSurpassLevelsItem]
  );

  // Equip / Toggle Aura
  const equipAura = useCallback((auraId: string) => {
    soundEngine.playClick();
    setState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        equippedAura: prev.profile.equippedAura === auraId ? undefined : auraId,
      },
    }));
  }, []);

  const rebirthPhoenix = useCallback(() => {
    soundEngine.playWin();
    setState((prev) => ({
      ...prev,
      hp: prev.maxHp,
      streakDays: 0,
      isGameOver: false,
      lastActiveDate: "",
    }));
  }, []);

  // Google Sign-In with Automatic Cloud Profile Sync
  const loginGoogle = useCallback(async (): Promise<{ success: boolean; isOnboarded: boolean }> => {
    soundEngine.playClick();
    try {
      const user = await signInWithGoogle();
      const cloudData = await loadGameStateFromCloud(user.uid);
      const isUserAlreadyOnboarded =
        (Boolean(cloudData?.isOnboarded) && Boolean(cloudData?.profile?.username)) ||
        (typeof window !== "undefined" &&
          localStorage.getItem(`control_urge_user_onboarded_${user.uid}`) === "true" &&
          Boolean(localStorage.getItem(`control_urge_user_username_${user.uid}`)));

      if (isUserAlreadyOnboarded) {
        setState((prev) => {
          const nextState: GameState = {
            ...prev,
            ...(cloudData || {}),
            isOnboarded: true,
            hasCompletedIntro: true,
            profile: {
              ...prev.profile,
              ...(cloudData?.profile || {}),
              firebaseUid: user.uid,
              name: cloudData?.profile?.name || prev.profile.name || user.displayName || "Novice Warrior",
              username: cloudData?.profile?.username || prev.profile.username || "@warrior",
              email: user.email || prev.profile.email,
              photoURL: user.photoURL || prev.profile.photoURL,
            },
          };
          saveGameStateToCloud(user.uid, nextState);
          if (typeof window !== "undefined") {
            localStorage.setItem(`control_urge_user_onboarded_${user.uid}`, "true");
            localStorage.setItem(`control_urge_user_username_${user.uid}`, nextState.profile.username);
          }
          return nextState;
        });
        soundEngine.playWin();
        return { success: true, isOnboarded: true };
      } else {
        setState((prev) => ({
          ...prev,
          isOnboarded: false,
          profile: {
            ...prev.profile,
            firebaseUid: user.uid,
            name: prev.profile.name || user.displayName || "",
            email: user.email || "",
            photoURL: user.photoURL || "",
          },
        }));
        soundEngine.playWin();
        return { success: true, isOnboarded: false };
      }
    } catch (error) {
      console.error("Google sign in failed:", error);
      return { success: false, isOnboarded: false };
    }
  }, [state.isOnboarded]);

  // Anonymous Guest Sign-In
  const loginGuest = useCallback(async (): Promise<boolean> => {
    soundEngine.playClick();
    try {
      const user = await signInAsGuest();
      setState((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          firebaseUid: user.uid,
        },
      }));
      return true;
    } catch (error) {
      console.error("Guest sign in failed:", error);
      return false;
    }
  }, []);

  // Logout: Sign out from Firebase and Reset Local Storage
  const logout = useCallback(async (): Promise<void> => {
    soundEngine.playDamage();
    try {
      await logOutFirebase();
    } catch (e) {
      console.warn("Firebase sign out warning:", e);
    }
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}

    setState({
      ...initialDefaultState,
      hasCompletedIntro: true,
    });
  }, []);

  const setActiveView = useCallback((view: GameState["activeView"]) => {
    soundEngine.playPageTransition();
    setState((prev) => ({ ...prev, activeView: view }));
  }, []);

  // Dev tools
  const devAddXp = useCallback(
    (amount: number) => {
      setState((prev) => {
        let newLevel = prev.level;
        let newXp = prev.currentXp + amount;
        let newMaxXp = prev.maxXp;
        while (newXp >= newMaxXp) {
          newXp -= newMaxXp;
          newLevel += 1;
          newMaxXp = getXpRequiredForLevel(newLevel);
        }
        soundEngine.playLevelUp();
        triggerConfetti();
        const levelBonusCoins = (newLevel - prev.level) * 35;
        return {
          ...prev,
          level: newLevel,
          currentXp: newXp,
          maxXp: newMaxXp,
          maxHp: getMaxHpForLevel(newLevel),
          coins: prev.coins + levelBonusCoins,
        };
      });
    },
    [triggerConfetti]
  );

  const devDamageHp = useCallback((amount: number) => {
    setState((prev) => {
      const nextHp = Math.max(0, prev.hp - amount);
      const isGameOver = nextHp <= 0;
      if (isGameOver) soundEngine.playGameOver();
      else soundEngine.playDamage();
      return { ...prev, hp: nextHp, isGameOver };
    });
  }, []);

  const devHealHp = useCallback((amount: number) => {
    soundEngine.playWin();
    setState((prev) => ({
      ...prev,
      hp: Math.min(prev.maxHp, prev.hp + amount),
    }));
  }, []);

  const devSetLevel = useCallback(
    (targetLevel: number) => {
      soundEngine.playLevelUp();
      triggerConfetti();
      setState((prev) => ({
        ...prev,
        level: targetLevel,
        currentXp: 0,
        maxXp: getXpRequiredForLevel(targetLevel),
        maxHp: getMaxHpForLevel(targetLevel),
        hp: getMaxHpForLevel(targetLevel),
        coins: prev.coins + Math.max(0, targetLevel - prev.level) * 35,
      }));
    },
    [triggerConfetti]
  );

  const devTriggerMidnightReset = useCallback(() => {
    triggerMissedDayPenalty();
  }, [triggerMissedDayPenalty]);

  const devAddCoins = useCallback(
    (amount: number) => {
      soundEngine.playWin();
      triggerConfetti();
      setState((prev) => ({
        ...prev,
        coins: Math.max(0, prev.coins + amount),
      }));
    },
    [triggerConfetti]
  );

  const devUnlockAllItems = useCallback(() => {
    soundEngine.playWin();
    triggerConfetti();
    setState((prev) => {
      const allInv: Record<string, number> = { ...prev.inventory };
      STORE_ITEMS.forEach((it) => {
        if (it.isConsumable) {
          allInv[it.id] = (allInv[it.id] || 0) + 10;
        } else {
          allInv[it.id] = 1;
        }
      });
      return {
        ...prev,
        inventory: allInv,
      };
    });
  }, [triggerConfetti]);

  const devUnlockAllSongs = useCallback(() => {
    soundEngine.playWin();
    triggerConfetti();
    setState((prev) => ({
      ...prev,
      unlockedSongs: [
        "arena_japanese_girl_whisper",
        "arena_midnight_rain",
        "sakura_breeze",
        "tokyo_night_drive",
        "zen_monastery",
        "cyberpunk_shinobi",
        "lofi_shrine",
        "anime_lofi_beat",
        "blade_runner_neon",
        "mountain_waterfall",
      ],
    }));
  }, [triggerConfetti]);

  const devToggleBypassStoreLocks = useCallback(() => {
    soundEngine.playToggle(!devBypassStoreLocks);
    setDevBypassStoreLocks((prev) => !prev);
  }, [devBypassStoreLocks]);

  const devSetStreak = useCallback((days: number) => {
    soundEngine.playWin();
    setState((prev) => ({
      ...prev,
      streakDays: days,
      bestStreakDays: Math.max(prev.bestStreakDays || 0, days),
    }));
  }, []);

  const devAuthorizeTesterUID = useCallback(() => {
    soundEngine.playLevelUp();
    triggerConfetti();
    setState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        firebaseUid: "CHan2MohYMWJTHLlAlanNrZvq6b2",
        name: prev.profile.name || "Master Tester",
        username: prev.profile.username || "@god_tester",
      },
      isOnboarded: true,
    }));
  }, [triggerConfetti]);

  const devSetElementalSkill = useCallback(
    (skillId: ElementalSkillId) => {
      soundEngine.playLevelUp();
      triggerConfetti();
      setState((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          elementalSkill: skillId,
        },
      }));
    },
    [triggerConfetti]
  );

  const devResetDailyLog = useCallback(() => {
    soundEngine.playWin();
    setState((prev) => ({
      ...prev,
      lastActiveDate: "",
    }));
  }, []);

  return (
    <GameContext.Provider
      value={{
        state,
        isLoaded,
        currentUser,
        isAuthLoading,
        loginGoogle,
        loginGuest,
        completeIntro,
        submitOnboarding,
        updateSettings,
        submitDailyLog,
        addCustomQuestion,
        equipAchiever,
        joinClan,
        sendChakraToClan,
        sendFriendRequest,
        acceptFriendRequest,
        declineFriendRequest,
        removeFriend,
        setActiveQuestions,
        buyStoreItem,
        useInventoryItem,
        equipAura,
        rebirthPhoenix,
        setLandingBackgroundVideo,
        setActiveBgmSong,
        buySong,
        useSurpassLevelsItem,
        useSkillChangeItem,
        useAttackGuildMateItem,
        logout,
        setActiveView,
        devAddXp,
        devDamageHp,
        devHealHp,
        devSetLevel,
        devTriggerMidnightReset,
        devAddCoins,
        devUnlockAllItems,
        devUnlockAllSongs,
        devBypassStoreLocks,
        devToggleBypassStoreLocks,
        devSetStreak,
        devAuthorizeTesterUID,
        devSetElementalSkill,
        devResetDailyLog,
        missedDayCountdown,
        triggerMissedDayPenalty,
        drinkReviveElixir,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
