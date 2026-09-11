export type Gender = "male" | "female" | "other";

export type RelationshipStatus =
  | "single"
  | "married"
  | "imaginary_spouse"; // User requested: single or married or having an imaginary wife or husband

export type ElementalSkillId =
  | "fire"
  | "aqua"
  | "lightning"
  | "wizard"
  | "wind"
  | "earth"
  | "shadow"
  | "light"
  | "dragon"
  | "frost";

export interface ElementalSkill {
  id: ElementalSkillId;
  name: string;
  icon: string;
  badge: string;
  tag: string; // Punchy 1-line tag e.g. "Burn Urges"
  color: string;
  gradient: string;
  description: string;
  perk: string;
  particles: string[];
}

export interface UserProfile {
  name: string;
  username: string; // e.g., @shadow_monk
  gender: Gender;
  relationship: RelationshipStatus;
  elementalSkill: ElementalSkillId;
  avatarSeed: string;
  createdAt: string;
  title: string; // e.g., "Novice Monk", "Iron Will Apprentice"
  equippedAnimeAchieverId?: string;
  clanId?: string;
  firebaseUid?: string;
  email?: string;
  photoURL?: string;
  equippedAura?: string;
}

export interface Comrade {
  id: string;
  name: string;
  username: string;
  gender: Gender;
  elementalSkill: ElementalSkillId;
  streakDays: number;
  animeTitle: string;
  avatarColor: string;
  status: "friend" | "pending_sent" | "pending_received";
  lastActive: string;
  clanName?: string;
}

export type QuestionPolarity = "win_on_yes" | "slip_on_yes";

export interface Question {
  id: string;
  textMale: string;
  textFemale: string;
  textMaleEn?: string;
  textFemaleEn?: string;
  polarity: QuestionPolarity;
  category: "relapse" | "trigger" | "control_win" | "habit_boost" | "night_urge";
  hpDamage: number;
  xpGain: number;
  hpHeal: number;
  isCustom?: boolean;
}

export interface DailyLogSubmission {
  date: string; // YYYY-MM-DD
  submittedAt: string;
  answers: Record<string, boolean>;
  xpEarned: number;
  hpDelta: number;
  isCleanDay: boolean;
}

export interface AnimeAchiever {
  id: string;
  name: string;
  anime: string;
  gender: "male" | "female" | "all";
  title: string;
  quote: string;
  perk: string;
  unlockLevel: number;
  avatarUrl?: string;
  avatarColor: string;
}

export interface AnimeClan {
  id: string;
  name: string;
  motto: string;
  anime: string;
  bannerColor: string;
  accentColor: string;
  badgeEmoji: string;
  membersCount: number;
  totalChakraSent: number;
  perk: string;
}

export interface GameSettings {
  soundEnabled: boolean;
  soundVolume: number;
  musicEnabled: boolean;
  musicVolume: number;
  hapticsEnabled: boolean;
  selectedBgmTrack?: string;
  cardLanguage?: "hinglish" | "english";
}

export interface StoreItem {
  id: string;
  name: string;
  category: "potion" | "shield" | "booster" | "title" | "aura" | "relic" | "combat" | "music";
  cost: number;
  icon: string;
  description: string;
  benefit: string;
  isConsumable: boolean;
  minLevel?: number; // Minimum level required to unlock / buy!
  badge?: string;
  effectType:
    | "heal_hp"
    | "gain_xp"
    | "surpass_levels"      // Level 20+ item: Skip 2 full levels!
    | "attack_guild_mate"    // Level 25+ item: Slash guild mate XP!
    | "change_skill"         // Level 22+ item: Switch elemental discipline!
    | "revive_hp"            // Phoenix Feather: Instant revive from 0 HP
    | "revive_elixir"        // Revive Elixir: Abort 10s missed day disciplinary reset
    | "streak_shield"
    | "double_xp"
    | "triple_xp"
    | "smoke_bomb"
    | "unlock_premium_song"  // Buy premium BGM track
    | "equip_title"
    | "equip_aura";
  effectValue?: number | string;
}

export interface GameState {
  hasCompletedIntro: boolean;
  isOnboarded: boolean;
  profile: UserProfile;
  level: number;
  currentXp: number;
  maxXp: number;
  hp: number;
  maxHp: number;
  coins: number;
  streakDays: number;
  bestStreakDays: number;
  lastActiveDate: string;
  isGameOver: boolean;
  history: DailyLogSubmission[];
  settings: GameSettings;
  questions: Question[];
  unlockedAchievers: string[];
  friends: Comrade[];
  activeQuestionIds: string[]; // The 7 chosen questions from the bucket
  inventory: Record<string, number>; // itemId -> quantity owned
  unlockedSongs: string[]; // Track IDs unlocked / purchased
  landingBackgroundVideo: "video-1" | "video-2"; // Video selected on landing page
  activeBgmSongId: string; // Currently active Arena BGM track
  activeStreakShields: number; // Active shields protecting from missed days
  doubleXpDaysRemaining: number; // Active days of 2x XP
  activeView: "daily" | "achievers" | "clans" | "stats" | "store";
}
