import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkAndAddColumn() {
  console.log('Checking profiles table for is_blocked column...')
  
  // Try to select the column
  const { error } = await supabase
    .from('profiles')
    .select('is_blocked')
    .limit(1)

  if (error && error.code === '42703') { // Column does not exist
    console.log('Column is_blocked does not exist. Please run the following SQL in your Supabase Dashboard SQL Editor:')
    console.log(`
      ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT false;
      
      -- Update notes policy to hide notes from blocked users
      DROP POLICY IF EXISTS "Notes are viewable by everyone" ON public.notes;
      CREATE POLICY "Notes are viewable by everyone" ON public.notes
          FOR SELECT USING (
              EXISTS (
                  SELECT 1 FROM public.profiles 
                  WHERE id = public.notes.uploaded_by AND is_blocked = false
              ) OR uploaded_by IS NULL
          );
    `)
  } else if (error) {
    console.error('Error checking column:', error)
  } else {
    console.log('Column is_blocked already exists.')
  }
}

checkAndAddColumn()
