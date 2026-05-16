/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#007AFF",
        secondary: "#5856D6",
        accent: "#FF2D55",
        background: "#F2F2F7",
        card: "#FFFFFF",
        text: "#000000",
        muted: "#8E8E93",
      },
    },
  },
  plugins: [],
};
