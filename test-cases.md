# Test case

> Phiên bản 19/10/2026 (tên bảng theo `supabase/schema.sql` của Dev A). BA điền cột "Kết quả thực tế" và "Đạt / Lỗi" khi thử từng Pull Request.
> Quy ước: **Đạt** nếu kết quả thực tế đúng mong đợi; **Lỗi** thì ghi cách tái hiện và tạo Issue `bugfix`.

## 1. Cách dùng
1. Với mỗi PR của Dev A, Dev B: lấy nhánh về, chạy kiểm thử tự động, rồi đối chiếu các dòng liên quan ở mục 3 (mức ứng dụng).
2. Với cơ sở dữ liệu: chạy từng câu ở mục 2 trong Supabase → SQL Editor (mỗi lần một câu, vì Supabase dừng ở câu lỗi đầu tiên), tick cột "Đạt trên Supabase".
3. Câu lệnh thêm/xóa dữ liệu thử phải được dọn lại để dữ liệu mẫu về nguyên trạng (15 khoản chi, 6 danh mục, 3 ngân sách; chỉ khi chạy trên dự án trống, xem `database.md` mục 7).

## 2. Test cơ sở dữ liệu (TC-DB)
Đã chạy trên PostgreSQL 16 cục bộ với `db/schema.sql` và `db/seed.sql` (chạy mỗi file hai lần, không lỗi). Chưa chạy trên Supabase thật; cột cuối để BA tick sau khi chạy ở đó.

| Mã TC | Nội dung | Câu lệnh / thao tác | Kết quả mong đợi | Đã thử cục bộ (PostgreSQL 16, 19/10/2026) | Đạt trên Supabase |
|---|---|---|---|---|---|
| TC-DB-01 | Số tiền bằng 0 bị từ chối | `insert into expenses(spent_on, amount, category_id) select '2026-10-09', 0, id from categories where name = 'Ăn uống';` | Lỗi vi phạm ràng buộc `expenses_amount_check` | Đạt | [ ] |
| TC-DB-02 | Số tiền âm bị từ chối | `insert into expenses(spent_on, amount, category_id) select '2026-10-09', -1000, id from categories where name = 'Ăn uống';` | Lỗi vi phạm `expenses_amount_check` | Đạt | [ ] |
| TC-DB-03 | Danh mục không tồn tại bị từ chối | `insert into expenses(spent_on, amount, category_id) values ('2026-10-09', 1000, 9999);` | Lỗi khóa ngoại `expenses_category_id_fkey` | Đạt | [ ] |
| TC-DB-04 | Thiếu danh mục bị từ chối | `insert into expenses(spent_on, amount) values ('2026-10-09', 1000);` | Lỗi `null value in column category_id` | Đạt | [ ] |
| TC-DB-05 | Danh mục trùng (khác hoa/thường) bị từ chối | `insert into categories(name) values ('ăn uống');` | Lỗi trùng khóa `categories_name_lower_uq` | Đạt | [ ] |
| TC-DB-06 | Danh mục toàn khoảng trắng bị từ chối | `insert into categories(name) values ('   ');` | Lỗi vi phạm `categories_name_check` | Đạt | [ ] |
| TC-DB-07 | Không xóa được danh mục đang có khoản chi | `delete from categories where name = 'Ăn uống';` | Lỗi khóa ngoại, khoản chi vẫn còn | Đạt | [ ] |
| TC-DB-08 | Ngân sách tháng 13 bị từ chối | `insert into budgets(year_month, amount) values ('2026-13', 1000);` | Lỗi vi phạm `budgets_year_month_check` | Đạt | [ ] |
| TC-DB-09 | Ngân sách tháng sai định dạng (2026-1) bị từ chối | `insert into budgets(year_month, amount) values ('2026-1', 1000);` | Lỗi vi phạm `budgets_year_month_check` | Đạt | [ ] |
| TC-DB-10 | Ngân sách tổng trùng tháng bị từ chối | `insert into budgets(year_month, amount) values ('2026-10', 5000);` | Lỗi trùng khóa `budgets_month_total_uq` | Đạt | [ ] |
| TC-DB-11 | Ngân sách danh mục trùng tháng bị từ chối | `insert into budgets(year_month, amount, category_id) select '2026-10', 5000, id from categories where name = 'Ăn uống';` | Lỗi trùng khóa `budgets_month_category_uq` | Đạt | [ ] |
| TC-DB-12 | Ngân sách âm bị từ chối | `insert into budgets(year_month, amount) values ('2026-11', -1);` | Lỗi vi phạm `budgets_amount_check` | Đạt | [ ] |
| TC-DB-13 | Ngân sách bằng 0 hợp lệ | `insert into budgets(year_month, amount) values ('2026-11', 0) returning *;` | Thêm được 1 dòng (xóa dòng này sau khi thử) | Đạt | [ ] |
| TC-DB-14 | Khóa `anon` (trang web) đọc và thêm được: bản demo có chủ đích | `set role anon; select count(*) from expenses; reset role;` | Đọc ra 15 dòng. Thêm bằng `anon` cũng được (policy demo của Dev A). Xóa khoản chi bằng `anon` được; xóa danh mục bằng `anon` bị từ chối. Ghi vào báo cáo như rủi ro đã biết: ai có khóa publishable đều sửa được dữ liệu | Đạt | [ ] |
| TC-DB-15 | `anon` không xóa được danh mục và ngân sách | `set role anon; delete from categories where name = 'Giải trí'; reset role;` | Báo `permission denied for table categories`, không có dòng nào bị xóa. Nhớ chạy `reset role;` sau cùng | Đạt | [ ] |
| TC-DB-16 | Ngày chi là bắt buộc | `insert into expenses(amount, category_id) select 1000, id from categories where name = 'Ăn uống';` | Lỗi `null value in column spent_on` (không có ngày mặc định) | Đạt | [ ] |
| TC-DB-17 | Xóa danh mục chưa dùng thì ngân sách riêng đi theo | Thêm danh mục 'Tạm' + ngân sách cho nó, rồi xóa danh mục | Ngân sách của danh mục đó cũng bị xóa | Đạt | [ ] |
| TC-DB-18 | Tổng chi theo tháng (Q1) | Chạy Q1 trong `database.md` | 2026-09: 1.615.000 (7 khoản); 2026-10: 2.850.000 (8 khoản) | Đạt | [ ] |
| TC-DB-19 | Tổng chi theo danh mục tháng 10 (Q2) | Chạy Q2 | Ăn uống 920.000 đứng đầu; Di chuyển 100.000 cuối | Đạt | [ ] |
| TC-DB-20 | Danh mục chi nhiều nhất (Q3) | Chạy Q3 | 2026-09: Mua sắm 400.000; 2026-10: Ăn uống 920.000 | Đạt | [ ] |
| TC-DB-21 | So sánh hai tháng (Q4) | Chạy Q4 | 1.235.000 | Đạt | [ ] |
| TC-DB-22 | Ngân sách và mức đã chi (Q5) | Chạy Q5 | Tổng: 3.000.000 / 2.850.000; Ăn uống: 1.000.000 / 920.000 | Đạt | [ ] |
| TC-DB-23 | Vượt ngân sách (Q6) | Thêm khoản chi Ăn uống 200.000 rồi chạy Q5 | Tổng 3.050.000 (vượt); Ăn uống 1.120.000 (vượt) | Đạt | [ ] |

## 2b. Test đơn vị Java đã có (JUnit 5, `ExpenseServiceTest`, PR #27 và #28 của Dev A)
BA đọc mã trên `main` ngày 19/10/2026 và đối chiếu với tiêu chí chấp nhận. Cột kết quả điền sau khi BA chạy `mvn verify`.

| Mã TC | Test trong `ExpenseServiceTest` | Tiêu chí liên quan | Kết quả mong đợi | Kết quả `mvn verify` |
|---|---|---|---|---|
| TC-JAVA-01 | `themKhoanChi_hopLe_duocLuu` | Thêm khoản chi hợp lệ | Khoản chi có mã 1, số tiền 50.000, ghi chú "Ăn trưa" | [điền] |
| TC-JAVA-02 | `tong_chuaCoKhoanChi_bangKhong` | Tổng chi khi chưa có dữ liệu | 0 | [điền] |
| TC-JAVA-03 | `tong_nhieuKhoanChi_congDon` | Tổng chi | 50.000 + 30.000 = 80.000 | [điền] |
| TC-JAVA-04 | `xoaKhoanChi_dangCo_tongGiam` | Xóa khoản chi | Tổng còn 30.000 | [điền] |
| TC-JAVA-05 | `xoaKhoanChi_khongTonTai_nemLoi` | Xóa mã không tồn tại | Ném `NoSuchElementException` | [điền] |

Khoảng trống BA đề xuất Dev A bổ sung test (để đạt coverage và khớp CSDL, vì bảng `expenses` có `check (amount > 0)`): thêm khoản chi với số tiền bằng 0 hoặc âm, ghi chú rỗng, danh mục không tồn tại, ngày rỗng. Hiện `ExpenseService.add` chưa kiểm tra các trường hợp này.

## 3. Test mức ứng dụng (TC-APP)
Sinh từ `05-tieu-chi-chap-nhan.md`: mỗi tiêu chí một test. Số liệu mong đợi lấy từ dữ liệu mẫu.

| Mã TC | Tiêu chí | Điều kiện và thao tác | Kết quả mong đợi | Kết quả thực tế | Đạt / Lỗi | Người test, ngày | PR |
|---|---|---|---|---|---|---|---|
| TC-APP-01 | AC-01.1 | Có danh mục "Ăn uống". Thêm khoản chi ngày 2026-10-09, 50.000, "Ăn uống", ghi chú "Ăn sáng" | Khoản chi được lưu và có trong danh sách |  |  |  |  |
| TC-APP-02 | AC-01.2 | Có danh mục "Ăn uống". Thêm khoản chi không nhập ghi chú | Lưu được, ghi chú để trống |  |  |  |  |
| TC-APP-03 | AC-01.3 | Thêm khoản chi số tiền trống | Báo lỗi, không lưu |  |  |  |  |
| TC-APP-04 | AC-01.4 | Thêm khoản chi số tiền 0 hoặc -1.000 | Báo lỗi, không lưu |  |  |  |  |
| TC-APP-05 | AC-01.5 | Thêm khoản chi chưa chọn danh mục | Báo lỗi, không lưu |  |  |  |  |
| TC-APP-06 | AC-02.1 | Chưa có khoản chi nào. Xem tổng chi | Tổng bằng 0 |  |  |  |  |
| TC-APP-07 | AC-02.2 | Dữ liệu mẫu. Xem tổng chi danh mục "Ăn uống" tháng 2026-10 | 920.000 |  |  |  |  |
| TC-APP-08 | AC-02.3 | Dữ liệu mẫu. Xem tổng chi danh mục chưa có khoản chi nào | 0 |  |  |  |  |
| TC-APP-09 | AC-03.1 | Dữ liệu mẫu. Lọc tháng 2026-10 | Hiển thị 8 khoản chi |  |  |  |  |
| TC-APP-10 | AC-03.2 | Dữ liệu mẫu. Lọc tháng 2026-09 | Hiển thị 7 khoản chi |  |  |  |  |
| TC-APP-11 | AC-03.3 | Dữ liệu mẫu. Lọc tháng 2026-12 | "Chưa có khoản chi", tổng bằng 0 |  |  |  |  |
| TC-APP-12 | AC-04.1 | Có khoản chi 50.000. Đổi số tiền thành 70.000 và lưu | Danh sách hiển thị 70.000 |  |  |  |  |
| TC-APP-13 | AC-04.2 | Có khoản chi 50.000. Đổi số tiền thành 0 và lưu | Báo lỗi, giữ nguyên 50.000 |  |  |  |  |
| TC-APP-14 | AC-05.1 | Có một khoản chi. Xóa và xác nhận | Khoản chi không còn trong danh sách |  |  |  |  |
| TC-APP-15 | AC-05.2 | Có một khoản chi. Xóa rồi chọn Hủy | Khoản chi vẫn còn |  |  |  |  |
| TC-APP-16 | AC-06.1 | Chưa có danh mục "Du lịch". Thêm "Du lịch" | Có trong danh sách danh mục |  |  |  |  |
| TC-APP-17 | AC-06.2 | Đã có "Ăn uống". Thêm "Ăn uống" hoặc "ăn uống" | Báo lỗi, không thêm |  |  |  |  |
| TC-APP-18 | AC-06.3 | Thêm danh mục rỗng hoặc toàn khoảng trắng | Báo lỗi, không thêm |  |  |  |  |
| TC-APP-19 | AC-07.1 | "Ăn uống" đang có khoản chi. Xóa "Ăn uống" | Báo "Danh mục đang được dùng", không xóa |  |  |  |  |
| TC-APP-20 | AC-07.2 | Danh mục chưa có khoản chi. Xóa danh mục | Xóa được; ngân sách riêng của danh mục đó cũng mất |  |  |  |  |
| TC-APP-21 | AC-08.1 | Đặt ngân sách tháng 2026-11 là 5.000.000 | Lưu được |  |  |  |  |
| TC-APP-22 | AC-08.2 | Đặt ngân sách bằng 0 | Lưu được |  |  |  |  |
| TC-APP-23 | AC-08.3 | Đặt ngân sách -1.000 | Báo lỗi, không lưu |  |  |  |  |
| TC-APP-24 | AC-08.4 | Tháng 2026-10 đã có ngân sách tổng. Đặt lại ngân sách tổng tháng 2026-10 | Cập nhật bản cũ, vẫn chỉ một bản |  |  |  |  |
| TC-APP-25 | AC-09.1 | Ngân sách tổng 2026-10 là 3.000.000, đã chi 2.850.000. Xem trạng thái | Chưa vượt (còn 150.000) |  |  |  |  |
| TC-APP-26 | AC-09.2 | Như trên. Thêm khoản chi 200.000 | Tổng chi 3.050.000, hiển thị cảnh báo vượt ngân sách |  |  |  |  |
| TC-APP-27 | AC-09.3 | Ngân sách là 100.000. Tổng chi đúng 100.000 | Chưa cảnh báo |  |  |  |  |
| TC-APP-28 | AC-09.4 | Ngân sách "Ăn uống" 2026-10 là 1.000.000, đã chi 920.000. Thêm khoản chi "Ăn uống" 200.000 | Tổng "Ăn uống" 1.120.000, cảnh báo vượt |  |  |  |  |
| TC-APP-29 | AC-10.1 | Dữ liệu mẫu. Thống kê tháng 2026-10 | 2.850.000 |  |  |  |  |
| TC-APP-30 | AC-10.2 | Dữ liệu mẫu. Thống kê tháng 2026-09 | 1.615.000 |  |  |  |  |
| TC-APP-31 | AC-10.3 | Dữ liệu mẫu. Thống kê tháng 2026-08 hoặc danh sách trống | 0 |  |  |  |  |
| TC-APP-32 | AC-11.1 | Dữ liệu mẫu. Danh mục chi nhiều nhất tháng 2026-10 | "Ăn uống" (920.000, hơn "Mua sắm" 900.000) |  |  |  |  |
| TC-APP-33 | AC-11.2 | Dữ liệu mẫu. Danh mục chi nhiều nhất tháng 2026-09 | "Mua sắm" (400.000) |  |  |  |  |
| TC-APP-34 | AC-11.3 | Không có khoản chi. Danh mục chi nhiều nhất | Không có (rỗng/None) |  |  |  |  |
| TC-APP-35 | AC-12.1 | Dữ liệu mẫu. So sánh 2026-10 với 2026-09 | +1.235.000 |  |  |  |  |
| TC-APP-36 | AC-12.2 | Dữ liệu mẫu. So sánh 2026-09 với 2026-10 | -1.235.000 |  |  |  |  |
| TC-APP-37 | AC-13.1 | Đã thêm một khoản chi trên web. Tải lại trang, hoặc mở bằng thiết bị khác | Khoản chi vẫn còn; thấy dòng đó trong Table Editor của Supabase |  |  |  |  |
| TC-APP-38 | AC-14.1 | Đã merge PR vào `main`. Chờ Vercel build xong | Trang web ở link công khai phản ánh thay đổi mới |  |  |  |  |

## 4. Kết quả kiểm thử Pull Request đã thực hiện
| Ngày | PR / nhánh | Người viết | Cách kiểm tra | Kết quả | Hành động |
|---|---|---|---|---|---|
| 09/10/2026 | PR #9 (đã merge vào `main`), file `test_budget.py` | @khuatdanhthai117-bit | `python3 -m py_compile test_budget.py` | **Lỗi**: `IndentationError: expected an indented block after function definition on line 13 (line 14)`. Hàm `test_calculate_total_by_category` bị thụt vào trong hàm `test_add_duplicate_category` | Tạo Issue `bugfix`, nhờ Dev B sửa thụt lề |
| 09/10/2026 | Nhánh `feature/2-danh-muc` (chưa merge), cùng file | @khuatdanhthai117-bit | `python3 -m py_compile test_budget.py` | **Lỗi** giống trên, nên toàn bộ test mới (thống kê tháng, danh mục chi nhiều nhất, so sánh hai tháng) chưa chạy được | Sửa trước khi mở/duyệt PR |
| 09/10/2026 | `main` | — | Đọc `ci.yml` | CI chỉ chạy `mvn -B verify`; `budget.py` và `test_budget.py` nằm ở thư mục gốc, bằng Python, nên CI không kiểm thử chúng | Ghi vào Issue; Dev A, Dev B chốt ngôn ngữ (xem `cong-nghe-ha-tang.md`, mục 8) |
| 19/10/2026 | `main` sau PR #27, #28 | @yenhoang295 | Đọc mã `Expense`, `ExpenseService`, `ExpenseServiceTest` | Có 5 test JUnit (TC-JAVA-01 đến 05); cột `Expense` khớp bảng `expenses`; `add` chưa kiểm tra số tiền không dương | BA chạy `mvn verify`, ghi kết quả và comment vào PR nếu đạt |
| 19/10/2026 | PR #31 (giao diện web, chờ duyệt) | @yenhoang295 | Đọc `web/app.js`, `supabase/schema.sql` | Web gọi bảng `categories`, `expenses`; thêm, xóa khoản chi; tạo danh mục; lọc theo danh mục và tháng. Chưa có bảng `budgets` và chưa có thống kê so sánh hai tháng | BA mở link Vercel, thử các TC-APP tương ứng, comment "Đã test OK" hoặc ghi lỗi |
| 19/10/2026 | PR #20 `feature/2-danh-muc` (đã Approved, chưa merge) | @khuatdanhthai117-bit | `python3 -m py_compile test_budget.py` ở lần kiểm tra 09/10 | Lỗi thụt lề như trên; sau 11/10 có thêm commit test nâng cao, BA chưa chạy lại | Chạy lại sau khi Dev B sửa |

Ghi chú: BA chưa chạy `pytest` (chưa cài trên máy kiểm tra), chỉ kiểm tra biên dịch cú pháp. Khi sửa xong, chạy lại `pytest` và ghi kết quả vào bảng này.

## 5. Nhật ký lỗi
| Mã | Mô tả | Mức độ | Issue | Trạng thái |
|---|---|---|---|---|
| BUG-01 | `test_budget.py` lỗi thụt lề, không chạy được | Cao | [điền số issue] | Mở |
| BUG-02 | Code `budget` nằm ngoài khung dự án Maven/Java, CI không kiểm thử | Cao | [điền số issue] | Mở |

## 2c. Test Java cho báo cáo gia đình (`FamilyReportServiceTest`, JUnit 5)
BA đọc mã ngày 27/10/2026; chưa chạy `mvn verify`.

| Mã TC | Test | Kết quả mong đợi | Kết quả `mvn verify` |
|---|---|---|---|
| TC-JAVA-06 | `testCalculateTotalFamilyExpense` | Tổng 2.000.000 | [điền] |
| TC-JAVA-07 | `testFindTopSpender` | "Con B" | [điền] |
| TC-JAVA-08 | `testCalculateTotalExpenseWithNullInput` | 0 | [điền] |
| TC-JAVA-09 | `testCalculateTotalExpenseWithEmptyList` | 0 | [điền] |
| TC-JAVA-10 | `testFindTopSpenderWithNullInput` | `null` | [điền] |

Test CSDL cho gia đình (TC-DB-F01 đến F15) nằm ở `database.md` mục 9. Test trang web đăng nhập, gia đình, thu nhập, quản trị: BA thêm hàng vào mục 3 sau khi thử trên Vercel.
