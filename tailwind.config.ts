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
        asphalt: "rgb(var(--asphalt-rgb) / <alpha-value>)",
        "asphalt-2": "rgb(var(--asphalt-2-rgb) / <alpha-value>)",
        steel: "rgb(var(--steel-rgb) / <alpha-value>)",
        "steel-light": "rgb(var(--steel-light-rgb) / <alpha-value>)",
        "off-white": "rgb(var(--off-white-rgb) / <alpha-value>)",
        "plate-yellow": "rgb(var(--plate-yellow-rgb) / <alpha-value>)",
        "ignition-red": "rgb(var(--ignition-red-rgb) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-barlow-condensed)", "sans-serif"],
        body: ["var(--font-plus-jakarta-sans)", "sans-serif"],
        sans: ["var(--font-plus-jakarta-sans)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
