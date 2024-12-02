/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        hero: "url('/images/bg-ns12.jpg')",
        hero2: "url('/images/bg-ns03.jpg')",
        hero3: "url('/images/CarteFestival.png')",
      },
      colors: { beige: "#D98C3D" },
    },
  },
  plugins: [],
};
