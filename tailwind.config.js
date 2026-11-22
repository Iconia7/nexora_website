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
          // Primary accent (crimson)
          rose: '#A7002A',
          'rose-dark': '#86001F',
          'rose-light': '#FCE8EC',
          // Primary dark (deep navy)
          charcoal: '#020230',
          navy: '#020230',
          'navy-800': '#0B0B45',
          'navy-700': '#16165C',
          light: '#F6F7FB',
          white: '#FFFFFF',
        },
        ink: {
          DEFAULT: '#0E1024',
          muted: '#4B5068',
          subtle: '#7A7F96',
        },
        line: '#E6E8F0',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        creative: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        site: '1240px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(14,16,36,0.04), 0 8px 24px -12px rgba(14,16,36,0.12)',
        lift: '0 2px 4px rgba(14,16,36,0.04), 0 24px 48px -20px rgba(14,16,36,0.25)',
      },
      letterSpacing: {
        tightest: '-0.035em',
      },
    },
  },
  plugins: [],
}
