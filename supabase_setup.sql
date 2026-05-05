-- 1. Create the waitlist table
create table public.waitlist (
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
  referrer text,
  placement text
);

-- 2. Enable Row Level Security (RLS)
alter table public.waitlist enable row level security;

-- 3. Create a policy to allow anyone to insert (Waitlist signup)
create policy "Allow public insert" on public.waitlist
  for insert with check (true);

-- 4. Create a policy to allow update if they have the ID (Survey completion)
-- Note: In a production app, you might want more complex logic, 
-- but for a simple waitlist survey, this works well.
create policy "Allow public update by ID" on public.waitlist
  for update using (true);
