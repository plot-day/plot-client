import type { Config } from "tailwindcss";
import scrollbarHide from 'tailwind-scrollbar-hide';

export const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#313338',
      },
      width: {
        '1/7': '14.2857143%',
      },
    },
  },
  plugins: [scrollbarHide],
};
export default config;
