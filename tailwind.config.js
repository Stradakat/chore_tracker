/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './index.html',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#87A96B", // Sage Green
          foreground: "#FEFEFE", // Soft White
        },
        secondary: {
          DEFAULT: "#F5F1EB", // Warm Beige
          foreground: "#2F3E46", // Charcoal Gray
        },
        destructive: {
          DEFAULT: "#E57373", // Gentle Red
          foreground: "#FEFEFE",
        },
        muted: {
          DEFAULT: "#E8E8E8", // Light Gray
          foreground: "#2F3E46",
        },
        accent: {
          DEFAULT: "#6B9DC2", // Muted Blue
          foreground: "#FEFEFE",
        },
        popover: {
          DEFAULT: "#FEFEFE", // Soft White
          foreground: "#2F3E46", // Charcoal Gray
        },
        card: {
          DEFAULT: "#FEFEFE", // Soft White
          foreground: "#2F3E46", // Charcoal Gray
        },
        // Custom color palette
        sage: "#87A96B",
        softWhite: "#FEFEFE",
        charcoal: "#2F3E46",
        warmBeige: "#F5F1EB",
        mutedBlue: "#6B9DC2",
        softCoral: "#E07A5F",
        lightGray: "#E8E8E8",
        freshGreen: "#81C784",
        amberYellow: "#FFB74D",
        gentleRed: "#E57373",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
