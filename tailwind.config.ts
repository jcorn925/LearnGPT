/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",

      screens: {
        sm: { max: "320px" },
        md: "480px",
        lg: "640px",
        xl: "800px",
        "2xl": "960px",
        "3xl": "1120px",
        "4xl": "1280px",
      },
      
      
      
    },
    extend: {
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },


      colors: {
        background1: "var(--background1)",
        background2: "var(--background2)",
        background3: "var(--background3)",
        background4: "var(--background4)",
        background5: "var(--background5)",
        backgroundInactive: "var(--backgroundInactive)",
        backgroundInverse: "var(--backgroundInverse)",
        backgroundInput: "var(--backgroundInput)",

        actionPrimaryBackground: "var(--actionPrimaryBackground)",
        actionPrimaryBackgroundHover: "var(--actionPrimaryBackgroundHover)",
        actionSecondaryBackground: "var(--actionSecondaryBackground)",
        actionSecondaryBackgroundHover: "var(--actionSecondaryBackgroundHover)",
        actionPrimaryText: "var(--actionPrimaryText)",
        actionPrimaryTextHover: "var(--actionPrimaryTextHover)",
        actionSecondaryText: "var(--actionSecondaryText)",
        actionSecondaryTextHover: "var(--actionSecondaryTextHover)",

        border1: "var(--border1)",
        border2: "var(--border2)",
        border3: "var(--border3)",

        text1: "var(--text1)",
        text2: "var(--text2)",
        text3: "var(--text3)",
        textInactive: "var(--textInactive)",
        textInverse: "var(--textInverse)",

        blueText: "var(--blueText)",
        blueIcon: "var(--blueIcon)",
        blueBorder: "var(--blueBorder)",

        greenBackground: "var(--greenBackground)",
        greenBackgroundHover: "var(--greenBackgroundHover)",
        greenText: "var(--greenText)",
        greenIcon: "var(--greenIcon)",
        greenBorder: "var(--greenBorder)",

        yellowBackground: "var(--yellowBackground)",
        yellowBackgroundHover: "var(--yellowBackgroundHover)",
        yellowText: "var(--yellowText)",
        yellowIcon: "var(--yellowIcon)",
        yellowBorder: "var(--yellowBorder)",

        redBackground: "var(--redBackground)",
        redBackgroundHover: "var(--redBackgroundHover)",
        redText: "var(--redText)",
        redIcon: "var(--redIcon)",
        redBorder: "var(--redBorder)",

        orangeBackground: "var(--orangeBackground)",
        orangeBackgroundHover: "var(--orangeBackgroundHover)",
        orangeText: "var(--orangeText)",
        orangeIcon: "var(--orangeIcon)",
        orangeBorder: "var(--orangeBorder)",

        purpleBackground: "var(--purpleBackground)",
        purpleBackgroundHover: "var(--purpleBackgroundHover)",
        purpleText: "var(--purpleText)",
        purpleIcon: "var(--purpleIcon)",
        purpleBorder: "var(--purpleBorder)",

        boxShadow: {
          'action-colored': "var(--boxShadows-action-colored)",
          'action-secondary': "var(--boxShadows-action-secondary)",
          'input-inner': "var(--boxShadows-input-inner)",
          'menu': "var(--boxShadows-menu)",
        },
        fontFamily: {
          sans: ["var(--font-stack)"],
        },
        fontSize: {
          small: ["var(--font-size-small)", { letterSpacing: "var(--font-size-small-letter-spacing)" }],
          large: "var(--font-size-large)",
        },
        fontWeight: {
          normal: "var(--font-weight-normal)",
          medium: "var(--font-weight-medium)",
        },
        borderRadius: {
          DEFAULT: "var(--border-radius)",
        },
        primary: {

          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "var(--colors-primary-50)",
          150: "var(--colors-primary-150)",
          100: "var(--colors-primary-100)",
          200: "var(--colors-primary-200)",
          300: "var(--colors-primary-300)",
          500: "var(--colors-primary-500)",
          600: "var(--colors-primary-600)",
          700: "var(--colors-primary-700)",
          800: "var(--colors-primary-800)",
          900: "var(--colors-primary-900)",
          error: "var(--colors-primary-error)",
          accent: "var(--colors-primary-accent)",
        },
        shadow: {
          500: "rgba(112, 144, 176, 0.08)",
        },

        lightPrimary: "#F4F7FE",
        blueSecondary: "#4318FF",
        brandLinear: "#868CFF",

        gray: {
          50: "#f8f9fa",
          100: "#edf2f7",
          200: "#e9ecef",
          300: "#cbd5e0",
          400: "#a0aec0",
          500: "#adb5bd",
          600: "#a3aed0",
          700: "#707eae",
          800: "#252f40",
          900: "#1b2559",
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
      boxShadow: {
        "3xl": "14px 17px 40px 4px",
        inset: "inset 0px 18px 22px",
        darkinset: "0px 4px 4px inset",
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
      "primary-accent": "var(--colors-primary-accent)",
    },
  },
  plugins: [
    require("tailwindcss"),
    require("tailwindcss-animate"),
  ],
};
