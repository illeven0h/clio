/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: "#FB8B24",
        black: "#0D0D0F",
        background: "#fefae0",
        grey: "#333333",
        neon: "#CBFF9C",
      },
      fontFamily: {
        heading: ["Montserrat", "sans-serif"],
        secondary: ["Montser Dots", "sans-serif"], 
        body: ["Michroma", "sans-serif"], 
      },
    },
  },
  plugins: [],
};
