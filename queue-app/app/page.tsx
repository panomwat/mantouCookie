import { getQueues } from "@/app/actions";
import { QueueStatus, STATUS_LABEL } from "@/lib/types";
import AutoRefresh from "./AutoRefresh";

export const dynamic = "force-dynamic"; // ดึงข้อมูลใหม่ทุกครั้งที่มีการเข้าชม

const STATUS_STYLES: Record<QueueStatus, string> = {
  waiting: "bg-waiting/10 text-waiting ring-waiting/30",
  in_progress: "bg-progress/20 text-progress ring-progress/40",
  done: "bg-done/10 text-done ring-done/30",
  cancelled: "bg-cancelled/10 text-cancelled ring-cancelled/30",
};

const DOT_STYLES: Record<QueueStatus, string> = {
  waiting: "bg-waiting",
  in_progress: "bg-progress",
  done: "bg-done",
  cancelled: "bg-cancelled",
};

export default async function HomePage() {
  const queues = await getQueues();
  const nowServing = queues.find((q) => q.status === "in_progress");
  const waitingList = queues.filter((q) => q.status === "waiting");
  const rest = queues.filter(
    (q) => q.status !== "waiting" && q.status !== "in_progress"
  );

  return (
    <main className="min-h-screen bg-base pb-16">
      <AutoRefresh />

      {/* แถบหัวเรื่องธีมดำ-ส้ม */}
      <div className="bg-gradient-to-br from-black via-accentDark to-accent px-4 pb-10 pt-8 text-center shadow-lg">
        <h1 className="text-lg font-bold text-white">สถานะคิวปัจจุบัน</h1>
        <p className="mt-1 text-sm text-orange-100/80">
          หน้านี้อัปเดตอัตโนมัติ
        </p>
      </div>

      <div className="mx-auto -mt-6 max-w-lg px-4">
        {/* คิวที่กำลังให้บริการ - เด่นที่สุด */}
        {nowServing ? (
          <div className="mb-6 rounded-3xl bg-surface p-6 text-center shadow-xl ring-1 ring-accent/20">
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-progress">
              🔔 กำลังให้บริการ
            </p>
            <p className="text-5xl font-extrabold text-ink">
              #{nowServing.queue_number}
            </p>
            {nowServing.customer_name && (
              <p className="mt-1 text-sm text-stone-400">
                {nowServing.customer_name}
              </p>
            )}
          </div>
        ) : (
          <div className="mb-6 rounded-3xl bg-surface p-6 text-center shadow-xl ring-1 ring-ready/30">
            <p className="mb-1 text-2xl">✅</p>
            <p className="text-lg font-bold text-ready">ว่าง พร้อมให้บริการ</p>
            <p className="mt-1 text-sm text-stone-400">
              ยังไม่มีลูกค้าในคิว เชิญรับบริการได้เลย
            </p>
          </div>
        )}

        {/* รายการคิวที่รออยู่ */}
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-accent">
          คิวที่กำลังรอ ({waitingList.length})
        </h2>
        <div className="mb-8 space-y-3">
          {waitingList.length === 0 && (
            <p className="rounded-2xl bg-surface p-6 text-center text-sm text-stone-500 ring-1 ring-white/5">
              ไม่มีคิวรออยู่ในขณะนี้
            </p>
          )}
          {waitingList.map((q) => (
            <div
              key={q.id}
              className="flex items-center justify-between rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-white/5"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${DOT_STYLES[q.status]}`}
                />
                <div>
                  <p className="text-lg font-bold text-ink">
                    #{q.queue_number}
                  </p>
                  {q.customer_name && (
                    <p className="text-xs text-stone-400">
                      {q.customer_name}
                    </p>
                  )}
                </div>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${STATUS_STYLES[q.status]}`}
              >
                {STATUS_LABEL[q.status]}
              </span>
            </div>
          ))}
        </div>

        {/* ประวัติ (เสร็จสิ้น/ยกเลิก) */}
        {rest.length > 0 && (
          <>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-accent">
              ประวัติล่าสุด
            </h2>
            <div className="space-y-2">
              {rest.slice(-5).reverse().map((q) => (
                <div
                  key={q.id}
                  className="flex items-center justify-between rounded-2xl bg-surface p-3 opacity-80 ring-1 ring-white/5"
                >
                  <div>
                    <span className="text-sm font-semibold text-ink">
                      #{q.queue_number}
                    </span>
                    {q.customer_name && (
                      <span className="ml-2 text-xs text-stone-400">
                        {q.customer_name}
                      </span>
                    )}
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${STATUS_STYLES[q.status]}`}
                  >
                    {STATUS_LABEL[q.status]}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
