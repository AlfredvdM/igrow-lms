'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Mail01, Lock01, User01 } from '@untitledui/icons';
import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import { createSupabaseBrowserClient } from '@/lib/supabase';
import { useAuth } from '@/providers/auth-provider';

// Allowed email domains for sign-up
const ALLOWED_DOMAINS = ['gasmarketing.co.za', 'igrow.co.za'];

const isAllowedEmailDomain = (email: string): boolean => {
  const domain = email.split('@')[1]?.toLowerCase();
  return ALLOWED_DOMAINS.includes(domain);
};

export default function SignUpPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  // Redirect if already signed in
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/insights');
    }
  }, [user, authLoading, router]);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email domain
    if (!isAllowedEmailDomain(email)) {
      setError('Access restricted to @gasmarketing.co.za and @igrow.co.za email addresses only.');
      return;
    }

    // Validate password
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const supabase = createSupabaseBrowserClient();

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/insights`,
        },
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          setError('An account with this email already exists. Please sign in instead.');
        } else {
          setError(error.message);
        }
        return;
      }

      // Check if user already exists - Supabase returns user data but with
      // identities as empty array when user already exists (for security)
      if (data?.user?.identities?.length === 0) {
        setError('An account with this email already exists. Please sign in instead.');
        return;
      }

      // Show success message - Supabase sends verification email automatically
      setSuccess(true);
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
      {/* Left side - Sign up form */}
      <div className="flex w-full flex-col justify-between px-4 py-8 lg:w-1/2 lg:px-12 xl:px-24">
        {/* Logo */}
        <div className="flex items-center gap-2">
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
          {!success ? (
            <>
              <div className="mb-8 text-center">
                <h1 className="text-display-sm font-semibold text-fg-primary lg:text-display-md">
                  Create an account
                </h1>
                <p className="mt-3 text-md text-fg-tertiary">
                  Start managing your leads today.
                </p>
              </div>

              {/* Error message */}
              {error && (
                <div className="mb-6 rounded-lg border border-error-300 bg-error-50 p-4">
                  <p className="text-sm text-error-700">{error}</p>
                </div>
              )}

              {/* Email/Password Form */}
              <form onSubmit={handleEmailSignUp} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First name"
                    type="text"
                    placeholder="First name"
                    icon={User01}
                    value={firstName}
                    onChange={setFirstName}
                    isRequired
                    isDisabled={isLoading}
                    size="md"
                  />

                  <Input
                    label="Last name"
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={setLastName}
                    isDisabled={isLoading}
                    size="md"
                  />
                </div>

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
                  placeholder="Create a password"
                  icon={Lock01}
                  value={password}
                  onChange={setPassword}
                  isRequired
                  isDisabled={isLoading}
                  size="md"
                  hint="Must be at least 8 characters."
                />

                <Button
                  type="submit"
                  color="primary"
                  size="lg"
                  className="w-full"
                  isLoading={isLoading}
                  isDisabled={isLoading}
                >
                  Get started
                </Button>
              </form>

              {/* Sign in link */}
              <p className="mt-8 text-center text-sm text-fg-tertiary">
                Already have an account?{' '}
                <Link
                  href="/sign-in"
                  className="font-semibold text-fg-brand-primary hover:text-fg-brand-primary_hover"
                >
                  Sign in
                </Link>
              </p>
            </>
          ) : (
            <>
              <div className="mb-8 text-center">
                <h1 className="text-display-sm font-semibold text-fg-primary lg:text-display-md">
                  Check your email
                </h1>
                <p className="mt-3 text-md text-fg-tertiary">
                  We sent a verification link to <strong>{email}</strong>
                </p>
              </div>

              <div className="mb-6 rounded-lg border border-success-300 bg-success-50 p-4">
                <p className="text-sm text-success-700">
                  Please check your email and click the verification link to complete your registration.
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-center text-sm text-fg-tertiary">
                  Didn&apos;t receive the email? Check your spam folder or{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setSuccess(false);
                      setError(null);
                    }}
                    className="font-semibold text-fg-brand-primary hover:text-fg-brand-primary_hover"
                  >
                    try again
                  </button>
                </p>

                <Link
                  href="/sign-in"
                  className="block text-center text-sm font-semibold text-fg-brand-primary hover:text-fg-brand-primary_hover"
                >
                  Back to sign in
                </Link>
              </div>
            </>
          )}
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
