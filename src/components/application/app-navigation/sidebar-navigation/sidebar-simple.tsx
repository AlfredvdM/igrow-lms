"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { cx } from "@/utils/cx";
import { MobileNavigationHeader } from "../base-components/mobile-header";
import { NavAccountCard } from "../base-components/nav-account-card";
import { NavListBrand } from "../base-components/nav-list-brand";
import type { NavItemType } from "../config";

interface SidebarNavigationProps {
    /** URL of the currently active item. */
    activeUrl?: string;
    /** List of items to display. */
    items: NavItemType[];
    /** List of footer items to display. */
    footerItems?: NavItemType[];
    /** Feature card to display. */
    featureCard?: ReactNode;
    /** Whether to show the account card. */
    showAccountCard?: boolean;
    /** Whether to hide the right side border. */
    hideBorder?: boolean;
    /** Additional CSS classes to apply to the sidebar. */
    className?: string;
    /** Currently selected campaign name to display. */
    selectedCampaignName?: string;
}

export const SidebarNavigationSimple = ({
    activeUrl,
    items,
    footerItems = [],
    featureCard,
    showAccountCard = true,
    hideBorder = false,
    className,
    selectedCampaignName,
}: SidebarNavigationProps) => {
    const MAIN_SIDEBAR_WIDTH = 296;

    const content = (
        <aside
            style={
                {
                    "--width": `${MAIN_SIDEBAR_WIDTH}px`,
                    background: "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 100%)",
                    backdropFilter: "blur(12px)",
                    boxShadow: 'inset -1px 0 0 0 rgba(182, 54, 75, 0.05)',
                } as React.CSSProperties
            }
            className={cx(
                "flex h-full w-full max-w-full flex-col justify-between overflow-auto pt-4 lg:w-(--width) lg:pt-6",
                !hideBorder && "border-r border-white/20",
                className,
            )}
        >
            <div className="flex flex-col gap-5 px-4 lg:px-5">
                <div className="flex items-center gap-3">
                    <Image
                        src="https://cdn.prod.website-files.com/68f0849e4b2688b01e255a47/690983d52fd448e267770035_IGrow-Rentals%202.png"
                        alt="IGrow Rentals"
                        width={32}
                        height={32}
                        className="h-8 w-8 object-contain"
                        priority
                    />
                    <span className="text-lg font-semibold text-fg-primary">IGrow Rentals</span>
                </div>
                {selectedCampaignName && (
                    <p className="text-sm text-fg-tertiary">
                        You are now viewing <span className="font-semibold text-fg-primary">{selectedCampaignName}</span>.
                    </p>
                )}
            </div>

            <NavListBrand activeUrl={activeUrl} items={items} />

            <div className="mt-auto flex flex-col gap-4 px-2 py-4 lg:px-4 lg:py-6">
                {footerItems.length > 0 && (
                    <NavListBrand activeUrl={activeUrl} items={footerItems} isFooter />
                )}

                {featureCard}

                {showAccountCard && <NavAccountCard />}
            </div>
        </aside>
    );

    return (
        <>
            {/* Mobile header navigation */}
            <MobileNavigationHeader>{content}</MobileNavigationHeader>

            {/* Desktop sidebar navigation */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex">{content}</div>

            {/* Placeholder to take up physical space because the real sidebar has `fixed` position. */}
            <div
                style={{
                    paddingLeft: MAIN_SIDEBAR_WIDTH,
                }}
                className="invisible hidden lg:sticky lg:top-0 lg:bottom-0 lg:left-0 lg:block"
            />
        </>
    );
};
