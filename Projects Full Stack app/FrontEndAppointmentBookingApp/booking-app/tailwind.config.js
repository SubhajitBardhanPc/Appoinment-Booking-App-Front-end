/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // <-- All your component files
    "./public/index.html"          // <-- Optional: if you use any classes in HTML
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwind-scrollbar-hide'), // If you want to hide scrollbars
  ],
}
