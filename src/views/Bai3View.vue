<script setup lang="ts">
// Theoretical presentation view for Exercise 3
</script>

<template>
  <div class="view-container">
    <!-- Header -->
    <div class="header-section text-center max-w-2xl mx-auto mb-10">
      <span class="category-badge">Bài 3 (BackEnd)</span>
      <h1 class="page-title mt-2">Hệ Thống Đặt Bàn Nhà Hàng</h1>
      <p class="page-subtitle mt-2">
        Giải pháp kỹ thuật phòng chống trùng đặt bàn (Race Condition) và tự động hủy đơn sau 15 phút.
      </p>
    </div>

    <div class="grid grid-cols-1 gap-8">
      <!-- 1. Database Schema -->
      <section class="premium-card">
        <div class="flex items-center gap-3 mb-6">
          <div class="icon-box bg-indigo-50 text-indigo-600">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.58 4 8 4s8-1.79 8-4M4 7c0-2.21 3.58-4 8-4s8 1.79 8 4m0 5c0 2.21-3.58 4-8 4s-8-1.79-8-4" />
            </svg>
          </div>
          <h2 class="text-xl font-bold text-slate-800">1. Thiết kế Cơ sở Dữ liệu (Schema)</h2>
        </div>

        <p class="text-slate-600 mb-4">
          Bảng <code>reservations</code> được thiết kế để lưu trữ trạng thái đặt bàn của thực khách với đầy đủ thông tin thời gian và trạng thái:
        </p>

        <!-- Schema Table -->
        <div class="overflow-x-auto mb-6 border border-slate-100 rounded-lg">
          <table class="w-full text-left border-collapse text-sm">
            <thead>
              <tr class="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                <th class="p-3">Tên trường</th>
                <th class="p-3">Kiểu dữ liệu</th>
                <th class="p-3">Mô tả</th>
              </tr>
            </thead>
            <tbody class="text-slate-600 divide-y divide-slate-100">
              <tr>
                <td class="p-3 font-mono font-bold text-indigo-600">id</td>
                <td class="p-3">SERIAL (PK)</td>
                <td class="p-3">Khóa chính tự tăng</td>
              </tr>
              <tr>
                <td class="p-3 font-mono font-bold text-indigo-600">customer_name</td>
                <td class="p-3">VARCHAR(255)</td>
                <td class="p-3">Tên khách hàng đặt bàn</td>
              </tr>
              <tr>
                <td class="p-3 font-mono font-bold text-indigo-600">customer_phone</td>
                <td class="p-3">VARCHAR(50)</td>
                <td class="p-3">Số điện thoại liên lạc</td>
              </tr>
              <tr>
                <td class="p-3 font-mono font-bold text-indigo-600">table_number</td>
                <td class="p-3">INT</td>
                <td class="p-3">Số thứ tự của bàn ăn</td>
              </tr>
              <tr>
                <td class="p-3 font-mono font-bold text-indigo-600">reservation_start_time</td>
                <td class="p-3">TIMESTAMP</td>
                <td class="p-3">Thời gian bắt đầu sử dụng bàn</td>
              </tr>
              <tr>
                <td class="p-3 font-mono font-bold text-indigo-600">reservation_end_time</td>
                <td class="p-3">TIMESTAMP</td>
                <td class="p-3">Thời gian kết thúc sử dụng bàn</td>
              </tr>
              <tr>
                <td class="p-3 font-mono font-bold text-indigo-600">status</td>
                <td class="p-3">VARCHAR(50)</td>
                <td class="p-3">Trạng thái: <code>Created</code> (Mới tạo), <code>Paid</code> (Đã thanh toán), <code>Canceled</code> (Đã hủy)</td>
              </tr>
              <tr>
                <td class="p-3 font-mono font-bold text-indigo-600">created_at</td>
                <td class="p-3">TIMESTAMP</td>
                <td class="p-3">Thời điểm tạo bản ghi</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- DDL block -->
        <h3 class="text-sm font-semibold text-slate-700 mb-2">Câu lệnh SQL tạo bảng (DDL):</h3>
        <pre class="code-block"><code><span class="key">CREATE TABLE</span> reservations (
  id <span class="type">SERIAL</span> <span class="key">PRIMARY KEY</span>,
  customer_name <span class="type">VARCHAR(255)</span> <span class="key">NOT NULL</span>,
  customer_phone <span class="type">VARCHAR(50)</span> <span class="key">NOT NULL</span>,
  table_number <span class="type">INT</span> <span class="key">NOT NULL</span>,
  reservation_start_time <span class="type">TIMESTAMP</span> <span class="key">NOT NULL</span>,
  reservation_end_time <span class="type">TIMESTAMP</span> <span class="key">NOT NULL</span>,
  status <span class="type">VARCHAR(50)</span> <span class="key">DEFAULT</span> <span class="val">'Created'</span>,
  created_at <span class="type">TIMESTAMP</span> <span class="key">DEFAULT CURRENT_TIMESTAMP</span>,
  updated_at <span class="type">TIMESTAMP</span> <span class="key">DEFAULT CURRENT_TIMESTAMP</span>
);</code></pre>
      </section>

      <!-- 2. Non-overlapping reservations -->
      <section class="premium-card">
        <div class="flex items-center gap-3 mb-6">
          <div class="icon-box bg-amber-50 text-amber-600">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 class="text-xl font-bold text-slate-800">2. Cơ chế Phòng chống Đặt trùng (Double Booking)</h2>
        </div>

        <div class="space-y-4 text-slate-600">
          <div class="p-4 bg-amber-50 border border-amber-200/50 rounded-lg">
            <h4 class="font-bold text-amber-800 flex items-center gap-1.5 mb-1">
              ⚠️ Thách thức về Race Condition (Tranh chấp tài nguyên)
            </h4>
            <p class="text-amber-900/80 text-sm leading-relaxed">
              Nếu hai khách hàng cùng lúc bấm đặt một bàn ăn vào cùng một thời điểm, các luồng xử lý đồng thời có thể kiểm tra cơ sở dữ liệu và thấy bàn trống cùng lúc trước khi thực hiện ghi. Kết quả là cả hai đơn đều thành công, tạo ra sự chồng chéo dữ liệu.
            </p>
          </div>

          <h4 class="font-bold text-slate-800 mt-4">Giải pháp tối ưu: Transaction kết hợp Pessimistic Locking (SELECT ... FOR UPDATE)</h4>
          <p>
            Hệ thống thiết lập một Database Transaction với cơ chế khóa dòng chọn lọc ghi (Pessimistic Write Lock):
          </p>
          <ul class="list-disc pl-5 space-y-1.5">
            <li><strong>Công thức kiểm tra chồng chéo thời gian:</strong> Khung giờ đặt mới <code>[Start_Mới, End_Mới]</code> trùng với khung giờ hiện tại <code>[Start_Hiện, End_Hiện]</code> khi và chỉ khi: <code>Start_Mới &lt; End_Hiện AND End_Mới &gt; Start_Hiện</code>.</li>
            <li><strong>Khóa dòng bằng <code>FOR UPDATE</code>:</strong> Truy vấn các đơn đặt bàn có khả năng chồng lấp và áp đặt khóa. Bất kỳ request đặt bàn đồng thời nào khác cho cùng bàn đó sẽ bị chặn ở bước này cho đến khi transaction đầu tiên Commit hoặc Rollback.</li>
            <li>Nếu tìm thấy ít nhất một bản ghi bị khóa trùng giờ → Trả về lỗi Conflict và thực hiện Rollback.</li>
            <li>Nếu không trùng giờ → Thực hiện câu lệnh <code>INSERT</code> đơn mới và Commit để giải phóng khóa.</li>
          </ul>

          <h4 class="font-bold text-slate-800 mt-4">Kịch bản SQL xử lý:</h4>
          <pre class="code-block"><code><span class="comment">-- 1. Bắt đầu Transaction tuần tự</span>
<span class="key">BEGIN TRANSACTION</span>;

<span class="comment">-- 2. Truy vấn khóa các đơn đã đặt có nguy cơ trùng (ví dụ đặt bàn số 5 từ 18:00 đến 20:00)</span>
<span class="key">SELECT</span> * <span class="key">FROM</span> reservations
<span class="key">WHERE</span> table_number = 5
  <span class="key">AND</span> status <span class="key">IN</span> (<span class="val">'Created'</span>, <span class="val">'Paid'</span>)
  <span class="key">AND</span> reservation_start_time &lt; <span class="val">'2026-06-29 20:00:00'</span>
  <span class="key">AND</span> reservation_end_time &gt; <span class="val">'2026-06-29 18:00:00'</span>
<span class="key">FOR UPDATE</span>;

<span class="comment">-- 3. (Logic Backend) Nếu danh sách trên có dữ liệu -> ROLLBACK; báo lỗi trùng lịch.</span>
<span class="comment">-- 4. Nếu không có dữ liệu chồng lấp, tiến hành lưu thông tin:</span>
<span class="key">INSERT INTO</span> reservations (
  customer_name, customer_phone, table_number, 
  reservation_start_time, reservation_end_time, status
) <span class="key">VALUES</span> (
  <span class="val">'Nguyen Van A'</span>, <span class="val">'0987654321'</span>, 5, 
  <span class="val">'2026-06-29 18:00:00'</span>, <span class="val">'2026-06-29 20:00:00'</span>, <span class="val">'Created'</span>
);

<span class="comment">-- 5. Commit dữ liệu và mở khóa dòng</span>
<span class="key">COMMIT</span>;</code></pre>
        </div>
      </section>

      <!-- 3. Auto cancel -->
      <section class="premium-card">
        <div class="flex items-center gap-3 mb-6">
          <div class="icon-box bg-rose-50 text-rose-600">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 class="text-xl font-bold text-slate-800">3. Các Phương án Tự động Hủy đơn sau 15 phút</h2>
        </div>

        <div class="space-y-4 text-slate-600">
          <p>
            Để xử lý việc giải phóng các bàn ăn được đặt nhưng không thực hiện thanh toán đúng hạn (15 phút), hệ thống có ba giải pháp kiến trúc phổ biến tùy thuộc vào quy mô dự án:
          </p>

          <!-- Option 1: Cron Job -->
          <div class="border border-slate-100 rounded-lg p-5 bg-slate-50/50 space-y-3">
            <h4 class="font-bold text-indigo-700 flex items-center gap-1">
              <span>Phương án 1: Sử dụng Scheduler Job (Cron Job) quét ngầm định kỳ</span>
              <span class="text-xs px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-normal">Đơn giản</span>
            </h4>
            <p class="text-sm">
              Hệ thống chạy một tác vụ lập lịch ngầm (ví dụ: chạy mỗi phút một lần) để quét bảng dữ liệu và cập nhật hàng loạt các đơn hàng chưa thanh toán đã quá 15 phút.
            </p>
            <h5 class="font-bold text-xs text-slate-700 mt-2">SQL Query tự động cập nhật trạng thái (Dành cho Cron Job):</h5>
            <pre class="code-block text-xs"><code><span class="key">UPDATE</span> reservations
<span class="key">SET</span> status = <span class="val">'Canceled'</span>,
    updated_at = <span class="key">NOW</span>()
<span class="key">WHERE</span> status = <span class="val">'Created'</span>
  <span class="key">AND</span> created_at &lt;= <span class="key">NOW</span>() - <span class="key">INTERVAL</span> <span class="val">'15 minutes'</span>;</code></pre>
          </div>

          <!-- Option 2: Lazy Evaluation -->
          <div class="border border-slate-100 rounded-lg p-5 bg-slate-50/50 space-y-3">
            <h4 class="font-bold text-indigo-700 flex items-center gap-1">
              <span>Phương án 2: Lazy Evaluation (Đánh giá trì hoãn - Tối ưu hiệu năng)</span>
              <span class="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-normal">Tối ưu DB</span>
            </h4>
            <p class="text-sm">
              Không cần chạy tiến trình ngầm nào để sửa đổi DB. Trạng thái hết hạn 15 phút được đánh giá động tại thời điểm đọc hoặc kiểm tra trùng lịch đặt bàn mới.
            </p>
            <ul class="list-disc pl-5 text-xs space-y-1">
              <li><strong>Khi kiểm tra trùng giờ:</strong> Một đơn đặt ở trạng thái <code>Created</code> nhưng có <code>created_at</code> quá 15 phút sẽ tự động được coi là đã hết hạn và không được tính vào lịch trùng.</li>
              <li><strong>Khi truy vấn dữ liệu:</strong> Sử dụng câu lệnh <code>CASE WHEN</code> trong SQL để chuyển trạng thái hiển thị thành <code>Canceled</code> ngay khi đọc.</li>
            </ul>

            <h5 class="font-bold text-xs text-slate-700 mt-2">SQL kiểm tra trùng giờ (Bỏ qua đơn Created quá hạn 15 phút):</h5>
            <pre class="code-block text-xs"><code><span class="key">SELECT</span> * <span class="key">FROM</span> reservations
<span class="key">WHERE</span> table_number = 5
  <span class="key">AND</span> (
    status = <span class="val">'Paid'</span> <span class="key">OR</span>
    (status = <span class="val">'Created'</span> <span class="key">AND</span> created_at &gt; <span class="key">NOW</span>() - <span class="key">INTERVAL</span> <span class="val">'15 minutes'</span>)
  )
  <span class="key">AND</span> reservation_start_time &lt; <span class="val">'2026-06-29 20:00:00'</span>
  <span class="key">AND</span> reservation_end_time &gt; <span class="val">'2026-06-29 18:00:00'</span>
<span class="key">FOR UPDATE</span>;</code></pre>
          </div>

          <!-- Option 3: Delay Event Queue -->
          <div class="border border-slate-100 rounded-lg p-5 bg-slate-50/50 space-y-2">
            <h4 class="font-bold text-indigo-700 flex items-center gap-1">
              <span>Phương án 3: Delay Event Queue (Hàng đợi sự kiện trễ - Event-driven)</span>
              <span class="text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-normal">Quy mô lớn</span>
            </h4>
            <p class="text-sm">
              Khi đơn đặt bàn được khởi tạo, hệ thống phát một sự kiện vào hàng đợi trễ (ví dụ <strong>BullMQ</strong>, <strong>RabbitMQ TTL</strong>) với thời gian trễ là 15 phút.
            </p>
            <p class="text-sm">
              Sau đúng 15 phút, consumer nhận được sự kiện và chỉ cập nhật đúng bản ghi đó từ <code>Created</code> sang <code>Canceled</code> nếu khách chưa thanh toán. Tránh table lock và không làm quá tải CPU.
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.premium-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(99, 102, 241, 0.08);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 20px -2px rgba(148, 163, 184, 0.08);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 10px 30px -4px rgba(148, 163, 184, 0.12);
    border-color: rgba(99, 102, 241, 0.16);
  }
}

.icon-box {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.code-block {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.85rem;
  padding: 1.25rem;
  border-radius: 0.75rem;
  background: #0f172a;
  color: #e2e8f0;
  overflow-x: auto;
  line-height: 1.6;

  .key { color: #f43f5e; font-weight: bold; }
  .type { color: #38bdf8; }
  .val { color: #34d399; }
  .comment { color: #64748b; font-style: italic; }
}
</style>
