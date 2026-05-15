import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./context/**/*.{ts,tsx}",
    "../../packages/shared/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: "#0C831F",
        "text-primary": "#1C1C1C",
        "text-muted": "#6B7280",
        "primary-yellow": "#F8C200",
        "primary-dark": "#E6B400",
        "success-green": "#0C831F",
        "success-light": "#EBF9EE",
        "danger-red": "#D0190A",
        "danger-light": "#FEF0EF",
        "surface-white": "#FFFFFF",
        "background-gray": "#F4F6FA",
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
