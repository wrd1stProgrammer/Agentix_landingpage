-- Run this before sending paid traffic.
-- The app writes through /api/waitlist with SUPABASE_SERVICE_ROLE_KEY.
-- Keep RLS enabled and do not expose public SELECT/UPDATE policies for this table.

create table if not exists public.waitlist (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  email text unique not null,
  survey_completed boolean default false,
  assets text,
  agents text[],
  trading_styles text[],
  info_gap text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  fbclid text,
  referrer text,
  landing_path text,
  placement text,
  privacy_consent boolean not null default false,
  marketing_consent boolean not null default false,
  consent_version text,
  consented_at timestamp with time zone,
  user_agent text,
  survey_token_hash text
);

alter table public.waitlist add column if not exists survey_completed boolean default false;
alter table public.waitlist add column if not exists assets text;
alter table public.waitlist add column if not exists agents text[];
alter table public.waitlist add column if not exists trading_styles text[];
alter table public.waitlist add column if not exists info_gap text;
alter table public.waitlist add column if not exists utm_source text;
alter table public.waitlist add column if not exists utm_medium text;
alter table public.waitlist add column if not exists utm_campaign text;
alter table public.waitlist add column if not exists utm_content text;
alter table public.waitlist add column if not exists utm_term text;
alter table public.waitlist add column if not exists fbclid text;
alter table public.waitlist add column if not exists referrer text;
alter table public.waitlist add column if not exists landing_path text;
alter table public.waitlist add column if not exists placement text;
alter table public.waitlist add column if not exists privacy_consent boolean not null default false;
alter table public.waitlist add column if not exists marketing_consent boolean not null default false;
alter table public.waitlist add column if not exists consent_version text;
alter table public.waitlist add column if not exists consented_at timestamp with time zone;
alter table public.waitlist add column if not exists user_agent text;
alter table public.waitlist add column if not exists survey_token_hash text;

alter table public.waitlist enable row level security;

drop policy if exists "Allow public insert" on public.waitlist;
drop policy if exists "Allow public update by ID" on public.waitlist;

create index if not exists waitlist_created_at_idx on public.waitlist (created_at desc);
create index if not exists waitlist_utm_campaign_idx on public.waitlist (utm_campaign);
create index if not exists waitlist_survey_token_hash_idx on public.waitlist (survey_token_hash)
  where survey_token_hash is not null;
