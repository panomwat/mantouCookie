"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/app/actions";

export default function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      try {
        const result = await loginAdmin(password);
        if (result?.success) {
          router.refresh(); // โหลด Server Component ใหม่เพื่ออ่าน cookie ล่าสุด
        } else {
          setError(result?.message ?? "เกิดข้อผิดพลาด กรุณาลองใหม่");
        }
      } catch {
        setError("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองใหม่อีกครั้ง");
      }
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-accentDark to-accent px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl bg-surface p-8 shadow-2xl ring-1 ring-white/10"
      >
        <h1 className="mb-1 text-xl font-bold text-ink">
          เข้าสู่ระบบผู้ดูแล
        </h1>
        <p className="mb-6 text-sm text-stone-400">
          กรอกรหัสผ่านเพื่อจัดการคิว
        </p>

        <label className="mb-2 block text-sm font-medium text-stone-300">
          รหัสผ่าน
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          className="mb-2 w-full rounded-lg border border-white/10 bg-base px-4 py-3 text-base text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          placeholder="••••••••"
        />

        {error && <p className="mb-3 text-sm text-cancelled">{error}</p>}

        <button
          type="submit"
          disabled={isPending || password.length === 0}
          className="mt-2 w-full rounded-lg bg-accent py-3 text-base font-semibold text-white transition active:scale-[0.98] disabled:opacity-50"
        >
          {isPending ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
        </button>
      </form>
    </div>
  );
}
