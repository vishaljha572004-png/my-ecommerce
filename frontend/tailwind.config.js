/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        secondary: "#3B82F6",
        lightBlue: "#EAF3FF",
        accentOrange: "#FF7A00",
        accentYellow: "#FFC83D",
        background: "#FFFFFF",
        section: "#F5F7FA",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'floating': '0 10px 40px -10px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
