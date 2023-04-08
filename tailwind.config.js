/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./screens/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        colors: {
          "warm":"#E4AC62",
          "tomato": "#FF776D",
          "cherry": "#D8473D",
          "golden": "#FFAF66",
          "light-green": "#BCFFBE",
          "light-grey": "#F8F8F8"
        }
      },
    },
    plugins: [],
  }