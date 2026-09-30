# 4. Use case

## UC-01: Thêm khoản chi
| Mục | Nội dung |
|---|---|
| Tác nhân | Người dùng |
| Mô tả | Người dùng ghi lại một khoản chi tiêu mới |
| Điều kiện trước | Người dùng đang ở trang quản lý giao dịch |
| Điều kiện sau | Khoản chi được lưu và hiện trong danh sách |
| Liên quan | FR-01 |

**Luồng chính**
1. Người dùng chọn "Thêm khoản chi".
2. Hệ thống hiển thị biểu mẫu (ngày, số tiền, danh mục, ghi chú).
3. Người dùng nhập thông tin và bấm "Lưu".
4. Hệ thống kiểm tra dữ liệu hợp lệ và lưu giao dịch.
5. Hệ thống hiển thị giao dịch mới trong danh sách.

**Luồng thay thế / ngoại lệ**
- 4a. Số tiền để trống hoặc không lớn hơn 0: hệ thống báo lỗi và giữ nguyên biểu mẫu.
- 4b. Chưa chọn danh mục: hệ thống báo lỗi yêu cầu chọn danh mục.

## UC-02, UC-03...
> Sao chép mẫu trên cho các chức năng còn lại (thêm khoản thu, sửa, xóa, đặt ngân sách...).
