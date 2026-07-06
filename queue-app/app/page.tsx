import { getQueues } from "@/app/actions";
import { QueueStatus, STATUS_LABEL } from "@/lib/types";
import AutoRefresh from "./AutoRefresh";

export const dynamic = "force-dynamic"; // ดึงข้อมูลใหม่ทุกครั้งที่มีการเข้าชม

const STATUS_STYLES: Record<QueueStatus, string> = {
  waiting: "bg-waiting/10 text-waiting ring-waiting/30",
  in_progress: "bg-progress/10 text-progress ring-progress/30",
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

      <div className="mx-auto max-w-lg px-4 pt-8">
        <h1 className="mb-1 text-center text-lg font-semibold text-ink">
          สถานะคิวปัจจุบัน
        </h1>
        <p className="mb-6 text-center text-sm text-stone-400">
          หน้านี้อัปเดตอัตโนมัติ
        </p>

        {/* คิวที่กำลังให้บริการ - เด่นที่สุด */}
        {nowServing ? (
          <div className="mb-6 rounded-xl2 bg-white p-6 text-center shadow-sm ring-2 ring-progress/40">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-progress">
              กำลังให้บริการ
            </p>
            <p className="text-5xl font-bold text-ink">
              #{nowServing.queue_number}
            </p>
            {nowServing.customer_name && (
              <p className="mt-1 text-sm text-stone-500">
                {nowServing.customer_name}
              </p>
            )}
          </div>
        ) : (
          <div className="mb-6 rounded-xl2 bg-white p-6 text-center text-sm text-stone-400 shadow-sm ring-1 ring-stone-200">
            ยังไม่มีคิวที่กำลังให้บริการ
          </div>
        )}

        {/* รายการคิวที่รออยู่ */}
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-stone-400">
          คิวที่กำลังรอ ({waitingList.length})
        </h2>
        <div className="mb-8 space-y-3">
          {waitingList.length === 0 && (
            <p className="rounded-xl2 bg-white p-6 text-center text-sm text-stone-400 ring-1 ring-stone-200">
              ไม่มีคิวรออยู่ในขณะนี้
            </p>
          )}
          {waitingList.map((q) => (
            <div
              key={q.id}
              className="flex items-center justify-between rounded-xl2 bg-white p-4 shadow-sm ring-1 ring-stone-200"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${DOT_STYLES[q.status]}`}
                />
                <div>
                  <p className="text-lg font-semibold text-ink">
                    #{q.queue_number}
                  </p>
                  {q.customer_name && (
                    <p className="text-xs text-stone-500">
                      {q.customer_name}
                    </p>
                  )}
                </div>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${STATUS_STYLES[q.status]}`}
              >
                {STATUS_LABEL[q.status]}
              </span>
            </div>
          ))}
        </div>

        {/* ประวัติ (เสร็จสิ้น/ยกเลิก) */}
        {rest.length > 0 && (
          <>
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-stone-400">
              ประวัติล่าสุด
            </h2>
            <div className="space-y-2">
              {rest.slice(-5).reverse().map((q) => (
                <div
                  key={q.id}
                  className="flex items-center justify-between rounded-xl2 bg-white p-3 opacity-60 ring-1 ring-stone-200"
                >
                  <span className="text-sm font-medium text-ink">
                    #{q.queue_number}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${STATUS_STYLES[q.status]}`}
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
