import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://hajecpzmdbrhwlfesmte.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhamVjcHptZGJyaHdsZmVzbXRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNzQ0MzcsImV4cCI6MjA4ODc1MDQzN30.ibMLBQgx-TVeVIMOednFlnBNH2uvp6Lpn8hjmFGMauw'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export const STUDENT_ID = 'zuzia'
