-- =====================================================================
-- db/seed.sql : Dữ liệu mẫu để kiểm thử thủ công (chạy SAU schema.sql)
-- Cách chạy: Supabase > SQL Editor > dán toàn bộ file > Run.
-- Chạy lại nhiều lần vẫn an toàn: danh mục và ngân sách bỏ qua nếu đã có,
-- khoản chi chỉ được thêm khi bảng expense đang trống.
-- Tổng mong đợi (dùng trong docs/ba/test-cases.md):
--   Tháng 2026-09: tổng chi 1.615.000 | danh mục chi nhiều nhất: Mua sắm (400.000)
--   Tháng 2026-10: tổng chi 2.850.000 | danh mục chi nhiều nhất: Ăn uống (920.000)
--   Chênh lệch 2026-10 so với 2026-09: +1.235.000
-- =====================================================================

-- 1. Danh mục -----------------------------------------------------------
insert into public.category (name) values
  ('Ăn uống'), ('Di chuyển'), ('Mua sắm'), ('Giải trí'), ('Học tập'), ('Hóa đơn')
on conflict do nothing;

-- 2. Khoản chi (chỉ thêm khi bảng đang trống) -----------------------------
insert into public.expense (date, amount, category_id, note)
select v.d::date, v.a, c.id, v.n
from (values
  ('2026-09-02',  45000, 'Ăn uống',   'Ăn sáng'),
  ('2026-09-05', 120000, 'Di chuyển', 'Đổ xăng'),
  ('2026-09-09', 250000, 'Ăn uống',   'Ăn tối cùng nhóm bạn'),
  ('2026-09-14', 400000, 'Mua sắm',   'Áo thun'),
  ('2026-09-18', 350000, 'Hóa đơn',   'Tiền điện'),
  ('2026-09-21', 150000, 'Giải trí',  'Xem phim'),
  ('2026-09-27', 300000, 'Học tập',   'Mua sách'),
  ('2026-10-01',  60000, 'Ăn uống',   'Ăn sáng'),
  ('2026-10-02', 100000, 'Di chuyển', 'Đổ xăng'),
  ('2026-10-03', 320000, 'Ăn uống',   'Đi chợ'),
  ('2026-10-04', 280000, 'Hóa đơn',   'Tiền nước và internet'),
  ('2026-10-05', 900000, 'Mua sắm',   'Giày'),
  ('2026-10-06', 540000, 'Ăn uống',   'Ăn tối sinh nhật'),
  ('2026-10-07', 200000, 'Giải trí',  'Cà phê và chơi game'),
  ('2026-10-08', 450000, 'Học tập',   'Khóa học trực tuyến')
) as v(d, a, cat, n)
join public.category c on lower(c.name) = lower(v.cat)
where not exists (select 1 from public.expense);

-- 3. Ngân sách ------------------------------------------------------------
-- Ngân sách tổng của tháng (category_id = NULL)
insert into public.budget (year_month, amount, category_id) values
  ('2026-09', 2500000, null),
  ('2026-10', 3000000, null)
on conflict do nothing;

-- Ngân sách riêng cho danh mục "Ăn uống" tháng 10
insert into public.budget (year_month, amount, category_id)
select '2026-10', 1000000, c.id from public.category c where lower(c.name) = lower('Ăn uống')
on conflict do nothing;
