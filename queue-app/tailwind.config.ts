import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#FAFAF9", // พื้นหลังโทนอุ่นนวล
        ink: "#292524", // ตัวอักษรหลัก
        accent: "#4F46E5", // สีหลักของระบบ (ปุ่ม/ลิงก์)
        waiting: "#94A3B8", // รอคิว - เทาอมฟ้า
        progress: "#F59E0B", // กำลังทำ - เหลืองอำพัน
        done: "#10B981", // เสร็จสิ้น - เขียวมรกต
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
