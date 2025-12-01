'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Lock01 } from '@untitledui/icons';
import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import { createSupabaseBrowserClient } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Check if we have a valid session from the reset link
  useEffect(() => {
    const checkSession = async () => {
      const supabase = createSupabaseBrowserClient();
      const { data: { session } } = await supabase.auth.getSession();

      // If no session and no hash params, redirect to sign-in
      if (!session && !window.location.hash) {
        router.push('/sign-in');
      }
    };

    checkSession();
  }, [router]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Validate password length
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const supabase = createSupabaseBrowserClient();

      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(true);

      // Redirect to sign-in after 3 seconds
      setTimeout(() => {
        router.push('/sign-in');
      }, 3000);
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Reset password form */}
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
                  Reset your password
                </h1>
                <p className="mt-3 text-md text-fg-tertiary">
                  Enter your new password below.
                </p>
              </div>

              {/* Error message */}
              {error && (
                <div className="mb-6 rounded-lg border border-error-300 bg-error-50 p-4">
                  <p className="text-sm text-error-700">{error}</p>
                </div>
              )}

              {/* Password Form */}
              <form onSubmit={handleResetPassword} className="space-y-5">
                <Input
                  label="New password"
                  type="password"
                  placeholder="Enter new password"
                  icon={Lock01}
                  value={password}
                  onChange={setPassword}
                  isRequired
                  isDisabled={isLoading}
                  size="md"
                  hint="Must be at least 8 characters."
                />

                <Input
                  label="Confirm password"
                  type="password"
                  placeholder="Confirm new password"
                  icon={Lock01}
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  isRequired
                  isDisabled={isLoading}
                  size="md"
                />

                <Button
                  type="submit"
                  color="primary"
                  size="lg"
                  className="w-full"
                  isLoading={isLoading}
                  isDisabled={isLoading}
                >
                  Reset password
                </Button>
              </form>

              {/* Back to sign in link */}
              <p className="mt-8 text-center text-sm text-fg-tertiary">
                Remember your password?{' '}
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
                  Password reset successful
                </h1>
                <p className="mt-3 text-md text-fg-tertiary">
                  Your password has been updated.
                </p>
              </div>

              <div className="mb-6 rounded-lg border border-success-300 bg-success-50 p-4">
                <p className="text-sm text-success-700">
                  You will be redirected to the sign-in page shortly.
                </p>
              </div>

              <Link
                href="/sign-in"
                className="block text-center text-sm font-semibold text-fg-brand-primary hover:text-fg-brand-primary_hover"
              >
                Go to sign in
              </Link>
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
