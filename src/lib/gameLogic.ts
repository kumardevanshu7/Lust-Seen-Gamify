import { AnimeAchiever, AnimeClan, Comrade, ElementalSkill, Gender } from "@/types/game";

// Exponential XP curve
export function getXpRequiredForLevel(level: number): number {
  if (level <= 1) return 100;
  return Math.floor(100 * Math.pow(level, 1.32));
}

// Scaling HP capacity
export function getMaxHpForLevel(level: number): number {
  return 100 + (level - 1) * 12;
}

// Calculate streak multiplier (1.0x to 2.5x)
export function getStreakMultiplier(streakDays: number): number {
  if (streakDays <= 0) return 1.0;
  if (streakDays < 3) return 1.1;
  if (streakDays < 7) return 1.25;
  if (streakDays < 14) return 1.5;
  if (streakDays < 30) return 1.8;
  return 2.5;
}

// Dynamic Question Bucket Capacity (Expands after Level 15)
export function getMaxBucketQuestionsForLevel(level: number): number {
  if (level < 15) return 7;   // Levels 1-14: Standard 7 questions
  if (level < 20) return 8;   // Level 15+: 8 questions
  if (level < 25) return 9;   // Level 20+: 9 questions
  if (level < 30) return 10;  // Level 25+: 10 questions
  if (level < 40) return 11;  // Level 30+: 11 questions
  return 12;                  // Level 40+: 12 questions (Grandmaster)
}

// Level 1 Starter Elemental Skills / Classes (10 Distinct Willpower Disciplines)
export const ELEMENTAL_SKILLS: ElementalSkill[] = [
  {
    id: "fire",
    name: "Pyromancer",
    icon: "🔥",
    badge: "Flame",
    tag: "Burn Urges",
    color: "#ff5722",
    gradient: "from-orange-500 to-red-600",
    description: "Channels raw passion into burning inner drive, vaporizing urge triggers.",
    perk: "+20% Streak XP multiplier on clean check-ins",
    particles: ["🔥", "✨", "💥", "⚡"],
  },
  {
    id: "aqua",
    name: "Hydromancer",
    icon: "💧",
    badge: "Stillness",
    tag: "Flowing Calm",
    color: "#0288d1",
    gradient: "from-cyan-500 to-blue-600",
    description: "Extinguishes raging dopamine fires with deep emotional calm and fluidity.",
    perk: "+15 HP bonus heal on meditation & cold shower habits",
    particles: ["💧", "🌊", "🫧", "✨"],
  },
  {
    id: "lightning",
    name: "Storm Monk",
    icon: "⚡",
    badge: "Reflex",
    tag: "Lightning Reflex",
    color: "#fbc02d",
    gradient: "from-amber-400 to-yellow-500",
    description: "Strikes down intrusive sexual thoughts in a microsecond before they manifest.",
    perk: "50% damage reduction on minor urge triggers",
    particles: ["⚡", "✨", "🌩️", "💫"],
  },
  {
    id: "wizard",
    name: "Arcane Sorcerer",
    icon: "🔮",
    badge: "Ward",
    tag: "Domain Shield",
    color: "#8e24aa",
    gradient: "from-purple-600 to-indigo-600",
    description: "Erects ancient mental domain wards that neutralize acute urge traps.",
    perk: "Arcane Aegis: Weekly shield absorbs 1 fatal slip",
    particles: ["🔮", "✨", "🧿", "🪄"],
  },
  {
    id: "wind",
    name: "Aerial Shinobi",
    icon: "🍃",
    badge: "Gale",
    tag: "Breath Evasion",
    color: "#10b981",
    gradient: "from-emerald-500 to-teal-600",
    description: "Masters rhythmic 4-7-8 breathing evasion to slip through any lust attack.",
    perk: "Double Zen Coins awarded upon defeating Panic urges",
    particles: ["🍃", "💨", "🌀", "✨"],
  },
  {
    id: "earth",
    name: "Iron Titan",
    icon: "🏔️",
    badge: "Fortress",
    tag: "Unshakeable Rock",
    color: "#854d0e",
    gradient: "from-amber-800 to-stone-800",
    description: "Rooted like an ancient mountain. No storm of desire can push you back.",
    perk: "+30 Maximum Base HP permanent capacity",
    particles: ["🏔️", "🛡️", "🪨", "✨"],
  },
  {
    id: "shadow",
    name: "Shadow Assassin",
    icon: "🌑",
    badge: "Stealth",
    tag: "Vanish Urges",
    color: "#475569",
    gradient: "from-slate-700 to-zinc-900",
    description: "Silently executes compulsive urges before they take root in consciousness.",
    perk: "Night Ward: Eliminates midnight trigger penalties",
    particles: ["🌑", "🗡️", "🥷", "✨"],
  },
  {
    id: "light",
    name: "Solar Paladin",
    icon: "☀️",
    badge: "Radiance",
    tag: "Mind Clarity",
    color: "#f59e0b",
    gradient: "from-yellow-400 to-amber-500",
    description: "Blinds the mind's dark shadows with intense willpower clarity and focus.",
    perk: "Solar Flare: +10% bonus coins on all daily check-ins",
    particles: ["☀️", "🌟", "✨", "🛡️"],
  },
  {
    id: "dragon",
    name: "Dragon Knight",
    icon: "🐉",
    badge: "Draconic",
    tag: "Draconic Fury",
    color: "#dc2626",
    gradient: "from-rose-600 to-amber-700",
    description: "Unleashes the dragon's roar to incinerate chronic urge cycles.",
    perk: "+25% XP bonus when resisting severe 10/10 cravings",
    particles: ["🐉", "🔥", "⚔️", "✨"],
  },
  {
    id: "frost",
    name: "Frost Warden",
    icon: "❄️",
    badge: "Zero",
    tag: "Freeze Dopamine",
    color: "#06b6d4",
    gradient: "from-cyan-400 to-blue-500",
    description: "Instantly freezes compulsive heatwaves with arctic focus and stillness.",
    perk: "Absolute Zero: 1 emergency auto-freeze per week",
    particles: ["❄️", "🧊", "💠", "✨"],
  },
];

// Helper to get animated battle avatar GIF URL for any elemental skill and gender
export function getSkillGifUrl(skillName: string, gender: "boys" | "girls" | "male" | "female" = "boys"): string {
  const folder = gender === "female" || gender === "girls" ? "girls" : "boys";
  return `/skills/${folder}/${encodeURIComponent(skillName)}.gif`;
}

// Anime Achievers (Available right away as Collab Title Personas!)
export const ANIME_ACHIEVERS: AnimeAchiever[] = [
  // Male heroes
  {
    id: "rock_lee",
    name: "Rock Lee",
    anime: "Naruto",
    gender: "male",
    title: "Iron Fist of Pure Effort",
    quote: "A dropout will beat a genius through sheer hard work! A promise made to oneself is unbreakable.",
    perk: "+15% XP earned on every urge overcome",
    unlockLevel: 1,
    avatarColor: "#10b981",
  },
  {
    id: "roronoa_zoro",
    name: "Roronoa Zoro",
    anime: "One Piece",
    gender: "male",
    title: "King of Bushido Willpower",
    quote: "Scars on the back are a swordsman's shame. An iron mind never bends to cheap pleasure.",
    perk: "+25 Maximum HP shield capacity",
    unlockLevel: 1,
    avatarColor: "#059669",
  },
  {
    id: "tanjiro_kamado",
    name: "Tanjiro Kamado",
    anime: "Demon Slayer",
    gender: "male",
    title: "Breath of the Sun Warrior",
    quote: "Total Concentration! Even if the urge roars like an upper-rank demon, sever it with clean focus.",
    perk: "+10 HP passive recovery on daily check-in",
    unlockLevel: 1,
    avatarColor: "#e11d48",
  },
  {
    id: "guts_berserk",
    name: "Guts",
    anime: "Berserk",
    gender: "male",
    title: "The Indomitable Struggler",
    quote: "Keep struggling, keep fighting. Don’t you ever dare surrender your spirit to darkness.",
    perk: "Phoenix Shield: Survives 1 fatal slip with 1 HP",
    unlockLevel: 1,
    avatarColor: "#475569",
  },
  {
    id: "son_goku",
    name: "Son Goku",
    anime: "Dragon Ball Super",
    gender: "male",
    title: "Ultra Instinct Master",
    quote: "When body and raw urge disconnect, pure supreme focus is born.",
    perk: "2x XP on discipline habits (cold showers/pushups)",
    unlockLevel: 1,
    avatarColor: "#f97316",
  },
  {
    id: "naruto_uzumaki",
    name: "Naruto Uzumaki",
    anime: "Naruto Shippuden",
    gender: "male",
    title: "Sage of Unwavering Resolve",
    quote: "I never go back on my word! That is my ninja way, and I won’t lose to lust!",
    perk: "+100 Bonus Zen Coins upon reaching clean streaks",
    unlockLevel: 1,
    avatarColor: "#eab308",
  },

  // Female heroines
  {
    id: "mikasa_ackerman",
    name: "Mikasa Ackerman",
    anime: "Attack on Titan",
    gender: "female",
    title: "Blade of Unbreakable Focus",
    quote: "This world is cruel, but my willpower is razor sharp. No temptation can penetrate my guard.",
    perk: "+20% XP boost on 5+ day clean streaks",
    unlockLevel: 1,
    avatarColor: "#dc2626",
  },
  {
    id: "nobara_kugisaki",
    name: "Nobara Kugisaki",
    anime: "Jujutsu Kaisen",
    gender: "female",
    title: "Resonant Queen of Self-Pride",
    quote: "I love myself when I am strong and unyielding. Living true to my dignity is everything!",
    perk: "Immunity to minor trigger slip damage",
    unlockLevel: 1,
    avatarColor: "#ea580c",
  },
  {
    id: "erza_scarlet",
    name: "Erza Scarlet",
    anime: "Fairy Tail",
    gender: "female",
    title: "Titania: Unshakeable Fortress",
    quote: "My armor is forged from self-respect. Cheap dopamine has no power over Titania!",
    perk: "+30 Maximum HP permanent boost",
    unlockLevel: 1,
    avatarColor: "#991b1b",
  },
  {
    id: "maki_zenin",
    name: "Maki Zenin",
    anime: "Jujutsu Kaisen",
    gender: "female",
    title: "Heavenly Restriction Paragon",
    quote: "Discarding worthless distractions to awaken raw, devastating personal power.",
    perk: "+25% XP multiplier on all active discipline habits",
    unlockLevel: 1,
    avatarColor: "#166534",
  },
  {
    id: "tsunade_senju",
    name: "Tsunade",
    anime: "Naruto",
    gender: "female",
    title: "Legendary Sannin of Vitality",
    quote: "A true healer knows that curing the soul requires discipline of iron and courage of gold.",
    perk: "Doubles HP recovered from meditation & exercise",
    unlockLevel: 1,
    avatarColor: "#0f766e",
  },
  {
    id: "mirko_hero",
    name: "Mirko (Rumi Usagiyama)",
    anime: "My Hero Academia",
    gender: "female",
    title: "Relentless Apex Brawler",
    quote: "Live every day with zero regrets! Urges are just weak hurdles to kick through!",
    perk: "+50 Bonus XP every 3 consecutive clean days",
    unlockLevel: 1,
    avatarColor: "#7c3aed",
  },
];

// Anime Clans / Guilds
export const ANIME_CLANS: AnimeClan[] = [
  {
    id: "survey_corps",
    name: "Survey Corps (Scouts)",
    motto: "Dedicate your heart to freedom from urge!",
    anime: "Attack on Titan",
    bannerColor: "#1e3a29",
    accentColor: "#4ade80",
    badgeEmoji: "🦅",
    membersCount: 2840,
    totalChakraSent: 19430,
    perk: "Wings of Freedom: Absorbs first slip damage each week",
  },
  {
    id: "straw_hat_fleet",
    name: "Straw Hat Fleet",
    motto: "The freest warrior is the one who rules their own desire!",
    anime: "One Piece",
    bannerColor: "#7c2d12",
    accentColor: "#fbbf24",
    badgeEmoji: "🏴‍☠️",
    membersCount: 3410,
    totalChakraSent: 28540,
    perk: "King's Feast: +50 daily bonus Zen coins",
  },
  {
    id: "demon_slayer_corps",
    name: "Demon Slayer Corps",
    motto: "Total Concentration Breathing against inner demons!",
    anime: "Demon Slayer",
    bannerColor: "#4c0519",
    accentColor: "#fb7185",
    badgeEmoji: "⚔️",
    membersCount: 2190,
    totalChakraSent: 16820,
    perk: "Sun Breathing: +15% HP restoration on clean days",
  },
  {
    id: "uchiha_clan",
    name: "Uchiha Clan",
    motto: "Awaken the Sharingan of clear discernment over illusions!",
    anime: "Naruto",
    bannerColor: "#2e1065",
    accentColor: "#f43f5e",
    badgeEmoji: "👁️",
    membersCount: 1890,
    totalChakraSent: 14200,
    perk: "Mind Sharingan: Highlights slip risk before logging",
  },
  {
    id: "black_bulls",
    name: "Black Bulls",
    motto: "Surpass your limits right here, right now!",
    anime: "Black Clover",
    bannerColor: "#171717",
    accentColor: "#f59e0b",
    badgeEmoji: "🐂",
    membersCount: 1650,
    totalChakraSent: 12100,
    perk: "Limit Break: XP earnings increase when HP is under 40%",
  },
  {
    id: "jujutsu_society",
    name: "Jujutsu Sorcerers",
    motto: "Purge the curse of cheap dopamine with pure mental domain!",
    anime: "Jujutsu Kaisen",
    bannerColor: "#0f172a",
    accentColor: "#38bdf8",
    badgeEmoji: "☯️",
    membersCount: 2310,
    totalChakraSent: 21400,
    perk: "Domain Expansion: Urge panic button gives 2x calm points",
  },
];

// Real comrades network (no mock/demo users)
export const INITIAL_COMRADES: Comrade[] = [];

// Helper to filter achievers based on user gender
export function getAchieversForGender(gender: Gender): AnimeAchiever[] {
  if (gender === "other") return ANIME_ACHIEVERS;
  return ANIME_ACHIEVERS.filter((a) => a.gender === gender || a.gender === "all");
}

// Calculate remaining time until next 12:00 AM midnight
export function getTimeUntilMidnight(): { hours: number; minutes: number; seconds: number; totalSeconds: number } {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);

  const diffMs = midnight.getTime() - now.getTime();
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds, totalSeconds };
}

// Get today's local date string YYYY-MM-DD
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
