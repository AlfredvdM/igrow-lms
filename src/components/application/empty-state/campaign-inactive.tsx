import { AlertCircle } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { CampaignSelector } from "@/components/application/campaign-selector/campaign-selector";
import { useCampaign } from "@/providers/campaign-provider";

interface CampaignInactiveProps {
    campaignName: string;
    pageName: string;
}

export function CampaignInactive({ campaignName, pageName }: CampaignInactiveProps) {
    const { selectedCampaignId, setSelectedCampaignId } = useCampaign();

    return (
        <div className="flex h-full w-full flex-col gap-8 px-4 py-8 lg:px-8">
            {/* Campaign Selector at top right */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex flex-col gap-0.5 lg:gap-1">
                    <p className="text-xl font-semibold text-primary lg:text-display-xs">{pageName}</p>
                    <p className="text-md text-tertiary">Campaign data will appear when the campaign is activated.</p>
                </div>
                <div className="w-full shrink-0 lg:w-64">
                    <CampaignSelector
                        selectedCampaignId={selectedCampaignId}
                        onCampaignChange={setSelectedCampaignId}
                    />
                </div>
            </div>

            {/* Inactive State Content */}
            <div className="flex flex-1 items-center justify-center">
                <div className="flex max-w-md flex-col items-center text-center">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-warning-100">
                        <AlertCircle className="h-8 w-8 text-warning-600" />
                    </div>

                    <h2 className="mb-2 text-display-sm font-semibold text-fg-primary">
                        Campaign Not Activated
                    </h2>

                    <p className="mb-8 text-md text-fg-tertiary">
                        The <span className="font-semibold">{campaignName}</span> campaign has not been activated yet.
                        Please contact your administrator to enable this campaign and start tracking {pageName.toLowerCase()} data.
                    </p>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Button size="lg" color="primary">
                            Request Activation
                        </Button>
                        <Button size="lg" color="secondary">
                            Contact Support
                        </Button>
                    </div>

                    <div className="mt-8 rounded-lg border border-border-secondary bg-secondary_subtle p-4">
                        <p className="text-sm text-fg-quaternary">
                            <span className="font-semibold text-fg-tertiary">Note:</span> Once activated, you'll be able to view:
                        </p>
                        <ul className="mt-2 space-y-1 text-left text-sm text-fg-quaternary">
                            <li>• Real-time campaign metrics and analytics</li>
                            <li>• Lead generation and conversion data</li>
                            <li>• Form submissions and user interactions</li>
                            <li>• AI conversation insights and performance</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
