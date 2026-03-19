export default {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "375px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
      colors:{
        dashboardBg:"#edf2f7",
        card:"#ffffff",
        header:"#5c7596",
        accent:"#4caf50",
        warning:"#ff9800",
        danger:"#e53935"
      },
      boxShadow:{
        card:"0 6px 16px rgba(0,0,0,0.08)"
      }
    }
  },
  plugins: [],
}