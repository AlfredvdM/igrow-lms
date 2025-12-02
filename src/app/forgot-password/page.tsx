'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail01, ArrowLeft } from '@untitledui/icons';
import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import { createSupabaseBrowserClient } from '@/lib/supabase';

// Allowed email domains for password reset
const ALLOWED_DOMAINS = ['gasmarketing.co.za', 'igrow.co.za'];

const isAllowedEmailDomain = (email: string): boolean => {
  const domain = email.split('@')[1]?.toLowerCase();
  return ALLOWED_DOMAINS.includes(domain);
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email domain
    if (!isAllowedEmailDomain(email)) {
      setError('Access restricted to @gasmarketing.co.za and @igrow.co.za email addresses only.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const supabase = createSupabaseBrowserClient();

      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        setError(error.message);
        return;
      }

      setSuccessMessage('Check your email for a password reset link.');
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
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
          <div className="mb-8 text-center">
            <h1 className="text-display-sm font-semibold text-fg-primary lg:text-display-md">
              Forgot password?
            </h1>
            <p className="mt-3 text-md text-fg-tertiary">
              No worries, we&apos;ll send you reset instructions.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 rounded-lg border border-error-300 bg-error-50 p-4">
              <p className="text-sm text-error-700">{error}</p>
            </div>
          )}

          {/* Success message */}
          {successMessage && (
            <div className="mb-6 rounded-lg border border-success-300 bg-success-50 p-4">
              <p className="text-sm text-success-700">{successMessage}</p>
            </div>
          )}

          {/* Reset Password Form */}
          <form onSubmit={handleResetPassword} className="space-y-5">
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

          {/* Back to sign in */}
          <div className="mt-8 text-center">
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-2 text-sm font-semibold text-fg-tertiary hover:text-fg-secondary"
            >
              <ArrowLeft className="size-4" />
              Back to sign in
            </Link>
          </div>
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
            Track, organize, and convert your real estate leads with our powerful lead management system.
          </p>
        </div>
      </div>
    </div>
  );
}
