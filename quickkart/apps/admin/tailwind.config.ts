import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
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
        sans: ["var(--font-plus-jakarta-sans)"],
      },
    },
  },
  plugins: [],
};
export default config;
