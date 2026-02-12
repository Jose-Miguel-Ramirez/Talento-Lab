-- Create conversations table
create table if not exists public.conversations (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.profiles(id) on delete cascade not null,
  talent_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(client_id, talent_id)
);

-- Component comment: Enable RLS for conversations
alter table public.conversations enable row level security;

-- Component comment: Policies for conversations
drop policy if exists "Users can view their own conversations" on public.conversations;
create policy "Users can view their own conversations"
  on public.conversations for select
  using (auth.uid() = client_id or auth.uid() = talent_id);

drop policy if exists "Users can insert conversations they are part of" on public.conversations;
create policy "Users can insert conversations they are part of"
  on public.conversations for insert
  with check (auth.uid() = client_id or auth.uid() = talent_id);

-- Create messages table
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  content text, -- Can be null if sending only image
  media_url text,
  media_type text, -- 'image', 'video', 'file'
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  check (content is not null or media_url is not null)
);

-- Component comment: Enable RLS for messages
alter table public.messages enable row level security;

-- Storage Bucket Policy
insert into storage.buckets (id, name, public)
values ('chat-media', 'chat-media', true)
on conflict (id) do nothing;

create policy "Users can upload chat media"
on storage.objects for insert
with check (
  bucket_id = 'chat-media' and
  auth.role() = 'authenticated'
);

create policy "Users can view chat media"
on storage.objects for select
using ( bucket_id = 'chat-media' );

-- Component comment: Policies for messages
drop policy if exists "Users can view messages in their conversations" on public.messages;
create policy "Users can view messages in their conversations"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations
      where id = messages.conversation_id
      and (client_id = auth.uid() or talent_id = auth.uid())
    )
  );

drop policy if exists "Users can insert messages in their conversations" on public.messages;
create policy "Users can insert messages in their conversations"
  on public.messages for insert
  with check (
    exists (
      select 1 from public.conversations
      where id = conversation_id
      and (client_id = auth.uid() or talent_id = auth.uid())
    )
    and sender_id = auth.uid()
  );

drop policy if exists "Users can update status of messages in their conversations" on public.messages;
create policy "Users can update status of messages in their conversations"
  on public.messages for update
  using (
    exists (
      select 1 from public.conversations
      where id = messages.conversation_id
      and (client_id = auth.uid() or talent_id = auth.uid())
    )
  );

-- Indexes for better performance
create index if not exists messages_conversation_id_idx on public.messages(conversation_id);
create index if not exists messages_created_at_idx on public.messages(created_at);
create index if not exists conversations_client_id_idx on public.conversations(client_id);
create index if not exists conversations_talent_id_idx on public.conversations(talent_id);

-- Function to get user conversations with last message
drop function if exists public.get_user_conversations(uuid);
create or replace function public.get_user_conversations(current_user_id uuid)
returns table (
  conversation_id uuid,
  other_user_id uuid,
  other_user_name text,
  other_user_avatar text,
  last_message_content text,
  last_message_time timestamp with time zone,
  unread_count bigint
)
language plpgsql
security definer
as $$
begin
  return query
  select
    c.id as conversation_id,
    case
      when c.client_id = current_user_id then c.talent_id
      else c.client_id
    end as other_user_id,
    (p.first_name || ' ' || p.last_name) as other_user_name,
    p.avatar_url as other_user_avatar,
    m.content as last_message_content,
    m.created_at as last_message_time,
    (
      select count(*)
      from public.messages m2
      where m2.conversation_id = c.id
      and m2.sender_id != current_user_id
      and m2.is_read = false
    ) as unread_count
  from public.conversations c
  join public.profiles p on p.id = (
    case
      when c.client_id = current_user_id then c.talent_id
      else c.client_id
    end
  )
  left join lateral (
    select msg.content, msg.created_at
    from public.messages msg
    where msg.conversation_id = c.id
    order by msg.created_at desc
    limit 1
  ) m on true
  where c.client_id = current_user_id or c.talent_id = current_user_id
  order by m.created_at desc nulls last;
end;
$$;
