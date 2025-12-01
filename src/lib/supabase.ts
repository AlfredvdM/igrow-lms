/**
 * Supabase Client Configuration (Browser)
 * Using @supabase/ssr for proper cookie-based authentication in Next.js
 */

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export type TypedSupabaseClient = SupabaseClient<Database>;

// Singleton browser client instance
let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

/**
 * Create a browser client for client components
 * This handles auth state and cookies automatically
 * Uses singleton pattern to avoid multiple GoTrueClient instances
 */
export function createSupabaseBrowserClient() {
  if (!browserClient) {
    browserClient = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
  }
  return browserClient;
}
