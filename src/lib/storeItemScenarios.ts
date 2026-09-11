// storeItemScenarios.ts
// Tactical gameplay scenarios and detailed operational mechanics for all 40+ Bazaar items

export interface ItemScenarioInfo {
  id: string;
  howItWorks: string;
  scenario: string;
}

export const STORE_ITEM_SCENARIOS: Record<string, ItemScenarioInfo> = {
  // 1. CONSUMABLES & HEALTH RESTORATION
  zen_tea: {
    id: "zen_tea",
    howItWorks: "Consumes 1 tea to immediately restore +20 HP to your Willpower Vitality bar, soothing sudden craving stress.",
    scenario: "Scenario: After a tough afternoon dealing with work stress and social media triggers, your HP dropped to 65%. You sip the Oolong Lotus Brew from your inventory to heal back to 85% before the evening sets in.",
  },
  smoke_bomb: {
    id: "smoke_bomb",
    howItWorks: "Emergency panic escape. Instantly restores +15 HP and clears distracting craving thoughts.",
    scenario: "Scenario: A sudden explicit pop-up appears while browsing. Your heart races. You hit the Ninja Smoke Bomb in your inventory to mentally disengage, close the browser, and recover +15 HP immediately.",
  },
  potion_hp: {
    id: "potion_hp",
    howItWorks: "Restores +35 HP Willpower Vitality. Essential replenishment after an intense day.",
    scenario: "Scenario: Yesterday was a brutal battle against late-night boredom, leaving your HP at 40%. You drink the Phoenix Vitality Elixir to start today's quest at a comfortable 75% HP.",
  },
  holy_water_tears: {
    id: "holy_water_tears",
    howItWorks: "Restores +40 HP Vitality and washes away psychological guilt and lingering negative thoughts.",
    scenario: "Scenario: You caught yourself almost slipping into mindless scrolling on Instagram. You drink Saint's Tear of Purification to wipe the slate clean and restore +40 HP.",
  },
  chakra_surge_tincture: {
    id: "chakra_surge_tincture",
    howItWorks: "Restores +60 HP Vitality by activating your inner chakra reserves.",
    scenario: "Scenario: After a grueling 14-hour workday, your willpower stamina is depleted down to 20 HP. You drink this potent Kyuubi Chakra Tonic to surge back up to 80 HP and avoid entering the danger zone.",
  },
  potion_mega_hp: {
    id: "potion_mega_hp",
    howItWorks: "Legendary Korin divine bean that immediately restores your HP to 100% full capacity, regardless of current health.",
    scenario: "Scenario: Multiple consecutive stressful days knocked your HP down to a precarious 12 HP. Consuming this Senzu Bean instantly refills your health bar to 100% Max HP.",
  },
  revive_feather: {
    id: "revive_feather",
    howItWorks: "Auto-revival relic. If your HP hits 0% (Game Over), this feather burns from the ashes to revive you with 50% HP without losing your streak.",
    scenario: "Scenario: You suffered a critical relapse day that dropped your HP to zero. Instead of facing a devastating Game Over, your Phoenix Rebirth Feather auto-activates, restoring you to 50% HP and keeping your 30-day streak alive.",
  },
  revive_elixir: {
    id: "revive_elixir",
    howItWorks: "Emergency chronological antidote. Available every 10th level (Lv 10, 20, 30...). If you miss the 12:00 AM daily check-in, an urgent 10-second Disciplinary Doom countdown begins. Drinking this elixir halts the countdown, averts disciplinary reset to Level 1, and heals you to 100% full HP.",
    scenario: "Scenario: You fell asleep at 11:30 PM and woke up past midnight. A terrifying red 10-second countdown flashes across the screen: '10... 9... 8...'. You quickly tap 'DRINK REVIVE ELIXIR'. The timer freezes, your progress is saved, and your HP surges to 100%!",
  },
  revive_stone: {
    id: "revive_stone",
    howItWorks: "Apex alchemical artifact. Revives a fallen warrior with 100% Full HP AND gives you 1 Free Streak Shield.",
    scenario: "Scenario: After a complete breakdown where you hit Game Over, you activate the Philosopher's Will Stone. You are reborn with 100% maximum HP plus an extra Streak Shield to cushion your next battle.",
  },

  // 2. SHIELDS & DEFENSE
  streak_shield: {
    id: "streak_shield",
    howItWorks: "Celestial barrier that automatically consumes itself if you miss a 12:00 AM midnight cutoff, protecting your streak from resetting.",
    scenario: "Scenario: You went camping with no cellular reception for 24 hours. When midnight passed, your Aegis Streak Shield auto-deployed, keeping your 45-day streak intact without any penalties.",
  },
  kamui_talisman: {
    id: "kamui_talisman",
    howItWorks: "Phases your profile into a pocket dimension. Restores +25 HP and adds +1 Streak Shield to your inventory.",
    scenario: "Scenario: You are heading into a weekend party with old friends where triggers are everywhere. You equip the Kamui Talisman beforehand to pocket an extra shield and bolster your HP by +25.",
  },
  grand_aegis_shield: {
    id: "grand_aegis_shield",
    howItWorks: "Grants 3 consecutive days of automatic streak freeze protection.",
    scenario: "Scenario: You are traveling abroad across time zones for a 3-day conference. Mirror of Yata ensures you do not lose your 60-day streak even if flight delays disrupt your daily check-in rhythm.",
  },
  susanoo_ribcage: {
    id: "susanoo_ribcage",
    howItWorks: "Manifests a chakra barrier granting +2 Streak Shields and instantly healing +30 HP.",
    scenario: "Scenario: During exam week or high-stress project deadlines, you activate Susano'o Ribcage Barrier to shield your streak for two potential misses and get an instant +30 HP boost.",
  },
  infinity_barrier: {
    id: "infinity_barrier",
    howItWorks: "Special Grade Jujutsu barrier. Grants 4 consecutive days of streak freeze protection against missed check-ins.",
    scenario: "Scenario: You are going on a remote meditation or wilderness retreat without your phone for four days. Gojo's Limitless Veil freezes your streak safely until your return.",
  },

  // 3. XP BOOSTERS & FAST PROGRESSION
  booster_xp: {
    id: "booster_xp",
    howItWorks: "Instantly injects +100 XP into your current level progression bar.",
    scenario: "Scenario: You are just 85 XP away from reaching Level 10 to unlock the Revive Elixir. You pop the Divine Chakra Capsule to level up immediately!",
  },
  double_xp: {
    id: "double_xp",
    howItWorks: "Doubles all XP earned from daily discipline logs for the next 2 full days.",
    scenario: "Scenario: It's Monday morning. You activate the Scroll of Twin Flow so that every successful daily log on Monday and Tuesday gives 2x the normal XP rewards.",
  },
  booster_hyper_xp: {
    id: "booster_hyper_xp",
    howItWorks: "Instantly awards +300 XP to accelerate your warrior level.",
    scenario: "Scenario: You want to climb the clan leaderboards ahead of weekly rewards. You consume the Hyperbolic Time Capsule to vault your XP forward by 300 points.",
  },
  zenitsu_thunder_clap: {
    id: "zenitsu_thunder_clap",
    howItWorks: "Strikes cravings with lightning speed, granting +200 instant XP and +15 HP.",
    scenario: "Scenario: After successfully executing a 10-minute cold shower to kill an urge, you reward yourself with the Thunderclap Scroll to gain +200 XP and +15 HP.",
  },
  triple_xp: {
    id: "triple_xp",
    howItWorks: "Forbidden Mount Myoboku scroll that triples (3x) all discipline XP earned across the next 3 days.",
    scenario: "Scenario: You embark on a 72-hour discipline challenge. The Ancient Sage Tome supercharges every check-in with 300% XP!",
  },

  // 4. USER SPECIFIC MAJOR ITEMS (LEVEL 20, 22, 25)
  item_surpass_2_levels: {
    id: "item_surpass_2_levels",
    howItWorks: "Unlocked at Level 20+. Instantly skips 2 complete levels (e.g., jumps from Level 20 directly to Level 22), granting level bonus coins and rewards.",
    scenario: "Scenario: You reach Level 20 after a 60-day battle. You want to quickly reach Level 22 to unlock the Elemental Respec Orb. You read Heaven's Scroll and immediately advance to Level 22!",
  },
  item_skill_respec: {
    id: "item_skill_respec",
    howItWorks: "Unlocked at Level 22+. Grants a one-time class change, allowing you to switch your Elemental Skill (Fire, Water, Earth, Wind, Lightning, etc.).",
    scenario: "Scenario: You started as Fire (+20% streak XP), but now face intense environmental triggers and prefer Earth (-15% damage reduction). At Level 22, you use this Soul Orb to re-spec your primary element.",
  },
  item_attack_guild: {
    id: "item_attack_guild",
    howItWorks: "Unlocked at Level 25+. One-time use PvP item. Targets any guildmate in your clan and slashes 250 XP from their current rank.",
    scenario: "Scenario: A clanmate has been bragging in guild chat while slacking on their daily logs. At Level 25, you target them with the Death Note strike to dock 250 XP and re-establish clan discipline!",
  },
  item_chakra_drain: {
    id: "item_chakra_drain",
    howItWorks: "Siphons spiritual momentum from rival reserves, stealing +120 bonus coins and granting +150 XP.",
    scenario: "Scenario: You are short on coins to buy a vital shield before midnight. You use Rasengan Chakra Siphon to immediately pocket +120 coins.",
  },
  item_curse_doll: {
    id: "item_curse_doll",
    howItWorks: "Resonates with spiritual energy to instantly inject +180 XP into your rank.",
    scenario: "Scenario: Facing strong evening cravings, you focus on your willpower altar and channel Nobara's Straw Doll nail to gain +180 XP and maintain your warrior focus.",
  },

  // 5. AURAS & COSMETIC GLOWS
  aura_flame: {
    id: "aura_flame",
    howItWorks: "Equips a pulsating blazing inferno particle effect around your warrior card across all game screens.",
    scenario: "Scenario: You achieved a 14-day streak and want your profile to radiate intense passion and discipline. You equip the Demon Slayer Fire Aura in your avatar deck.",
  },
  aura_super_saiyan: {
    id: "aura_super_saiyan",
    howItWorks: "Equips radiant golden electric lightning sparks around your warrior portrait.",
    scenario: "Scenario: You unlocked Super Saiyan at Level 10. Your avatar now crackles with golden ki on the Clan Leaderboard.",
  },
  aura_ultra_instinct: {
    id: "aura_ultra_instinct",
    howItWorks: "Equips silvery divine particles with ethereal blue flames around your card.",
    scenario: "Scenario: At Level 30, you attain Ultra Instinct. Your mind moves on pure reflex, immune to low-vibrational urges.",
  },
  aura_zen_lotus: {
    id: "aura_zen_lotus",
    howItWorks: "Surrounds your profile with tranquil emerald chakra ripples and floating lotus petals.",
    scenario: "Scenario: You value inner peace and stoicism. You equip the Zen Lotus aura to display calm mastery in the Achievers Hall.",
  },

  // 6. TITLES & PRESTIGE
  title_hokage: {
    id: "title_hokage",
    howItWorks: "Equips the prestigious title '7th Shadow Hokage' on your warrior profile and clan tag.",
    scenario: "Scenario: As leader of your clan, you wear the Hokage title to inspire junior warriors and hold the guild's standard high.",
  },
  title_hashira: {
    id: "title_hashira",
    howItWorks: "Equips the elite title 'Flame Hashira of Iron Will' on your card.",
    scenario: "Scenario: Having survived 30 days without a single slip, you dawn the Hashira mantle to symbolize unwavering resolve.",
  },
  title_special_grade: {
    id: "title_special_grade",
    howItWorks: "Equips the terrifying title 'Special Grade Willpower Sorcerer' on your profile.",
    scenario: "Scenario: You enter the Clan Hall. Fellow members see your Special Grade title and know you are a top-tier master.",
  },

  // 7. EXCLUSIVE JUKEBOX SONGS
  premium_midnight_rain_pre: {
    id: "premium_midnight_rain_pre",
    howItWorks: "Permanently unlocks the full studio master recording of 'Midnight Rain' in your Arena Jukebox.",
    scenario: "Scenario: You love training to low-fi rain acoustics. You purchase this exclusive master for 1,500 coins to set it as your permanent background theme.",
  },
  premium_warriors_ascent_pre: {
    id: "premium_warriors_ascent_pre",
    howItWorks: "Permanently unlocks the mythic orchestral battle score 'Warrior's Ascent' in your Arena Jukebox.",
    scenario: "Scenario: You hit a massive 100-day milestone and have a wealth of coins. You unlock this mythic soundtrack to celebrate your ascension to warrior godhood.",
  },
};
