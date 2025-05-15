import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "app/**/*.{ts,tsx,css,scss}",
    "components/**/*.{ts,tsx,scss}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx,css}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          50: '#F8F5FF',
          100: '#F0EBFF',
          200: '#E1D6FF',
          300: '#CEBEFF',
          400: '#B69EFF',
          500: '#9C7DFF',
          600: '#8A5FFF',
          700: '#7645E8',
          800: '#6234BB',
          900: '#502D93',
          950: '#2D1959',
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      zIndex: {
        max: "999",
        logo: "998",
        sidebar: "997",
        "port-dropdown": "996",
        "iframe-overlay": "995",
        prompt: "2",
        workbench: "3",
        "file-tree-breadcrumb": "998",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeInRight: {
          from: { opacity: "0", transform: "translate3d(100%, 0, 0)" },
          to: { opacity: "1", transform: "translate3d(0, 0, 0)" },
        },
        fadeOutRight: {
          from: { opacity: "1" },
          to: { opacity: "0", transform: "translate3d(100%, 0, 0)" },
        },
        fadeMoveDown: {
          to: { opacity: "1", transform: "translateY(6px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-right":
          "fadeInRight 0.2s cubic-bezier(0, 0, 0.2, 1) both",
        "fade-out-right":
          "fadeOutRight 0.2s cubic-bezier(0, 0, 0.2, 1) both",
        dropdown: "fadeMoveDown 0.15s cubic-bezier(0.4, 0, 0.2, 1) forwards",
      },
    },
  },
  plugins: []
};

export default config;