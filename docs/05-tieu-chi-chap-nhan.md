# 5. Tiêu chí chấp nhận (dùng cho TDD)

Tiêu chí viết theo dạng **Given / When / Then**. Dev dựa vào đây để viết kiểm thử trước, rồi mới viết mã.

## FR-01: Thêm khoản chi
| Mã | Given (Cho trước) | When (Khi) | Then (Thì) |
|---|---|---|---|
| AC-01.1 | Người dùng nhập ngày, số tiền 50.000, danh mục "Ăn uống" | Bấm Lưu | Giao dịch được lưu và hiện trong danh sách |
| AC-01.2 | Người dùng để trống số tiền | Bấm Lưu | Hệ thống báo lỗi, không lưu |
| AC-01.3 | Người dùng nhập số tiền bằng 0 hoặc số âm | Bấm Lưu | Hệ thống báo lỗi, không lưu |
| AC-01.4 | Người dùng chưa chọn danh mục | Bấm Lưu | Hệ thống báo lỗi yêu cầu chọn danh mục |

## FR-08: Cảnh báo vượt ngân sách
| Mã | Given | When | Then |
|---|---|---|---|
| AC-08.1 | Ngân sách "Ăn uống" tháng này là 1.000.000, đã chi 950.000 | Thêm khoản chi 100.000 vào "Ăn uống" | Hệ thống lưu giao dịch và cảnh báo đã vượt ngân sách |

## Các chức năng còn lại
> Bổ sung tiêu chí cho FR-02 đến FR-10 khi nhóm chốt yêu cầu.
