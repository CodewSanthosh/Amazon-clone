/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  mode: "jit",
  theme: {
    fontFamily: {
      Roboto: ["Roboto", "sans-serif"],
      Poppins: ["Poppins", "sans-serif"],
    },
    extend: {
      screens: {
        "1000px": "1050px",
        "1100px": "1110px",
        "800px": "800px",
        "1300px": "1300px",
        "400px": "400px",
      },
      colors: {
        "amazon-dark": "#131921",
        "amazon-nav": "#232f3e",
        "amazon-orange": "#ff9900",
        "amazon-orange-hover": "#e68a00",
        "relife-green": "#00a86b",
        "relife-green-light": "#e8f5e9",
        "relife-leaf": "#4caf50",
        "trust-blue": "#1976d2",
      },
    },
  },
  plugins: [],
};
