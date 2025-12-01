"use client";

import { ChevronDown } from "@untitledui/icons";
import {
    Button as AriaButton,
    Menu as AriaMenu,
    MenuItem as AriaMenuItem,
    MenuTrigger as AriaMenuTrigger,
    Popover as AriaPopover,
} from "react-aria-components";
import { cx } from "@/utils/cx";

export type Campaign = {
    id: string;
    name: string;
    status: "active" | "inactive";
};

export const campaigns: Campaign[] = [
    {
        id: "the-aura",
        name: "The Aura",
        status: "active",
    },
    {
        id: "the-bolton",
        name: "The Bolton",
        status: "active",
    },
];

interface CampaignSelectorProps {
    selectedCampaignId?: string;
    onCampaignChange?: (campaignId: string) => void;
}

export function CampaignSelector({
    selectedCampaignId = "the-aura",
    onCampaignChange,
}: CampaignSelectorProps) {
    const selectedCampaign = campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];

    return (
        <AriaMenuTrigger>
            <AriaButton
                className={(state) =>
                    cx(
                        "flex w-full items-center justify-between gap-2 rounded-lg border border-border-secondary bg-bg-primary px-3 py-2 text-sm font-semibold text-fg-primary shadow-xs transition-colors",
                        "hover:bg-bg-primary_hover focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2",
                        state.isPressed && "ring-2 ring-brand-500"
                    )
                }
            >
                <div className="flex items-center gap-2">
                    <div
                        className={cx(
                            "size-2 rounded-full",
                            selectedCampaign.status === "active"
                                ? "bg-fg-success-secondary"
                                : "bg-fg-quaternary"
                        )}
                    />
                    <span>{selectedCampaign.name}</span>
                </div>
                <ChevronDown
                    className={cx(
                        "size-4 text-fg-quaternary transition-transform"
                    )}
                />
            </AriaButton>

            <AriaPopover
                placement="bottom"
                offset={8}
                className={(state) =>
                    cx(
                        "w-[--trigger-width] rounded-lg border border-border-secondary bg-bg-primary shadow-lg z-50 overflow-hidden origin-(--trigger-anchor-point) will-change-transform",
                        state.isEntering &&
                            "duration-150 ease-out animate-in fade-in slide-in-from-top-0.5",
                        state.isExiting &&
                            "duration-100 ease-in animate-out fade-out slide-out-to-top-0.5"
                    )
                }
            >
                <AriaMenu
                    onAction={(key) => onCampaignChange?.(key.toString())}
                    className="outline-none"
                >
                    {campaigns.map((campaign) => (
                        <AriaMenuItem
                            key={campaign.id}
                            id={campaign.id}
                            className={(state) =>
                                cx(
                                    "flex w-full items-center justify-between gap-2 px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer outline-none",
                                    "hover:bg-bg-primary_hover",
                                    state.isFocused && "bg-bg-primary_hover",
                                    campaign.id === selectedCampaignId
                                        ? "bg-bg-brand_subtle text-fg-brand-primary"
                                        : "text-fg-primary"
                                )
                            }
                        >
                            <div className="flex items-center gap-2">
                                <div
                                    className={cx(
                                        "size-2 rounded-full",
                                        campaign.status === "active"
                                            ? "bg-fg-success-secondary"
                                            : "bg-fg-quaternary"
                                    )}
                                />
                                <span>{campaign.name}</span>
                            </div>
                            {campaign.status === "inactive" && (
                                <span className="text-xs text-fg-quaternary">Inactive</span>
                            )}
                        </AriaMenuItem>
                    ))}
                </AriaMenu>
            </AriaPopover>
        </AriaMenuTrigger>
    );
}
