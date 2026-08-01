import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://slerkkqdtyzucmzbfcbi.supabase.co';
const supabaseKey = 'sb_publishable_6wjdNRQQJKMKjjWYb-am7g_fD_-vkIL';

export const supabase = createClient(supabaseUrl, supabaseKey);
