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
    <div
      className="flex min-h-screen flex-col lg:flex-row relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 50%, #fef2f3 100%)',
      }}
    >
      {/* Ambient gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] rounded-full opacity-[0.03]"
          style={{
            background: 'radial-gradient(circle, #b6364b 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute -bottom-1/2 -right-1/4 w-[600px] h-[600px] rounded-full opacity-[0.02]"
          style={{
            background: 'radial-gradient(circle, #79273a 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      <SidebarNavigationSimple
        hideBorder={false}
        showAccountCard={true}
        selectedCampaignName={selectedCampaign?.name}
        items={[
          {
            label: "Insights",
            href: "/insights",
            icon: BarChartSquare02,
          },
          {
            label: "Lead List",
            href: "/leads",
            icon: Users01,
          },
        ]}
      />
      <main className="min-w-0 flex-1 lg:pt-2 relative z-10">
        <div
          className="flex h-full min-h-screen flex-col shadow-sm lg:rounded-tl-[32px] lg:border-t lg:border-l overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(249, 250, 251, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%)',
            backdropFilter: 'blur(20px)',
            borderColor: 'rgba(255, 255, 255, 0.3)',
          }}
        >
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
