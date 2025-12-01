'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Mail01, Lock01 } from '@untitledui/icons';
import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import { DialogTrigger, ModalOverlay, Modal, Dialog } from '@/components/application/modals/modal';
import { ForgotPasswordModalContent } from '@/components/auth/forgot-password-modal';
import { createSupabaseBrowserClient } from '@/lib/supabase';
import { useAuth } from '@/providers/auth-provider';

// Allowed email domains for sign-in
const ALLOWED_DOMAINS = ['gasmarketing.co.za', 'igrow.co.za'];

const isAllowedEmailDomain = (email: string): boolean => {
  const domain = email.split('@')[1]?.toLowerCase();
  return ALLOWED_DOMAINS.includes(domain);
};

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading } = useAuth();
  const isVerified = searchParams?.get('verified') === 'true';
  const authError = searchParams?.get('error');

  // Redirect if already signed in
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/insights');
    }
  }, [user, authLoading, router]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVerifiedMessage, setShowVerifiedMessage] = useState(isVerified);

  // Handle auth callback errors
  useEffect(() => {
    if (authError === 'auth_callback_error') {
      setError('Authentication failed. Please try again.');
    }
  }, [authError]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email domain
    if (email && !isAllowedEmailDomain(email)) {
      setError('Access restricted to @gasmarketing.co.za and @igrow.co.za email addresses only.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setShowVerifiedMessage(false);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please try again.');
        } else if (error.message.includes('Email not confirmed')) {
          setError('Please verify your email before signing in. Check your inbox for a verification link.');
        } else {
          setError(error.message);
        }
        return;
      }

      // Successful sign-in - router will handle redirect via middleware
      router.push('/insights');
      router.refresh();
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-600 border-t-transparent mx-auto" />
          <p className="mt-4 text-sm font-medium text-fg-primary">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Sign in form */}
      <div className="flex w-full flex-col justify-between px-4 py-8 lg:w-1/2 lg:px-12 xl:px-24">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 lg:justify-start">
          <Image
            src="https://cdn.prod.website-files.com/68f0849e4b2688b01e255a47/690983d52fd448e267770035_IGrow-Rentals%202.png"
            alt="IGrow Rentals"
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
          <span className="text-xl font-semibold text-fg-primary">IGrow Rentals</span>
        </div>

        {/* Form container */}
        <div className="mx-auto w-full max-w-[360px]">
          <div className="mb-8 text-center">
            <h1 className="text-display-sm font-semibold text-fg-primary lg:text-display-md">
              Welcome back
            </h1>
            <p className="mt-3 text-md text-fg-tertiary">
              Sign in to your account to continue.
            </p>
          </div>

          {/* Success message after email verification */}
          {showVerifiedMessage && (
            <div className="mb-6 rounded-lg border border-success-300 bg-success-50 p-4">
              <p className="text-sm text-success-700">Email verified successfully! Please sign in to continue.</p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-6 rounded-lg border border-error-300 bg-error-50 p-4">
              <p className="text-sm text-error-700">{error}</p>
            </div>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleEmailSignIn} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              icon={Mail01}
              value={email}
              onChange={setEmail}
              isRequired
              isDisabled={isLoading}
              size="md"
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              icon={Lock01}
              value={password}
              onChange={setPassword}
              isRequired
              isDisabled={isLoading}
              size="md"
            />

            <div className="flex items-center justify-end">
              <DialogTrigger>
                <button
                  type="button"
                  className="text-sm font-semibold text-fg-brand-primary hover:text-fg-brand-primary_hover"
                >
                  Forgot password?
                </button>
                <ModalOverlay isDismissable>
                  <Modal>
                    <Dialog className="w-full max-w-lg">
                      <ForgotPasswordModalContent />
                    </Dialog>
                  </Modal>
                </ModalOverlay>
              </DialogTrigger>
            </div>

            <Button
              type="submit"
              color="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              isDisabled={isLoading}
            >
              Sign in
            </Button>
          </form>

          {/* Sign up link */}
          <p className="mt-8 text-center text-sm text-fg-tertiary">
            Don&apos;t have an account?{' '}
            <Link
              href="/sign-up"
              className="font-semibold text-fg-brand-primary hover:text-fg-brand-primary_hover"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-fg-quaternary">
          © IGrow 2025
        </div>
      </div>

      {/* Right side - Image */}
      <div className="relative hidden lg:block lg:w-1/2">
        <Image
          src="https://cdn.prod.website-files.com/68f0849e4b2688b01e255a47/691c117619872724aa43510f_DJI_0401-HDR.png"
          alt="IGrow Rentals Property"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Text overlay */}
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <h2 className="text-display-sm font-semibold lg:text-display-md">
            Manage your leads efficiently
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Track, organise, and convert your real estate leads with our powerful lead management system.
          </p>
        </div>
      </div>
    </div>
  );
}
