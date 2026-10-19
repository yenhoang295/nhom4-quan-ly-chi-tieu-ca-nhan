-- =====================================================================
-- db/schema.sql : Lược đồ CSDL PostgreSQL cho ứng dụng Quản lý chi tiêu cá nhân
-- Nền tảng : Supabase (PostgreSQL). Người phụ trách: BA (@lethihuechi16-sen)
-- Đồng bộ với supabase/schema.sql của Dev A (trang web đang dùng các bảng
-- categories, expenses). File này giữ nguyên hai bảng đó và THÊM bảng budgets.
-- Cách chạy: Supabase > SQL Editor > New query > dán toàn bộ file > Run.
-- Chạy lại nhiều lần vẫn an toàn (create ... if not exists), không xóa dữ liệu.
-- Quy ước: tên bảng/cột viết thường, snake_case. Trong mã Java, Expense.date
--          ứng với cột spent_on, Expense.categoryId ứng với cột category_id.
-- =====================================================================

-- 1. Bảng danh mục -----------------------------------------------------
create table if not exists public.categories (
  id   bigint generated always as identity primary key,
  name text not null unique check (length(btrim(name)) > 0)
);

-- Không cho trùng tên danh mục kể cả khác hoa/thường ("Ăn uống" = "ăn uống")
create unique index if not exists categories_name_lower_uq
  on public.categories (lower(btrim(name)));

-- 2. Bảng khoản chi ----------------------------------------------------
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

-- 3. Bảng ngân sách theo tháng (BA thêm, trang web chưa dùng) -----------
-- category_id = NULL     -> ngân sách TỔNG của cả tháng
-- category_id có giá trị -> ngân sách riêng cho một danh mục
create table if not exists public.budgets (
  id          bigint generated always as identity primary key,
  year_month  char(7) not null
              check (year_month ~ '^[0-9]{4}-(0[1-9]|1[0-2])$'),   -- dạng yyyy-MM
  amount      bigint  not null check (amount >= 0),
  category_id bigint  references public.categories(id) on delete cascade
);

create unique index if not exists budgets_month_category_uq
  on public.budgets (year_month, category_id) where category_id is not null;
create unique index if not exists budgets_month_total_uq
  on public.budgets (year_month) where category_id is null;

-- 4. Row Level Security (giống cách Dev A đang dùng) --------------------
-- Bản demo: ai có khóa publishable/anon đều đọc, thêm, xóa được.
-- Muốn riêng tư theo người dùng thì thêm Supabase Auth ở bước sau.
alter table public.categories enable row level security;
alter table public.expenses   enable row level security;
alter table public.budgets    enable row level security;

drop policy if exists "demo_doc_danh_muc"   on public.categories;
drop policy if exists "demo_them_danh_muc"  on public.categories;
drop policy if exists "demo_doc_khoan_chi"  on public.expenses;
drop policy if exists "demo_them_khoan_chi" on public.expenses;
drop policy if exists "demo_xoa_khoan_chi"  on public.expenses;
drop policy if exists "demo_doc_ngan_sach"  on public.budgets;
drop policy if exists "demo_them_ngan_sach" on public.budgets;

create policy "demo_doc_danh_muc"   on public.categories for select to anon, authenticated using (true);
create policy "demo_them_danh_muc"  on public.categories for insert to anon, authenticated with check (true);
create policy "demo_doc_khoan_chi"  on public.expenses   for select to anon, authenticated using (true);
create policy "demo_them_khoan_chi" on public.expenses   for insert to anon, authenticated with check (true);
create policy "demo_xoa_khoan_chi"  on public.expenses   for delete to anon, authenticated using (true);
create policy "demo_doc_ngan_sach"  on public.budgets    for select to anon, authenticated using (true);
create policy "demo_them_ngan_sach" on public.budgets    for insert to anon, authenticated with check (true);

grant usage on schema public to anon, authenticated;
grant select, insert         on public.categories to anon, authenticated;
grant select, insert, delete on public.expenses   to anon, authenticated;
grant select, insert         on public.budgets    to anon, authenticated;
