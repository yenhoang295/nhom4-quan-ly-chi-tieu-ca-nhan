# 3. Yêu cầu phi chức năng

| Mã | Nhóm | Yêu cầu | Cách kiểm tra |
|---|---|---|---|
| NFR-01 | Độ chính xác | Số tiền không sai số làm tròn; chỉ chấp nhận số tiền lớn hơn 0 | Test đơn vị và ràng buộc CSDL (TC-DB-01, TC-DB-02) |
| NFR-02 | Toàn vẹn dữ liệu | Khoản chi luôn thuộc một danh mục có thật; không xóa danh mục đang có khoản chi | TC-DB-03, TC-DB-07 |
| NFR-03 | Hiệu năng | Trang danh sách và thống kê hiển thị trong vài giây với vài nghìn khoản chi | Thử với dữ liệu mẫu lớn (BA) |
| NFR-04 | Khả dụng | Thêm một khoản chi trong tối đa 4 thao tác | Kiểm thử thủ công |
| NFR-05 | Tương thích | Chạy trên Chrome, Edge, Firefox bản mới; dùng được trên điện thoại | Kiểm thử thủ công trên link Vercel |
| NFR-06 | Bảo mật dữ liệu | Bật Row Level Security trên cả 3 bảng; khóa công khai chỉ được các thao tác mà web cần (không sửa, không xóa danh mục) | TC-DB-14, TC-DB-15 |
| NFR-07 | Bảo mật khóa | Không đưa mật khẩu, khóa `service_role`, file `.env*` lên GitHub; khóa chỉ để trong biến môi trường của Vercel | Rà soát PR, tìm chuỗi khóa trong repo |
| NFR-08 | Kiểm thử | Mỗi chức năng có test tự động chạy trong CI; coverage mã nghiệp vụ từ 80% | Báo cáo JaCoCo hoặc công cụ tương đương |
| NFR-09 | Quy trình | Không push thẳng `main`; mỗi PR có `Closes #số`, CI xanh, có một người duyệt | Ruleset `bao-ve-main` |
| NFR-10 | Sẵn sàng khi demo | Dự án Supabase đang chạy (không bị tạm dừng) và link Vercel mở được trước giờ báo cáo | Kiểm tra trước ngày nộp 1 ngày |
| NFR-11 | Dung lượng | Dữ liệu nằm trong giới hạn gói miễn phí của Supabase (500 MB) | Xem mục Database trong Supabase |
