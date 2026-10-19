-- schema.sql cho Supabase (PostgreSQL)
-- Cách chạy: Supabase > SQL Editor > New query > dán toàn bộ file này > bấm Run.
-- Chạy lại nhiều lần vẫn an toàn (không mất dữ liệu đã có).
-- Nếu Supabase hiện hộp cảnh báo về lệnh "drop policy", bấm "Run this query".

-- 1) Bảng danh mục
create table if not exists public.categories (
  id   bigint generated always as identity primary key,
  name text not null unique check (length(btrim(name)) > 0)
);

-- 2) Bảng khoản chi
create table if not exists public.expenses (
  id          bigint generated always as identity primary key,
  spent_on    date   not null,
  amount      bigint not null check (amount > 0),
  category_id bigint not null references public.categories(id),
  note        text,
  created_at  timestamptz not null default now()
);

create index if not exists expenses_spent_on_idx on public.expenses (spent_on);
create index if not exists expenses_category_idx on public.expenses (category_id);

-- 3) Quyền truy cập từ trang web (khóa publishable/anon)
-- Bật Row Level Security rồi mở quyền đọc, thêm, xóa cho trang web.
-- Lưu ý: bản demo này cho phép MỌI người có khóa publishable đọc/ghi dữ liệu.
-- Muốn riêng tư theo từng người dùng thì thêm đăng nhập (Supabase Auth) ở bước sau.
alter table public.categories enable row level security;
alter table public.expenses   enable row level security;

drop policy if exists "demo_doc_danh_muc"   on public.categories;
drop policy if exists "demo_them_danh_muc"  on public.categories;
drop policy if exists "demo_doc_khoan_chi"  on public.expenses;
drop policy if exists "demo_them_khoan_chi" on public.expenses;
drop policy if exists "demo_xoa_khoan_chi"  on public.expenses;

create policy "demo_doc_danh_muc"   on public.categories for select to anon, authenticated using (true);
create policy "demo_them_danh_muc"  on public.categories for insert to anon, authenticated with check (true);
create policy "demo_doc_khoan_chi"  on public.expenses   for select to anon, authenticated using (true);
create policy "demo_them_khoan_chi" on public.expenses   for insert to anon, authenticated with check (true);
create policy "demo_xoa_khoan_chi"  on public.expenses   for delete to anon, authenticated using (true);

grant usage on schema public to anon, authenticated;
grant select, insert on public.categories to anon, authenticated;
grant select, insert, delete on public.expenses to anon, authenticated;

-- 4) Dữ liệu mẫu (chỉ nạp khi bảng còn trống)
insert into public.categories (name) values
  ('Ăn uống'), ('Di chuyển'), ('Học tập'), ('Nhà ở và hóa đơn'),
  ('Giải trí'), ('Mua sắm'), ('Sức khỏe')
on conflict (name) do nothing;

insert into public.expenses (spent_on, amount, category_id, note)
select v.d::date, v.a, c.id, v.n
from (values
  ('2026-09-01',   35000, 'Ăn uống',          'Ăn sáng bánh mì và cà phê'),
  ('2026-09-01',  120000, 'Di chuyển',        'Đổ xăng xe máy'),
  ('2026-09-03',   65000, 'Ăn uống',          'Cơm trưa cùng nhóm'),
  ('2026-09-05',  250000, 'Học tập',          'Mua tài liệu và in giáo trình'),
  ('2026-09-07', 1800000, 'Nhà ở và hóa đơn', 'Tiền trọ tháng 9'),
  ('2026-09-08',  320000, 'Nhà ở và hóa đơn', 'Tiền điện, nước tháng 8'),
  ('2026-09-10',  150000, 'Giải trí',         'Xem phim cuối tuần'),
  ('2026-09-12',  480000, 'Mua sắm',          'Mua áo sơ mi'),
  ('2026-09-14',   90000, 'Ăn uống',          'Ăn tối với bạn'),
  ('2026-09-16',  200000, 'Sức khỏe',         'Khám và mua thuốc cảm'),
  ('2026-09-18',  100000, 'Di chuyển',        'Vé xe buýt nhiều lượt'),
  ('2026-09-20',  110000, 'Ăn uống',          'Đi chợ mua thực phẩm trong tuần'),
  ('2026-09-22',   79000, 'Học tập',          'Gia hạn tài khoản học trực tuyến'),
  ('2026-09-25',  175000, 'Giải trí',         'Cà phê và chơi board game'),
  ('2026-09-28',  165000, 'Nhà ở và hóa đơn', 'Tiền internet'),
  ('2026-10-01',   40000, 'Ăn uống',          'Ăn sáng'),
  ('2026-10-01', 1800000, 'Nhà ở và hóa đơn', 'Tiền trọ tháng 10'),
  ('2026-10-02',  130000, 'Di chuyển',        'Đổ xăng xe máy'),
  ('2026-10-02',   70000, 'Ăn uống',          'Cơm trưa'),
  ('2026-10-03',  350000, 'Mua sắm',          'Mua tai nghe cũ'),
  ('2026-10-03',   85000, 'Ăn uống',          'Trà sữa và đồ ăn vặt'),
  ('2026-10-04',  120000, 'Giải trí',         'Vé xem phim'),
  ('2026-10-04',  215000, 'Học tập',          'In báo cáo và đóng quyển')
) as v(d, a, cname, n)
join public.categories c on c.name = v.cname
where not exists (select 1 from public.expenses);
