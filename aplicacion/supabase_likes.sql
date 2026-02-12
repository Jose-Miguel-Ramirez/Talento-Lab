-- Function to increment likes
create or replace function increment_likes(post_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update public.posts
  set likes_count = likes_count + 1
  where id = post_id;
end;
$$;

-- Function to decrement likes
create or replace function decrement_likes(post_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update public.posts
  set likes_count = greatest(0, likes_count - 1)
  where id = post_id;
end;
$$;
