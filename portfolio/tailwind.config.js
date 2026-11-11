/**
 * TAILWIND CONFIGURATION
 * Focused on Sophisticated Minimalism
 */
/** @type{import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'metro-gray': '#1A1A1A',
        'metro-light': '#F5F5F5',
        'metro-accent': '#3A3A3A',
        'metro-bg': '#0A0A0A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
