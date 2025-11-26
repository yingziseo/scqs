/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1d1d1f',
        secondary: '#86868b',
        tertiary: '#aeaeb2',
        accent: '#0071e3',
      },
    },
  },
  plugins: [],
}
