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
        asphalt: "#15171A",
        "asphalt-2": "#1E2125",
        steel: "#8A8D91",
        "steel-light": "#B7BABE",
        "off-white": "#F2F1EC",
        "plate-yellow": "#E8B93A",
        "ignition-red": "#E23434",
      },
      fontFamily: {
        display: ["var(--font-barlow-condensed)", "sans-serif"],
        body: ["var(--font-barlow-condensed)", "sans-serif"],
        sans: ["var(--font-barlow-condensed)", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
