module.exports = {
  content: ['./public/index.html', './src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
};
