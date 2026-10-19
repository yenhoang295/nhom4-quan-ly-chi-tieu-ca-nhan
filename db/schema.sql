-- =====================================================================
-- db/schema.sql : Lược đồ CSDL PostgreSQL cho ứng dụng Quản lý chi tiêu cá nhân
-- Nền tảng : Supabase (PostgreSQL). Người phụ trách: BA (@lethihuechi16-sen)
-- Cách chạy: Supabase > SQL Editor > New query > dán toàn bộ file > Run.
-- File chạy lại được nhiều lần (create ... if not exists), không xóa dữ liệu.
-- Muốn làm lại từ đầu: bỏ dấu -- ở khối RESET ở cuối file (XÓA HẾT DỮ LIỆU).
-- Quy ước: tên bảng/cột viết thường, snake_case. Trong mã nguồn Expense.categoryId
--          tương ứng cột category_id.
-- =====================================================================

-- 1. Bảng danh mục -----------------------------------------------------
create table if not exists public.category (
  id   bigint generated always as identity primary key,
  name text not null check (length(btrim(name)) > 0)
);

-- Không cho trùng tên danh mục, không phân biệt hoa/thường ("Ăn uống" = "ăn uống")
create unique index if not exists category_name_lower_uq
  on public.category (lower(btrim(name)));

-- 2. Bảng khoản chi ----------------------------------------------------
-- Các cột id, date, amount, category_id, note khớp lớp Expense của Dev A.
create table if not exists public.expense (
  id          bigint generated always as identity primary key,
  date        date          not null default current_date,
  amount      numeric(18,0) not null check (amount > 0),
  category_id bigint        not null
              references public.category (id) on delete restrict,
  note        text
);

create index if not exists expense_date_idx     on public.expense (date);
create index if not exists expense_category_idx on public.expense (category_id);

-- 3. Bảng ngân sách theo tháng ----------------------------------------
-- category_id = NULL  -> ngân sách TỔNG của cả tháng
-- category_id có giá trị -> ngân sách riêng cho một danh mục
create table if not exists public.budget (
  id          bigint generated always as identity primary key,
  year_month  char(7)       not null
              check (year_month ~ '^[0-9]{4}-(0[1-9]|1[0-2])$'),   -- dạng yyyy-MM
  amount      numeric(18,0) not null check (amount >= 0),
  category_id bigint
              references public.category (id) on delete cascade
);

-- Mỗi (tháng, danh mục) chỉ có một ngân sách; mỗi tháng chỉ có một ngân sách tổng
create unique index if not exists budget_month_category_uq
  on public.budget (year_month, category_id) where category_id is not null;
create unique index if not exists budget_month_total_uq
  on public.budget (year_month) where category_id is null;

-- 4. Bảo mật mức dòng (Row Level Security) -----------------------------
-- Bật RLS để khóa truy cập ẩn danh qua khóa "anon" của Supabase.
-- Chỉ người đã đăng nhập (role authenticated) mới đọc/ghi được.
-- Phía máy chủ dùng khóa service_role thì không bị RLS chặn.
alter table public.category enable row level security;
alter table public.expense  enable row level security;
alter table public.budget   enable row level security;

drop policy if exists category_authenticated_all on public.category;
create policy category_authenticated_all on public.category
  for all to authenticated using (true) with check (true);

drop policy if exists expense_authenticated_all on public.expense;
create policy expense_authenticated_all on public.expense
  for all to authenticated using (true) with check (true);

drop policy if exists budget_authenticated_all on public.budget;
create policy budget_authenticated_all on public.budget
  for all to authenticated using (true) with check (true);

-- ---------------------------------------------------------------------
-- RESET (CHỈ DÙNG KHI MUỐN XÓA SẠCH): bỏ dấu -- ở dòng dưới rồi chạy.
-- drop table if exists public.budget, public.expense, public.category cascade;
-- ---------------------------------------------------------------------
