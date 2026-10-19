# 5. Tiêu chí chấp nhận (dùng cho TDD)

Viết theo dạng **Given / When / Then**. Dev dựa vào đây để viết test trước (RED), rồi viết mã (GREEN). Số liệu lấy từ `db/seed.sql` (đã kiểm chứng trên PostgreSQL 16).

## FR-01: Thêm khoản chi
| Mã | Given | When | Then |
|---|---|---|---|
| AC-01.1 | Có danh mục "Ăn uống" | Thêm khoản chi ngày 2026-10-09, 50.000, "Ăn uống", ghi chú "Ăn sáng" | Khoản chi được lưu và có trong danh sách |
| AC-01.2 | Có danh mục "Ăn uống" | Thêm khoản chi không nhập ghi chú | Lưu được, ghi chú để trống |
| AC-01.3 | — | Thêm khoản chi số tiền trống | Báo lỗi, không lưu |
| AC-01.4 | — | Thêm khoản chi số tiền 0 hoặc -1.000 | Báo lỗi, không lưu |
| AC-01.5 | — | Thêm khoản chi chưa chọn danh mục | Báo lỗi, không lưu |

## FR-02: Tổng chi
| Mã | Given | When | Then |
|---|---|---|---|
| AC-02.1 | Chưa có khoản chi nào | Xem tổng chi | Tổng bằng 0 |
| AC-02.2 | Dữ liệu mẫu | Xem tổng chi danh mục "Ăn uống" tháng 2026-10 | 920.000 |
| AC-02.3 | Dữ liệu mẫu | Xem tổng chi danh mục chưa có khoản chi nào | 0 |

## FR-03: Lọc danh sách
| Mã | Given | When | Then |
|---|---|---|---|
| AC-03.1 | Dữ liệu mẫu | Lọc tháng 2026-10 | Hiển thị 8 khoản chi |
| AC-03.2 | Dữ liệu mẫu | Lọc tháng 2026-09 | Hiển thị 7 khoản chi |
| AC-03.3 | Dữ liệu mẫu | Lọc tháng 2026-12 | "Chưa có khoản chi", tổng bằng 0 |

## FR-04, FR-05: Sửa và xóa khoản chi
| Mã | Given | When | Then |
|---|---|---|---|
| AC-04.1 | Có khoản chi 50.000 | Đổi số tiền thành 70.000 và lưu | Danh sách hiển thị 70.000 |
| AC-04.2 | Có khoản chi 50.000 | Đổi số tiền thành 0 và lưu | Báo lỗi, giữ nguyên 50.000 |
| AC-05.1 | Có một khoản chi | Xóa và xác nhận | Khoản chi không còn trong danh sách |
| AC-05.2 | Có một khoản chi | Xóa rồi chọn Hủy | Khoản chi vẫn còn |

## FR-06, FR-07: Danh mục
| Mã | Given | When | Then |
|---|---|---|---|
| AC-06.1 | Chưa có danh mục "Du lịch" | Thêm "Du lịch" | Có trong danh sách danh mục |
| AC-06.2 | Đã có "Ăn uống" | Thêm "Ăn uống" hoặc "ăn uống" | Báo lỗi, không thêm |
| AC-06.3 | — | Thêm danh mục rỗng hoặc toàn khoảng trắng | Báo lỗi, không thêm |
| AC-07.1 | "Ăn uống" đang có khoản chi | Xóa "Ăn uống" | Báo "Danh mục đang được dùng", không xóa |
| AC-07.2 | Danh mục chưa có khoản chi | Xóa danh mục | Xóa được; ngân sách riêng của danh mục đó cũng mất |

## FR-08, FR-09: Ngân sách
| Mã | Given | When | Then |
|---|---|---|---|
| AC-08.1 | — | Đặt ngân sách tháng 2026-11 là 5.000.000 | Lưu được |
| AC-08.2 | — | Đặt ngân sách bằng 0 | Lưu được |
| AC-08.3 | — | Đặt ngân sách -1.000 | Báo lỗi, không lưu |
| AC-08.4 | Tháng 2026-10 đã có ngân sách tổng | Đặt lại ngân sách tổng tháng 2026-10 | Cập nhật bản cũ, vẫn chỉ một bản |
| AC-09.1 | Ngân sách tổng 2026-10 là 3.000.000, đã chi 2.850.000 | Xem trạng thái | Chưa vượt (còn 150.000) |
| AC-09.2 | Như trên | Thêm khoản chi 200.000 | Tổng chi 3.050.000, hiển thị cảnh báo vượt ngân sách |
| AC-09.3 | Ngân sách là 100.000 | Tổng chi đúng 100.000 | Chưa cảnh báo |
| AC-09.4 | Ngân sách "Ăn uống" 2026-10 là 1.000.000, đã chi 920.000 | Thêm khoản chi "Ăn uống" 200.000 | Tổng "Ăn uống" 1.120.000, cảnh báo vượt |

## FR-10, FR-11, FR-12: Thống kê
| Mã | Given | When | Then |
|---|---|---|---|
| AC-10.1 | Dữ liệu mẫu | Thống kê tháng 2026-10 | 2.850.000 |
| AC-10.2 | Dữ liệu mẫu | Thống kê tháng 2026-09 | 1.615.000 |
| AC-10.3 | Dữ liệu mẫu | Thống kê tháng 2026-08 hoặc danh sách trống | 0 |
| AC-11.1 | Dữ liệu mẫu | Danh mục chi nhiều nhất tháng 2026-10 | "Ăn uống" (920.000, hơn "Mua sắm" 900.000) |
| AC-11.2 | Dữ liệu mẫu | Danh mục chi nhiều nhất tháng 2026-09 | "Mua sắm" (400.000) |
| AC-11.3 | Không có khoản chi | Danh mục chi nhiều nhất | Không có (rỗng/None) |
| AC-12.1 | Dữ liệu mẫu | So sánh 2026-10 với 2026-09 | +1.235.000 |
| AC-12.2 | Dữ liệu mẫu | So sánh 2026-09 với 2026-10 | -1.235.000 |

## FR-13, FR-14: Lưu trữ và triển khai
| Mã | Given | When | Then |
|---|---|---|---|
| AC-13.1 | Đã thêm một khoản chi trên web | Tải lại trang, hoặc mở bằng thiết bị khác | Khoản chi vẫn còn; thấy dòng đó trong Table Editor của Supabase |
| AC-14.1 | Đã merge PR vào `main` | Chờ Vercel build xong | Trang web ở link công khai phản ánh thay đổi mới |
