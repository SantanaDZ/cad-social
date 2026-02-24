-- SQL Script to update specific emails to fictitious ones

-- Update andresantanamartins01@gmail.com to adm@email.com
UPDATE auth.users
SET email = 'adm@email.com',
    raw_user_meta_data = jsonb_set(
        coalesce(raw_user_meta_data, '{}'::jsonb),
        '{email}',
        '"adm@email.com"'::jsonb
    )
WHERE email = 'andresantanamartins01@gmail.com';

UPDATE public.profiles
SET email = 'adm@email.com'
WHERE email = 'andresantanamartins01@gmail.com';

-- Update andresantmartins@hotmail.com to user@email.com
UPDATE auth.users
SET email = 'user@email.com',
    raw_user_meta_data = jsonb_set(
        coalesce(raw_user_meta_data, '{}'::jsonb),
        '{email}',
        '"user@email.com"'::jsonb
    )
WHERE email = 'andresantmartins@hotmail.com';

UPDATE public.profiles
SET email = 'user@email.com'
WHERE email = 'andresantmartins@hotmail.com';
