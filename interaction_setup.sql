-- 0. Add missing columns to existing tables
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;

-- 1. Create saved_notes table
CREATE TABLE IF NOT EXISTS public.saved_notes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    note_id UUID REFERENCES public.notes(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, note_id)
);

-- 2. Create ratings table
CREATE TABLE IF NOT EXISTS public.ratings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    note_id UUID REFERENCES public.notes(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, note_id)
);

-- 3. Function to increment views
CREATE OR REPLACE FUNCTION increment_views(note_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.notes
    SET views = COALESCE(views, 0) + 1
    WHERE id = note_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Function to increment downloads
CREATE OR REPLACE FUNCTION increment_downloads(note_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.notes
    SET downloads = COALESCE(downloads, 0) + 1
    WHERE id = note_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Trigger to update average_rating in notes table
CREATE OR REPLACE FUNCTION update_average_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.notes
    SET average_rating = (
        SELECT ROUND(AVG(rating)::numeric, 1)
        FROM public.ratings
        WHERE note_id = NEW.note_id
    )
    WHERE id = NEW.note_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_rating_changed ON public.ratings;
CREATE TRIGGER on_rating_changed
    AFTER INSERT OR UPDATE ON public.ratings
    FOR EACH ROW EXECUTE FUNCTION update_average_rating();

-- 6. Enable RLS and add policies
ALTER TABLE public.saved_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- Saved Notes Policies
CREATE POLICY "Users can view their own saved notes" ON public.saved_notes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved notes" ON public.saved_notes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved notes" ON public.saved_notes
    FOR DELETE USING (auth.uid() = user_id);

-- Ratings Policies
CREATE POLICY "Ratings are viewable by everyone" ON public.ratings
    FOR SELECT USING (true);

CREATE POLICY "Users can insert/update their own ratings" ON public.ratings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings" ON public.ratings
    FOR UPDATE USING (auth.uid() = user_id);
