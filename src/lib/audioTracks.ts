export interface AudioTrack {
  id: string;
  title: string;
  category: "landing" | "arena" | "other" | "premium";
  src: string;
  cost: number;
  isDefault?: boolean;
  previewLimitSeconds?: number;
  badge: string;
  icon: string;
  description: string;
}

export const GAME_AUDIO_TRACKS: AudioTrack[] = [
  // 1. Landing Page Background Music
  {
    id: "landing_control_desire",
    title: "Control the Desire",
    category: "landing",
    src: "/musics/landing_page/Control the Desire.mp3",
    cost: 0,
    isDefault: true,
    badge: "Landing Theme",
    icon: "🌸",
    description: "Atmospheric, sensual rhythm that plays alongside Video 2 on the landing portal.",
  },

  // 2. Arena Default Unlocked Music
  {
    id: "arena_japanese_girl_whisper",
    title: "Japanese Girl Whisper",
    category: "arena",
    src: "/musics/arena_music/Japanese Girl Wisper.mp3",
    cost: 0,
    isDefault: true,
    badge: "Arena Default",
    icon: "🎋",
    description: "Delicate whispering oriental tones echoing through the daily willpower arena.",
  },
  {
    id: "arena_midnight_rain",
    title: "Midnight Rain",
    category: "arena",
    src: "/musics/arena_music/Midnight Rain.mp3",
    cost: 0,
    badge: "Arena Unlocked",
    icon: "🌧️",
    description: "Rain-drenched bamboo melodies for deep nocturnal willpower focus.",
  },

  // 3. Other Songs (100 Coins Each, 20s Free Preview with purchase prompt)
  {
    id: "other_desire_in_the_wind",
    title: "Desire in the Wind",
    category: "other",
    src: "/musics/other_songs/Desire in the Wind.mp3",
    cost: 100,
    previewLimitSeconds: 20,
    badge: "100 Coins",
    icon: "🍃",
    description: "Seductive airy gusts. 20-second free audition, unlock full song for 100 Zen coins.",
  },
  {
    id: "other_throne_of_wind",
    title: "Throne of Wind",
    category: "other",
    src: "/musics/other_songs/Throne of Wind.mp3",
    cost: 100,
    previewLimitSeconds: 20,
    badge: "100 Coins",
    icon: "🌪️",
    description: "Majestic soaring flute of the wind sovereign. 20-second free preview, unlock for 100 coins.",
  },

  // 4. Premium Songs (Store / Bazaar Exclusive, Above 1500 Coins)
  {
    id: "premium_midnight_rain_pre",
    title: "Midnight Rain (Studio Master)",
    category: "premium",
    src: "/musics/premium_songs/Midnight Rain Pre.mp3",
    cost: 1500,
    badge: "Elite 1500 Coins",
    icon: "👑",
    description: "Master studio recording with rich sub-bass frequencies and calming acoustic harmonics.",
  },
  {
    id: "premium_warriors_ascent_pre",
    title: "Warrior's Ascent (Epic Master)",
    category: "premium",
    src: "/musics/premium_songs/Warrior's Ascent Pre.mp3",
    cost: 1800,
    badge: "Mythic 1800 Coins",
    icon: "⚡",
    description: "Legendary ascent symphony designed for long-streak masters overcoming impossible cravings.",
  },
];
