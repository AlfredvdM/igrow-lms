'use client';

import { useState, useEffect } from 'react';
import { useSignIn, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Mail01, Lock01 } from '@untitledui/icons';
import { Button } from '@/components/base/buttons/button';
import { SocialButton } from '@/components/base/buttons/social-button';
import { Input } from '@/components/base/input/input';
import { DialogTrigger, ModalOverlay, Modal, Dialog } from '@/components/application/modals/modal';
import { ForgotPasswordModalContent } from '@/components/auth/forgot-password-modal';

// Allowed email domains for sign-in
const ALLOWED_DOMAINS = ['gasmarketing.co.za', 'igrow.co.za'];

const isAllowedEmailDomain = (email: string): boolean => {
  const domain = email.split('@')[1]?.toLowerCase();
  return ALLOWED_DOMAINS.includes(domain);
};

export default function SignInPage() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  // Redirect if already signed in
  useEffect(() => {
    if (isSignedIn) {
      router.push('/insights');
    }
  }, [isSignedIn, router]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signIn) return;

    // Validate email domain (optional for sign-in, mainly for better UX)
    if (email && !isAllowedEmailDomain(email)) {
      setError('Access restricted to @gasmarketing.co.za and @igrow.co.za email addresses only.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.push('/insights');
      } else {
        setError('Sign in failed. Please try again.');
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

  const handleGoogleSignIn = async () => {
    if (!isLoaded || !signIn) return;

    setIsGoogleLoading(true);
    setError(null);

    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/insights',
      });
    } catch (err: unknown) {
      const clerkError = err as { errors?: Array<{ message: string; longMessage?: string }> };
      if (clerkError.errors && clerkError.errors.length > 0) {
        const errorMessage = clerkError.errors[0].longMessage || clerkError.errors[0].message;

        // Check for domain restriction errors from Clerk
        if (errorMessage.toLowerCase().includes('not allowed') || errorMessage.toLowerCase().includes('allowlist')) {
          setError('Access restricted to @gasmarketing.co.za and @igrow.co.za email addresses only.');
        } else {
          setError(errorMessage);
        }
      } else {
        setError('Failed to sign in with Google. Please try again.');
      }
      setIsGoogleLoading(false);
    }
  };

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

          {/* Error message */}
          {error && (
            <div className="mb-6 rounded-lg border border-error-300 bg-error-50 p-4">
              <p className="text-sm text-error-700">{error}</p>
            </div>
          )}

          {/* Google Sign In */}
          <div className="mb-6">
            <SocialButton
              social="google"
              theme="gray"
              size="lg"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || !isLoaded}
            >
              {isGoogleLoading ? 'Signing in...' : 'Sign in with Google'}
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
              isDisabled={!isLoaded || isLoading}
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
