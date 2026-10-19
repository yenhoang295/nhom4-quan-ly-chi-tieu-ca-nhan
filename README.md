# Quản lý chi tiêu cá nhân – Nhóm 4

Ứng dụng web giúp một cá nhân ghi chép khoản chi hằng ngày, phân loại theo danh mục, đặt ngân sách theo tháng và xem thống kê chi tiêu. Dự án phát triển theo TDD và làm việc nhóm bằng GitHub Flow.

## Trang web
**Link:** [DÁN LINK VERCEL VÀO ĐÂY, ví dụ https://ten-du-an.vercel.app]

Dữ liệu được lưu trên Supabase (PostgreSQL). Nếu trang báo lỗi kết nối, có thể dự án Supabase bản miễn phí đang bị tạm dừng do một tuần không hoạt động; xem phần "Xử lý sự cố" bên dưới.

## Công nghệ
| Thành phần | Công nghệ |
|---|---|
| Cơ sở dữ liệu | PostgreSQL trên [Supabase](https://supabase.com) |
| Triển khai web | [Vercel](https://vercel.com), tự động deploy khi merge vào `main` |
| Mã nguồn và quy trình | GitHub, GitHub Flow, Pull Request, CODEOWNERS |
| Kiểm thử tự động | GitHub Actions (job `build`) trên mỗi Pull Request |
| Ngôn ngữ và framework web | Đang được nhóm chốt, xem `docs/ba/cong-nghe-ha-tang.md` mục 8 |
| Tài khoản Supabase, Vercel | Đăng nhập bằng GitHub |

![Sơ đồ triển khai](docs/ba/images/kien-truc.png)

## Cấu trúc thư mục
```
.github/          CODEOWNERS, mẫu Pull Request, CI (workflows/ci.yml)
db/               schema.sql (tạo bảng), seed.sql (dữ liệu mẫu)
docs/ba/          Tài liệu BA: yêu cầu, use case, database.md, test-cases.md, báo cáo, nhật ký
docs/dev-a/       Nhật ký, ghi chú TDD của Dev A
src/              Mã nguồn và test
AI_USAGE.md       Khai báo việc dùng công cụ AI
CONTRIBUTING.md   Quy ước làm việc nhóm
```

## Thiết lập cơ sở dữ liệu trên Supabase
1. Đăng nhập [supabase.com](https://supabase.com) bằng GitHub, mở dự án của nhóm (hoặc tạo mới: **New project**, chọn vùng gần Việt Nam, đặt mật khẩu cơ sở dữ liệu và cất riêng, không đưa lên GitHub).
2. Vào **SQL Editor** → **New query**, dán toàn bộ `db/schema.sql`, bấm **Run**.
3. Tạo query mới, dán `db/seed.sql`, bấm **Run** để có dữ liệu mẫu (trên dự án trống: 6 danh mục, 15 khoản chi, 3 ngân sách).
4. Vào **Table Editor** kiểm tra ba bảng `category`, `expense`, `budget`.

Hai file chạy lại nhiều lần vẫn an toàn. Thiết kế chi tiết và truy vấn mẫu: [`docs/ba/database.md`](docs/ba/database.md).

## Biến môi trường
Địa chỉ dự án Supabase và khóa API được đặt trong **Vercel → Project → Settings → Environment Variables** (tên biến do Dev quy định). **Không** ghi các giá trị này vào mã và **không** commit file `.env*`, `db.properties`. Khóa `service_role` chỉ dùng ở phía máy chủ.

## Chạy kiểm thử
Kiểm thử tự động chạy trên mỗi Pull Request qua GitHub Actions. Với khung Maven hiện tại, chạy tại máy:

```
mvn verify
```

Báo cáo độ phủ JaCoCo nằm ở `target/site/jacoco/index.html`. Mục tiêu độ phủ mã nghiệp vụ là từ 80%. Danh sách test case của BA: [`docs/ba/test-cases.md`](docs/ba/test-cases.md).

## Quy trình làm việc
Không push thẳng `main`. Mỗi việc đi theo: Issue → nhánh `loai/so-issue-mo-ta` → Pull Request có `Closes #số` → CI xanh → có một người duyệt và BA test → Squash and merge → xóa nhánh. Chi tiết: [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Tài liệu
- [Tổng quan](docs/ba/01-tong-quan-du-an.md), [Yêu cầu chức năng](docs/ba/02-yeu-cau-chuc-nang.md), [Yêu cầu phi chức năng](docs/ba/03-yeu-cau-phi-chuc-nang.md)
- [Use case](docs/ba/04-use-case.md), [Tiêu chí chấp nhận](docs/ba/05-tieu-chi-chap-nhan.md)
- [Thiết kế cơ sở dữ liệu](docs/ba/database.md), [Công nghệ và hạ tầng](docs/ba/cong-nghe-ha-tang.md)
- [Test case](docs/ba/test-cases.md), [Báo cáo](docs/ba/bao-cao.md)

## Xử lý sự cố
| Hiện tượng | Nguyên nhân thường gặp | Cách xử lý |
|---|---|---|
| Web báo lỗi kết nối cơ sở dữ liệu | Dự án Supabase bản miễn phí bị tạm dừng sau một tuần không hoạt động | Vào Supabase, bấm **Restore project**, chờ vài phút |
| Web hiện danh sách rỗng dù Table Editor có dữ liệu | Thiếu policy cho khóa công khai hoặc sai `SUPABASE_URL`/`SUPABASE_KEY` trong `web/config.js` | Chạy lại `db/schema.sql`; xem `docs/ba/database.md` mục 5 |
| Deploy trên Vercel không chạy | Lỗi build hoặc người commit không có quyền trong dự án Vercel | Mở tab **Deployments**, đọc log |

## Thành viên
| Vai trò | GitHub |
|---|---|
| Dev A (trưởng nhóm) | [@yenhoang295](https://github.com/yenhoang295) |
| Dev B | [@khuatdanhthai117-bit](https://github.com/khuatdanhthai117-bit) |
| BA kiêm test | [@lethihuechi16-sen](https://github.com/lethihuechi16-sen) |
