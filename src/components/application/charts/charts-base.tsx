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
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-md">
            {formattedLabel && (
                <p className="mb-3 text-xs font-semibold text-gray-700">
                    {formattedLabel}
                </p>
            )}
            <div className="flex flex-col gap-2">
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between gap-6">
                        <div className="flex items-center gap-2.5">
                            <div
                                className="size-3 rounded-full shadow-sm"
                                style={{ backgroundColor: isPieChart ? entry.fill : entry.color }}
                            />
                            <span className="text-sm text-gray-600">{entry.name}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">
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
