# 1. Tổng quan dự án

## 1.1 Mục tiêu
Xây dựng ứng dụng web giúp cá nhân ghi chép và quản lý thu chi hằng ngày, phân loại theo danh mục, đặt ngân sách và theo dõi mức chi tiêu. Dự án được phát triển theo hướng TDD (viết kiểm thử trước, viết mã sau).

## 1.2 Phạm vi
**Trong phạm vi:**
- Quản lý giao dịch thu/chi (issue #2)
- Quản lý danh mục và ngân sách (issue #3)
- Kiểm thử, quản lý Pull Request và hoàn thiện tài liệu (issue #4)

**Ngoài phạm vi (dự kiến, cần nhóm thống nhất):**
- Kết nối ngân hàng, ví điện tử
- Ứng dụng di động

## 1.3 Đối tượng người dùng
| Nhóm người dùng | Mô tả | Nhu cầu chính |
|---|---|---|
| Cá nhân | Người muốn theo dõi chi tiêu của mình | Ghi nhanh khoản thu/chi, xem báo cáo, kiểm soát ngân sách |

## 1.4 Vai trò trong nhóm
| Vai trò | Nhiệm vụ chính |
|---|---|
| Trưởng nhóm | Cấu hình repo, CI, khung dự án |
| Dev A, Dev B | Xây dựng chức năng, viết kiểm thử |
| BA | Phân tích yêu cầu, viết tài liệu, tiêu chí chấp nhận |

## 1.5 Thuật ngữ
| Thuật ngữ | Ý nghĩa |
|---|---|
| Giao dịch | Một khoản thu hoặc một khoản chi có ngày, số tiền, danh mục |
| Danh mục | Nhóm phân loại giao dịch (ăn uống, đi lại, lương...) |
| Ngân sách | Hạn mức chi tối đa cho một danh mục trong một tháng |
| TDD | Test-Driven Development, phát triển hướng kiểm thử |

## 1.6 Giả định và ràng buộc
- Ứng dụng chạy trên web, xây dựng theo khung Maven của nhóm.
- Mỗi người dùng chỉ xem dữ liệu của chính mình.
- [bổ sung sau khi họp nhóm]
