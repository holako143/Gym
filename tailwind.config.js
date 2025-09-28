/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'brand-dark': '#122118',
        'brand-green-dark': '#1b3124',
        'brand-green-medium': '#264532',
        'brand-green-light': '#366348',
        'brand-green-accent': '#38e07b',
        'brand-green-text': '#96c5a9',
      },
      fontFamily: {
        sans: ['Lexend', 'Noto Sans', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};