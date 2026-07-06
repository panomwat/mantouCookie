import { cookies } from "next/headers";
import { getQueues } from "@/app/actions";
import LoginForm from "./LoginForm";
import AdminBoard from "./AdminBoard";

export const dynamic = "force-dynamic"; // ต้องอ่านสถานะล่าสุดทุกครั้ง ไม่ cache

export default async function AdminPage() {
  const isAdmin = cookies().get("admin_session")?.value === "true";

  // ยังไม่ได้ล็อกอิน -> แสดงฟอร์มกรอกรหัสผ่านก่อน
  if (!isAdmin) {
    return <LoginForm />;
  }

  const queues = await getQueues();

  return (
    <main className="min-h-screen bg-base">
      <AdminBoard queues={queues} />
    </main>
  );
}
