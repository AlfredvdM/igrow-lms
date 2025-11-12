import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { RouteProvider } from "@/providers/router-provider";
import { QueryProvider } from "@/providers/query-provider";
import { Theme } from "@/providers/theme";
import "@/styles/globals.css";
import { cx } from "@/utils/cx";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: "IGrow Rentals LMS",
    description: "Lead Management System for IGrow Rentals",
};

export const viewport: Viewport = {
    themeColor: "#7f56d9",
    colorScheme: "light dark",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={cx(inter.variable, "bg-primary antialiased")}>
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
