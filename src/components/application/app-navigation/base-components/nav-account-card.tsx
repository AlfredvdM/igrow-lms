"use client";

import type { FC, HTMLAttributes } from "react";
import { useCallback, useEffect, useRef } from "react";
import type { Placement } from "@react-types/overlays";
import { ChevronSelectorVertical, LogOut01, User01 } from "@untitledui/icons";
import { useFocusManager } from "react-aria";
import type { DialogProps as AriaDialogProps } from "react-aria-components";
import { Button as AriaButton, Dialog as AriaDialog, DialogTrigger as AriaDialogTrigger, Popover as AriaPopover } from "react-aria-components";
import { useRouter } from "next/navigation";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { useUser, useAuth } from "@/providers/auth-provider";
import { cx } from "@/utils/cx";

const settingsTabs = [
    { id: "profile", label: "Profile" },
    { id: "security", label: "Account & Security" },
];

export const NavAccountMenu = ({
    className,
    ...dialogProps
}: AriaDialogProps & { className?: string }) => {
    const focusManager = useFocusManager();
    const dialogRef = useRef<HTMLDivElement>(null);
    const { signOut } = useAuth();
    const router = useRouter();

    const handleSignOut = () => {
        signOut();
    };

    const handleTabClick = (tabId: string) => {
        router.push(`/settings?tab=${tabId}`);
    };

    const onKeyDown = useCallback(
        (e: KeyboardEvent) => {
            switch (e.key) {
                case "ArrowDown":
                    focusManager?.focusNext({ tabbable: true, wrap: true });
                    break;
                case "ArrowUp":
                    focusManager?.focusPrevious({ tabbable: true, wrap: true });
                    break;
            }
        },
        [focusManager],
    );

    useEffect(() => {
        const element = dialogRef.current;
        if (element) {
            element.addEventListener("keydown", onKeyDown);
        }

        return () => {
            if (element) {
                element.removeEventListener("keydown", onKeyDown);
            }
        };
    }, [onKeyDown]);

    return (
        <AriaDialog
            {...dialogProps}
            ref={dialogRef}
            className={cx("w-66 rounded-xl bg-secondary_alt shadow-lg ring ring-secondary_alt outline-hidden", className)}
        >
            <div className="rounded-xl bg-primary ring-1 ring-secondary">
                <div className="flex flex-col gap-0.5 py-1.5">
                    <div className="px-3 pt-1.5 pb-1 text-xs font-semibold text-tertiary">Settings</div>
                    {settingsTabs.map((tab) => (
                        <NavAccountCardMenuItem
                            key={tab.id}
                            label={tab.label}
                            onClick={() => handleTabClick(tab.id)}
                        />
                    ))}
                </div>
            </div>

            <div className="pt-1 pb-1.5">
                <NavAccountCardMenuItem label="Sign out" icon={LogOut01} shortcut="⌥⇧Q" onClick={handleSignOut} />
            </div>
        </AriaDialog>
    );
};

const NavAccountCardMenuItem = ({
    icon: Icon,
    label,
    shortcut,
    ...buttonProps
}: {
    icon?: FC<{ className?: string }>;
    label: string;
    shortcut?: string;
} & HTMLAttributes<HTMLButtonElement>) => {
    return (
        <button {...buttonProps} className={cx("group/item w-full cursor-pointer px-1.5 focus:outline-hidden", buttonProps.className)}>
            <div
                className={cx(
                    "flex w-full items-center justify-between gap-3 rounded-md p-2 group-hover/item:bg-primary_hover",
                    // Focus styles.
                    "outline-focus-ring group-focus-visible/item:outline-2 group-focus-visible/item:outline-offset-2",
                )}
            >
                <div className="flex gap-2 text-sm font-semibold text-secondary group-hover/item:text-secondary_hover">
                    {Icon && <Icon className="size-5 text-fg-quaternary" />} {label}
                </div>

                {shortcut && (
                    <kbd className="flex rounded px-1 py-px font-body text-xs font-medium text-tertiary ring-1 ring-secondary ring-inset">{shortcut}</kbd>
                )}
            </div>
        </button>
    );
};

export const NavAccountCard = ({
    popoverPlacement,
}: {
    popoverPlacement?: Placement;
}) => {
    const triggerRef = useRef<HTMLDivElement>(null);
    const isDesktop = useBreakpoint("lg");
    const { firstName, lastName, email, isLoaded } = useUser();

    // Build display name from first and last name
    const displayName = [firstName, lastName].filter(Boolean).join(' ') || 'User';

    if (!isLoaded) {
        return (
            <div
                className="relative flex items-center gap-3 rounded-xl p-3 ring-1 ring-secondary ring-inset"
                style={{
                    background: 'linear-gradient(135deg, rgba(243, 244, 246, 0.95) 0%, rgba(249, 250, 251, 0.9) 100%)',
                }}
            >
                <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
                <div className="flex-1">
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                    <div className="mt-1 h-3 w-32 animate-pulse rounded bg-gray-200" />
                </div>
            </div>
        );
    }

    return (
        <div
            ref={triggerRef}
            className="relative flex items-center gap-3 rounded-xl p-3 ring-1 ring-secondary ring-inset transition-all duration-200 hover:shadow-sm"
            style={{
                background: 'linear-gradient(135deg, rgba(243, 244, 246, 0.95) 0%, rgba(249, 250, 251, 0.9) 100%)',
            }}
        >
            {/* Person Icon */}
            <div
                className="flex items-center justify-center rounded-full p-2.5 bg-gray-200"
            >
                <User01 className="size-6 text-gray-600" />
            </div>

            {/* User Info */}
            <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
                <p className="text-xs text-gray-600 truncate">{email}</p>
            </div>

            <div className="absolute top-1.5 right-1.5">
                <AriaDialogTrigger>
                    <AriaButton className="flex cursor-pointer items-center justify-center rounded-md p-1.5 text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:bg-primary_hover hover:text-fg-quaternary_hover focus-visible:outline-2 focus-visible:outline-offset-2 pressed:bg-primary_hover pressed:text-fg-quaternary_hover">
                        <ChevronSelectorVertical className="size-4 shrink-0" />
                    </AriaButton>
                    <AriaPopover
                        placement={popoverPlacement ?? (isDesktop ? "right bottom" : "top right")}
                        triggerRef={triggerRef}
                        offset={8}
                        className={({ isEntering, isExiting }) =>
                            cx(
                                "origin-(--trigger-anchor-point) will-change-transform",
                                isEntering &&
                                    "duration-150 ease-out animate-in fade-in placement-right:slide-in-from-left-0.5 placement-top:slide-in-from-bottom-0.5 placement-bottom:slide-in-from-top-0.5",
                                isExiting &&
                                    "duration-100 ease-in animate-out fade-out placement-right:slide-out-to-left-0.5 placement-top:slide-out-to-bottom-0.5 placement-bottom:slide-out-to-top-0.5",
                            )
                        }
                    >
                        <NavAccountMenu />
                    </AriaPopover>
                </AriaDialogTrigger>
            </div>
        </div>
    );
};
