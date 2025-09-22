/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        display: ["Playfair Display", "serif"],
      },
      keyframes: {
        "fade-in": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        "slide-up": {
          from: { transform: "translateY(8px)", opacity: 0 },
          to: { transform: "translateY(0)", opacity: 1 },
        },
        "scale-in": {
          from: { transform: "scale(0.98)", opacity: 0 },
          to: { transform: "scale(1)", opacity: 1 },
        },
        shimmer: {
          '0%': { backgroundPosition: '-468px 0' },
          '100%': { backgroundPosition: '468px 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 300ms ease-out both',
        'slide-up': 'slide-up 300ms ease-out both',
        'scale-in': 'scale-in 250ms ease-out both',
        shimmer: 'shimmer 1.25s linear infinite',
      },
      backgroundImage: {
        shimmer: 'linear-gradient( to right, rgba(255,255,255,0) 0%, rgba(255,255,255,.6) 50%, rgba(255,255,255,0) 100% )',
      },
    },
  },
  plugins: [],
};
