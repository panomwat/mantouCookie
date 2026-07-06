import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#FFF7ED", // พื้นหลังโทนส้มอ่อนอุ่นๆ
        ink: "#3B2A1E", // ตัวอักษรหลัก น้ำตาลเข้ม
        accent: "#F97316", // สีหลักของระบบ - ส้มสด
        accentDark: "#C2410C", // ส้มเข้มสำหรับ gradient/hover
        ready: "#14B8A6", // สถานะ "ว่าง พร้อมให้บริการ" - เขียวอมฟ้า
        waiting: "#94A3B8", // รอคิว - เทาอมฟ้า
        progress: "#FACC15", // กำลังทำ - เหลืองสด
        done: "#22C55E", // เสร็จสิ้น - เขียว
        cancelled: "#F43F5E", // ยกเลิก - แดงกุหลาบ
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
export default config;
