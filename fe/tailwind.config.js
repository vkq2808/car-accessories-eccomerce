module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
  corePlugins: {
    preflight: false,
  }
};
