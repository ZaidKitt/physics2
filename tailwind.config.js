/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'neon-blue': '#00b7eb',
        'neon-red': '#ff4040',
        'dark-bg': '#0f1116',
        'dark-surface': '#1a1c25'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'neon-blue': '0 0 5px #00b7eb, 0 0 10px #00b7eb',
        'neon-red': '0 0 5px #ff4040, 0 0 10px #ff4040',
      },
    },
  },
  plugins: [],
} 