# 4. Use case

Tác nhân chung: **Người dùng**. Điều kiện chung: web đang chạy và kết nối được cơ sở dữ liệu.

## UC-01: Thêm khoản chi (FR-01)
- **Điều kiện trước:** đã có ít nhất một danh mục.
- **Điều kiện sau:** khoản chi được lưu và có trong danh sách.

**Luồng chính**
1. Người dùng chọn "Thêm khoản chi".
2. Hệ thống hiển thị biểu mẫu: ngày (mặc định hôm nay), số tiền, danh mục, ghi chú.
3. Người dùng nhập và bấm "Lưu".
4. Hệ thống kiểm tra, lưu vào bảng `expense`, hiển thị khoản chi mới.

**Ngoại lệ**
- 4a. Số tiền trống, bằng 0 hoặc âm: báo lỗi, không lưu.
- 4b. Chưa chọn danh mục: báo lỗi, không lưu.
- 4c. Không kết nối được cơ sở dữ liệu: báo "Không lưu được, vui lòng thử lại", không mất dữ liệu đã nhập trên biểu mẫu.

## UC-02: Xem và lọc khoản chi (FR-02, FR-03)
**Luồng chính:** (1) Người dùng mở trang danh sách. (2) Hệ thống hiển thị khoản chi, mới nhất ở trên, kèm tổng chi của danh sách đang hiển thị. (3) Người dùng chọn tháng và/hoặc danh mục. (4) Hệ thống chỉ hiển thị khoản chi phù hợp và cập nhật tổng.

**Ngoại lệ:** không có khoản chi phù hợp thì hiển thị "Chưa có khoản chi" và tổng bằng 0.

## UC-03: Sửa khoản chi (FR-04)
**Luồng chính:** (1) Người dùng chọn một khoản chi, bấm "Sửa". (2) Hệ thống hiện dữ liệu hiện có. (3) Người dùng đổi và bấm "Lưu". (4) Hệ thống kiểm tra như UC-01, cập nhật, hiển thị lại danh sách.

**Ngoại lệ:** dữ liệu mới không hợp lệ thì báo lỗi và giữ nguyên bản cũ.

## UC-04: Xóa khoản chi (FR-05)
**Luồng chính:** (1) Người dùng chọn khoản chi, bấm "Xóa". (2) Hệ thống hỏi xác nhận. (3) Người dùng đồng ý, hệ thống xóa và cập nhật danh sách.

**Ngoại lệ:** người dùng chọn "Hủy" thì giữ nguyên.

## UC-05: Tạo và xóa danh mục (FR-06, FR-07)
**Luồng chính (tạo):** (1) Người dùng nhập tên danh mục, bấm "Thêm". (2) Hệ thống cắt khoảng trắng hai đầu, kiểm tra, lưu và hiển thị.

**Ngoại lệ**
- Tên rỗng hoặc chỉ có khoảng trắng: báo lỗi.
- Tên trùng danh mục đã có (không phân biệt hoa/thường): báo lỗi, không thêm.
- Xóa danh mục đang có khoản chi: báo "Danh mục đang được dùng", không xóa.

## UC-06: Đặt ngân sách tháng (FR-08)
**Luồng chính:** (1) Người dùng chọn tháng (`yyyy-MM`), chọn phạm vi (cả tháng hoặc một danh mục), nhập số tiền. (2) Hệ thống kiểm tra và lưu. (3) Hệ thống hiển thị ngân sách, số đã chi và số còn lại.

**Ngoại lệ**
- Số tiền âm: báo lỗi. Số tiền bằng 0: hợp lệ.
- Tháng đã có ngân sách cùng phạm vi: cập nhật bản cũ, không tạo thêm bản thứ hai.

## UC-07: Cảnh báo vượt ngân sách (FR-09)
**Luồng chính:** (1) Người dùng thêm hoặc sửa khoản chi. (2) Hệ thống cộng tổng chi của tháng (và của danh mục) rồi so với ngân sách. (3) Nếu tổng chi lớn hơn ngân sách, hệ thống vẫn lưu khoản chi và hiển thị cảnh báo "Đã vượt ngân sách".

**Ghi chú:** tổng chi bằng đúng ngân sách thì chưa cảnh báo.

## UC-08: Xem thống kê (FR-10, FR-11, FR-12)
**Luồng chính:** (1) Người dùng mở trang thống kê, chọn tháng. (2) Hệ thống hiển thị tổng chi tháng, tổng theo từng danh mục, danh mục chi nhiều nhất. (3) Người dùng chọn thêm một tháng để so sánh; hệ thống hiển thị chênh lệch (tháng A trừ tháng B).

**Ngoại lệ:** tháng không có dữ liệu thì tổng bằng 0 và danh mục chi nhiều nhất để trống.

## UC-09: Mở web và dữ liệu được giữ lại (FR-13, FR-14)
**Luồng chính:** (1) Người dùng mở link Vercel trên trình duyệt. (2) Web tải dữ liệu từ Supabase và hiển thị. (3) Người dùng tắt trình duyệt, mở lại: dữ liệu vẫn còn.

**Ngoại lệ:** dự án Supabase đang bị tạm dừng thì web báo lỗi kết nối; nhóm vào Supabase bấm khôi phục (Restore project).
