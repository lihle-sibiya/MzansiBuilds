/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        mzansiGreen: "#22c55e",
        mzansiBlack: "#111827",
        mzansiWhite: "#f9fafb",
      },
    },
  },
  plugins: [],
}