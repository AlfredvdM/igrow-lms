"use client";

import type { FC, HTMLAttributes, MouseEventHandler, ReactNode } from "react";
import { ChevronDown, Share04 } from "@untitledui/icons";
import { Link as AriaLink } from "react-aria-components";
import { Badge } from "@/components/base/badges/badges";
import { cx } from "@/utils/cx";
import { useMobileMenu } from "./mobile-menu-context";

interface NavItemBrandProps {
    /** Whether the nav item shows only an icon. */
    iconOnly?: boolean;
    /** Whether the collapsible nav item is open. */
    open?: boolean;
    /** URL to navigate to when the nav item is clicked. */
    href?: string;
    /** Type of the nav item. */
    type: "link" | "collapsible" | "collapsible-child";
    /** Icon component to display. */
    icon?: FC<HTMLAttributes<HTMLOrSVGElement>>;
    /** Badge to display. */
    badge?: ReactNode;
    /** Whether the nav item is currently active. */
    current?: boolean;
    /** Whether to truncate the label text. */
    truncate?: boolean;
    /** Handler for click events. */
    onClick?: MouseEventHandler;
    /** Content to display. */
    children?: ReactNode;
}

export const NavItemBrand = ({ current, type, badge, href, icon: Icon, children, truncate = true, onClick }: NavItemBrandProps) => {
    const mobileMenu = useMobileMenu();

    const handleLinkClick: MouseEventHandler = (e) => {
        onClick?.(e);
        mobileMenu?.close();
    };

    const iconElement = Icon && (
        <Icon
            aria-hidden="true"
            className={cx(
                "mr-2 size-5 shrink-0 transition-inherit-all",
                current ? "text-white" : "text-fg-quaternary"
            )}
        />
    );

    const badgeElement =
        badge && (typeof badge === "string" || typeof badge === "number") ? (
            <Badge className="ml-3" color={current ? "brand" : "gray"} type="pill-color" size="sm">
                {badge}
            </Badge>
        ) : (
            badge
        );

    const labelElement = (
        <span
            className={cx(
                "flex-1 text-md font-semibold transition-inherit-all",
                truncate && "truncate",
                current
                    ? "text-white"
                    : "text-secondary group-hover:text-secondary_hover",
            )}
        >
            {children}
        </span>
    );

    const isExternal = href && href.startsWith("http");
    const externalIcon = isExternal && (
        <Share04 className={cx("size-4 stroke-[2.5px]", current ? "text-white/70" : "text-fg-quaternary")} />
    );

    // Base styles for all nav items
    const baseStyles = cx(
        "group relative flex w-full cursor-pointer items-center rounded-lg outline-focus-ring transition duration-150 ease-out select-none focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2"
    );

    // Selected state with maroon gradient
    const selectedStyles = "text-white shadow-sm";

    // Hover state for non-selected items
    const hoverStyles = "hover:bg-brand-50";

    if (type === "collapsible") {
        return (
            <summary
                className={cx(
                    "px-3 py-2.5",
                    baseStyles,
                    current ? selectedStyles : hoverStyles
                )}
                style={current ? { background: "linear-gradient(135deg, #b6364b 0%, #a63346 50%, #79273a 100%)" } : undefined}
                onClick={onClick}
            >
                {iconElement}
                {labelElement}
                {badgeElement}
                <ChevronDown
                    aria-hidden="true"
                    className={cx(
                        "ml-3 size-4 shrink-0 stroke-[2.5px] in-open:-scale-y-100",
                        current ? "text-white/70" : "text-fg-quaternary"
                    )}
                />
            </summary>
        );
    }

    if (type === "collapsible-child") {
        return (
            <AriaLink
                href={href!}
                target={isExternal ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className={cx(
                    "py-2.5 pr-3 pl-10",
                    baseStyles,
                    current ? selectedStyles : hoverStyles
                )}
                style={current ? { background: "linear-gradient(135deg, #b6364b 0%, #a63346 50%, #79273a 100%)" } : undefined}
                onClick={handleLinkClick}
                aria-current={current ? "page" : undefined}
            >
                {labelElement}
                {externalIcon}
                {badgeElement}
            </AriaLink>
        );
    }

    return (
        <AriaLink
            href={href!}
            target={isExternal ? "_blank" : "_self"}
            rel="noopener noreferrer"
            className={cx(
                "px-3 py-2.5",
                baseStyles,
                current ? selectedStyles : hoverStyles
            )}
            style={current ? { background: "linear-gradient(135deg, #b6364b 0%, #a63346 50%, #79273a 100%)" } : undefined}
            onClick={handleLinkClick}
            aria-current={current ? "page" : undefined}
        >
            {iconElement}
            {labelElement}
            {externalIcon}
            {badgeElement}
        </AriaLink>
    );
};
