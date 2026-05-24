/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        retro: {
          primary:  '#cc00ff',
          accent:   '#00ffcc',
          pink:     '#ff0099',
          bg:       '#0a0010',
          surface:  '#120020',
        },
      },
      fontFamily: {
        pixel:   ['"Press Start 2P"', 'monospace'],
        vt323:   ['VT323', 'monospace'],
        ui:      ['Silkscreen', 'monospace'],
        mono:    ['"Space Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
