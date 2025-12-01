'use client';

import { useState, useEffect } from 'react';
import { useSignUp, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Mail01, Lock01, User01 } from '@untitledui/icons';
import { Button } from '@/components/base/buttons/button';
import { SocialButton } from '@/components/base/buttons/social-button';
import { Input } from '@/components/base/input/input';

export default function SignUpPage() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  // Redirect if already signed in
  useEffect(() => {
    if (isSignedIn) {
      router.push('/insights');
    }
  }, [isSignedIn, router]);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;

    setIsLoading(true);
    setError(null);

    try {
      await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: unknown) {
      const clerkError = err as { errors?: Array<{ message: string; longMessage?: string }> };
      if (clerkError.errors && clerkError.errors.length > 0) {
        setError(clerkError.errors[0].longMessage || clerkError.errors[0].message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.push('/insights');
      } else {
        setError('Verification failed. Please try again.');
      }
    } catch (err: unknown) {
      const clerkError = err as { errors?: Array<{ message: string; longMessage?: string }> };
      if (clerkError.errors && clerkError.errors.length > 0) {
        setError(clerkError.errors[0].longMessage || clerkError.errors[0].message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!isLoaded || !signUp) return;

    setIsGoogleLoading(true);
    setError(null);

    try {
      await signUp.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/insights',
      });
    } catch (err: unknown) {
      const clerkError = err as { errors?: Array<{ message: string; longMessage?: string }> };
      if (clerkError.errors && clerkError.errors.length > 0) {
        setError(clerkError.errors[0].longMessage || clerkError.errors[0].message);
      } else {
        setError('Failed to sign up with Google. Please try again.');
      }
      setIsGoogleLoading(false);
    }
  };

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
          {!pendingVerification ? (
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

              {/* Google Sign Up */}
              <div className="mb-6">
                <SocialButton
                  social="google"
                  theme="gray"
                  size="lg"
                  className="w-full"
                  onClick={handleGoogleSignUp}
                  disabled={isGoogleLoading || !isLoaded}
                >
                  {isGoogleLoading ? 'Signing up...' : 'Sign up with Google'}
                </SocialButton>
              </div>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border-secondary" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-bg-primary px-3 text-fg-quaternary">or</span>
                </div>
              </div>

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

                {/* Clerk CAPTCHA widget for bot protection */}
                <div id="clerk-captcha" />

                <Button
                  type="submit"
                  color="primary"
                  size="lg"
                  className="w-full"
                  isLoading={isLoading}
                  isDisabled={!isLoaded || isLoading}
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
                  Verify your email
                </h1>
                <p className="mt-3 text-md text-fg-tertiary">
                  We sent a verification code to {email}
                </p>
              </div>

              {/* Error message */}
              {error && (
                <div className="mb-6 rounded-lg border border-error-300 bg-error-50 p-4">
                  <p className="text-sm text-error-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleVerification} className="space-y-5">
                <Input
                  label="Verification code"
                  type="text"
                  placeholder="Enter the code"
                  value={code}
                  onChange={setCode}
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
                  isDisabled={!isLoaded || isLoading}
                >
                  Verify email
                </Button>
              </form>
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
            Track, organize, and convert your real estate leads with our powerful lead management system.
          </p>
        </div>
      </div>
    </div>
  );
}
