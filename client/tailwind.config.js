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
        supabase: {
          bg: '#121212',
          surface: '#181818',
          card: '#1e1e1e',
          hover: '#262626',
          border: '#2e2e2e',
          muted: '#888888',
          green: {
            DEFAULT: '#3ecf8e',
            dark: '#24b47e',
            light: '#6ee7b7',
            glow: 'rgba(62, 207, 142, 0.2)'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'supabase-glow': '0 0 25px -5px rgba(62, 207, 142, 0.25)',
        'card-elevated': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)'
      }
    },
  },
  plugins: [],
}
