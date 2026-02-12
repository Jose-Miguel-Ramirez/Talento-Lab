-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name, middle_name, last_name, second_last_name, phone, user_type)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'middle_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'second_last_name',
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'user_type'
  );
  return new;
end;
$$;

-- Trigger to execute the function on new user insert
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
