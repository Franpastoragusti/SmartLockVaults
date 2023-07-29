/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  darkTheme: "scaffoldEthDark",
  // DaisyUI theme colors
  daisyui: {
    themes: [
      {
        scaffoldEth: {
          primary: "#262626",
          "primary-content": "#ffffff",
          secondary: "#262626",
          "secondary-content": "#ffffff",
          accent: "#ffffff",
          "accent-content": "#ffffff",
          neutral: "#E8E9EB",
          "neutral-content": "blue",
          "base-100": "#ffffff",
          "base-200": "#ffffff",
          "base-300": "#ffffff",
          "base-content": "#262626",
          info: "#B1B1B1",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",

          "--rounded-btn": "9999rem",

          ".tooltip": {
            "--tooltip-tail": "6px",
          },
        },
      },
      {
        scaffoldEthDark: {
          primary: "#ffffff",
          "primary-content": "#262626",
          secondary: "#ffffff",
          "secondary-content": "#262626",
          accent: "#505050",
          "accent-content": "#262626",
          neutral: "#323232",
          "neutral-content": "#ffffff",
          "base-100": "#121212",
          "base-200": "#121212",
          "base-300": "#262626",
          "base-content": "#ffffff",
          info: "#8c8c8c",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",

          "--rounded-btn": "9999rem",

          ".tooltip": {
            "--tooltip-tail": "6px",
            "--tooltip-color": "hsl(var(--p))",
          },
        },
      },
    ],
  },
  theme: {
    // Extend Tailwind classes (e.g. font-bai-jamjuree, animate-grow)
    extend: {
      fontFamily: {
        "bai-jamjuree": ["Bai Jamjuree", "sans-serif"],
      },
      keyframes: {
        grow: {
          "0%": {
            width: "0%",
          },
          "100%": {
            width: "100%",
          },
        },
        zoom: {
          "0%, 100%": { transform: "scale(1, 1)" },
          "50%": { transform: "scale(1.1, 1.1)" },
        },
      },
      animation: {
        grow: "grow 5s linear infinite",
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        zoom: "zoom 1s ease infinite",
      },
    },
  },
};
