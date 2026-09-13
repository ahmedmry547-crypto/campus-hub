-- ============================================================
-- Campus Hub — Supabase schema, RLS policies, storage & seed data
-- Run this whole file once in the Supabase SQL editor.
-- ============================================================

-- 1. TABLES ----------------------------------------------------

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  academic_year text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists academic_years (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_ar text,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists subjects (
  id uuid primary key default gen_random_uuid(),
  academic_year_id uuid not null references academic_years(id) on delete cascade,
  name text not null,
  name_ar text,
  description text,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists lectures (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references subjects(id) on delete cascade,
  title text not null,
  file_path text not null,   -- path inside the 'lecture-pdfs' storage bucket
  size_label text,
  created_at timestamptz not null default now()
);

create table if not exists videos (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references subjects(id) on delete cascade,
  title text not null,
  youtube_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references subjects(id) on delete cascade,
  title text not null,
  content text,
  created_at timestamptz not null default now()
);

create table if not exists suggestions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text,
  email text,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists support_requests (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  message text not null,
  created_at timestamptz not null default now()
);

-- 2. ROW LEVEL SECURITY -----------------------------------------

alter table profiles enable row level security;
alter table academic_years enable row level security;
alter table subjects enable row level security;
alter table lectures enable row level security;
alter table videos enable row level security;
alter table notes enable row level security;
alter table suggestions enable row level security;
alter table support_requests enable row level security;

-- Helper: is the current user an admin?
create or replace function is_admin() returns boolean as $$
  select coalesce((select is_admin from profiles where id = auth.uid()), false);
$$ language sql stable security definer;

-- profiles: a user can read/update only their own row; admins can read all
create policy "read own profile" on profiles for select
  using (auth.uid() = id or is_admin());
create policy "insert own profile" on profiles for insert
  with check (auth.uid() = id);
create policy "update own profile" on profiles for update
  using (auth.uid() = id or is_admin());

-- academic_years / subjects / lectures / videos / notes:
-- readable by any signed-in user, writable only by admins
create policy "read years" on academic_years for select using (auth.role() = 'authenticated');
create policy "admin write years" on academic_years for all
  using (is_admin()) with check (is_admin());

create policy "read subjects" on subjects for select using (auth.role() = 'authenticated');
create policy "admin write subjects" on subjects for all
  using (is_admin()) with check (is_admin());

create policy "read lectures" on lectures for select using (auth.role() = 'authenticated');
create policy "admin write lectures" on lectures for all
  using (is_admin()) with check (is_admin());

create policy "read videos" on videos for select using (auth.role() = 'authenticated');
create policy "admin write videos" on videos for all
  using (is_admin()) with check (is_admin());

create policy "read notes" on notes for select using (auth.role() = 'authenticated');
create policy "admin write notes" on notes for all
  using (is_admin()) with check (is_admin());

-- suggestions: any signed-in user can submit; only admins can read
create policy "insert suggestions" on suggestions for insert
  with check (auth.role() = 'authenticated');
create policy "admin read suggestions" on suggestions for select
  using (is_admin());

-- support_requests: anyone (even before profile exists) can submit; only admins can read
create policy "insert support" on support_requests for insert
  with check (true);
create policy "admin read support" on support_requests for select
  using (is_admin());

-- 3. STORAGE BUCKET ----------------------------------------------

insert into storage.buckets (id, name, public)
values ('lecture-pdfs', 'lecture-pdfs', true)
on conflict (id) do nothing;

-- Public read (anyone with the link can view/download the PDF)
create policy "public read pdfs" on storage.objects for select
  using (bucket_id = 'lecture-pdfs');

-- Only admins can upload/replace/delete
create policy "admin upload pdfs" on storage.objects for insert
  with check (bucket_id = 'lecture-pdfs' and is_admin());
create policy "admin update pdfs" on storage.objects for update
  using (bucket_id = 'lecture-pdfs' and is_admin());
create policy "admin delete pdfs" on storage.objects for delete
  using (bucket_id = 'lecture-pdfs' and is_admin());

-- 4. SEED / DUMMY DATA ---------------------------------------------

with y1 as (
  insert into academic_years (name, name_ar, order_index) values ('Year 1', 'السنة الأولى', 1) returning id
), y2 as (
  insert into academic_years (name, name_ar, order_index) values ('Year 2', 'السنة الثانية', 2) returning id
), y3 as (
  insert into academic_years (name, name_ar, order_index) values ('Year 3', 'السنة الثالثة', 3) returning id
)
insert into subjects (academic_year_id, name, name_ar, description, order_index)
select id, 'Calculus I', 'التفاضل والتكامل ١', 'Limits, derivatives and integrals of single-variable functions.', 1 from y1
union all
select id, 'Programming Fundamentals', 'أساسيات البرمجة', 'Variables, control flow, functions and basic data structures.', 2 from y1
union all
select id, 'Data Structures', 'هياكل البيانات', 'Stacks, queues, linked lists, trees and hash tables.', 1 from y2
union all
select id, 'Database Systems', 'نظم قواعد البيانات', 'Relational design, SQL and normalization.', 2 from y2
union all
select id, 'Operating Systems', 'نظم التشغيل', 'Processes, scheduling, memory management and file systems.', 1 from y3;

-- Sample video + note for the first subject found (safe to run once)
insert into videos (subject_id, title, youtube_url)
select id, 'Intro to Limits', 'https://www.youtube.com/watch?v=riXcZT2ICjA' from subjects where name = 'Calculus I' limit 1;

insert into notes (subject_id, title, content)
select id, 'Chapter 1 Summary', 'Key definitions: limit, continuity, derivative as a limit of a difference quotient.' from subjects where name = 'Calculus I' limit 1;

-- ============================================================
-- To make a user an admin after they sign up in the app, run:
--   update profiles set is_admin = true where email = 'admin@example.com';
-- ============================================================
