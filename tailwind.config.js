/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#fff9eb',
          100: '#ffefc6',
          200: '#fedd88',
          300: '#fdc44a',
          400: '#fba318',
          500: '#f57c00', // vibrant Indian saffron / marigold
          600: '#d95a00',
          700: '#b43f02',
          800: '#903107',
          900: '#762908',
        },
        peacock: {
          50: '#eff9f9',
          100: '#d5f1f1',
          200: '#aee3e4',
          300: '#75cbcf',
          400: '#3da8b2',
          500: '#00838f', // deep Indian peacock blue/teal
          600: '#006c77',
          700: '#035862',
          800: '#094850',
          900: '#0c3d44',
        },
        mehendi: {
          50: '#f4f8f0',
          100: '#e6efdd',
          200: '#cfe0be',
          300: '#afcc97',
          400: '#8fb46f',
          500: '#689f38', // prosperous green / kheti / agricultural green
          600: '#558b2f',
          700: '#416a24',
          800: '#34551e',
          900: '#2c471b',
        },
        gulabi: {
          50: '#fdf2f7',
          100: '#fce7f1',
          200: '#fbcfe4',
          300: '#f8a8ce',
          400: '#f273ad',
          500: '#e91e63', // auspicious pink / kumkum / festive
          600: '#d81557',
          700: '#ba0d45',
          800: '#9a0e3a',
          900: '#801133',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
