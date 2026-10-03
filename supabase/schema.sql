-- SIKILAT SKB ASN — Skema Database Fase 2 (setiap statement ditulis dalam satu baris)
begin;
create extension if not exists "pgcrypto";
create table if not exists public.packages (id uuid primary key default gen_random_uuid(), slug text not null unique, title text not null, agency_name text not null, position_title text not null, package_number smallint not null check (package_number between 1 and 3), total_questions smallint not null default 100 check (total_questions > 0), duration_minutes smallint not null default 90 check (duration_minutes > 0), max_score smallint not null default 500 check (max_score > 0), is_active boolean not null default true, created_at timestamptz not null default now());
create table if not exists public.exam_results (id uuid primary key default gen_random_uuid(), package_id uuid not null references public.packages(id) on delete cascade, user_id uuid references auth.users(id) on delete cascade, score smallint not null check (score >= 0), correct_count smallint not null default 0 check (correct_count >= 0), wrong_count smallint not null default 0 check (wrong_count >= 0), unanswered_count smallint not null default 0 check (unanswered_count >= 0), time_spent_seconds integer not null default 0 check (time_spent_seconds >= 0), user_answers jsonb not null default '{}'::jsonb, completed_at timestamptz not null default now());
create index if not exists exam_results_user_package_idx on public.exam_results (user_id, package_id);
create index if not exists exam_results_package_idx on public.exam_results (package_id);
drop view if exists public.package_score_summary;
create view public.package_score_summary with (security_invoker = true) as select p.id as package_id, p.slug, p.title, r.user_id, coalesce(max(r.score), 0)::smallint as highest_score, count(r.id)::integer as attempts_count, max(r.completed_at) as last_completed_at from public.packages p left join public.exam_results r on r.package_id = p.id group by p.id, p.slug, p.title, r.user_id;
alter table public.packages enable row level security;
alter table public.exam_results enable row level security;
drop policy if exists "packages_public_read" on public.packages;
create policy "packages_public_read" on public.packages for select to anon, authenticated using (is_active = true);
drop policy if exists "exam_results_select_own" on public.exam_results;
create policy "exam_results_select_own" on public.exam_results for select to authenticated using (auth.uid() = user_id);
drop policy if exists "exam_results_insert_own" on public.exam_results;
create policy "exam_results_insert_own" on public.exam_results for insert to authenticated with check (auth.uid() = user_id);
-- SEMENTARA (mode dev sebelum Supabase Auth). WAJIB dihapus nanti.
drop policy if exists "exam_results_dev_anon_select" on public.exam_results;
create policy "exam_results_dev_anon_select" on public.exam_results for select to anon using (user_id is null);
drop policy if exists "exam_results_dev_anon_insert" on public.exam_results;
create policy "exam_results_dev_anon_insert" on public.exam_results for insert to anon with check (user_id is null);
insert into public.packages (slug, title, agency_name, position_title, package_number) values ('kejaksaan-ppbb-paket-1', 'Paket 1: SKB Kejaksaan', 'Kejaksaan Republik Indonesia', 'Petugas Pengelola Barang Bukti', 1), ('kejaksaan-ppbb-paket-2', 'Paket 2: SKB Kejaksaan', 'Kejaksaan Republik Indonesia', 'Petugas Pengelola Barang Bukti', 2), ('kemenkes-epid-paket-1', 'Paket 1: SKB Kemenkes', 'Kementerian Kesehatan', 'Epidemiolog Kesehatan Ahli Pertama', 1) on conflict (slug) do nothing;
commit;
