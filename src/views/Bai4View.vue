<script setup lang="ts">
// Theoretical presentation view for Exercise 4
</script>

<template>
  <div class="view-container">
    <!-- Header -->
    <div class="header-section text-center max-w-2xl mx-auto mb-10">
      <span class="category-badge">Bài 4 (BackEnd)</span>
      <h1 class="page-title mt-2">Cơ Sở Dữ Liệu Viễn Thông</h1>
      <p class="page-subtitle mt-2">
        Thiết kế cơ sở dữ liệu viễn thông, sơ đồ thực thể ERD và viết các truy vấn SQL báo cáo nâng cao.
      </p>
    </div>

    <div class="grid grid-cols-1 gap-8">
      <!-- 1. ERD diagram -->
      <section class="premium-card">
        <div class="flex items-center gap-3 mb-6">
          <div class="icon-box bg-indigo-50 text-indigo-600">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 class="text-xl font-bold text-slate-800">1. Sơ đồ Quan hệ Thực thể (ERD Diagram)</h2>
        </div>

        <p class="text-slate-600 mb-6">
          Dưới đây là sơ đồ thực thể quan hệ (ERD) biểu diễn mối liên kết 1-n giữa bảng Người dùng (<code>users</code>) và Nhật ký cuộc gọi (<code>call_records</code>) trong hệ thống viễn thông:
        </p>

        <!-- Beautiful SVG ERD -->
        <div class="flex justify-center p-6 border border-slate-100 rounded-xl bg-slate-50/40 mb-2 overflow-x-auto">
          <svg width="680" height="240" viewBox="0 0 680 240" fill="none" class="max-w-full">
            <!-- Table USERS -->
            <rect x="20" y="20" width="220" height="200" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
            <path d="M20 20h220v38H20z" fill="url(#header-indigo)"/>
            <text x="130" y="44" fill="#ffffff" font-size="14" font-weight="bold" text-anchor="middle" font-family="sans-serif">USERS</text>
            <text x="35" y="85" fill="#3b82f6" font-size="12" font-weight="bold" font-family="monospace">PK</text>
            <text x="65" y="85" fill="#334155" font-size="12" font-weight="bold" font-family="sans-serif">id</text>
            <text x="140" y="85" fill="#94a3b8" font-size="11" font-family="monospace">INT</text>
            <text x="65" y="115" fill="#334155" font-size="12" font-family="sans-serif">name</text>
            <text x="140" y="115" fill="#94a3b8" font-size="11" font-family="monospace">VARCHAR</text>
            <text x="65" y="145" fill="#334155" font-size="12" font-family="sans-serif">date_of_birth</text>
            <text x="160" y="145" fill="#94a3b8" font-size="11" font-family="monospace">DATE</text>
            <text x="35" y="175" fill="#f59e0b" font-size="11" font-weight="bold" font-family="monospace">UQ</text>
            <text x="65" y="175" fill="#334155" font-size="12" font-family="sans-serif">phone_number</text>
            <text x="160" y="175" fill="#94a3b8" font-size="11" font-family="monospace">VARCHAR</text>

            <!-- Line connector -->
            <path d="M240 120h200" stroke="#6366f1" stroke-width="2" stroke-dasharray="4 4"/>
            <!-- One relation circle / line -->
            <circle cx="250" cy="120" r="4" fill="#ffffff" stroke="#6366f1" stroke-width="2"/>
            <path d="M240 114v12" stroke="#6366f1" stroke-width="2"/>
            <!-- Many relation crow's foot -->
            <path d="M430 112l10 8-10 8" fill="none" stroke="#6366f1" stroke-width="2"/>
            <path d="M425 114v12" stroke="#6366f1" stroke-width="2"/>

            <!-- Table CALL_RECORDS -->
            <rect x="440" y="20" width="220" height="200" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
            <path d="M440 20h220v38H440z" fill="url(#header-purple)"/>
            <text x="550" y="44" fill="#ffffff" font-size="14" font-weight="bold" text-anchor="middle" font-family="sans-serif">CALL_RECORDS</text>
            <text x="455" y="85" fill="#3b82f6" font-size="12" font-weight="bold" font-family="monospace">PK</text>
            <text x="485" y="85" fill="#334155" font-size="12" font-weight="bold" font-family="sans-serif">id</text>
            <text x="550" y="85" fill="#94a3b8" font-size="11" font-family="monospace">INT</text>
            <text x="455" y="115" fill="#10b981" font-size="12" font-weight="bold" font-family="monospace">FK</text>
            <text x="485" y="115" fill="#334155" font-size="12" font-family="sans-serif">caller_id</text>
            <text x="550" y="115" fill="#94a3b8" font-size="11" font-family="monospace">INT</text>
            <text x="455" y="145" fill="#10b981" font-size="12" font-weight="bold" font-family="monospace">FK</text>
            <text x="485" y="145" fill="#334155" font-size="12" font-family="sans-serif">callee_id</text>
            <text x="550" y="145" fill="#94a3b8" font-size="11" font-family="monospace">INT</text>
            <text x="485" y="175" fill="#334155" font-size="12" font-family="sans-serif">duration</text>
            <text x="550" y="175" fill="#94a3b8" font-size="11" font-family="monospace">INT</text>
            <text x="485" y="205" fill="#334155" font-size="12" font-family="sans-serif">call_time</text>
            <text x="550" y="205" fill="#94a3b8" font-size="11" font-family="monospace">TIMESTAMP</text>

            <defs>
              <linearGradient id="header-indigo" x1="0" y1="0" x2="1" y2="1">
                <stop stop-color="#4f46e5"/>
                <stop offset="1" stop-color="#6366f1"/>
              </linearGradient>
              <linearGradient id="header-purple" x1="0" y1="0" x2="1" y2="1">
                <stop stop-color="#7c3aed"/>
                <stop offset="1" stop-color="#8b5cf6"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>

      <!-- 2. Database DDL Table -->
      <section class="premium-card">
        <div class="flex items-center gap-3 mb-6">
          <div class="icon-box bg-slate-50 text-slate-600">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 class="text-xl font-bold text-slate-800">2. Cấu trúc SQL khởi tạo bảng (DDL)</h2>
        </div>

        <pre class="code-block"><code><span class="comment">-- Khởi tạo bảng Users</span>
<span class="key">CREATE TABLE</span> users (
  id <span class="type">SERIAL</span> <span class="key">PRIMARY KEY</span>,
  name <span class="type">VARCHAR(255)</span> <span class="key">NOT NULL</span>,
  date_of_birth <span class="type">DATE</span> <span class="key">NOT NULL</span>,
  phone_number <span class="type">VARCHAR(50)</span> <span class="key">UNIQUE</span> <span class="key">NOT NULL</span>
);

<span class="comment">-- Khởi tạo bảng Nhật ký Cuộc gọi (Call Records)</span>
<span class="key">CREATE TABLE</span> call_records (
  id <span class="type">SERIAL</span> <span class="key">PRIMARY KEY</span>,
  caller_id <span class="type">INT</span> <span class="key">REFERENCES</span> users(id) <span class="key">ON DELETE CASCADE</span>,
  callee_id <span class="type">INT</span> <span class="key">REFERENCES</span> users(id) <span class="key">ON DELETE CASCADE</span>,
  duration <span class="type">INT</span> <span class="key">NOT NULL</span>, <span class="comment">-- Đơn vị: giây</span>
  call_time <span class="type">TIMESTAMP</span> <span class="key">NOT NULL</span>
);</code></pre>
      </section>

      <!-- 3. Query 1: Top 3 Callers -->
      <section class="premium-card">
        <div class="flex items-center gap-3 mb-6">
          <div class="icon-box bg-emerald-50 text-emerald-600">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h2 class="text-xl font-bold text-slate-800">3. Truy vấn Top 3 người gọi nhiều nhất</h2>
        </div>

        <div class="space-y-4 text-slate-600">
          <p>
            Yêu cầu: Lọc ra 3 người dùng có **tổng thời lượng cuộc gọi đi (caller)** lớn nhất trong tháng vừa rồi.
          </p>

          <pre class="code-block"><code><span class="key">SELECT</span>
  u.id,
  u.name,
  u.phone_number <span class="key">AS</span> <span class="val">"phoneNumber"</span>,
  <span class="key">SUM</span>(cr.duration) <span class="key">AS</span> <span class="val">"totalDuration"</span>
<span class="key">FROM</span> users u
<span class="key">INNER JOIN</span> call_records cr <span class="key">ON</span> cr.caller_id = u.id
<span class="key">WHERE</span> cr.call_time &gt;= <span class="key">DATE_TRUNC</span>(<span class="val">'month'</span>, <span class="key">CURRENT_DATE</span> - <span class="key">INTERVAL</span> <span class="val">'1 month'</span>)
  <span class="key">AND</span> cr.call_time &lt; <span class="key">DATE_TRUNC</span>(<span class="val">'month'</span>, <span class="key">CURRENT_DATE</span>)
<span class="key">GROUP BY</span> u.id, u.name, u.phone_number
<span class="key">ORDER BY</span> <span class="val">"totalDuration"</span> <span class="key">DESC</span>
<span class="key">LIMIT</span> 3;</code></pre>

          <h4 class="font-bold text-slate-800 mt-4">Giải thích thuật toán và logic:</h4>
          <ul class="list-disc pl-5 space-y-1.5">
            <li>Dùng <code>INNER JOIN</code> giữa hai bảng dựa trên mối quan hệ <code>caller_id = users.id</code> để lấy thông tin người thực hiện cuộc gọi.</li>
            <li>Dùng hàm <code>DATE_TRUNC</code> của PostgreSQL để xác định cận đầu và cận cuối của tháng trước (tính từ ngày đầu tiên của tháng trước tới ngày đầu tiên của tháng hiện tại).</li>
            <li>Sử dụng hàm gộp nhóm <code>SUM(cr.duration)</code> để tính tổng số giây đã thực hiện cuộc gọi đi cho từng người dùng, gộp theo ID và Số điện thoại.</li>
            <li>Sắp xếp giảm dần (<code>DESC</code>) và dùng <code>LIMIT 3</code> để chỉ lấy ra 3 bản ghi đầu bảng xếp hạng.</li>
          </ul>
        </div>
      </section>

      <!-- 4. Query 2: Second Highest Callers -->
      <section class="premium-card">
        <div class="flex items-center gap-3 mb-6">
          <div class="icon-box bg-blue-50 text-blue-600">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <h2 class="text-xl font-bold text-slate-800">4. Truy vấn người có thời lượng gọi lớn thứ 2</h2>
        </div>

        <div class="space-y-4 text-slate-600">
          <p>
            Yêu cầu: Viết câu lệnh truy vấn ra những người dùng có tổng thời lượng cuộc gọi đi lớn thứ 2 (Hỗ trợ giải quyết trường hợp nhiều người đồng hạng nhì).
          </p>

          <pre class="code-block"><code><span class="key">WITH</span> ranked_users <span class="key">AS</span> (
  <span class="key">SELECT</span>
    u.id,
    u.name,
    u.phone_number <span class="key">AS</span> <span class="val">"phoneNumber"</span>,
    <span class="key">SUM</span>(cr.duration) <span class="key">AS</span> <span class="val">"totalDuration"</span>,
    <span class="key">DENSE_RANK</span>() <span class="key">OVER</span> (<span class="key">ORDER BY</span> <span class="key">SUM</span>(cr.duration) <span class="key">DESC</span>) <span class="key">AS</span> rank
  <span class="key">FROM</span> users u
  <span class="key">INNER JOIN</span> call_records cr <span class="key">ON</span> cr.caller_id = u.id
  <span class="key">WHERE</span> cr.call_time &gt;= <span class="key">DATE_TRUNC</span>(<span class="val">'month'</span>, <span class="key">CURRENT_DATE</span> - <span class="key">INTERVAL</span> <span class="val">'1 month'</span>)
    <span class="key">AND</span> cr.call_time &lt; <span class="key">DATE_TRUNC</span>(<span class="val">'month'</span>, <span class="key">CURRENT_DATE</span>)
  <span class="key">GROUP BY</span> u.id, u.name, u.phone_number
)
<span class="key">SELECT</span> id, name, <span class="val">"phoneNumber"</span>, <span class="val">"totalDuration"</span>
<span class="key">FROM</span> ranked_users
<span class="key">WHERE</span> rank = 2;</code></pre>

          <div class="p-4 bg-blue-50 border border-blue-200/50 rounded-lg">
            <h4 class="font-bold text-blue-800 flex items-center gap-1.5 mb-1">
              💡 Tại sao sử dụng DENSE_RANK() thay vì RANK() hay ROW_NUMBER()?
            </h4>
            <p class="text-blue-900/80 text-sm leading-relaxed">
              Nếu có 2 người cùng đứng đầu (Top 1) với cùng thời lượng gọi:
              <br/>• <code>ROW_NUMBER()</code> sẽ đánh thứ hạng tùy ý 1 và 2 (làm mất người đồng hạng nhì thực tế).
              <br/>• <code>RANK()</code> sẽ đánh thứ tự [1, 1, 3] (bỏ qua vị trí hạng 2).
              <br/>• <code>DENSE_RANK()</code> xếp hạng theo thứ tự [1, 1, 2] (giữ nguyên hạng 2 và cho phép hiển thị đầy đủ mọi người dùng đồng hạng nhì). Đây là hàm xếp hạng tối ưu nhất cho kịch bản này.
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
