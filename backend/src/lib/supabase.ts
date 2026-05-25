import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// We use the service role key for the backend to bypass RLS and perform operations securely
// Make sure to NEVER expose this key to the client.
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
