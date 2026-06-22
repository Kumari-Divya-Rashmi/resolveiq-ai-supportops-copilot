/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0F172A",
        muted: "#64748B",
        brand: "#2563EB",
        brandDark: "#1D4ED8",
        soft: "#F8FAFC",
        panel: "#FFFFFF",
        line: "#E2E8F0",
        success: "#059669",
        warning: "#D97706",
        danger: "#DC2626"
      },
      boxShadow: {
        panel: "0 10px 30px rgba(15, 23, 42, 0.08)",
        soft: "0 4px 14px rgba(15, 23, 42, 0.06)"
      },
      borderRadius: {
        xl2: "1.25rem"
      }
    }
  },
  plugins: []
};
