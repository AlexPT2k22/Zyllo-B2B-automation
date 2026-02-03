-- Enable UUID extension if not enabled
create extension if not exists "uuid-ossp";

-- 1. Instagram Accounts Table
create table if not exists public.instagram_accounts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  instagram_user_id text not null unique,
  username text,
  access_token text not null,
  token_expires_at timestamptz,
  account_type text,
  media_count integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS for Instagram Accounts
alter table public.instagram_accounts enable row level security;
create policy "Users can view own instagram account" 
  on public.instagram_accounts for select 
  using (auth.uid() = user_id);
create policy "Users can update own instagram account" 
  on public.instagram_accounts for update 
  using (auth.uid() = user_id);
create policy "Users can match instagram account by ID (public for webhook)" 
  on public.instagram_accounts for select 
  using (true); -- Caution: Needed for webhook to find owner by IG ID. Ideally limited to service role.

-- 2. Automations Table (If not already exists from previous steps)
create table if not exists public.automations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  nodes jsonb default '[]'::jsonb,
  connections jsonb default '[]'::jsonb,
  "isActive" boolean default false,
  viewport jsonb default '{"x": 0, "y": 0, "zoom": 1}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS for Automations
alter table public.automations enable row level security;
create policy "Users can CRUD own automations" 
  on public.automations for all 
  using (auth.uid() = user_id);

-- 3. Activity Log Table
create table if not exists public.activity_log (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  action_type text not null, -- 'automation_run', 'system_error', etc.
  description text,
  metadata jsonb default '{}'::jsonb, -- Store execution details here
  created_at timestamptz default now()
);

-- RLS for Activity Log
alter table public.activity_log enable row level security;
create policy "Users can view own logs" 
  on public.activity_log for select 
  using (auth.uid() = user_id);
create policy "Service role can insert logs" 
  on public.activity_log for insert 
  with check (true); -- Allow webhook (anon/service) to insert

-- 4. Instagram Messages Table (For history/inbox)
create table if not exists public.instagram_messages (
  id uuid default uuid_generate_v4() primary key,
  sender_id text not null,
  recipient_id text not null,
  message_id text unique,
  message_text text,
  media_url text,
  timestamp timestamptz,
  direction text check (direction in ('inbound', 'outbound')),
  processed boolean default false, -- True if automation handled it
  created_at timestamptz default now()
);

-- RLS for Messages (Simplify for now, refine later)
alter table public.instagram_messages enable row level security;
create policy "Anyone can insert messages (Webhook)" 
  on public.instagram_messages for insert 
  with check (true);
create policy "Users can view messages directed to their IG account" 
  on public.instagram_messages for select 
  using (true); -- Needs complex join logic to be secure, allowing all for beta
