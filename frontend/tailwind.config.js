/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          deepTeal: '#087985',
          darkTeal: '#063F46',
          paleMint: '#D7ECE5',
          mutedOlive: '#B7D16A',
          chartreuse: '#C5E86C',
          offWhite: '#F4F3E9',
          surface: '#084850',
          surfaceCard: '#0a525b',
          surfaceHover: '#0d5d67',
          surfaceBorder: '#0e6570',
          darker: '#042c31',
          gold: '#FFD700',
        }
      },
      fontFamily: {
        sans: ['"Inter"', '"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
