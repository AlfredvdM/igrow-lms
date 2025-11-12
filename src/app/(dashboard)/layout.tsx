'use client';

/**
 * Dashboard Layout
 * Main layout for authenticated dashboard pages with sidebar navigation
 */

import { ReactNode } from 'react';
import { SidebarNavigationSimple } from "@/components/application/app-navigation/sidebar-navigation/sidebar-simple";
import { CampaignProvider } from "@/providers/campaign-provider";
import {
    BarChartSquare02,
    MessageChatSquare,
    FileCheck02,
    Settings01,
} from "@untitledui/icons";

interface DashboardLayoutProps {
  children: ReactNode;
}

function DashboardLayoutContent({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-primary lg:flex-row">
      <SidebarNavigationSimple
        hideBorder
        showAccountCard={true}
        items={[
          {
            label: "Overview",
            href: "/overview",
            icon: BarChartSquare02,
          },
          {
            label: "Lead Form",
            href: "/lead-form",
            icon: FileCheck02,
          },
          {
            label: "AI Conversation",
            href: "/ai-conversation",
            icon: MessageChatSquare,
          },
        ]}
        footerItems={[
          {
            label: "Settings",
            href: "/settings",
            icon: Settings01,
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
