import { QueueItem, QueueStatus } from "@/lib/types";

// เก็บข้อมูลไว้ใน memory ของ process (ไม่ต้องมี database ภายนอก)
// หมายเหตุ: ข้อมูลจะรีเซ็ตเมื่อ deploy ใหม่ หรือเมื่อ serverless function
// ถูกสร้าง instance ใหม่ (cold start) เหมาะกับการใช้งานเบา ๆ/เดโมเท่านั้น
// ถ้าต้องการข้อมูลถาวร ให้กลับไปต่อกับฐานข้อมูลจริง เช่น Supabase

type Store = { queues: QueueItem[] };

// ใช้ globalThis เพื่อกันข้อมูลรีเซ็ตระหว่าง hot-reload ตอน dev
const globalForStore = globalThis as unknown as { __queueStore?: Store };

const store: Store =
  globalForStore.__queueStore ??
  (globalForStore.__queueStore = { queues: [] });

function genId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function listQueues(): QueueItem[] {
  return [...store.queues].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
}

export function insertQueue(customerName: string | null): QueueItem {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const countToday = store.queues.filter(
    (q) => new Date(q.created_at) >= today
  ).length;

  const item: QueueItem = {
    id: genId(),
    queue_number: String(countToday + 1).padStart(3, "0"),
    customer_name: customerName,
    status: "waiting",
    created_at: new Date().toISOString(),
  };
  store.queues.push(item);
  return item;
}

export function setQueueStatus(id: string, status: QueueStatus): boolean {
  const item = store.queues.find((q) => q.id === id);
  if (!item) return false;
  item.status = status;
  return true;
}
