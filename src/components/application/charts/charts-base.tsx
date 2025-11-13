import { cx } from "@/utils/cx";

interface ChartTooltipContentProps {
    active?: boolean;
    payload?: Array<{
        name: string;
        value: number;
        color: string;
        dataKey: string;
        fill?: string;
    }>;
    label?: string | number | Date;
    isPieChart?: boolean;
}

export function ChartTooltipContent({
    active,
    payload,
    label,
    isPieChart = false,
}: ChartTooltipContentProps) {
    if (!active || !payload || payload.length === 0) {
        return null;
    }

    // Format label if it's a Date object
    const formattedLabel = label instanceof Date
        ? label.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        : label;

    return (
        <div className="rounded-lg border border-border-secondary bg-bg-primary p-3 shadow-lg">
            {formattedLabel && (
                <p className="mb-2 text-xs font-medium text-fg-quaternary_hover">
                    {formattedLabel}
                </p>
            )}
            <div className="flex flex-col gap-1.5">
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div
                                className="size-2 rounded-full"
                                style={{ backgroundColor: isPieChart ? entry.fill : entry.color }}
                            />
                            <span className="text-sm text-fg-tertiary">{entry.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-fg-primary">
                            {typeof entry.value === "number"
                                ? entry.value.toLocaleString()
                                : entry.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

interface ChartLegendContentProps {
    payload?: Array<{
        value: string;
        type?: string;
        id?: string;
        color?: string;
    }>;
    className?: string;
}

export function ChartLegendContent({ payload, className }: ChartLegendContentProps) {
    if (!payload || payload.length === 0) {
        return null;
    }

    return (
        <div className={cx("flex flex-wrap gap-4 justify-center", className)}>
            {payload.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                    <div
                        className="size-2 rounded-full"
                        style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm text-fg-tertiary">{entry.value}</span>
                </div>
            ))}
        </div>
    );
}

// Helper function to select evenly spaced items from an array
export function selectEvenlySpacedItems<T>(items: T[], count: number): T[] {
    if (items.length <= count) {
        return items;
    }

    const result: T[] = [];
    const step = (items.length - 1) / (count - 1);

    for (let i = 0; i < count; i++) {
        const index = Math.round(i * step);
        result.push(items[index]);
    }

    return result;
}
