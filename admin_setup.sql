-- 1. Add missing columns to Notes table
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS summary TEXT;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS keywords TEXT[];
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS downloads INTEGER DEFAULT 0;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS average_rating DECIMAL DEFAULT 0;

-- Ensure uploader column exists (handling potential naming inconsistency)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='notes' AND column_name='uploaded_by') THEN
        ALTER TABLE public.notes ADD COLUMN uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 2. ENABLE RLS and ADD POLICIES for Notes
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Allow public to view notes
DROP POLICY IF EXISTS "Notes are viewable by everyone" ON public.notes;
CREATE POLICY "Notes are viewable by everyone" ON public.notes
    FOR SELECT USING (true);

-- Allow authenticated users to insert their own notes
DROP POLICY IF EXISTS "Users can insert their own notes" ON public.notes;
CREATE POLICY "Users can insert their own notes" ON public.notes
    FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

-- Allow users to update their own notes
DROP POLICY IF EXISTS "Users can update their own notes" ON public.notes;
CREATE POLICY "Users can update their own notes" ON public.notes
    FOR UPDATE USING (auth.uid() = uploaded_by);

-- Allow users to delete their own notes
DROP POLICY IF EXISTS "Users can delete their own notes" ON public.notes;
CREATE POLICY "Users can delete their own notes" ON public.notes
    FOR DELETE USING (auth.uid() = uploaded_by);


-- 3. Ensure Profiles Table has 'role' column
-- This fixes the "column role does not exist" error
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='role') THEN
        ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin'));
    END IF;
END $$;

-- 4. Create Reports Table
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    note_id UUID REFERENCES public.notes(id) ON DELETE CASCADE NOT NULL,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'ignored')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for reports
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Policies for reports
DROP POLICY IF EXISTS "Users can create reports" ON public.reports;
CREATE POLICY "Users can create reports" 
    ON public.reports FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all reports" ON public.reports;
CREATE POLICY "Admins can view all reports" 
    ON public.reports FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 5. Profiles Table Policies (Ensure role based access)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- 6. Trigger to create profile on signup (Updated to handle existing role)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email, role)
    VALUES (
        NEW.id, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Student'), 
        NEW.email, 
        'student'
    )
    ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        email = EXCLUDED.email;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. SET ADMIN CREDENTIALS
-- Use this to make a specific user an admin.
-- Replace 'your-email@example.com' with your actual account email.
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'admin@notesbazi.com'; 

-- Also ensure the admin role is checked in server functions
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
