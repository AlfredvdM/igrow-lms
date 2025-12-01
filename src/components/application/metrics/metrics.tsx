import { ArrowDown, ArrowUp } from "@untitledui/icons";
import { cx } from "@/utils/cx";
import type { FC, HTMLAttributes } from "react";

interface MetricsSimpleProps {
    title: string;
    subtitle: string;
    type?: "modern" | "default" | "gradient";
    trend?: "positive" | "negative" | "neutral";
    change?: string;
    className?: string;
    icon?: FC<HTMLAttributes<HTMLOrSVGElement>>;
}

export function MetricsSimple({
    title,
    subtitle,
    type = "default",
    trend = "neutral",
    change,
    className,
    icon: Icon,
}: MetricsSimpleProps) {
    const TrendIcon = trend === "positive" ? ArrowUp : ArrowDown;
    const trendColor =
        trend === "positive"
            ? "text-fg-success-primary"
            : trend === "negative"
              ? "text-fg-error-primary"
              : "text-fg-tertiary";

    const trendBgColor =
        trend === "positive"
            ? "bg-green-50"
            : trend === "negative"
              ? "bg-red-50"
              : "bg-gray-50";

    // Gradient variant for premium maroon cards
    if (type === "gradient") {
        return (
            <div
                className={cx(
                    "group relative flex flex-col gap-3 rounded-2xl border border-white/10 p-6 transition-all duration-300 overflow-hidden",
                    "hover:scale-[1.02] hover:shadow-xl",
                    className
                )}
                style={{
                    background: 'linear-gradient(135deg, #b6364b 0%, #8e2c3e 50%, #79273a 100%)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
                }}
            >
                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.1] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                        <p className="text-xs font-medium text-white/80 uppercase tracking-wide">{subtitle}</p>
                        <p className="text-2xl font-bold text-white tracking-tight">{title}</p>
                    </div>
                    {Icon && (
                        <div
                            className="rounded-xl p-3 backdrop-blur-sm transition-all duration-200"
                            style={{
                                background: 'rgba(255, 255, 255, 0.15)',
                                boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.2)',
                            }}
                        >
                            <Icon className="size-6 text-white" />
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Default glassmorphism variant
    return (
        <div
            className={cx(
                "group relative flex flex-col gap-3 rounded-2xl border border-white/20 p-6 transition-all duration-300 overflow-hidden",
                "backdrop-blur-sm bg-gradient-to-br from-white/95 via-white/90 to-white/95",
                "hover:scale-[1.02] hover:border-white/40 hover:shadow-lg",
                className
            )}
            style={{
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05), inset 0 1px 0 0 rgba(255, 255, 255, 0.6)'
            }}
        >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#b6364b]/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative flex items-start justify-between">
                <div className="flex flex-col gap-1.5">
                    <p className="text-sm font-medium text-gray-600">{subtitle}</p>
                    <p className="text-display-md font-bold text-gray-900 tracking-tight">{title}</p>
                </div>
                {change && trend !== "neutral" && (
                    <div
                        className={cx("rounded-full p-2 backdrop-blur-sm transition-all duration-200", trendBgColor)}
                        style={{
                            boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.5)'
                        }}
                    >
                        <TrendIcon className={cx("size-5", trendColor)} />
                    </div>
                )}
            </div>
            {change && (
                <div className="relative flex items-center gap-2">
                    <span className={cx("text-sm font-semibold", trendColor)}>{change}</span>
                    <span className="text-xs text-gray-500">vs last month</span>
                </div>
            )}
        </div>
    );
}
