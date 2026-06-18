import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uqqacwycnfnaxyhbjyrg.supabase.co'
const supabaseKey = 'sb_publishable_C7ABHbXqfBFd-9rpojjTtg_2GLBcayZ'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)