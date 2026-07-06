"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addQueue, logoutAdmin, updateQueueStatus } from "@/app/actions";
import { QueueItem, QueueStatus, STATUS_LABEL } from "@/lib/types";

const STATUS_STYLES: Record<QueueStatus, string> = {
  waiting: "bg-waiting/10 text-waiting ring-waiting/30",
  in_progress: "bg-progress/10 text-progress ring-progress/30",
  done: "bg-done/10 text-done ring-done/30",
  cancelled: "bg-cancelled/10 text-cancelled ring-cancelled/30",
};

const STATUS_ORDER: QueueStatus[] = [
  "waiting",
  "in_progress",
  "done",
  "cancelled",
];

export default function AdminBoard({ queues }: { queues: QueueItem[] }) {
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const router = useRouter();

  function handleStatusChange(id: string, status: QueueStatus) {
    setPendingId(id);
    startTransition(async () => {
      try {
        await updateQueueStatus(id, status);
      } finally {
        setPendingId(null);
      }
    });
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await addQueue(name.trim());
      setName("");
    });
  }

  function handleLogout() {
    startTransition(async () => {
      await logoutAdmin();
      router.refresh();
    });
  }

  const active = queues.filter(
    (q) => q.status === "waiting" || q.status === "in_progress"
  );
  const finished = queues.filter(
    (q) => q.status === "done" || q.status === "cancelled"
  );

  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink">จัดการคิว</h1>
        <button
          onClick={handleLogout}
          className="rounded-lg px-3 py-2 text-sm text-stone-500 hover:bg-stone-100"
        >
          ออกจากระบบ
        </button>
      </div>

      {/* เพิ่มคิวใหม่ */}
      <form
        onSubmit={handleAdd}
        className="mb-6 flex gap-2 rounded-xl2 bg-white p-3 shadow-sm ring-1 ring-stone-200"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ชื่อลูกค้า (ไม่บังคับ)"
          className="flex-1 rounded-lg border border-stone-300 px-3 py-3 text-base outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-accent px-5 py-3 text-base font-medium text-white active:scale-[0.98] disabled:opacity-50"
        >
          + เพิ่มคิว
        </button>
      </form>

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-stone-400">
          กำลังดำเนินการ ({active.length})
        </h2>
        <div className="space-y-3">
          {active.length === 0 && (
            <p className="rounded-xl2 bg-white p-6 text-center text-sm text-stone-400 ring-1 ring-stone-200">
              ไม่มีคิวที่กำลังดำเนินการ
            </p>
          )}
          {active.map((q) => (
            <div
              key={q.id}
              className="rounded-xl2 bg-white p-4 shadow-sm ring-1 ring-stone-200"
            >
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-ink">
                    #{q.queue_number}
                  </p>
                  {q.customer_name && (
                    <p className="text-sm text-stone-500">
                      {q.customer_name}
                    </p>
                  )}
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${STATUS_STYLES[q.status]}`}
                >
                  {STATUS_LABEL[q.status]}
                </span>
              </div>

              {/* ปุ่มเปลี่ยนสถานะ ขนาดใหญ่ กดง่ายบนมือถือ */}
              <div className="grid grid-cols-4 gap-2">
                {STATUS_ORDER.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(q.id, s)}
                    disabled={isPending && pendingId === q.id}
                    className={`rounded-lg py-3 text-xs font-medium transition active:scale-95 disabled:opacity-40 ${
                      q.status === s
                        ? STATUS_STYLES[s] + " ring-2"
                        : "bg-stone-50 text-stone-500 ring-1 ring-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    {STATUS_LABEL[s]}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-stone-400">
          ประวัติวันนี้ ({finished.length})
        </h2>
        <div className="space-y-2">
          {finished.map((q) => (
            <div
              key={q.id}
              className="flex items-center justify-between rounded-xl2 bg-white p-3 opacity-70 ring-1 ring-stone-200"
            >
              <span className="font-medium text-ink">#{q.queue_number}</span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${STATUS_STYLES[q.status]}`}
              >
                {STATUS_LABEL[q.status]}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
