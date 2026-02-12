-- Fix for foreign key relationship error in comments
-- This adds an explicit foreign key constraint to the comments table
-- linking user_id to the profiles table.

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'comments_user_id_fkey_profiles'
    ) THEN
        ALTER TABLE public.comments
        ADD CONSTRAINT comments_user_id_fkey_profiles
        FOREIGN KEY (user_id)
        REFERENCES public.profiles(id);
    END IF;
END $$;
