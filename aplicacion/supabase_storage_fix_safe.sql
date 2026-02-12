-- 1. Policies for 'posts' bucket
-- Drop existing policies if they exist to avoid conflicts (and recreate them)
drop policy if exists "Public Access posts" on storage.objects;
drop policy if exists "Authenticated Upload posts" on storage.objects;
drop policy if exists "User Update posts" on storage.objects;
drop policy if exists "User Delete posts" on storage.objects;

-- Allow public viewing of posts
create policy "Public Access posts"
on storage.objects for select
using ( bucket_id = 'posts' );

-- Allow authenticated users to upload to 'posts' bucket
create policy "Authenticated Upload posts"
on storage.objects for insert
with check (
  bucket_id = 'posts' 
  and auth.role() = 'authenticated'
);

-- Allow users to update their own files
create policy "User Update posts"
on storage.objects for update
using ( bucket_id = 'posts' and auth.uid() = owner )
with check ( bucket_id = 'posts' and auth.uid() = owner );

-- Allow users to delete their own files
create policy "User Delete posts"
on storage.objects for delete
using ( bucket_id = 'posts' and auth.uid() = owner );


-- 2. Policies for 'avatars' bucket
drop policy if exists "Public Access avatars" on storage.objects;
drop policy if exists "Authenticated Upload avatars" on storage.objects;
drop policy if exists "User Update avatars" on storage.objects;
drop policy if exists "User Delete avatars" on storage.objects;

-- Allow public viewing of avatars
create policy "Public Access avatars"
on storage.objects for select
using ( bucket_id = 'avatars' );

-- Allow authenticated users to upload their own avatar
create policy "Authenticated Upload avatars"
on storage.objects for insert
with check (
  bucket_id = 'avatars' 
  and auth.role() = 'authenticated'
);

-- Allow users to update/delete their own avatar
create policy "User Update avatars"
on storage.objects for update
using ( bucket_id = 'avatars' and auth.uid() = owner );

create policy "User Delete avatars"
on storage.objects for delete
using ( bucket_id = 'avatars' and auth.uid() = owner );
