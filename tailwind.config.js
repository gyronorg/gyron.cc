module.exports = {
  content: ['./src/**/*.tsx', 'public/index.html'],
  darkMode: 'class',
  plugins: [require('@tailwindcss/typography')],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#b5b5b5',
          200: '#86b6ac',
          300: '#56b6a4',
          400: '#27B79B',
          500: '#219780',
          600: '#1a7664',
          700: '#145649',
        },
      },
      maxWidth: {
        '8xl': '90rem',
      },
      spacing: {
        'b-safe': 'env(safe-area-inset-bottom)',
      },
    },
  },
}
