/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        surfaceHover: 'var(--color-surface-hover)',
        border: 'var(--color-border)',
        primary: 'var(--color-primary)',
        primaryHover: 'var(--color-primary-hover)',
        accent: 'var(--color-accent)',
        textMain: 'var(--color-text-main)',
        textMuted: 'var(--color-text-muted)',
        danger: 'var(--color-danger)',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.4)',
        'card': '0 1px 3px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
      }
    },
  },
  plugins: [],
}
