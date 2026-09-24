/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        red: '#F70303',
        deepred: '#930101',
        ink: '#161616',
        off: '#F7F7F7',
        grey: '#A4A4A4',
        girls: '#FF3E8E',
        note: '#FFE84D',
      },
      fontFamily: {
        sans: ['"Libre Franklin"', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.03em',
        tighter: '-0.02em',
      },
      // Extra stops so every /NN opacity modifier we use actually compiles.
      opacity: {
        3: '0.03',
        4: '0.04',
        7: '0.07',
        8: '0.08',
        12: '0.12',
        15: '0.15',
        18: '0.18',
        22: '0.22',
        35: '0.35',
        45: '0.45',
        55: '0.55',
        65: '0.65',
        85: '0.85',
        92: '0.92',
        97: '0.97',
      },
      screens: {
        xs: '375px',
      },
      maxWidth: {
        shell: '1600px',
      },
    },
  },
  plugins: [],
};
