/**
 * Supabase Client Configuration (Browser)
 * Using @supabase/ssr for proper cookie-based authentication in Next.js
 */

import { createBrowserClient } from '@supabase/ssr';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export type TypedSupabaseClient = SupabaseClient<Database>;

/**
 * Create a browser client for client components
 * This handles auth state and cookies automatically
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}

/**
 * Legacy browser client for backward compatibility
 * Prefer createSupabaseBrowserClient() for new code
 */
export const supabase: TypedSupabaseClient = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);
