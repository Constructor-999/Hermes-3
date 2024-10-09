/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      aspectRatio: {
        '209/126': '209 / 126', // Custom aspect ratio
      },
    },
  },
  darkMode: 'media',
  plugins: [require('@tailwindcss/aspect-ratio')],
};
