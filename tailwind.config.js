/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sai: {
          dark: '#0a0f1d',
          card: '#111827',
          surface: '#1a2236',
          border: '#2a364f',
          primary: '#0ea5e9',    // Sky blue avionics
          accent: '#38bdf8',
          amber: '#f59e0b',     // Runway warning
          green: '#10b981',     // Active QFU / Approved
          danger: '#ef4444'     // Crosswind limit exceeded
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
