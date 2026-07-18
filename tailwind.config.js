/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        display: ['DM Serif Display', 'serif'],
      },
    },
  },
  daisyui: {
    themes: [
      {
        earthfolio: {
          primary: '#355744',
          secondary: '#b85c3d',
          accent: '#d5a642',
          neutral: '#232a25',
          'base-100': '#f4f0e7',
          'base-200': '#e9e4d8',
          'base-300': '#d8d0c0',
          info: '#597b7b',
          success: '#66845f',
          warning: '#d5a642',
          error: '#a64b3c',
        },
      },
    ],
  },
  plugins: [require('daisyui')],
}
