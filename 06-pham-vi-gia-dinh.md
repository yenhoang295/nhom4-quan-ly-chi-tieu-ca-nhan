# 06. Phạm vi mở rộng: gia đình, đăng nhập, thu nhập

Cập nhật 27/10/2026. Tài liệu này **thay thế** các câu "không có đăng nhập" và "khoản thu ngoài phạm vi" trong `01` và `02`. Căn cứ: `supabase/family-1-bang.sql`, `FamilyReportService.java` và `FamilyReportServiceTest.java` của nhóm. Các hành vi của trang web chưa được BA thử, nên được đánh dấu **[chưa thử]**.

## 1. Phạm vi mới
- Có đăng ký, đăng nhập (Supabase Auth). Mỗi tài khoản có một dòng trong `profiles`.
- Một người tạo gia đình và trở thành **admin (mẹ)**, nhận **mã mời** 8 ký tự. Người khác nhập mã mời để thành **member**. Mỗi người chỉ thuộc một gia đình.
- Mỗi người ghi **thu nhập** của mình (`incomes`). Admin chỉ được **xem** thu nhập của thành viên, không sửa, không xóa.
- Báo cáo gia đình: tổng chi cả nhà và người chi nhiều nhất (`FamilyReportService`).

## 2. Yêu cầu chức năng bổ sung
| Mã | Yêu cầu | Căn cứ |
|---|---|---|
| FR-15 | Đăng ký, đăng nhập, đăng xuất | `web/auth.js` **[chưa thử]** |
| FR-16 | Hệ thống tự tạo hồ sơ khi có tài khoản mới; tên lấy từ `full_name`, nếu trống thì lấy phần trước `@` của email | trigger `handle_new_user` |
| FR-17 | Tạo gia đình: tên không rỗng, người tạo thành admin, sinh mã mời | `create_family` |
| FR-18 | Tham gia gia đình bằng mã mời (không phân biệt hoa thường) | `join_family` |
| FR-19 | Mỗi người chỉ thuộc một gia đình | khóa chính `family_members.user_id` |
| FR-20 | Thêm, sửa, xóa, xem thu nhập của chính mình; số tiền lớn hơn 0 | bảng `incomes`, RLS |
| FR-21 | Admin xem thu nhập của thành viên cùng gia đình, không sửa, không xóa | RLS `thu_nhap_*` |
| FR-22 | Người ngoài gia đình không thấy dữ liệu gia đình | RLS |
| FR-23 | Báo cáo gia đình: tổng chi, người chi nhiều nhất | `FamilyReportService` |

## 3. Use case bổ sung
**UC-10 Tạo gia đình.** Tác nhân: người dùng đã đăng nhập, chưa có gia đình. Luồng chính: nhập tên, hệ thống tạo gia đình, gán vai trò admin, hiện mã mời. Ngoại lệ: tên rỗng → "Tên gia đình không được để trống"; đã có gia đình → "Bạn đã thuộc một gia đình"; chưa đăng nhập → "Cần đăng nhập" (hoặc bị từ chối quyền gọi hàm).

**UC-11 Tham gia gia đình.** Luồng chính: nhập mã mời, hệ thống thêm người đó với vai trò member. Ngoại lệ: mã sai → "Mã mời không đúng"; đã có gia đình → "Bạn đã thuộc một gia đình".

**UC-12 Ghi thu nhập.** Luồng chính: nhập ngày, số tiền, nguồn, ghi chú; hệ thống lưu cho chính người đó. Ngoại lệ: số tiền không dương bị từ chối (`incomes_amount_check`); ghi thay người khác bị từ chối (RLS).

**UC-13 Admin xem thu nhập thành viên.** Luồng chính: admin mở trang quản trị gia đình, xem thu nhập và chi tiêu từng người. Ngoại lệ: admin sửa hoặc xóa thu nhập của người khác không có tác dụng (0 dòng bị đổi). Giao diện **[chưa thử]**.

**UC-14 Xem báo cáo gia đình.** Tính tổng chi và người chi nhiều nhất. Danh sách rỗng hoặc rỗng dữ liệu cho kết quả 0 và không có người nào.

## 4. Tiêu chí chấp nhận (Given / When / Then)
| Mã | Given | When | Then |
|---|---|---|---|
| AC-15 | Đã đăng nhập, chưa có gia đình | Tạo gia đình "Nhà Lan" | Người đó là admin; mã mời dài 8 ký tự |
| AC-16 | Đã có gia đình | Tạo hoặc tham gia gia đình khác | Lỗi "Bạn đã thuộc một gia đình" |
| AC-17 | Chưa có gia đình | Nhập mã sai | Lỗi "Mã mời không đúng" |
| AC-18 | Có mã mời hợp lệ | Nhập mã bằng chữ thường | Tham gia thành công với vai trò member |
| AC-19 | Đã đăng nhập | Thêm thu nhập 0 | Bị từ chối (`incomes_amount_check`) |
| AC-20 | Đã đăng nhập | Thêm thu nhập cho người khác | Bị từ chối (vi phạm RLS) |
| AC-21 | Admin | Xem thu nhập của member | Thấy |
| AC-22 | Admin | Sửa hoặc xóa thu nhập của member | Không dòng nào bị đổi |
| AC-23 | Người ngoài gia đình | Xem thu nhập, gia đình, thành viên | Không thấy dòng nào của gia đình đó |
| AC-24 | Chưa đăng nhập | Đọc `incomes` hoặc gọi `create_family` | Bị từ chối quyền |
| AC-25 | Danh sách chi tiêu của 3 người | Tính tổng và người chi nhiều nhất | Theo `FamilyReportServiceTest` (tổng 2.000.000; người chi nhiều nhất "Con B") |

## 5. Còn mở
1. Phạm vi thu nhập đã được nhóm chốt chưa (BA ghi theo mã đã có).
2. `supabase/family-1-bang.sql` đang nằm trên nhánh `feature/46-db-gia-dinh`, tính đến 27/10 chưa thấy trên `main`; `family-2-cutover.sql` (đổi quyền `expenses` theo người dùng) chưa có, nên `expenses` vẫn là quyền demo công khai.
3. Trang giao diện và trang quản trị: BA chưa thử trên Vercel.
