/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        secondary: "#10b981",
        background: "#0f172a",
        card: "#1e293b",
        textMain: "#f8fafc",
        textMuted: "#94a3b8"
      }
    },
  },
  plugins: [],
}
