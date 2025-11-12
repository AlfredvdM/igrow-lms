import { ArrowDown, ArrowUp } from "@untitledui/icons";
import { cx } from "@/utils/cx";

interface MetricsSimpleProps {
    title: string;
    subtitle: string;
    type?: "modern" | "default";
    trend?: "positive" | "negative" | "neutral";
    change?: string;
    className?: string;
}

export function MetricsSimple({
    title,
    subtitle,
    type = "default",
    trend = "neutral",
    change,
    className,
}: MetricsSimpleProps) {
    const TrendIcon = trend === "positive" ? ArrowUp : ArrowDown;
    const trendColor =
        trend === "positive"
            ? "text-fg-success-primary"
            : trend === "negative"
              ? "text-fg-error-primary"
              : "text-fg-tertiary";

    return (
        <div
            className={cx(
                "flex flex-col gap-2 rounded-xl border border-border-secondary bg-bg-primary p-5 shadow-xs",
                className
            )}
        >
            <div className="flex flex-col gap-1">
                <p className="text-md font-medium text-fg-quaternary_hover">{subtitle}</p>
                <p className="text-display-md font-semibold text-fg-primary">{title}</p>
            </div>
            {change && (
                <div className="flex items-center gap-1">
                    {trend !== "neutral" && <TrendIcon className={cx("size-5", trendColor)} />}
                    <span className={cx("text-sm font-medium", trendColor)}>{change}</span>
                    <span className="text-sm text-fg-quaternary_hover">vs last month</span>
                </div>
            )}
        </div>
    );
}
