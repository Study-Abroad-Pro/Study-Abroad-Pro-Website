-- Study Abroad Pro — Supabase schema
-- Run in the SQL Editor of a fresh project, then seed the six destinations.
--
-- Design notes:
--   * Content tables are readable by the anon role only when published, but in
--     practice the browser never queries them: pages are statically generated
--     and revalidated on a timer, so reads happen at build time.
--   * `leads` is insert-only for anon and has no select policy at all, so a
--     leaked anon key cannot read the pipeline.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- countries
create table if not exists countries (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  name         text not null,
  code         text not null,                 -- ca | ie | gb | de | au | nz
  tagline      text,
  headline     text,
  blurb        text,
  lat          numeric not null,
  lon          numeric not null,              -- drives the globe rotation order
  study_levels text[] default '{}',
  hero_path    text,                          -- storage key, not a URL
  body         jsonb default '{}'::jsonb,
  sort_order   int default 0,
  is_published boolean default false,
  updated_at   timestamptz default now()
);
create index if not exists countries_slug_idx on countries (slug);
create index if not exists countries_sort_idx on countries (sort_order);

-- ------------------------------------------------------------------ courses
create table if not exists courses (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  name         text not null,
  category     text,
  summary      text,
  body         jsonb default '{}'::jsonb,
  icon         text,
  sort_order   int default 0,
  is_published boolean default false,
  updated_at   timestamptz default now()
);
create index if not exists courses_slug_idx on courses (slug);

create table if not exists country_courses (
  country_id uuid references countries(id) on delete cascade,
  course_id  uuid references courses(id) on delete cascade,
  primary key (country_id, course_id)
);

-- -------------------------------------------------------------------- posts
create table if not exists posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title        text not null,
  excerpt      text,
  category     text,
  cover_path   text,
  body_md      text,
  published_at timestamptz,
  is_published boolean default false
);
create index if not exists posts_published_idx on posts (published_at desc);

-- ------------------------------------------------------------- testimonials
create table if not exists testimonials (
  id           uuid primary key default gen_random_uuid(),
  student_name text not null,
  course       text,
  university   text,
  country_id   uuid references countries(id),
  quote        text not null,
  photo_path   text,
  consent      boolean default false,   -- never render a quote without this
  is_published boolean default false,
  created_at   timestamptz default now()
);

-- -------------------------------------------------------------------- leads
create table if not exists leads (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz default now(),
  form_type         text not null check (form_type in ('quick','eligibility','country','contact')),
  full_name         text not null,
  phone             text not null,
  email             text not null,
  message           text,
  preferred_country text,
  preferred_course  text,
  qualification     text,
  year_completed    int,
  score             text,
  english_test      text,
  budget            text,
  intake            text,
  current_location  text,
  source_path       text,
  utm               jsonb,
  status            text default 'new' check (status in ('new','contacted','qualified','closed'))
);
create index if not exists leads_created_idx on leads (created_at desc);
create index if not exists leads_status_idx on leads (status);

-- ------------------------------------------------------- row level security
alter table countries    enable row level security;
alter table courses      enable row level security;
alter table posts        enable row level security;
alter table testimonials enable row level security;
alter table leads        enable row level security;

drop policy if exists "published countries readable" on countries;
create policy "published countries readable"
  on countries for select to anon using (is_published);

drop policy if exists "published courses readable" on courses;
create policy "published courses readable"
  on courses for select to anon using (is_published);

drop policy if exists "published posts readable" on posts;
create policy "published posts readable"
  on posts for select to anon using (is_published and published_at <= now());

drop policy if exists "consented testimonials readable" on testimonials;
create policy "consented testimonials readable"
  on testimonials for select to anon using (is_published and consent);

drop policy if exists "anon can insert leads" on leads;
create policy "anon can insert leads"
  on leads for insert to anon with check (true);
-- Deliberately no select policy on leads.

-- ------------------------------------------------------------------- seed
insert into countries (slug, name, code, headline, blurb, lat, lon, study_levels, sort_order, is_published)
values
  ('study-in-canada','Canada','ca','Study. Work. Build Your Future.',
   'Post-study work rights, a clear path from college to career, and one of the most welcoming systems for international students.',
   56.1, -100.3, '{Diploma,"Advanced Diploma","Bachelor''s","Master''s","PG Diploma",MBA}', 1, true),
  ('study-in-ireland','Ireland','ie','A Global Destination for Innovation & Careers',
   'Europe''s technology and pharmaceutical hub, with English-taught degrees and a two-year stay-back option for graduates.',
   53.4, -8.2, '{Business,IT,"Artificial Intelligence",Finance,"Pharmaceutical Sciences"}', 2, true),
  ('study-in-uk','United Kingdom','gb','World-Class Education With Global Opportunities',
   'One-year master''s degrees, globally recognised universities, and a graduate route that lets you stay and work after you finish.',
   54.0, -2.0, '{Foundation,"Bachelor''s","Master''s",MBA,"Healthcare Courses"}', 3, true),
  ('study-in-germany','Germany','de','Study in One of Europe''s Leading Education Destinations',
   'Public universities with little or no tuition fee, deep industry links, and engineering programmes taught in English.',
   51.2, 10.5, '{"Bachelor''s","Master''s",Engineering,Automotive,"Data Science"}', 4, true),
  ('study-in-australia','Australia','au','Build Your Future in Australia',
   'Strong demand for nursing, engineering and IT graduates, generous work rights while studying, and a high quality of life.',
   -25.3, 133.8, '{Diploma,"Bachelor''s","Master''s",Nursing,Engineering,IT}', 5, true),
  ('study-in-new-zealand','New Zealand','nz','Learn, Experience & Grow',
   'Smaller class sizes, practical qualifications, and a straightforward post-study work visa for eligible graduates.',
   -41.5, 174.0, '{Diploma,"Bachelor''s","Master''s",Hospitality,Agriculture}', 6, true)
on conflict (slug) do nothing;
