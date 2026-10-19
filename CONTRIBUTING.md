# Quy ước làm việc nhóm 4

## Thành viên và phân vùng
| Vai trò | GitHub | Vùng làm việc |
|---|---|---|
| Dev A (trưởng nhóm) | @yenhoang295 | `src/.../expense/`, `docs/dev-a/` |
| Dev B | @khuatdanhthai117-bit | `src/.../budget/`, `docs/dev-b/` |
| BA kiêm test | @lethihuechi16-sen | `docs/ba/`, `db/` |

Vùng của ai thì người kia review (xem `.github/CODEOWNERS`).

## Quy trình (GitHub Flow)
1. Tạo Issue (BA hoặc người nhận việc).
2. `git switch main && git pull`, rồi tạo nhánh.
3. Commit nhỏ, push, mở Pull Request, ghi `Closes #số-issue`.
4. Người khác review, BA test, CI xanh.
5. Tác giả bấm **Squash and merge**, xóa nhánh, `git pull` lại main.

## Tên nhánh: `loai/so-issue-mo-ta`
Chữ thường, không dấu, nối bằng `-`. Tiền tố: `feature/`, `bugfix/`, `hotfix/`, `docs/`, `refactor/`, `test/`, `chore/`.
Ví dụ: `feature/5-them-khoan-chi`, `docs/12-nhat-ky-ngay-3`.

## Commit: `<type>(<scope>): <mô tả>`
Mô tả ngắn, dạng mệnh lệnh, mỗi commit một việc.
- `test(expense): thêm test khoản chi có số tiền âm`  (RED)
- `feat(expense): thêm khoản chi`  (GREEN)
- `refactor(expense): tách hàm kiểm tra số tiền`  (REFACTOR)
- `docs(ba): cập nhật nhật ký ngày 3`

Type: feat, fix, docs, style, refactor, test, chore, ci.
Scope: expense, budget, category, statistics, db, ba, dev-a, dev-b.

## Pull Request
- Tiêu đề viết theo quy ước commit.
- Dưới khoảng 400 dòng, một mục đích, CI xanh trước khi nhờ review.
- Chưa xong thì tạo Draft PR.

## Không commit
`.env`, mật khẩu (`db.properties`), thư mục `target/`.

## Kiểm thử của BA
1. Với mỗi Pull Request của Dev: `git fetch origin`, `git switch <tên-nhánh>`, chạy kiểm thử của dự án (khung Maven hiện tại: `mvn verify`), đối chiếu `docs/ba/test-cases.md`.
2. Kết quả ghi bằng bình luận trong PR: đạt thì viết "Đã test OK"; lỗi thì ghi cách tái hiện và tạo Issue `bugfix`.
3. Tick ô "BA đã test" trong mô tả PR chỉ khi đã bình luận "Đã test OK".

## Tài liệu BA
- Nằm ở `docs/ba/` (yêu cầu, use case, tiêu chí chấp nhận, `database.md`, `test-cases.md`, báo cáo, nhật ký) và `db/` (`schema.sql`, `seed.sql`).
- Cả hai Dev review PR tài liệu BA (xem `.github/CODEOWNERS`).
- Cứ 2 ngày làm việc mở một PR tài liệu; mỗi ngày có ít nhất một commit nhật ký.

## Cơ sở dữ liệu (Supabase) và web (Vercel)
- Cơ sở dữ liệu là PostgreSQL trên Supabase. Thay đổi cấu trúc bảng đi qua PR sửa `db/schema.sql`, ghi rõ trong mô tả PR; sau khi merge, chạy lại file trong Supabase → SQL Editor.
- Vercel tự deploy khi merge vào `main`. Mở tab **Deployments** kiểm tra sau mỗi lần merge.
- Tài khoản Supabase và Vercel đăng nhập bằng GitHub.

## Bảo mật
- Không commit: khóa API, mật khẩu cơ sở dữ liệu, `.env*`, `db.properties`, thư mục `.vercel/`.
- Khóa `service_role` của Supabase chỉ đặt trong biến môi trường của Vercel, tuyệt đối không đưa vào mã chạy trên trình duyệt.
- Lỡ đưa khóa lên GitHub: đổi khóa trong Supabase ngay, không chỉ xóa file.
- Không chụp màn hình hiện khóa API hay mật khẩu khi làm minh chứng.
