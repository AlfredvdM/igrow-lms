'use client';

import { useState, useEffect, Suspense } from "react";
import { useUser } from "@clerk/nextjs";
import { useSearchParams, useRouter } from "next/navigation";

import { Tabs, TabList, TabPanel } from "@/components/application/tabs/tabs";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Label } from "@/components/base/input/label";
import { TextArea } from "@/components/base/textarea/textarea";
import { DialogTrigger, ModalOverlay, Modal, Dialog } from "@/components/application/modals/modal";
import { Trash03, Lock01 } from "@untitledui/icons";

function SettingsContent() {
    const { user, isLoaded } = useUser();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState("profile");
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);

    // Update selected tab from URL parameter
    useEffect(() => {
        const tabParam = searchParams?.get('tab');
        if (tabParam && ['profile', 'security'].includes(tabParam)) {
            setSelectedTab(tabParam);
        }
    }, [searchParams]);

    const handlePasswordChange = async () => {
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
            // Update password using Clerk
            await user?.updatePassword({
                currentPassword,
                newPassword,
            });

            setPasswordSuccess(true);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

            // Close modal after 2 seconds
            setTimeout(() => {
                setShowPasswordModal(false);
                setPasswordSuccess(false);
            }, 2000);
        } catch (err: unknown) {
            const clerkError = err as { errors?: Array<{ message: string; longMessage?: string }> };
            if (clerkError.errors && clerkError.errors.length > 0) {
                setPasswordError(clerkError.errors[0].longMessage || clerkError.errors[0].message);
            } else {
                setPasswordError('Failed to update password. Please try again.');
            }
        } finally {
            setIsChangingPassword(false);
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
                        {/* Name Fields */}
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    defaultValue={user?.firstName || ''}
                                    placeholder="Enter your first name"
                                />
                            </div>
                            <div>
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    defaultValue={user?.lastName || ''}
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
                                defaultValue={user?.primaryEmailAddress?.emailAddress || ''}
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
                            <Button size="md" color="secondary">Cancel</Button>
                            <Button size="md" color="primary">Save changes</Button>
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
                                            onClick={() => {
                                                setShowPasswordModal(true);
                                                setPasswordError(null);
                                                setPasswordSuccess(false);
                                                setCurrentPassword('');
                                                setNewPassword('');
                                                setConfirmPassword('');
                                            }}
                                        >
                                            Change password
                                        </Button>
                                        <ModalOverlay>
                                            <Modal>
                                                <Dialog className="w-full max-w-lg">
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
                                                            >
                                                                Cancel
                                                            </Button>
                                                            <Button
                                                                size="md"
                                                                color="primary"
                                                                onClick={handlePasswordChange}
                                                                isLoading={isChangingPassword}
                                                                isDisabled={isChangingPassword}
                                                            >
                                                                Update password
                                                            </Button>
                                                        </div>
                                                    </div>
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
                                        <ModalOverlay>
                                            <Modal>
                                                <Dialog className="w-full max-w-lg">
                                                    <div className="rounded-xl bg-primary p-6 shadow-xl ring-1 ring-secondary ring-inset">
                                                        {/* Modal Header */}
                                                        <div className="mb-4">
                                                            <h2 className="text-lg font-semibold text-fg-primary">Delete Account</h2>
                                                            <p className="mt-1 text-sm text-fg-tertiary">
                                                                Are you absolutely sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.
                                                            </p>
                                                        </div>

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
                                                                <Label htmlFor="confirmDelete">Type "DELETE" to confirm</Label>
                                                                <Input id="confirmDelete" placeholder="DELETE" className="mt-2" />
                                                            </div>
                                                        </div>

                                                        {/* Modal Footer */}
                                                        <div className="mt-6 flex justify-end gap-3 border-t border-border-secondary pt-4">
                                                            <Button size="md" color="secondary">
                                                                Cancel
                                                            </Button>
                                                            <Button size="md" color="primary" className="!bg-error-600 hover:!bg-error-700">
                                                                Yes, delete my account
                                                            </Button>
                                                        </div>
                                                    </div>
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
