"use client";

import { useState } from "react";
import { ChevronDown } from "@untitledui/icons";
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
    const [isOpen, setIsOpen] = useState(false);
    const selectedCampaign = campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];

    const handleSelect = (campaignId: string) => {
        onCampaignChange?.(campaignId);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cx(
                    "flex w-full items-center justify-between gap-2 rounded-lg border border-border-secondary bg-bg-primary px-3 py-2 text-sm font-semibold text-fg-primary shadow-xs transition-colors",
                    "hover:bg-bg-primary_hover focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2",
                    isOpen && "ring-2 ring-brand-500"
                )}
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
                        "size-4 text-fg-quaternary transition-transform",
                        isOpen && "rotate-180"
                    )}
                />
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-[999]"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown menu */}
                    <div className="absolute top-full left-0 z-[1000] mt-2 w-full overflow-hidden rounded-lg border border-border-secondary bg-bg-primary shadow-lg">
                        {campaigns.map((campaign) => (
                            <button
                                key={campaign.id}
                                onClick={() => handleSelect(campaign.id)}
                                className={cx(
                                    "flex w-full items-center justify-between gap-2 px-3 py-2.5 text-sm font-medium transition-colors",
                                    "hover:bg-bg-primary_hover focus:outline-none",
                                    campaign.id === selectedCampaignId
                                        ? "bg-bg-brand_subtle text-fg-brand-primary"
                                        : "text-fg-primary"
                                )}
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
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
