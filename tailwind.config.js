// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',   // Your blue
        accent: '#38BDF8' ,
        secondary: '#FACC15',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        'dark-bg': '#0F172A',
        'light-bg': '#F8FAFC',
        'text-primary': '#1E293B',
        'text-muted': '#64748B',
        accent: '#38BDF8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};