-- =========================================================================
-- SIKILAT SKB ASN — Skema Database Fase 2 (Refactored Clean Architecture)
-- =========================================================================
begin;

create extension if not exists "pgcrypto";

-- 1. TABEL MASTER KATALOG PAKET (Katalog bersama semua formasi)
create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  agency_name text not null,
  position_title text not null,
  package_number smallint not null check (package_number between 1 and 3),
  total_questions smallint not null default 100 check (total_questions > 0),
  duration_minutes smallint not null default 90 check (duration_minutes > 0),
  max_score smallint not null default 500 check (max_score > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 2. TABEL KEPEMILIKAN / TRANSAKSI PEMBELIAN PAKET PER USER
create table if not exists public.user_packages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  package_id uuid not null references public.packages(id) on delete cascade,
  purchased_at timestamptz not null default now(),
  expires_at timestamptz not null,
  constraint user_packages_user_package_unique unique (user_id, package_id)
);
create index if not exists user_packages_user_id_idx on public.user_packages (user_id);
create index if not exists user_packages_package_id_idx on public.user_packages (package_id);

-- 3. TABEL HASIL UJIAN & AUTOSAVE REAL-TIME
create table if not exists public.exam_results (
  id uuid primary key default gen_random_uuid(),
  package_id uuid not null references public.packages(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  score smallint not null default 0 check (score >= 0),
  correct_count smallint not null default 0 check (correct_count >= 0),
  wrong_count smallint not null default 0 check (wrong_count >= 0),
  unanswered_count smallint not null default 0 check (unanswered_count >= 0),
  time_spent_seconds integer not null default 0 check (time_spent_seconds >= 0),
  seconds_left integer not null default 5400 check (seconds_left >= 0),
  current_index smallint not null default 0 check (current_index >= 0),
  user_answers jsonb not null default '{}'::jsonb,
  doubtful_answers jsonb not null default '{}'::jsonb,
  is_finished boolean not null default false,
  completed_at timestamptz not null default now()
);

-- Pastikan kolom baru autosave ditambahkan jika tabel exam_results sudah ada
alter table public.exam_results add column if not exists seconds_left integer not null default 5400 check (seconds_left >= 0);
alter table public.exam_results add column if not exists current_index smallint not null default 0 check (current_index >= 0);
alter table public.exam_results add column if not exists doubtful_answers jsonb not null default '{}'::jsonb;
alter table public.exam_results add column if not exists is_finished boolean not null default false;

create index if not exists exam_results_user_package_idx on public.exam_results (user_id, package_id);
create index if not exists exam_results_package_idx on public.exam_results (package_id);
create index if not exists exam_results_active_session_idx on public.exam_results (user_id, package_id, is_finished);

-- 4. VIEW AGREGASI REKAP SKOR PER USER (SECURITY INVOKER)
drop view if exists public.package_score_summary;
create view public.package_score_summary with (security_invoker = true) as 
select 
  up.user_id,
  up.package_id,
  p.slug, 
  p.title, 
  coalesce(max(case when r.is_finished = true or (r.is_finished is null and r.score > 0) then r.score else 0 end), 0)::smallint as highest_score, 
  count(case when r.is_finished = true or (r.is_finished is null and r.score > 0) then r.id else null end)::integer as attempts_count, 
  max(case when r.is_finished = true or (r.is_finished is null and r.score > 0) then r.completed_at else null end) as last_completed_at 
from public.user_packages up
join public.packages p on p.id = up.package_id
left join public.exam_results r on r.package_id = up.package_id and r.user_id = up.user_id
group by up.user_id, up.package_id, p.slug, p.title;

grant select on public.package_score_summary to anon, authenticated;

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
alter table public.packages enable row level security;
alter table public.user_packages enable row level security;
alter table public.exam_results enable row level security;

-- Policies untuk public.packages (Katalog Master)
drop policy if exists "packages_public_read" on public.packages;
create policy "packages_public_read" on public.packages for select to anon, authenticated using (is_active = true);

drop policy if exists "packages_insert_auth" on public.packages;
drop policy if exists "packages_dev_anon_insert" on public.packages;
create policy "packages_insert_auth" on public.packages for insert to anon, authenticated with check (true);

drop policy if exists "packages_update_auth" on public.packages;
drop policy if exists "packages_dev_anon_update" on public.packages;
create policy "packages_update_auth" on public.packages for update to anon, authenticated using (true) with check (true);

-- Policies untuk public.user_packages (Kepemilikan per Akun)
drop policy if exists "user_packages_select_own" on public.user_packages;
create policy "user_packages_select_own" on public.user_packages for select to authenticated using (auth.uid() = user_id);

drop policy if exists "user_packages_insert_own" on public.user_packages;
create policy "user_packages_insert_own" on public.user_packages for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "user_packages_update_own" on public.user_packages;
create policy "user_packages_update_own" on public.user_packages for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Policies untuk public.exam_results (Hasil Ujian & Autosave)
drop policy if exists "exam_results_select_own" on public.exam_results;
create policy "exam_results_select_own" on public.exam_results for select to authenticated using (auth.uid() = user_id);

drop policy if exists "exam_results_insert_own" on public.exam_results;
create policy "exam_results_insert_own" on public.exam_results for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "exam_results_update_own" on public.exam_results;
create policy "exam_results_update_own" on public.exam_results for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 6. PAKSA POSTGREST ME-RELOAD SCHEMA CACHE SECARA INSTAN!
notify pgrst, 'reload schema';

commit;
