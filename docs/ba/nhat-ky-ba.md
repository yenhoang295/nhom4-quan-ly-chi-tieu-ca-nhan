# Nhật ký cá nhân – BA

* **Họ tên:** Lê Thị Huệ Chi
* **Vai trò:** BA kiêm test
* **Tài khoản GitHub:** lethihuechi16-sen
* **Dự án:** Quản lý chi tiêu cá nhân – Nhóm 4
* **Issue chính:** #4 Kiểm thử, quản lý Pull Request và hoàn thiện tài liệu dự án

## Nhật ký theo ngày

### 30/09/2026

* **Việc đã làm:** Được thêm vào repo với vai trò collaborator. Tạo Issue #5 "Thêm nhật ký và khung tài liệu BA". Soạn khung tài liệu BA gồm tổng quan dự án, yêu cầu chức năng, yêu cầu phi chức năng, use case và tiêu chí chấp nhận.
* **Sản phẩm:** Thư mục `docs` (6 file).
* **Vướng mắc:** [điền nếu có]
* **Dự kiến ngày mai:** [điền]

### 01/10/2026

* **Việc đã làm:** Tạo Issue #7 và PR #8 chuyển file nhật ký BA vào thư mục docs; PR được duyệt và merge.
* **Sản phẩm:** `docs/nhat-ky-ba.md`
* **Vướng mắc:** Đặt nhầm tên nhánh và dòng Closes ở PR #8 nên phải đóng issue #7 thủ công.
* **Dự kiến ngày mai:** Bổ sung use case và tiêu chí chấp nhận.

### 02/10/2026

* **Việc đã làm:** Rà lại repo sau khi các bạn cập nhật. Soạn bổ sung `04-use-case.md` và `05-tieu-chi-chap-nhan.md`. Tạo Issue #11 để theo dõi. PR #12 cập nhật nhật ký đã merge.
* **Sản phẩm:** `docs/nhat-ky-ba.md`
* **Vướng mắc:** Chờ nhóm thống nhất cách xử lý khi xóa danh mục đang có giao dịch.
* **Dự kiến ngày mai:** Đối chiếu use case với phần Dev A, Dev B đang làm.

### 09/10/2026

* **Việc đã làm:**
  * Liên kết Supabase và Vercel với GitHub bằng đăng nhập GitHub.
  * Rà soát repo: `main`, nhánh `feature/2-danh-muc` của Dev B, `ci.yml`, `CODEOWNERS`, `pom.xml`.
  * Cập nhật tài liệu theo công nghệ mới của nhóm: đổi ERD sang PostgreSQL, viết `db/schema.sql` và `db/seed.sql`, thêm mô tả Supabase và Vercel (`cong-nghe-ha-tang.md`), viết `database.md`.
  * Sửa phạm vi tài liệu cho khớp thực tế của nhóm (chỉ khoản chi, ngân sách, thống kê; bỏ khoản thu). Viết lại `01` đến `05`.
  * Viết `test-cases.md` (23 test CSDL, 38 test mức ứng dụng), bản nháp `bao-cao.md`, `README.md`, `AI_USAGE.md`, bổ sung `CONTRIBUTING.md`.
  * Chạy thử `schema.sql` và `seed.sql` trên PostgreSQL 16 cục bộ (có hỗ trợ của Claude, một công cụ AI), kết quả đúng mong đợi.
  * Kiểm tra `test_budget.py` của Dev B bằng `py_compile`: lỗi thụt lề dòng 14 trên cả `main` và nhánh `feature/2-danh-muc`.
* **Sản phẩm:** `docs/ba/*`, `db/schema.sql`, `db/seed.sql`, `README.md`, `AI_USAGE.md`.
* **Vướng mắc:**
  * Mã của Dev B viết bằng Python nhưng khung dự án và CI là Java/Maven; Vercel không có Java trong danh sách runtime chính thức. Cần cả nhóm chốt ngôn ngữ.
  * Chưa chụp được ảnh Table Editor và trang web: [điền: đã chụp chưa, lý do nếu chưa].
  * Chưa chạy `schema.sql` trên Supabase thật: [điền sau khi chạy].
* **Dự kiến ngày mai:** Chạy `schema.sql`, `seed.sql` trên Supabase, chụp ảnh Table Editor và trang web, dán link Vercel vào README; tạo Issue cho BUG-01, BUG-02; nhắn nhóm họp chốt ngôn ngữ.

### 19/10/2026

* **Việc đã làm:**
  * Rà lại repo từ 09/10 đến 19/10: Dev A đã thêm mã Java cho khoản chi (thêm khoản chi, tính tổng chi, xóa khoản chi; PR #27, #28) kèm 5 test trong `ExpenseServiceTest`; Dev A đưa giao diện web kết nối Supabase lên nhánh `feature/30-giao-dien-web` (commit ngày 18/10, chưa có PR vào `main`); Dev B bổ sung test nâng cao cho `budget` và phần B của `AI_USAGE.md` trên nhánh `feature/2-danh-muc` (11/10).
  * Đối chiếu tài liệu BA với mã mới: `Expense` dùng `id`, `date`, `amount`, `categoryId`, `note` khớp với bảng `expense` trong `db/schema.sql`; `ExpenseService` có `add`, `total`, `delete` khớp FR về thêm, tổng và xóa khoản chi.
  * Phát hiện `supabase/schema.sql` của Dev A dùng tên bảng `categories`, `expenses` (cột `spent_on`) khác bản nháp của BA; sửa `db/schema.sql`, `seed.sql`, `database.md`, `test-cases.md` cho khớp và chỉ thêm bảng `budgets`. Thêm 5 test Java (TC-JAVA) của Dev A vào `test-cases.md`.
  * [điền: việc bạn thật sự đã làm từ 10/10 đến 18/10, ví dụ đã chạy `schema.sql` trên Supabase chưa, đã mở PR nào]
* **Sản phẩm:** [điền: PR/Issue/ảnh minh chứng nếu có]
* **Vướng mắc:**
  * Mã budget của Dev B vẫn là Python (`budget.py`) còn khung dự án là Java/Maven; chưa thấy nhóm chốt.
  * `docs/ba/`, `db/`, `AI_USAGE.md` của BA chưa có trên `main` nếu chưa mở 5 PR theo `HUONG-DAN-NOP.md`: [điền tình trạng].
  * `README.md` trên `main` vẫn chỉ 2 dòng, chưa có link Vercel.
* **Dự kiến ngày mai:** Test PR của Dev A (#27, #28) và comment "Đã test OK" nếu đạt; chạy `mvn verify` chụp coverage; cập nhật `test-cases.md` và báo cáo theo mã Java mới; hỏi Dev A khi nào mở PR cho giao diện web để test.

<!--
Mẫu cho ngày mới (sao chép phần dưới, bỏ dòng này):

### dd/mm/yyyy

* **Việc đã làm:**
* **Sản phẩm:**
* **Vướng mắc:**
* **Dự kiến ngày mai:**
-->

### 27/10/2026

* **Việc đã làm:**
  * Đọc mã và SQL mới của nhóm: `supabase/family-1-bang.sql` (Dev A) và `FamilyReportService` kèm 5 test (Dev B). Phạm vi đã mở rộng sang đăng nhập, gia đình, thu nhập.
  * Chạy `family-1-bang.sql` hai lần trên PostgreSQL 16 cục bộ, không lỗi. Thử 15 tình huống (tạo gia đình, mã mời sai, tham gia hai lần, thu nhập bằng 0, admin sửa hoặc xóa thu nhập của thành viên, người lạ, người chưa đăng nhập): tất cả đúng như thiết kế.
  * Soạn `06-pham-vi-gia-dinh.md`, cập nhật `database.md`, `test-cases.md`, `01-tong-quan-du-an.md`.
* **Sản phẩm:** Issue #55, PR #56 (chờ Dev A duyệt).
* **Vướng mắc:** `family-1-bang.sql` đang ở nhánh `feature/46-db-gia-dinh`, chưa vào `main`; `expenses` vẫn quyền công khai (demo). BA chưa thử giao diện đăng nhập, gia đình trên Vercel.
* **Dự kiến ngày mai:** Thử trang web trên Vercel và ghi kết quả vào `test-cases.md`; nhờ Dev A chụp ảnh Supabase và Rulesets.
