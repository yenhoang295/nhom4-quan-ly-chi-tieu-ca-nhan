-- family-1-bang.sql  (Ngày 1, Dev A)
-- Thêm tính năng GIA ĐÌNH: hồ sơ người dùng, gia đình, thành viên, thu nhập.
-- Chỉ THÊM bảng, cột và hàm mới. KHÔNG đổi quyền của web hiện tại (index.html, trang-chu.html vẫn chạy).
-- Việc đổi quyền sang "theo từng người dùng" nằm ở file family-2-cutover.sql, chạy sau.
-- Chạy: Supabase > SQL Editor > New query > dán toàn bộ > Run. Chạy lại nhiều lần vẫn an toàn.
-- Nếu hiện hộp cảnh báo về "drop policy"/"destructive", bấm "Run this query".

-- ============ 1) BẢNG ============

-- Hồ sơ người dùng (một dòng cho mỗi tài khoản đăng nhập)
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text not null default '',
  created_at timestamptz not null default now()
);

-- Gia đình (có mã mời để thành viên tham gia)
create table if not exists public.families (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (length(btrim(name)) > 0),
  invite_code text not null unique
              default upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8)),
  created_by  uuid references public.profiles(id) on delete set null,
  created_at  timestamptz not null default now()
);

-- Thành viên gia đình. Mỗi người chỉ thuộc MỘT gia đình (khóa chính là user_id).
-- role = 'admin' là mẹ (người tạo gia đình), 'member' là thành viên.
create table if not exists public.family_members (
  user_id   uuid primary key references public.profiles(id) on delete cascade,
  family_id uuid not null references public.families(id) on delete cascade,
  role      text not null default 'member' check (role in ('admin', 'member')),
  joined_at timestamptz not null default now()
);
create index if not exists family_members_family_idx on public.family_members (family_id);

-- Thu nhập của từng người
create table if not exists public.incomes (
  id          bigint generated always as identity primary key,
  user_id     uuid   not null default auth.uid() references public.profiles(id) on delete cascade,
  received_on date   not null,
  amount      bigint not null check (amount > 0),
  source      text,
  note        text,
  created_at  timestamptz not null default now()
);
create index if not exists incomes_user_date_idx on public.incomes (user_id, received_on);

-- Cột người chi trên bảng expenses (để trống với dữ liệu cũ, không ảnh hưởng web hiện tại)
alter table public.expenses
  add column if not exists user_id uuid references public.profiles(id) on delete set null default auth.uid();
create index if not exists expenses_user_idx on public.expenses (user_id);

-- ============ 2) TỰ TẠO HỒ SƠ KHI CÓ NGƯỜI ĐĂNG KÝ ============

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(nullif(btrim(new.raw_user_meta_data ->> 'full_name'), ''), split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Tạo hồ sơ cho tài khoản đã có sẵn (nếu có)
insert into public.profiles (id, full_name)
select u.id, coalesce(nullif(btrim(u.raw_user_meta_data ->> 'full_name'), ''), split_part(u.email, '@', 1))
from auth.users u
on conflict (id) do nothing;

-- ============ 3) HÀM HỖ TRỢ QUYỀN ============

-- Gia đình của người đang đăng nhập (null nếu chưa có)
create or replace function public.my_family_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select family_id from public.family_members where user_id = auth.uid();
$$;

-- Người đang đăng nhập có phải admin (mẹ) của gia đình chứa người "target" không
create or replace function public.is_family_admin_of(target uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.family_members me
    join public.family_members t on t.family_id = me.family_id
    where me.user_id = auth.uid()
      and me.role = 'admin'
      and t.user_id = target
  );
$$;

-- ============ 4) HÀM TẠO VÀ THAM GIA GIA ĐÌNH (gọi từ trang web) ============

-- Mẹ tạo gia đình, trở thành admin, nhận mã mời
create or replace function public.create_family(p_name text)
returns public.families
language plpgsql
security definer
set search_path = public
as $$
declare
  v_family public.families;
begin
  if auth.uid() is null then
    raise exception 'Cần đăng nhập';
  end if;
  if btrim(coalesce(p_name, '')) = '' then
    raise exception 'Tên gia đình không được để trống';
  end if;
  if exists (select 1 from public.family_members where user_id = auth.uid()) then
    raise exception 'Bạn đã thuộc một gia đình';
  end if;

  insert into public.families (name, created_by)
  values (btrim(p_name), auth.uid())
  returning * into v_family;

  insert into public.family_members (user_id, family_id, role)
  values (auth.uid(), v_family.id, 'admin');

  return v_family;
end;
$$;

-- Thành viên nhập mã mời để tham gia
create or replace function public.join_family(p_code text)
returns public.families
language plpgsql
security definer
set search_path = public
as $$
declare
  v_family public.families;
begin
  if auth.uid() is null then
    raise exception 'Cần đăng nhập';
  end if;
  if exists (select 1 from public.family_members where user_id = auth.uid()) then
    raise exception 'Bạn đã thuộc một gia đình';
  end if;

  select * into v_family from public.families where invite_code = upper(btrim(coalesce(p_code, '')));
  if not found then
    raise exception 'Mã mời không đúng';
  end if;

  insert into public.family_members (user_id, family_id, role)
  values (auth.uid(), v_family.id, 'member');

  return v_family;
end;
$$;

-- Chỉ người đã đăng nhập mới được gọi các hàm này
revoke execute on function public.create_family(text) from public, anon;
revoke execute on function public.join_family(text)   from public, anon;
grant  execute on function public.create_family(text) to authenticated;
grant  execute on function public.join_family(text)   to authenticated;
grant  execute on function public.my_family_id()      to authenticated;
grant  execute on function public.is_family_admin_of(uuid) to authenticated;

-- ============ 5) QUYỀN TRUY CẬP (RLS) CHO CÁC BẢNG MỚI ============

alter table public.profiles       enable row level security;
alter table public.families       enable row level security;
alter table public.family_members enable row level security;
alter table public.incomes        enable row level security;

drop policy if exists "profiles_xem"          on public.profiles;
drop policy if exists "profiles_sua_minh"     on public.profiles;
drop policy if exists "families_xem"          on public.families;
drop policy if exists "thanh_vien_xem"        on public.family_members;
drop policy if exists "thu_nhap_xem"          on public.incomes;
drop policy if exists "thu_nhap_them"         on public.incomes;
drop policy if exists "thu_nhap_sua"          on public.incomes;
drop policy if exists "thu_nhap_xoa"          on public.incomes;

-- Mỗi người xem hồ sơ của mình; mẹ (admin) xem hồ sơ thành viên trong gia đình
create policy "profiles_xem" on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_family_admin_of(id));
create policy "profiles_sua_minh" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- Thành viên xem gia đình và danh sách thành viên của chính mình
create policy "families_xem" on public.families for select to authenticated
  using (id = public.my_family_id());
create policy "thanh_vien_xem" on public.family_members for select to authenticated
  using (family_id = public.my_family_id());

-- Thu nhập: mỗi người xem, thêm, sửa, xóa của mình; mẹ chỉ ĐƯỢC XEM của thành viên
create policy "thu_nhap_xem" on public.incomes for select to authenticated
  using (user_id = auth.uid() or public.is_family_admin_of(user_id));
create policy "thu_nhap_them" on public.incomes for insert to authenticated
  with check (user_id = auth.uid());
create policy "thu_nhap_sua" on public.incomes for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "thu_nhap_xoa" on public.incomes for delete to authenticated
  using (user_id = auth.uid());

-- Cấp quyền cho vai trò đăng nhập. Người chưa đăng nhập (anon) KHÔNG có quyền với các bảng mới.
revoke all on public.profiles, public.families, public.family_members, public.incomes from anon;
grant usage on schema public to authenticated;
grant select, update on public.profiles       to authenticated;
grant select         on public.families       to authenticated;
grant select         on public.family_members to authenticated;
grant select, insert, update, delete on public.incomes to authenticated;

-- ============ 6) KIỂM TRA NHANH (chạy riêng sau khi Run xong, không bắt buộc) ============
-- select table_name from information_schema.tables
--   where table_schema = 'public' and table_name in ('profiles','families','family_members','incomes','categories','expenses');
-- select routine_name from information_schema.routines
--   where routine_schema = 'public' and routine_name in ('create_family','join_family','my_family_id','is_family_admin_of');
-- select column_name from information_schema.columns
--   where table_schema = 'public' and table_name = 'expenses' and column_name = 'user_id';
