-- 1. Create Posts Table
create table public.posts (
  id uuid default gen_random_uuid() primary key,
  talent_id uuid references public.profiles(id) on delete cascade not null,
  content text,
  image_url text,
  likes_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable RLS
alter table public.posts enable row level security;

-- 3. Create Policies for Posts
-- Everyone can view posts
create policy "Posts are viewable by everyone." 
  on public.posts for select 
  using (true);

-- Only Talents can insert posts (and only for themselves)
create policy "Talents can insert their own posts." 
  on public.posts for insert 
  with check (
    auth.uid() = talent_id 
    and exists (
      select 1 from public.profiles 
      where id = auth.uid() and user_type = 'talent'
    )
  );

-- Talents can delete their own posts
create policy "Talents can delete their own posts." 
  on public.posts for delete 
  using (auth.uid() = talent_id);

-- 4. Create Storage Bucket for Post Images
-- Note: You might need to create the bucket 'posts' manually in the dashboard if this fails,
-- but this policy allows public access to view images.
insert into storage.buckets (id, name, public) 
values ('posts', 'posts', true)
on conflict (id) do nothing;

-- 5. Storage Policies
-- Everyone can view images
create policy "Everyone can view post images" 
  on storage.objects for select 
  using ( bucket_id = 'posts' );

-- Talents can upload images
create policy "Talents can upload post images" 
  on storage.objects for insert 
  with check (
    bucket_id = 'posts' 
    and auth.uid() = owner
  );
