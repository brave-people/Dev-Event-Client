module.exports = {
  content: ['./public/index.html', './src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      maxWidth: {
        'ultra': '120rem', // 1920px
      },
      animation: {
        blob: 'blob 20s ease-in-out infinite',
      },
      keyframes: {
        blob: {
          '0%, 100%': {
            transform: 'translate(0, 0) scale(1)',
          },
          '25%': {
            transform: 'translate(20px, -50px) scale(1.1)',
          },
          '50%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '75%': {
            transform: 'translate(50px, 30px) scale(1.05)',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
