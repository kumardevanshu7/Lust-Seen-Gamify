# Control Urge 🎮🔥

<div align="center">
  <h3>Conquer Compulsions · Awaken Willpower · Gamified Discipline</h3>
  <p>A high-performance gamified habit-tracking RPG to conquer sexual urges and build unbreakable willpower.</p>
</div>

---

> **Note**: This project is proudly developed under **Arigato Labs**, founded by **Kumar Devanshu** in 2026.

Built with **Next.js 14**, **Tailwind CSS**, **Framer Motion**, and **Pure Web Audio API**, adhering strictly to the **Vercel Web Interface Guidelines**.

---

## ✨ Features

1. **2-Second "Time To Control" Splash Animation**:
   - High-energy opening logo animation with smooth zoom-out into a no-scrollable landing interface.
2. **Playful 3-Step Onboarding**:
   - Name / Warrior alias.
   - Gender / Discipline path (tailors Hinglish grammar and Level 10 Anime Achievers).
   - Relationship status: Single, Married, or Having an imaginary wife/husband.
3. **20 Curated Accountability Questions**:
   - Evaluated with exact Win/Slip polarity logic.
   - Win habits grant **XP** and heal **Health (HP)**.
   - Slip/relapse triggers deal damage to **Health (HP)**.
   - Includes custom question creator.
4. **RPG Health Bar & Leveling Mechanics**:
   - Health Bar (HP) scales with level.
   - **Game Over**: If HP drops to 0 at any level, a dramatic breakdown screen triggers and resets the run via **Phoenix Rebirth**.
   - **12:00 AM Midnight Rule**: Live countdown timer. If a daily entry is missed past 12:00 AM, the system breaks the streak and applies an HP penalty.
5. **Level 10 Unlock: Anime Achievers**:
   - Boys roster: Rock Lee, Roronoa Zoro, Tanjiro Kamado, Guts, Son Goku, Naruto Uzumaki.
   - Girls roster: Mikasa Ackerman, Nobara Kugisaki, Erza Scarlet, Maki Zenin, Tsunade, Mirko.
   - Non-binary / diverse roster with dual title access.
   - Equip character badges for passive discipline buffs.
6. **Level 15 Unlock: Join Anime Clans**:
   - Survey Corps, Straw Hat Fleet, Demon Slayer Corps, Uchiha Clan, Black Bulls, Jujutsu Sorcerers.
   - Social Ki/Chakra sharing with clan comrades for bonus Zen coins.
7. **Playful Casual Mobile Game UI (Inspired by Reference Screenshot)**:
   - Level progression bar (`3  198 / 250  4  5`).
   - Pause / Settings menu with interactive sliders for Music, Sound Effects, and Haptics.
   - Emergency **🚨 Urge Panic Button** with 4-7-8 breathing circle and emergency physical distraction checklist.
8. **Responsive Across All Screens (PWA)**:
   - Compact Mobile (iPhone SE/Android 360-390px)
   - Large Mobile (iPhone Pro Max 430px)
   - Tablet (iPad 768px - 1024px)
   - Laptop / Desktop (1024px - 1440px)
   - Ultrawide / Multi-window
   - Includes desktop **View Switcher Toolbar** to preview on different screen sizes.
9. **Dev Testing Drawer**:
   - Built-in simulation tool to fast-forward midnight reset, jump to Level 10/15, damage HP, and add XP instantly.

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deploying to Vercel

1. Push this repository to GitHub / GitLab / Bitbucket.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import the repository and click **Deploy**.
4. Next.js App Router will be detected automatically with zero additional configuration needed.

---

## 🔑 Environment Variables

```env
# Optional: Web3Forms access key for Contact form delivery to kumardevanshu3001@gmail.com
NEXT_PUBLIC_WEB3FORMS_KEY=your_key_here
```

---

*Control Urge is a product of Arigato Labs, founded by Kumar Devanshu in 2026. All Rights Reserved.*
