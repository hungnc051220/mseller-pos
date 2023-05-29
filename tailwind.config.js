/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/renderer/index.html",
    "./src/renderer/src/**/*.{js,ts,jsx,tsx}",
  ],
  important: true,
  theme: {
    extend: {
      colors: {
        primary: "#2DB894",
        black1: "#5A5656"
      },
      screens: {
        'tablet': '1280px'
      },
      keyframes: {
        'swing': {
          '0%,100%' : { transform: 'rotate(15deg)' },
          '50%' : { transform: 'rotate(-15deg)' },
        }
      },
      animation: {
        'swing': 'swing 1s infinite'
      }
    },
  },
  plugins: [],
}