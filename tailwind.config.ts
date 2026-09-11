import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        game: {
          cream: "#fbf6ec",
          card: "#fdfbf7",
          border: "#7b5233",
          borderLight: "#b8906f",
          dark: "#2b1810",
          orange: "#ff7033",
          orangeDark: "#d9531e",
          blue: "#38a5ff",
          blueDark: "#1b7ed9",
          green: "#2ecc71",
          greenDark: "#239a55",
          red: "#ff4d4d",
          redDark: "#cc2929",
          yellow: "#ffbe1a",
          yellowDark: "#d49607",
          purple: "#9b51e0",
          purpleDark: "#7b2cbf",
          gold: "#f59e0b",
        },
      },
      boxShadow: {
        "game-sm": "0 2px 0 0 rgba(0, 0, 0, 0.25)",
        "game-md": "0 4px 0 0 rgba(0, 0, 0, 0.25)",
        "game-lg": "0 6px 0 0 rgba(0, 0, 0, 0.3)",
        "game-orange": "0 4px 0 0 #b34213",
        "game-blue": "0 4px 0 0 #1868b3",
        "game-green": "0 4px 0 0 #1c7c42",
        "game-red": "0 4px 0 0 #ad2020",
        "game-yellow": "0 4px 0 0 #a87402",
        "game-card": "0 8px 0 0 rgba(74, 46, 24, 0.15), 0 20px 30px -10px rgba(0, 0, 0, 0.2)",
      },
      fontFamily: {
        sans: ["var(--font-chakra)", "system-ui", "sans-serif"],
        serif: ["var(--font-cinzel)", "Georgia", "serif"],
        game: ["var(--font-chakra)", "system-ui", "sans-serif"],
        display: ["var(--font-cinzel)", "Georgia", "serif"],
      },
      keyframes: {
        "pulse-damage": {
          "0%, 100%": { transform: "scale(1)", filter: "none" },
          "50%": { transform: "scale(0.97)", filter: "drop-shadow(0 0 12px rgba(255, 77, 77, 0.8))" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "pulse-damage": "pulse-damage 0.3s ease-in-out",
        "float-slow": "float-slow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
