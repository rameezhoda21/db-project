/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'iba-red': '#C4232B',        // primary brand red
        'iba-light': '#F7EAEA',      // light background
        'iba-dark': '#5F1E1F',       // dark accent
      },
    },
  },
  plugins: [],
}
