import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { RouteProvider } from "@/providers/router-provider";
import { QueryProvider } from "@/providers/query-provider";
import { Theme } from "@/providers/theme";
import "@/styles/globals.css";
import { cx } from "@/utils/cx";

const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-plus-jakarta-sans",
});

export const metadata: Metadata = {
    title: "IGrow Rentals LMS",
    description: "Lead Management System for IGrow Rentals",
    icons: {
        icon: "https://cdn.prod.website-files.com/68f0849e4b2688b01e255a47/692001ae8734969a5bb07683_icon.png",
        shortcut: "https://cdn.prod.website-files.com/68f0849e4b2688b01e255a47/692001ae8734969a5bb07683_icon.png",
        apple: "https://cdn.prod.website-files.com/68f0849e4b2688b01e255a47/692001ae8734969a5bb07683_icon.png",
    },
};

export const viewport: Viewport = {
    themeColor: "#a63346",
    colorScheme: "light dark",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={cx(plusJakartaSans.variable, "bg-primary antialiased")}>
                <ClerkProvider>
                    <QueryProvider>
                        <RouteProvider>
                            <Theme>{children}</Theme>
                        </RouteProvider>
                    </QueryProvider>
                </ClerkProvider>
            </body>
        </html>
    );
}
