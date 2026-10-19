# Công nghệ và hạ tầng: GitHub, Supabase, Vercel

> Cập nhật 09/10/2026. Nhóm dùng **Supabase** làm cơ sở dữ liệu, **Vercel** để đưa web lên Internet, cả hai liên kết với GitHub bằng đăng nhập GitHub.

## 1. Bức tranh chung

![Sơ đồ triển khai](images/kien-truc.png)

| Việc | Ai làm | Ở đâu |
|---|---|---|
| Viết mã, mở Pull Request, duyệt, merge | Cả nhóm | GitHub |
| Tạo bảng, nạp dữ liệu mẫu, xem dữ liệu | BA (và Dev khi cần) | Supabase: SQL Editor, Table Editor |
| Build và chạy web, cấp link công khai | Tự động sau khi merge vào `main` | Vercel |
| Chạy kiểm thử tự động trên Pull Request | Tự động | GitHub Actions (job `build`) |

## 2. GitHub
- Repo: `yenhoang295/nhom4-quan-ly-chi-tieu-ca-nhan`; nhánh `main` được khóa, mọi thay đổi đi qua Pull Request.
- Tài khoản GitHub là "chìa khóa chung": Supabase và Vercel đều cho đăng nhập bằng nút **Continue with GitHub**, nên không có mật khẩu riêng cần nhớ hay lộ.

## 3. Supabase (cơ sở dữ liệu)
**Supabase là gì:** dịch vụ cung cấp cơ sở dữ liệu PostgreSQL có giao diện web. Các phần nhóm dùng:

| Thành phần | Dùng để |
|---|---|
| SQL Editor | Chạy `db/schema.sql`, `db/seed.sql` và truy vấn kiểm tra |
| Table Editor | Xem và sửa dữ liệu như bảng tính; dùng làm minh chứng trong báo cáo |
| Project Settings → API | Lấy địa chỉ dự án (Project URL) và các khóa API |
| Authentication (nếu cần) | Đăng nhập người dùng cuối; nhóm chưa quyết định dùng |

**Các bước thiết lập (người tạo dự án làm một lần)**
1. Đăng nhập supabase.com bằng GitHub, tạo **New project**, chọn vùng gần Việt Nam (ví dụ Singapore), đặt mật khẩu cơ sở dữ liệu và **lưu vào nơi riêng, không đưa lên GitHub**.
2. Chạy `db/schema.sql`, rồi `db/seed.sql` trong SQL Editor (xem `database.md`, mục 4).
3. Mở Table Editor kiểm tra 3 bảng có dữ liệu.
4. Lấy Project URL và khóa API, gửi cho Dev qua kênh riêng của nhóm để cài vào Vercel (mục 4).

**Hai loại khóa API**
| Khóa | Đặt ở đâu | Quyền |
|---|---|---|
| `anon` (publishable) | Được phép nằm trong mã chạy trên trình duyệt | Bị giới hạn bởi RLS |
| `service_role` (secret) | Chỉ ở phía máy chủ, trong biến môi trường Vercel | Bỏ qua RLS, quyền rất lớn |

**Giới hạn gói miễn phí (theo supabase.com/pricing, xem ngày 08/10/2026)**
- 500 MB cơ sở dữ liệu cho mỗi dự án; tối đa 2 dự án hoạt động cùng lúc.
- Dự án miễn phí bị **tạm dừng sau một tuần không có hoạt động**. Trước buổi demo phải mở Supabase xem dự án có đang chạy không; nếu bị dừng thì bấm khôi phục (Restore) và chờ vài phút.

## 4. Vercel (đưa web lên Internet)
**Vercel là gì:** dịch vụ tự động build mã từ GitHub và chạy thành trang web có link công khai, thường có dạng `https://<tên-dự-án>.vercel.app`.

**Cách hoạt động với repo của nhóm**
1. Đăng nhập vercel.com bằng GitHub, chọn **Add New → Project**, import repo `nhom4-quan-ly-chi-tieu-ca-nhan`.
2. Ở mục **Environment Variables**, nhập địa chỉ Supabase và khóa API (tên biến do Dev quy định theo framework). Không ghi các giá trị này vào mã.
3. Mỗi lần có commit vào `main` (tức là sau khi Squash and merge một PR), Vercel tự build và cập nhật trang chính. Vercel cũng có thể tạo bản xem thử cho từng Pull Request.
4. Xem lịch sử build ở tab **Deployments**; nếu build lỗi, mở log để đọc nguyên nhân.

**Hai điều nhóm cần kiểm tra sớm**
- **Ngôn ngữ của web.** Danh sách runtime chính thức của Vercel Functions gồm Node.js, Bun, Python, Rust, Go, Ruby, Wasm và Edge; **Java không nằm trong danh sách** (theo vercel.com/docs/functions/runtimes, cập nhật 12/08/2026). Dự án hiện có `pom.xml` (Java/Maven) và code của Dev B đang viết bằng Python, nên Dev A và Dev B cần chốt ngôn ngữ và framework của web để Vercel build được.
- **Gói Hobby và người cộng tác.** Trên diễn đàn Vercel có nhiều báo cáo deploy bị chặn khi tác giả commit không được nhận là người có quyền trong dự án thuộc gói Hobby, kèm thông báo "Hobby teams do not support collaboration". Sau khi merge PR đầu tiên của Dev B hoặc BA, chủ dự án nên mở tab Deployments xem bản deploy có chạy được không. Nếu bị chặn, cân nhắc nhờ chủ dự án merge, hoặc dùng gói có hỗ trợ cộng tác.

## 5. Đăng nhập bằng GitHub
| Dịch vụ | Ai đã liên kết | Ghi chú |
|---|---|---|
| Supabase | BA (@lethihuechi16-sen) liên kết tài khoản bằng GitHub | Cần mời các thành viên khác vào organization/dự án nếu họ cũng muốn vào Dashboard |
| Vercel | Đã liên kết với GitHub, dùng để mở web | Cần xác nhận tài khoản nào đang là chủ dự án |

Khi liên kết, GitHub hiện danh sách quyền mà dịch vụ xin. Chỉ cấp cho đúng repo của nhóm khi có lựa chọn, không cấp cho tất cả repo.

## 6. Bảo mật và file không được commit
- `.gitignore` hiện chặn `target/`, `db.properties`, `.env`. Khi dùng Vercel thường phát sinh thêm `.env.local` và thư mục `.vercel/`; hai thứ này **chưa** được chặn. Đề xuất nhờ Dev A thêm `.env*` và `.vercel/` vào `.gitignore`.
- Nếu lỡ đưa khóa hoặc mật khẩu lên GitHub, coi như đã lộ: vào Supabase đổi khóa và mật khẩu ngay, không chỉ xóa file.
- Không chụp màn hình hiện khóa API, mật khẩu hoặc Project URL kèm khóa khi làm minh chứng (xem mục 7).

## 7. Minh chứng cần chụp và nộp
Lưu ảnh vào `docs/ba/images/` theo đúng tên dưới đây để báo cáo dùng lại.

| Tên file | Chụp gì | Cần che |
|---|---|---|
| `supabase-sql-editor-schema.png` | SQL Editor sau khi chạy `schema.sql`, thấy thông báo thành công | Không có gì nhạy cảm |
| `supabase-table-editor-expense.png` | Table Editor, bảng `expense` có dữ liệu mẫu | — |
| `supabase-table-editor-category.png` | Table Editor, bảng `category` (6 dòng) | — |
| `supabase-table-editor-budget.png` | Table Editor, bảng `budget` (3 dòng) | — |
| `supabase-rls.png` | Bảng bất kỳ ở Table Editor cho thấy RLS đang bật (không có nhãn "RLS disabled") | — |
| `vercel-trang-web.png` | Trang web mở bằng link công khai, thấy thanh địa chỉ có link | — |
| `vercel-deployments.png` | Tab Deployments của dự án, có bản deploy trạng thái Ready | Email cá nhân nếu có |
| `github-pr-co-review.png` | Một PR đã Approve và merge | — |
| `github-rulesets.png` | Trang Settings → Rulesets → `bao-ve-main` | — |

**Không chụp hoặc phải che:** trang Project Settings → API (có khóa), mật khẩu cơ sở dữ liệu, giá trị biến môi trường trên Vercel.

## 8. Rủi ro và việc cần chốt
| # | Rủi ro | Việc cần làm | Người |
|---|---|---|---|
| 1 | Ngôn ngữ của web chưa thống nhất (Java trong `pom.xml`, Python trong `budget.py`); Vercel không chạy Java trực tiếp | Họp chốt; sau đó cập nhật CI và README | Dev A, Dev B |
| 2 | CI hiện chỉ chạy `mvn verify`, không chạy test Python | Cập nhật `ci.yml` theo ngôn ngữ đã chốt | Dev A |
| 3 | Supabase bị tạm dừng sau 1 tuần không hoạt động | Mở Supabase trước ngày demo | BA |
| 4 | Deploy Vercel bị chặn với người cộng tác (gói Hobby) | Thử sau PR đầu tiên của Dev B hoặc BA | Dev A |
| 5 | Khóa API lộ lên GitHub | Thêm `.env*`, `.vercel/` vào `.gitignore`; không commit khóa | Dev A |
| 6 | Policy demo cho khóa công khai đọc, thêm, xóa khoản chi: ai có khóa trong `web/config.js` đều sửa được dữ liệu | Thêm Supabase Auth và giới hạn policy (xem `database.md`, mục 5) | Dev A |

## 9. Nguồn tham khảo
- Supabase, bảng giá và giới hạn gói miễn phí: https://supabase.com/pricing
- Vercel, danh sách runtime của Functions: https://vercel.com/docs/functions/runtimes
- Diễn đàn Vercel, deploy bị chặn ở gói Hobby: https://community.vercel.com/t/vercel-deployment-blocked-because-commit-author-does-not-have-contributing-access-on-hobby-plan/36192
