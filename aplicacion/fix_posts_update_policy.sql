-- Create policy to allow talents to update their own posts
create policy "Talents can update their own posts"
on public.posts for update
using ( auth.uid() = talent_id )
with check ( auth.uid() = talent_id );
