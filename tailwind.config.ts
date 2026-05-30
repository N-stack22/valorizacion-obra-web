import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#020617",
          900: "#081124",
          800: "#0f1e38",
          700: "#14284a",
        },
        gold: {
          500: "#d6a434",
          400: "#f2c45b",
        },
      },
      boxShadow: {
        soft: "0 18px 45px rgba(2, 6, 23, 0.18)",
      },
    },
  },
  plugins: [],
} satisfies Config;
