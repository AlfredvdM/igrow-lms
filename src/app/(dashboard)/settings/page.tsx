'use client';

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { Tabs, TabList, TabPanel } from "@/components/application/tabs/tabs";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Label } from "@/components/base/input/label";
import { TextArea } from "@/components/base/textarea/textarea";
import { Toggle } from "@/components/base/toggle/toggle";
import { DialogTrigger, ModalOverlay, Modal, Dialog } from "@/components/application/modals/modal";
import { Avatar } from "@/components/base/avatar/avatar";
import { Sun, Moon01, Monitor05, Trash03, Lock01, Mail01, Bell01 } from "@untitledui/icons";

export default function SettingsPage() {
    const { user, isLoaded } = useUser();
    const { theme, setTheme } = useTheme();
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [marketingEmails, setMarketingEmails] = useState(false);

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

            <Tabs>
                <TabList
                    type="button-gray"
                    items={[
                        { id: "profile", label: "Profile" },
                        { id: "appearance", label: "Appearance" },
                        { id: "security", label: "Account & Security" },
                        { id: "notifications", label: "Notifications" },
                    ]}
                />

                {/* Profile Tab */}
                <TabPanel id="profile">
                    <div className="mt-6 max-w-2xl space-y-8">
                        {/* Profile Photo */}
                        <div>
                            <Label>Profile Photo</Label>
                            <div className="mt-3 flex items-center gap-4">
                                <Avatar
                                    size="lg"
                                    src={user?.imageUrl}
                                    alt={user?.fullName || "User"}
                                />
                                <div className="flex gap-3">
                                    <Button size="sm" color="secondary">Change photo</Button>
                                    <Button size="sm" color="secondary">Remove</Button>
                                </div>
                            </div>
                        </div>

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

                {/* Appearance Tab */}
                <TabPanel id="appearance">
                    <div className="mt-6 max-w-2xl space-y-8">
                        <div>
                            <Label>Theme</Label>
                            <p className="mt-1 text-sm text-fg-tertiary">Select your preferred theme for the dashboard.</p>

                            <div className="mt-4 grid gap-4 sm:grid-cols-3">
                                <button
                                    onClick={() => setTheme('light')}
                                    className={`flex flex-col items-center gap-3 rounded-lg border-2 p-6 transition-all hover:border-brand-300 ${
                                        theme === 'light' ? 'border-brand-600 bg-brand-50' : 'border-border-secondary'
                                    }`}
                                >
                                    <Sun className="h-8 w-8 text-fg-quaternary" />
                                    <div className="text-center">
                                        <p className="font-semibold text-fg-primary">Light</p>
                                        <p className="text-xs text-fg-tertiary">Bright and clean</p>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setTheme('dark')}
                                    className={`flex flex-col items-center gap-3 rounded-lg border-2 p-6 transition-all hover:border-brand-300 ${
                                        theme === 'dark' ? 'border-brand-600 bg-brand-50' : 'border-border-secondary'
                                    }`}
                                >
                                    <Moon01 className="h-8 w-8 text-fg-quaternary" />
                                    <div className="text-center">
                                        <p className="font-semibold text-fg-primary">Dark</p>
                                        <p className="text-xs text-fg-tertiary">Easy on the eyes</p>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setTheme('system')}
                                    className={`flex flex-col items-center gap-3 rounded-lg border-2 p-6 transition-all hover:border-brand-300 ${
                                        theme === 'system' ? 'border-brand-600 bg-brand-50' : 'border-border-secondary'
                                    }`}
                                >
                                    <Monitor05 className="h-8 w-8 text-fg-quaternary" />
                                    <div className="text-center">
                                        <p className="font-semibold text-fg-primary">System</p>
                                        <p className="text-xs text-fg-tertiary">Match your OS</p>
                                    </div>
                                </button>
                            </div>

                            <div className="mt-4 rounded-lg border border-border-secondary bg-secondary_subtle p-4">
                                <p className="text-sm text-fg-quaternary">
                                    <span className="font-semibold">Current theme:</span> {theme || 'system'}
                                </p>
                            </div>
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
                                    <Button size="sm" color="secondary" className="mt-4">Change password</Button>
                                </div>
                            </div>
                        </div>

                        {/* Two-Factor Authentication */}
                        <div className="rounded-lg border border-border-secondary p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-success-50">
                                    <Lock01 className="h-5 w-5 text-success-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-fg-primary">Two-Factor Authentication</h3>
                                    <p className="mt-1 text-sm text-fg-tertiary">Add an extra layer of security to your account.</p>
                                    <Button size="sm" color="secondary" className="mt-4">Enable 2FA</Button>
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

                {/* Notifications Tab */}
                <TabPanel id="notifications">
                    <div className="mt-6 max-w-2xl space-y-8">
                        {/* Email Notifications */}
                        <div className="rounded-lg border border-border-secondary p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary_alt">
                                        <Mail01 className="h-5 w-5 text-fg-quaternary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-fg-primary">Email Notifications</h3>
                                        <p className="mt-1 text-sm text-fg-tertiary">Receive email updates about your account activity.</p>
                                    </div>
                                </div>
                                <Toggle
                                    size="md"
                                    isSelected={emailNotifications}
                                    onChange={setEmailNotifications}
                                />
                            </div>
                        </div>

                        {/* Push Notifications */}
                        <div className="rounded-lg border border-border-secondary p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary_alt">
                                        <Bell01 className="h-5 w-5 text-fg-quaternary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-fg-primary">Push Notifications</h3>
                                        <p className="mt-1 text-sm text-fg-tertiary">Receive push notifications for important updates.</p>
                                    </div>
                                </div>
                                <Toggle
                                    size="md"
                                    isSelected={pushNotifications}
                                    onChange={setPushNotifications}
                                />
                            </div>
                        </div>

                        {/* Marketing Emails */}
                        <div className="rounded-lg border border-border-secondary p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary_alt">
                                        <Mail01 className="h-5 w-5 text-fg-quaternary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-fg-primary">Marketing Emails</h3>
                                        <p className="mt-1 text-sm text-fg-tertiary">Receive news, tips, and product updates via email.</p>
                                    </div>
                                </div>
                                <Toggle
                                    size="md"
                                    isSelected={marketingEmails}
                                    onChange={setMarketingEmails}
                                />
                            </div>
                        </div>
                    </div>
                </TabPanel>
            </Tabs>
        </div>
    );
}
