/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom theme colors
        'dark-yellow': '#FDB813',
        'sky-blue': '#38BDF8',
        'dark-black': '#1A1A1A',
        // Accent colors
        primary: {
          DEFAULT: '#FDB813',
          dark: '#E5A50F',
          light: '#FEC94C',
        },
        secondary: {
          DEFAULT: '#38BDF8',
          dark: '#0EA5E9',
          light: '#7DD3FC',
        },
        accent: {
          DEFAULT: '#1A1A1A',
          light: '#2D2D2D',
          lighter: '#404040',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #FDB813 0%, #FEC94C 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #38BDF8 0%, #7DD3FC 100%)',
      },
    },
  },
  plugins: [],
}
