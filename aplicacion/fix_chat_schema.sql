-- Add media columns if they don't exist
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'messages' and column_name = 'media_url') then
    alter table public.messages add column media_url text;
  end if;

  if not exists (select 1 from information_schema.columns where table_name = 'messages' and column_name = 'media_type') then
    alter table public.messages add column media_type text;
  end if;

  -- Dropping the constraint if it exists to avoid errors when re-adding
  alter table public.messages drop constraint if exists messages_check;
  alter table public.messages add constraint messages_check check (content is not null or media_url is not null);
end $$;

-- Ensure storage bucket exists
insert into storage.buckets (id, name, public)
values ('chat-media', 'chat-media', true)
on conflict (id) do nothing;

-- Ensure policy exists (drop and recreate to be safe)
drop policy if exists "Users can upload chat media" on storage.objects;
create policy "Users can upload chat media"
on storage.objects for insert
with check (
  bucket_id = 'chat-media' and
  auth.role() = 'authenticated'
);

drop policy if exists "Users can view chat media" on storage.objects;
create policy "Users can view chat media"
on storage.objects for select
using ( bucket_id = 'chat-media' );
