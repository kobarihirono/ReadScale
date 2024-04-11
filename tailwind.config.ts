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
        navy: '#2C5282',
        hover_button: '#2B6CB0',
        deepGreen: '#2D9596',
        lightGreen: '#9AD0C2',
        yellowGreenBeige: '#F1FADA',
        backgroundWhite: '#F8F8F8',
      },
    },
  },
  plugins: [],
};
export default config;
