/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#EEF1F7',
          100: '#D6DCEA',
          400: '#3E4E76',
          600: '#243456',
          700: '#1B2A4A',
          900: '#101a30'
        },
        parchment: {
          DEFAULT: '#FAF6ED',
          dim: '#F1EAD8'
        },
        brass: {
          DEFAULT: '#C9962C',
          dark: '#A87A1E'
        },
        teal: {
          DEFAULT: '#3E6259',
          light: '#5C8374'
        },
        coral: '#E0673A'
      },
      fontFamily: {
        sans: ['Cairo', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        card: '18px'
      }
    }
  },
  plugins: []
}
