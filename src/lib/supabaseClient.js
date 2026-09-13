import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // The app still renders with dummy data if these are missing,
  // but any live Supabase call will fail until .env is filled in.
  console.warn(
    'Supabase env vars are missing. Copy .env.example to .env and add your project URL + anon key.'
  )
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

export const PDF_BUCKET = 'lecture-pdfs'
