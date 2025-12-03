'use client';

import { useState, useEffect, Suspense, useContext } from "react";
import { useSearchParams } from "next/navigation";
import { OverlayTriggerStateContext } from "react-aria-components";

import { Tabs, TabList, TabPanel } from "@/components/application/tabs/tabs";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Label } from "@/components/base/input/label";
import { TextArea } from "@/components/base/textarea/textarea";
import { DialogTrigger, ModalOverlay, Modal, Dialog } from "@/components/application/modals/modal";
import { Trash03, Lock01 } from "@untitledui/icons";
import { useUser, useAuth } from "@/providers/auth-provider";
import { createSupabaseBrowserClient } from "@/lib/supabase";

// Password Change Modal Content Component
function PasswordChangeModalContent({
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    passwordError,
    passwordSuccess,
    isChangingPassword,
    handlePasswordChange,
}: {
    currentPassword: string;
    setCurrentPassword: (value: string) => void;
    newPassword: string;
    setNewPassword: (value: string) => void;
    confirmPassword: string;
    setConfirmPassword: (value: string) => void;
    passwordError: string | null;
    passwordSuccess: boolean;
    isChangingPassword: boolean;
    handlePasswordChange: (close: () => void) => Promise<void>;
}) {
    const state = useContext(OverlayTriggerStateContext);
    const close = () => {
        if (state?.close) {
            state.close();
        }
    };

    return (
        <div className="rounded-xl bg-primary p-6 shadow-xl ring-1 ring-secondary ring-inset">
            {/* Modal Header */}
            <div className="mb-4">
                <h2 className="text-lg font-semibold text-fg-primary">Change Password</h2>
                <p className="mt-1 text-sm text-fg-tertiary">
                    Enter your current password and choose a new password.
                </p>
            </div>

            {/* Success Message */}
            {passwordSuccess && (
                <div className="mb-6 rounded-lg border border-success-300 bg-success-50 p-4">
                    <p className="text-sm text-success-700">Password updated successfully!</p>
                </div>
            )}

            {/* Error Message */}
            {passwordError && (
                <div className="mb-6 rounded-lg border border-error-300 bg-error-50 p-4">
                    <p className="text-sm text-error-700">{passwordError}</p>
                </div>
            )}

            {/* Modal Content */}
            <div className="space-y-4">
                <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                        id="currentPassword"
                        type="password"
                        placeholder="Enter current password"
                        className="mt-2"
                        value={currentPassword}
                        onChange={setCurrentPassword}
                        isDisabled={isChangingPassword}
                    />
                </div>
                <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                        id="newPassword"
                        type="password"
                        placeholder="Enter new password"
                        className="mt-2"
                        value={newPassword}
                        onChange={setNewPassword}
                        isDisabled={isChangingPassword}
                    />
                    <p className="mt-2 text-sm text-fg-quaternary">Must be at least 8 characters.</p>
                </div>
                <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm new password"
                        className="mt-2"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        isDisabled={isChangingPassword}
                    />
                </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-6 flex justify-end gap-3 border-t border-border-secondary pt-4">
                <Button
                    size="md"
                    color="secondary"
                    isDisabled={isChangingPassword}
                    onClick={close}
                >
                    Cancel
                </Button>
                <Button
                    size="md"
                    color="primary"
                    onClick={() => handlePasswordChange(close)}
                    isLoading={isChangingPassword}
                    isDisabled={isChangingPassword}
                >
                    Update password
                </Button>
            </div>
        </div>
    );
}

// Delete Account Modal Content Component
function DeleteAccountModalContent() {
    const state = useContext(OverlayTriggerStateContext);
    const { signOut } = useAuth();
    const [confirmText, setConfirmText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const close = () => {
        if (state?.close) {
            state.close();
        }
    };

    const handleDeleteAccount = async () => {
        // Validate confirmation text
        if (confirmText !== 'DELETE') {
            setDeleteError('Please type "DELETE" to confirm account deletion.');
            return;
        }

        setIsDeleting(true);
        setDeleteError(null);

        try {
            const supabase = createSupabaseBrowserClient();

            // Delete the user's account
            // Note: This requires the user to be authenticated
            // Supabase will handle cascading deletes if configured in the database
            const { error } = await supabase.rpc('delete_user_account');

            if (error) {
                // If RPC doesn't exist, try direct sign out with a note
                if (error.code === 'PGRST202') {
                    // RPC function doesn't exist - sign out user and show message
                    setDeleteError('Account deletion is not yet configured. Please contact support to delete your account.');
                    setIsDeleting(false);
                    return;
                }
                throw error;
            }

            // Sign out and redirect
            await signOut();
        } catch (error) {
            console.error('Delete account error:', error);
            setDeleteError('Failed to delete account. Please contact support.');
            setIsDeleting(false);
        }
    };

    return (
        <div className="rounded-xl bg-primary p-6 shadow-xl ring-1 ring-secondary ring-inset">
            {/* Modal Header */}
            <div className="mb-4">
                <h2 className="text-lg font-semibold text-fg-primary">Delete Account</h2>
                <p className="mt-1 text-sm text-fg-tertiary">
                    Are you absolutely sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.
                </p>
            </div>

            {/* Error Message */}
            {deleteError && (
                <div className="mb-4 rounded-lg border border-error-300 bg-error-50 p-4">
                    <p className="text-sm text-error-700">{deleteError}</p>
                </div>
            )}

            {/* Modal Content */}
            <div className="space-y-4">
                <div className="rounded-lg border border-error-200 bg-error-50 p-4">
                    <p className="text-sm font-semibold text-error-900">Warning: This action is irreversible</p>
                    <ul className="mt-2 space-y-1 text-sm text-error-700">
                        <li>• All your personal data will be deleted</li>
                        <li>• You will lose access to all campaigns</li>
                        <li>• Your team members will be notified</li>
                        <li>• Active subscriptions will be cancelled</li>
                    </ul>
                </div>
                <div>
                    <Label htmlFor="confirmDelete">Type &quot;DELETE&quot; to confirm</Label>
                    <Input
                        id="confirmDelete"
                        placeholder="DELETE"
                        className="mt-2"
                        value={confirmText}
                        onChange={setConfirmText}
                        isDisabled={isDeleting}
                    />
                </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-6 flex justify-end gap-3 border-t border-border-secondary pt-4">
                <Button size="md" color="secondary" onClick={close} isDisabled={isDeleting}>
                    Cancel
                </Button>
                <Button
                    size="md"
                    color="primary"
                    className="!bg-error-600 hover:!bg-error-700"
                    onClick={handleDeleteAccount}
                    isLoading={isDeleting}
                    isDisabled={isDeleting || confirmText !== 'DELETE'}
                >
                    Yes, delete my account
                </Button>
            </div>
        </div>
    );
}

function SettingsContent() {
    const { firstName, lastName, email, isLoaded, user } = useUser();
    const { refreshSession } = useAuth();
    const searchParams = useSearchParams();
    const [selectedTab, setSelectedTab] = useState("profile");
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);

    // Profile form state
    const [profileFirstName, setProfileFirstName] = useState(firstName);
    const [profileLastName, setProfileLastName] = useState(lastName);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [profileSuccess, setProfileSuccess] = useState(false);
    const [profileError, setProfileError] = useState<string | null>(null);

    // Update profile form when user data loads
    useEffect(() => {
        setProfileFirstName(firstName);
        setProfileLastName(lastName);
    }, [firstName, lastName]);

    // Update selected tab from URL parameter
    useEffect(() => {
        const tabParam = searchParams?.get('tab');
        if (tabParam && ['profile', 'security'].includes(tabParam)) {
            setSelectedTab(tabParam);
        }
    }, [searchParams]);

    const handlePasswordChange = async (close: () => void) => {
        setPasswordError(null);
        setPasswordSuccess(false);

        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError('All fields are required.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError('New passwords do not match.');
            return;
        }

        if (newPassword.length < 8) {
            setPasswordError('New password must be at least 8 characters.');
            return;
        }

        setIsChangingPassword(true);

        try {
            const supabase = createSupabaseBrowserClient();

            // First, verify current password by attempting to sign in
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: email,
                password: currentPassword,
            });

            if (signInError) {
                setPasswordError('Current password is incorrect.');
                setIsChangingPassword(false);
                return;
            }

            // Now update to new password
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (updateError) {
                setPasswordError(updateError.message);
                return;
            }

            setPasswordSuccess(true);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

            // Close modal after 2 seconds
            setTimeout(() => {
                close();
                setPasswordSuccess(false);
                setPasswordError(null);
            }, 2000);
        } catch {
            setPasswordError('Failed to update password. Please try again.');
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleSaveProfile = async () => {
        setProfileError(null);
        setProfileSuccess(false);
        setIsSavingProfile(true);

        try {
            const supabase = createSupabaseBrowserClient();

            const { error } = await supabase.auth.updateUser({
                data: {
                    first_name: profileFirstName,
                    last_name: profileLastName,
                },
            });

            if (error) {
                setProfileError(error.message);
                return;
            }

            // Refresh session to get updated user data
            await refreshSession();
            setProfileSuccess(true);

            // Hide success message after 3 seconds
            setTimeout(() => {
                setProfileSuccess(false);
            }, 3000);
        } catch {
            setProfileError('Failed to update profile. Please try again.');
        } finally {
            setIsSavingProfile(false);
        }
    };

    if (!isLoaded) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-600 border-t-transparent mx-auto"></div>
                    <p className="mt-4 text-sm font-medium text-fg-primary">Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col gap-8 px-4 py-8 lg:px-8">
            {/* Page Header */}
            <div className="flex flex-col gap-0.5 lg:gap-1">
                <p className="text-xl font-semibold text-primary lg:text-display-xs">Settings</p>
                <p className="text-md text-tertiary">Manage your account settings and preferences.</p>
            </div>

            <Tabs selectedKey={selectedTab} onSelectionChange={(key) => setSelectedTab(key as string)}>
                <TabList
                    type="button-gray"
                    items={[
                        { id: "profile", label: "Profile" },
                        { id: "security", label: "Account & Security" },
                    ]}
                />

                {/* Profile Tab */}
                <TabPanel id="profile">
                    <div className="mt-6 max-w-2xl space-y-8">
                        {/* Success Message */}
                        {profileSuccess && (
                            <div className="rounded-lg border border-success-300 bg-success-50 p-4">
                                <p className="text-sm text-success-700">Profile updated successfully!</p>
                            </div>
                        )}

                        {/* Error Message */}
                        {profileError && (
                            <div className="rounded-lg border border-error-300 bg-error-50 p-4">
                                <p className="text-sm text-error-700">{profileError}</p>
                            </div>
                        )}

                        {/* Name Fields */}
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    value={profileFirstName}
                                    onChange={setProfileFirstName}
                                    placeholder="Enter your first name"
                                />
                            </div>
                            <div>
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    value={profileLastName}
                                    onChange={setProfileLastName}
                                    placeholder="Enter your last name"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                defaultValue={email}
                                isDisabled
                                className="bg-disabled_subtle"
                            />
                            <p className="mt-2 text-sm text-fg-quaternary">Email address cannot be changed directly. Contact support if needed.</p>
                        </div>

                        {/* Bio */}
                        <div>
                            <Label htmlFor="bio">Bio</Label>
                            <TextArea
                                id="bio"
                                placeholder="Tell us a bit about yourself..."
                                rows={4}
                            />
                            <p className="mt-2 text-sm text-fg-quaternary">Brief description for your profile. Max 500 characters.</p>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end gap-3 border-t border-border-secondary pt-6">
                            <Button
                                size="md"
                                color="secondary"
                                onClick={() => {
                                    setProfileFirstName(firstName);
                                    setProfileLastName(lastName);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="md"
                                color="primary"
                                onClick={handleSaveProfile}
                                isLoading={isSavingProfile}
                                isDisabled={isSavingProfile}
                            >
                                Save changes
                            </Button>
                        </div>
                    </div>
                </TabPanel>

                {/* Security Tab */}
                <TabPanel id="security">
                    <div className="mt-6 max-w-2xl space-y-8">
                        {/* Password Section */}
                        <div className="rounded-lg border border-border-secondary p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary_alt">
                                    <Lock01 className="h-5 w-5 text-fg-quaternary" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-fg-primary">Password</h3>
                                    <p className="mt-1 text-sm text-fg-tertiary">Update your password to keep your account secure.</p>
                                    <DialogTrigger>
                                        <Button
                                            size="sm"
                                            color="secondary"
                                            className="mt-4"
                                        >
                                            Change password
                                        </Button>
                                        <ModalOverlay isDismissable>
                                            <Modal>
                                                <Dialog className="w-full max-w-lg">
                                                    <PasswordChangeModalContent
                                                        currentPassword={currentPassword}
                                                        setCurrentPassword={setCurrentPassword}
                                                        newPassword={newPassword}
                                                        setNewPassword={setNewPassword}
                                                        confirmPassword={confirmPassword}
                                                        setConfirmPassword={setConfirmPassword}
                                                        passwordError={passwordError}
                                                        passwordSuccess={passwordSuccess}
                                                        isChangingPassword={isChangingPassword}
                                                        handlePasswordChange={handlePasswordChange}
                                                    />
                                                </Dialog>
                                            </Modal>
                                        </ModalOverlay>
                                    </DialogTrigger>
                                </div>
                            </div>
                        </div>

                        {/* Delete Account */}
                        <div className="rounded-lg border border-error-200 bg-error-50 p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-error-100">
                                    <Trash03 className="h-5 w-5 text-error-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-error-900">Delete Account</h3>
                                    <p className="mt-1 text-sm text-error-700">Permanently delete your account and all associated data. This action cannot be undone.</p>
                                    <DialogTrigger>
                                        <Button
                                            size="sm"
                                            color="secondary"
                                            className="mt-4 !border-error-300 !text-error-700 hover:!bg-error-100"
                                        >
                                            Delete account
                                        </Button>
                                        <ModalOverlay isDismissable>
                                            <Modal>
                                                <Dialog className="w-full max-w-lg">
                                                    <DeleteAccountModalContent />
                                                </Dialog>
                                            </Modal>
                                        </ModalOverlay>
                                    </DialogTrigger>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabPanel>
            </Tabs>
        </div>
    );
}

export default function SettingsPage() {
    return (
        <Suspense fallback={
            <div className="flex h-full items-center justify-center">
                <div className="text-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-600 border-t-transparent mx-auto"></div>
                    <p className="mt-4 text-sm font-medium text-fg-primary">Loading settings...</p>
                </div>
            </div>
        }>
            <SettingsContent />
        </Suspense>
    );
}
