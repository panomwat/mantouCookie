export type QueueStatus = "waiting" | "in_progress" | "done" | "cancelled";

export interface QueueItem {
  id: string;
  queue_number: string;
  customer_name: string | null;
  status: QueueStatus;
  created_at: string;
}

export const STATUS_LABEL: Record<QueueStatus, string> = {
  waiting: "รอคิว",
  in_progress: "กำลังทำ",
  done: "เสร็จสิ้น",
  cancelled: "ยกเลิก",
};
