"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { QueueItem, QueueStatus } from "@/lib/types";
import { insertQueue, listQueues, setQueueStatus } from "@/lib/store";

// ---------- READ ----------
export async function getQueues(): Promise<QueueItem[]> {
  return listQueues();
}

// ---------- UPDATE STATUS (ใช้ในหน้า Admin) ----------
export async function updateQueueStatus(id: string, status: QueueStatus) {
  // ตรวจสอบสิทธิ์ admin จาก cookie ทุกครั้งก่อนแก้ไขข้อมูล
  const isAdmin = cookies().get("admin_session")?.value === "true";
  if (!isAdmin) {
    throw new Error("ไม่มีสิทธิ์เข้าถึง");
  }

  const ok = setQueueStatus(id, status);
  if (!ok) {
    throw new Error("ไม่พบคิวนี้");
  }

  // สั่งให้หน้า user และ admin ดึงข้อมูลใหม่ทันที
  revalidatePath("/");
  revalidatePath("/admin");
}

// ---------- เพิ่มคิวใหม่ (ใช้ในหน้า Admin) ----------
export async function addQueue(customerName: string) {
  const isAdmin = cookies().get("admin_session")?.value === "true";
  if (!isAdmin) {
    throw new Error("ไม่มีสิทธิ์เข้าถึง");
  }

  insertQueue(customerName || null);

  revalidatePath("/");
  revalidatePath("/admin");
}

// ---------- LOGIN / LOGOUT ADMIN ----------
export async function loginAdmin(password: string) {
  const correctPassword = process.env.ADMIN_PASSWORD;

  if (!correctPassword) {
    throw new Error("ยังไม่ได้ตั้งค่า ADMIN_PASSWORD บนเซิร์ฟเวอร์");
  }

  if (password !== correctPassword) {
    return { success: false, message: "รหัสผ่านไม่ถูกต้อง" };
  }

  cookies().set("admin_session", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 ชั่วโมง
  });

  return { success: true };
}

export async function logoutAdmin() {
  cookies().delete("admin_session");
}
