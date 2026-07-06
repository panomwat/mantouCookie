# ระบบจัดการคิว (Next.js + In-memory Store)

โปรเจกต์ระบบจัดการคิวแบบ Modern Minimalist ใช้ Next.js App Router และ Tailwind CSS
**ไม่ต้องต่อฐานข้อมูลภายนอกหรือเขียน SQL** — เก็บข้อมูลไว้ใน memory ของเซิร์ฟเวอร์
เหมาะกับการใช้งานเบา ๆ หรือเดโม

> ⚠️ **ข้อควรรู้:** เพราะไม่มีฐานข้อมูลถาวร ข้อมูลคิวทั้งหมดจะ**หายไปทุกครั้งที่
> deploy ใหม่ หรือเมื่อเซิร์ฟเวอร์ restart/cold start** ถ้าต้องการเก็บข้อมูล
> ถาวรในอนาคต ดูหัวข้อ "อยากต่อฐานข้อมูลทีหลัง" ด้านล่าง

## โครงสร้างไฟล์หลัก

```
queue-app/
├── app/
│   ├── page.tsx              # หน้า User - ดูสถานะคิว (การ์ด, สีตามสถานะ)
│   ├── layout.tsx
│   ├── globals.css
│   ├── actions.ts            # Server Actions: getQueues, updateQueueStatus, addQueue, loginAdmin, logoutAdmin
│   ├── AutoRefresh.tsx       # รีเฟรชหน้า User อัตโนมัติทุก 8 วิ
│   └── admin/
│       ├── page.tsx          # ตรวจสอบ cookie -> โชว์ LoginForm หรือ AdminBoard
│       ├── LoginForm.tsx     # ฟอร์มกรอกรหัสผ่าน (Client Component)
│       └── AdminBoard.tsx    # แผงควบคุม ปุ่ม toggle สถานะ (Client Component)
├── lib/
│   ├── types.ts              # QueueItem, QueueStatus, STATUS_LABEL
│   └── store.ts              # In-memory store (แทนฐานข้อมูล)
└── .env.local.example
```

## 1. รันโปรเจกต์บนเครื่อง

```bash
npm install
cp .env.local.example .env.local
# แก้ไข .env.local ใส่รหัสผ่าน admin ที่ต้องการ
npm run dev
```

- หน้า User: `http://localhost:3000`
- หน้า Admin: `http://localhost:3000/admin`

## 2. กลไกความปลอดภัยของหน้า Admin

1. `app/admin/page.tsx` เป็น Server Component อ่าน cookie ชื่อ `admin_session`
   - ถ้ายังไม่มี/ไม่ใช่ `"true"` → แสดง `<LoginForm />`
   - ถ้ามีแล้ว → แสดง `<AdminBoard />` พร้อมข้อมูลคิว
2. `loginAdmin()` (Server Action ใน `app/actions.ts`) เทียบรหัสผ่านกับ
   `process.env.ADMIN_PASSWORD` แล้วตั้ง cookie แบบ `httpOnly`
3. ทุก Server Action ที่แก้ไขข้อมูล (`updateQueueStatus`, `addQueue`) จะเช็ค
   cookie ซ้ำอีกครั้งก่อนเขียนข้อมูลเสมอ (ไม่เชื่อ UI ฝั่ง client อย่างเดียว)

## 3. Deploy บน Vercel

**วิธีเร็วสุด (ไม่ต้องใช้ Git):**
```bash
npm i -g vercel
cd queue-app
vercel
```
ตอบคำถามตาม prompt (framework = Next.js จะถูกตรวจจับอัตโนมัติ) แล้วรอลิงก์ deploy

**วิธีมาตรฐาน (ผ่าน GitHub):**
1. Push โค้ดขึ้น GitHub repository
2. ไปที่ [vercel.com](https://vercel.com) → **Add New Project** → เลือก repo นี้
3. Vercel จะตรวจพบว่าเป็น Next.js อัตโนมัติ ไม่ต้องแก้ Build Command
4. ไปที่แท็บ **Environment Variables** แล้วเพิ่มค่าเดียว:

   | Key | Value |
   |---|---|
   | `ADMIN_PASSWORD` | รหัสผ่านที่ต้องการตั้ง |

5. กด **Deploy**
6. ทดสอบเข้า `https://your-app.vercel.app/admin` ด้วยรหัสผ่านที่ตั้งไว้

> ถ้าแก้ไขค่า Environment Variables บน Vercel หลัง deploy ไปแล้ว ต้องกด
> **Redeploy** อีกครั้ง (Deployments > เลือก deployment ล่าสุด > Redeploy)

## 4. อยากต่อฐานข้อมูลทีหลัง

โค้ดถูกแยกชั้นไว้แล้ว: ทุกที่ที่ดึง/แก้ข้อมูลเรียกผ่าน `lib/store.ts`
(`listQueues`, `insertQueue`, `setQueueStatus`) เท่านั้น ถ้าจะเปลี่ยนไปใช้
ฐานข้อมูลจริง (เช่น Supabase, Vercel Postgres) ในอนาคต แก้แค่ไฟล์นี้ไฟล์เดียว
ไม่ต้องแตะ `page.tsx` หรือ `actions.ts` เลย
