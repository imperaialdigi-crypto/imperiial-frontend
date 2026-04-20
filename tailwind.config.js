/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  extend: {
    colors: {
      'imperial-black': '#080808',
      'imperial-dark':  '#111111',
      'imperial-white': '#ffffff',
      'imperial-silver':'rgba(255,255,255,0.55)',
      'imperial-graphite': 'rgba(255,255,255,0.08)',
    },
    fontFamily: {
      serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
      mono:  ['"IBM Plex Mono"', '"JetBrains Mono"', 'monospace'],
    },
  }
},
  plugins: [],
}