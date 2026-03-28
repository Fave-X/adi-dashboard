/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#080c14',
        card: '#111827',
        primary: '#e8b84b',
        secondary: '#2dd4bf',
        growth: '#4ade80',
        decline: '#f87171',
        'primary-text': '#eef2ff',
        'muted-text': '#7a8fad',
        border: 'rgba(255,255,255,0.06)',
        'table-header': '#0f1520',
        'table-hover': '#1a1f2e',
        'disclaimer-bg': '#111827',
        'credits-text': '#7a8fad',
        'chart-grid': 'rgba(255,255,255,0.03)',
        'chart-axis': '#7a8fad',
      },
      fontFamily: {
        'dm-mono': ['DM Mono', 'monospace'],
        'syne': ['Syne', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
        heading: ['Syne', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'light': '0 1px 3px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}
