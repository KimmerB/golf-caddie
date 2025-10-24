/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#16A34A',
        charcoal: '#1F2933',
        fog: '#F5F5F4'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        serif: ['Playfair Display', 'serif']
      },
      boxShadow: {
        subtle: '0 10px 30px rgba(0, 0, 0, 0.05)'
      }
    }
  },
  plugins: []
};
