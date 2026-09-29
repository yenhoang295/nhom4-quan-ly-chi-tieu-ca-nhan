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
