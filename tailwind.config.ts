import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bone: '#F4F1EA',
        ink: '#1A1815',
        copper: '#B0663F',
        'copper-dark': '#8A4E2F',
        stone: '#8C8578',
      },
      fontFamily: {
        // next/font exposes the loaded families as CSS variables (set in app/layout.tsx),
        // so the utility classes below resolve to the actual Fraunces/Inter files rather
        // than a system-font fallback.
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
