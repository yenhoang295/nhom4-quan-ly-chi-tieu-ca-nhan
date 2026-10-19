# 2. Yêu cầu chức năng

> Ưu tiên: **M** = bắt buộc, **S** = nên có. Cột "Issue" ghi công việc của nhóm đang theo dõi.
> Bản BA, đã đối chiếu với code của Dev B (nhánh `feature/2-danh-muc`) ngày 09/10/2026.

## 2.1 Khoản chi
| Mã | User story | Ưu tiên | Issue |
|---|---|---|---|
| FR-01 | Là người dùng, tôi muốn thêm một khoản chi (ngày, số tiền, danh mục, ghi chú) để ghi lại việc tiêu tiền. | M | #2, #21 |
| FR-02 | Là người dùng, tôi muốn xem tổng chi (toàn bộ, theo tháng, theo danh mục) để biết mình đã tiêu bao nhiêu. | M | #21 |
| FR-03 | Là người dùng, tôi muốn xem danh sách khoản chi và lọc theo tháng hoặc danh mục. | M | #2 |
| FR-04 | Là người dùng, tôi muốn sửa một khoản chi đã nhập sai. | S | #2 |
| FR-05 | Là người dùng, tôi muốn xóa một khoản chi không còn đúng. | S | #2 |

## 2.2 Danh mục và ngân sách
| Mã | User story | Ưu tiên | Issue |
|---|---|---|---|
| FR-06 | Là người dùng, tôi muốn tạo danh mục để phân loại khoản chi; tên không được rỗng và không được trùng. | M | #3 |
| FR-07 | Là người dùng, tôi muốn xóa danh mục không dùng; danh mục đang có khoản chi thì không được xóa. | S | #3 |
| FR-08 | Là người dùng, tôi muốn đặt ngân sách cho một tháng (tổng, hoặc riêng từng danh mục); ngân sách không được âm. | M | #3 |
| FR-09 | Là người dùng, tôi muốn được báo khi tổng chi vượt ngân sách. | M | #3 |

## 2.3 Thống kê
| Mã | User story | Ưu tiên | Issue |
|---|---|---|---|
| FR-10 | Là người dùng, tôi muốn xem tổng chi của một tháng (định dạng `yyyy-MM`). | M | #3 |
| FR-11 | Là người dùng, tôi muốn biết danh mục nào chi nhiều nhất. | S | #3 |
| FR-12 | Là người dùng, tôi muốn so sánh chi tiêu hai tháng (tháng A trừ tháng B). | S | #3 |

## 2.4 Lưu trữ và triển khai
| Mã | User story | Ưu tiên | Issue |
|---|---|---|---|
| FR-13 | Là người dùng, tôi muốn dữ liệu được lưu lâu dài trên cơ sở dữ liệu PostgreSQL (Supabase) để mở lại vẫn còn. | M | #4 |
| FR-14 | Là người dùng, tôi muốn mở web bằng một đường link công khai (Vercel). | M | #4 |

## 2.5 Điểm cần nhóm xác nhận
| # | Vấn đề | Đề xuất của BA | Người quyết |
|---|---|---|---|
| 1 | Ngân sách chỉ một con số cho cả tháng (như code hiện tại) hay có thêm ngân sách theo danh mục? | CSDL đã hỗ trợ cả hai; phần mềm làm tổng tháng trước | Dev B |
| 2 | Ngân sách bằng 0 có hợp lệ không? | Hợp lệ (khớp test `test_edge_cases_budget_zero`) | Dev B |
| 3 | Hai danh mục đạt cùng mức chi cao nhất thì chọn danh mục nào? | Chọn danh mục xếp trước theo bảng chữ cái | Dev B |
| 4 | Tên danh mục "Ăn uống" và "ăn uống" có coi là trùng không? | Coi là trùng (CSDL đã chặn) | Dev B |
| 5 | Số tiền lưu kiểu số nguyên (`long`) hay `BigDecimal`? | CSDL dùng `numeric(18,0)`, nhận cả hai | Dev A |
| 6 | Có đăng nhập người dùng cuối không? | Chưa; nếu có thì dùng Supabase Auth | Cả nhóm |
