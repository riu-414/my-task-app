import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Profile = {
  id: string
  username: string
}

export type Task = {
  id: string
  title: string
  is_completed: boolean
  user_id: string
  created_at: string
}

export type TaskWithProfile = Task & {
  profiles: { username: string } | null
}
