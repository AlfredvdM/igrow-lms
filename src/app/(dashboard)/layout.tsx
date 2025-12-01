'use client';

/**
 * Dashboard Layout
 * Main layout for authenticated dashboard pages with sidebar navigation
 */

import { ReactNode } from 'react';
import { SidebarNavigationSimple } from "@/components/application/app-navigation/sidebar-navigation/sidebar-simple";
import { CampaignProvider, useCampaign } from "@/providers/campaign-provider";
import { campaigns } from "@/components/application/campaign-selector/campaign-selector";
import {
    Users01,
    BarChartSquare02,
} from "@untitledui/icons";

interface DashboardLayoutProps {
  children: ReactNode;
}

function DashboardLayoutContent({ children }: DashboardLayoutProps) {
  const { selectedCampaignId } = useCampaign();
  const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId);

  return (
    <div className="flex min-h-screen flex-col bg-primary lg:flex-row">
      <SidebarNavigationSimple
        hideBorder
        showAccountCard={true}
        selectedCampaignName={selectedCampaign?.name}
        items={[
          {
            label: "Lead List",
            href: "/leads",
            icon: Users01,
          },
          {
            label: "Insights",
            href: "/insights",
            icon: BarChartSquare02,
          },
        ]}
        className="border-r-0"
      />
      <main className="min-w-0 flex-1 lg:pt-2">
        <div className="flex h-full min-h-screen flex-col border-secondary bg-secondary_subtle shadow-xs lg:rounded-tl-[32px] lg:border-t lg:border-l">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <CampaignProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </CampaignProvider>
  );
}
