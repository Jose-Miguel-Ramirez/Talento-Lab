-- Create comments table
create table if not exists public.comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references auth.users(id) not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.comments enable row level security;

-- Policies
-- 1. Everyone can view comments
create policy "Comments are viewable by everyone"
  on public.comments for select
  using ( true );

-- 2. Authenticated users can insert comments
create policy "Authenticated users can create comments"
  on public.comments for insert
  with check ( auth.role() = 'authenticated' );

-- 3. Users can delete their own comments
create policy "Users can delete own comments"
  on public.comments for delete
  using ( auth.uid() = user_id );

-- 4. Post authors can delete any comment on their post (optional but good for moderation)
create policy "Post authors can delete comments on their posts"
  on public.comments for delete
  using ( 
    auth.uid() in (
      select talent_id from public.posts where id = post_id
    )
  );
