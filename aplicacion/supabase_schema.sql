-- 1. Profiles Table (Main Identity)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  first_name text not null,
  middle_name text,
  last_name text not null,
  second_last_name text,
  phone text,
  user_type text check (user_type in ('talent', 'client')) not null,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);


-- 2. Talent Profiles Table (Specific Details)
create table public.talent_profiles (
  id uuid references public.profiles(id) on delete cascade not null primary key,
  profession text not null,
  experience_years text,
  bio text,
  hourly_rate numeric,
  background_check_url text, -- URL for uploaded image
  verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.talent_profiles enable row level security;

-- Create policies
create policy "Talent profiles are viewable by everyone." on public.talent_profiles for select using (true);
create policy "Talents can insert their own profile." on public.talent_profiles for insert with check (auth.uid() = id);
create policy "Talents can update own profile." on public.talent_profiles for update using (auth.uid() = id);


-- 3. Client Profiles Table (Specific Details)
create table public.client_profiles (
  id uuid references public.profiles(id) on delete cascade not null primary key,
  default_address text,
  preferences jsonb, -- Flexible field for preferences
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.client_profiles enable row level security;

-- Create policies
create policy "Client profiles are viewable by everyone." on public.client_profiles for select using (true);
create policy "Clients can insert their own profile." on public.client_profiles for insert with check (auth.uid() = id);
create policy "Clients can update own profile." on public.client_profiles for update using (auth.uid() = id);

-- 4. Storage Bucket Policy (Ensure 'background-checks' exists)
-- This is usually done via Supabase dashboard, but here is the policy if bucket exists:
-- create policy "Talent can upload background check" on storage.objects for insert with check ( bucket_id = 'background-checks' );
