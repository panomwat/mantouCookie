"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// รีเฟรชข้อมูลอัตโนมัติทุก 8 วินาที เพื่อให้ผู้ใช้เห็นสถานะคิวล่าสุด
// โดยไม่ต้องกดปุ่มเอง (ทางเลือกที่ง่ายกว่าการต่อ Supabase Realtime)
export default function AutoRefresh({ intervalMs = 8000 }: { intervalMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => {
      router.refresh();
    }, intervalMs);
    return () => clearInterval(id);
  }, [router, intervalMs]);

  return null;
}
