/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './src/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],
  darkMode: 'class', // NativeWind v4: React Navigation theme context 대신 class 사용
  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};
