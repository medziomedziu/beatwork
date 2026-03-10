-- ============================================================
-- Beatflow — Supabase Schema
-- Run this once in the Supabase SQL Editor
-- ============================================================

-- Module progress: completion status + lesson checklist per user
create table if not exists module_progress (
  user_id    text    not null,
  module_id  integer not null,
  status     text    not null default 'locked',
  lessons    jsonb   not null default '[]',
  primary key (user_id, module_id)
);

-- Personal notes per module
create table if not exists notes (
  user_id    text    not null,
  module_id  integer not null,
  content    text    not null default '',
  primary key (user_id, module_id)
);

-- Q&A questions and answers
create table if not exists questions (
  id          bigserial    primary key,
  user_id     text         not null,
  module_id   integer      not null,
  question    text         not null,
  asked_at    timestamptz  not null default now(),
  answer      text,
  answered_at timestamptz
);

-- Disable RLS for this personal single-user app
alter table module_progress disable row level security;
alter table notes           disable row level security;
alter table questions       disable row level security;
