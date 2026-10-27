# 1. Tổng quan dự án

> **Cập nhật 27/10/2026:** phạm vi đã mở rộng (đăng nhập, gia đình, thu nhập). Xem `06-pham-vi-gia-dinh.md`; nội dung dưới đây về "không đăng nhập", "khoản thu ngoài phạm vi" không còn đúng.

## 1.1 Mục tiêu
Xây dựng ứng dụng web giúp một cá nhân ghi chép các khoản chi hằng ngày, phân loại theo danh mục, đặt ngân sách theo tháng và xem thống kê chi tiêu. Dự án được phát triển theo hướng TDD (viết kiểm thử trước, viết mã sau) và quản lý bằng GitHub Flow.

## 1.2 Phạm vi
**Trong phạm vi**
- Thêm, xem, lọc, sửa, xóa khoản chi (issue #2, #21).
- Quản lý danh mục và ngân sách tháng, cảnh báo vượt ngân sách (issue #3).
- Thống kê: tổng chi theo tháng, danh mục chi nhiều nhất, so sánh hai tháng.
- Lưu dữ liệu trên cơ sở dữ liệu PostgreSQL của Supabase.
- Đưa web lên Internet bằng Vercel, có link truy cập công khai.
- Kiểm thử, quản lý Pull Request và hoàn thiện tài liệu (issue #4).

**Ngoài phạm vi (chưa làm, nếu nhóm đổi ý sẽ cập nhật tài liệu này)**
- Ghi nhận khoản thu và tính số dư.
- Kết nối ngân hàng, ví điện tử; ứng dụng di động.
- Đăng nhập cho người dùng cuối của web (nếu nhóm làm, dùng Supabase Auth; xem mục 5 của `database.md`).

## 1.3 Đối tượng sử dụng
| Nhóm | Mô tả | Nhu cầu chính |
|---|---|---|
| Cá nhân | Người muốn theo dõi chi tiêu của mình | Ghi nhanh khoản chi, xem tổng chi theo tháng, kiểm soát ngân sách |

## 1.4 Công nghệ và hạ tầng (cập nhật 08/10/2026)
| Thành phần | Lựa chọn | Ghi chú |
|---|---|---|
| Mã nguồn, quy trình | GitHub (GitHub Flow, Pull Request, CODEOWNERS) | Repo `yenhoang295/nhom4-quan-ly-chi-tieu-ca-nhan` |
| Cơ sở dữ liệu | PostgreSQL trên **Supabase** | Tạo bảng bằng `db/schema.sql`, xem dữ liệu bằng Table Editor |
| Triển khai web | **Vercel** | Liên kết với repo GitHub, tự động deploy khi merge vào `main` |
| Tài khoản | Đăng nhập Supabase và Vercel bằng GitHub | Không phải tạo và nhớ thêm mật khẩu |
| Kiểm thử tự động | GitHub Actions (job `build`) | Chạy trên mỗi Pull Request |

Chi tiết cách thiết lập, giới hạn gói miễn phí và rủi ro xem `cong-nghe-ha-tang.md`.

## 1.5 Vai trò trong nhóm
| Vai trò | GitHub | Nhiệm vụ chính |
|---|---|---|
| Dev A (trưởng nhóm) | @yenhoang295 | Khoản chi (expense), cấu hình repo và CI, kết nối cơ sở dữ liệu |
| Dev B | @khuatdanhthai117-bit | Danh mục, ngân sách, thống kê (budget) |
| BA kiêm test | @lethihuechi16-sen | Yêu cầu, use case, thiết kế CSDL, test case, kiểm thử PR, coverage, README, báo cáo |

## 1.6 Thuật ngữ
| Thuật ngữ | Ý nghĩa |
|---|---|
| Khoản chi | Một lần chi tiêu có ngày, số tiền (lớn hơn 0), danh mục, ghi chú |
| Danh mục | Nhóm phân loại khoản chi (Ăn uống, Di chuyển...) |
| Ngân sách | Hạn mức chi của một tháng: tổng cả tháng hoặc riêng một danh mục |
| Vượt ngân sách | Tổng chi **lớn hơn** ngân sách (bằng nhau thì chưa vượt) |
| Tháng | Chuỗi `yyyy-MM`, ví dụ `2026-10` |
| TDD | Phát triển hướng kiểm thử: RED (test đỏ) → GREEN (test xanh) → REFACTOR |

## 1.7 Giả định và ràng buộc
- Một người dùng, chưa phân quyền nhiều người (xem phạm vi).
- Đơn vị tiền là đồng (VND), không có phần lẻ.
- Gói miễn phí của Supabase tạm dừng dự án sau một tuần không hoạt động, cần khôi phục trước khi demo (xem `cong-nghe-ha-tang.md`).
- Ngôn ngữ lập trình và framework của web do Dev A, Dev B chốt; tài liệu BA không phụ thuộc vào lựa chọn đó.
