import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#15110E", // พื้นหลังหลัก ดำอมน้ำตาลอุ่นๆ
        surface: "#221C17", // พื้นผิวการ์ด
        ink: "#F5EFE7", // ตัวอักษรหลัก ขาวนวล
        accent: "#F97316", // สีหลักของระบบ - ส้มสด
        accentDark: "#EA580C", // ส้มเข้มสำหรับ gradient/hover
        ready: "#2DD4BF", // สถานะ "ว่าง พร้อมให้บริการ" - เขียวอมฟ้าสว่าง
        waiting: "#94A3B8", // รอคิว - เทาอมฟ้า
        progress: "#FBBF24", // กำลังทำ - เหลืองทอง
        done: "#4ADE80", // เสร็จสิ้น - เขียวสว่าง
        cancelled: "#FB7185", // ยกเลิก - แดงกุหลาบสว่าง
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
