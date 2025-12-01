'use client';

import { useEffect } from 'react';
import { useSignIn, useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function SSOCallback() {
  const { signIn, setActive: setSignInActive } = useSignIn();
  const { signUp, setActive: setSignUpActive } = useSignUp();
  const router = useRouter();

  useEffect(() => {
    async function handleCallback() {
      if (!signIn || !signUp) return;

      // Check the sign-in attempt
      const signInAttempt = signIn;
      const signUpAttempt = signUp;

      try {
        // Try to complete sign-in first
        if (signInAttempt.status === 'complete') {
          await setSignInActive({ session: signInAttempt.createdSessionId });
          router.push('/insights');
          return;
        }

        // If sign-in needs second factor, handle it
        if (signInAttempt.status === 'needs_first_factor' || signInAttempt.status === 'needs_second_factor') {
          // Redirect to sign-in to complete the process
          router.push('/sign-in');
          return;
        }

        // Check if this is a new sign-up via OAuth
        if (signUpAttempt.status === 'complete') {
          await setSignUpActive({ session: signUpAttempt.createdSessionId });
          router.push('/insights');
          return;
        }

        // If we get here, something unexpected happened
        router.push('/sign-in');
      } catch (error) {
        console.error('SSO callback error:', error);
        router.push('/sign-in');
      }
    }

    handleCallback();
  }, [signIn, signUp, setSignInActive, setSignUpActive, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-600 border-t-transparent mx-auto" />
        <p className="mt-4 text-sm font-medium text-fg-primary">Completing sign in...</p>
      </div>
    </div>
  );
}
