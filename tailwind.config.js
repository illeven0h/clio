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
        bone: "#E6E4D5",
        black: "#000000",
        ivory: "#FFFDF1",
      },
      fontFamily: {
        heading: ["Moon Walk", "sans-serif"], // For main headings
        secondary: ["Zen Dots", "sans-serif"], // For secondary headings
        body: ["Michroma", "sans-serif"], // For body text
      },
    },
  },
  plugins: [],
};
