'use client';

import { useState, useContext } from 'react';
import { useSignIn } from '@clerk/nextjs';
import { OverlayTriggerStateContext } from 'react-aria-components';
import { Mail01 } from '@untitledui/icons';
import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';

export function ForgotPasswordModalContent() {
    const { signIn, isLoaded } = useSignIn();
    const state = useContext(OverlayTriggerStateContext);
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const close = () => {
        if (state?.close) {
            state.close();
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded || !signIn) return;

        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            await signIn.create({
                strategy: 'reset_password_email_code',
                identifier: email,
            });

            setSuccessMessage('Check your email for reset instructions.');

            // Auto-close modal after 3 seconds
            setTimeout(() => {
                close();
                // Reset form state
                setEmail('');
                setSuccessMessage(null);
                setError(null);
            }, 3000);
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

    return (
        <div className="rounded-xl bg-primary p-6 shadow-xl ring-1 ring-secondary ring-inset">
            {/* Modal Header */}
            <div className="mb-4">
                <h2 className="text-lg font-semibold text-fg-primary">Forgot password?</h2>
                <p className="mt-1 text-sm text-fg-tertiary">
                    No worries, we&apos;ll send you reset instructions.
                </p>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="mb-6 rounded-lg border border-success-300 bg-success-50 p-4">
                    <p className="text-sm text-success-700">{successMessage}</p>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-6 rounded-lg border border-error-300 bg-error-50 p-4">
                    <p className="text-sm text-error-700">{error}</p>
                </div>
            )}

            {/* Modal Content */}
            <form onSubmit={handleResetPassword}>
                <div className="mb-4">
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
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end gap-3 border-t border-border-secondary pt-4">
                    <form method="dialog" className="contents">
                        <Button
                            type="submit"
                            size="md"
                            color="secondary"
                            isDisabled={isLoading}
                        >
                            Cancel
                        </Button>
                    </form>
                    <Button
                        type="submit"
                        size="md"
                        color="primary"
                        isLoading={isLoading}
                        isDisabled={!isLoaded || isLoading}
                    >
                        Reset password
                    </Button>
                </div>
            </form>
        </div>
    );
}
