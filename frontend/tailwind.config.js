/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        obsidian:        '#0A0A0A',
        'obsidian-light':'#111111',
        gold:            '#F59E0B',
        'gold-bright':   '#FBBF24',
        'gold-dim':      '#D97706',
        'gold-pale':     '#FDE68A',
        champagne:       '#FFFBEB',
        'champagne-muted':'#D1D5DB',
        'champagne-faint':'#6B7280',
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
