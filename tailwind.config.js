/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'logo-anim': 'logo-anim 4s ease-in-out infinite',
        'fade-in-top': 'fade-in-top 100ms ease-in-out',
        'fade-in-top-tiny': 'fade-in-top-tiny 50ms ease-in-out',
        'fade-in-bottom': 'fade-in-bottom 100ms ease-in-out',
        'fade-in-left': 'fade-in-left 100ms ease-in-out',
        'fade-in-right': 'fade-in-right 100ms ease-in-out',
        'fade-out-top': 'fade-out-top 100ms ease-in-out',
      },
      keyframes: {
        'logo-anim': {
          '0%': { transform: 'translateY(0%)' },
          '50%': { transform: 'translateY(-5%)' },
          '100%': { transform: 'translateY(0%)' },
        },
        'fade-in-top': {
          '0%': { opacity: 0, transform: 'translateY(-50%)' },
          '100%': { opacity: 1, transform: 'translateY(0%)' },
        },
        'fade-in-top-tiny': {
          '0%': { opacity: 0, transform: 'translateY(-20px)' },
          '100%': { opacity: 1, transform: 'translateY(0%)' },
        },
        'fade-in-bottom': {
          '0%': { opacity: 0, transform: 'translateY(50%)' },
          '100%': { opacity: 1, transform: 'translateY(0%)' },
        },
        'fade-in-left': {
          '0%': { opacity: 0, transform: 'translateX(-50%)' },
          '100%': { opacity: 1, transform: 'translateX(0%)' },
        },
        'fade-in-right': {
          '0%': { opacity: 0, transform: 'translateX(50%)' },
          '100%': { opacity: 1, transform: 'translateX(0%)' },
        },
        'fade-out-top': {
          '0%': { opacity: 1, transform: 'translateY(0%)' },
          '100%': { opacity: 0, transform: 'translateY(-50%)' },
        }
      },
    },
  },
  plugins: [],
}
