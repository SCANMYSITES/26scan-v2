/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandBlue: "#3BA1C5",
        brandBlueDark: "#2A7FA0",
        dashboardDark: "#0A1A2A",
        dashboardPanel: "#11263D",
      },
    },
  },
  plugins: [],
};

