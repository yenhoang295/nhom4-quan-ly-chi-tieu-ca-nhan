# NHẬT KÝ SỬ DỤNG AI ĐẠT CHUẨN CNPM HIỆN ĐẠI - THÀNH VIÊN DEV B (NGÀY 5)

### 1. Các kỹ thuật và tính năng đã áp dụng (Dev B)
- **Giai đoạn Thiết kế (Ngày 1):** Phát triển thành công hệ thống giao diện Frontend phi trạng thái bám sát Mock Data để kiểm thử luồng hiển thị độc lập.
- **Giai đoạn Đấu nối API (Ngày 2 & Ngày 4):** Loại bỏ Mock Data, tích hợp trực tiếp SDK Supabase để thực thi các thao tác CRUD an toàn thời gian thực trên bảng `incomes` và `expenses`.
- **Kiến trúc Bảo mật (Ngày 4 & Sửa đổi):** Ứng dụng mô hình Guard Clauses 2 lớp kiểm tra đặc quyền Admin (Mẹ) ở Frontend, triệt tiêu hoàn toàn lỗ hổng chèn mã độc bằng hàm `escapeHTML` chống tấn công XSS. Xác nhận an toàn cốt lõi được chặn bằng chính sách RLS tại Database.
- **Phát triển Backend (Ngày 3 & Ngày 5):** Thực thi đúng quy trình Test-Driven Development (TDD) trên ngôn ngữ Java (RED -> GREEN), sử dụng Stream API tối ưu hóa hiệu năng tính toán.

### 2. Kết quả minh chứng độ bao phủ (Coverage)
- Đã bổ sung đầy đủ các kịch bản kiểm thử trường hợp biên đặc biệt vào tệp `FamilyReportServiceTest.java`.
- Chỉ số bao phủ kiểm thử kiểm soát lỗi nhánh (Branch Coverage) của module Java phụ trách cam kết đạt tỷ lệ trên 80%, đáp ứng đầy đủ tiêu chí nghiệm thu phần mềm.
