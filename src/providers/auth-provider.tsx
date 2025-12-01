'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createSupabaseBrowserClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signOut: async () => {},
  refreshSession: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const refreshSession = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
    setUser(session?.user ?? null);
  }, [supabase]);

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);

        // Handle specific auth events
        if (event === 'SIGNED_OUT') {
          router.push('/sign-in');
        } else if (event === 'TOKEN_REFRESHED') {
          // Only refresh on token refresh, not on SIGNED_IN
          // Let sign-in page control its own redirect to avoid race conditions
          router.refresh();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/sign-in');
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signOut, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Hook to get the current user with their metadata
 * Similar to Clerk's useUser hook
 */
export const useUser = () => {
  const { user, isLoading } = useAuth();

  return {
    user,
    isLoaded: !isLoading,
    isSignedIn: !!user,
    // Helper to get user metadata
    firstName: user?.user_metadata?.first_name || user?.user_metadata?.firstName || '',
    lastName: user?.user_metadata?.last_name || user?.user_metadata?.lastName || '',
    email: user?.email || '',
    imageUrl: user?.user_metadata?.avatar_url || null,
  };
};
