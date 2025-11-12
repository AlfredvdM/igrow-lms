interface ChartTooltipContentProps {
    active?: boolean;
    payload?: Array<{
        name: string;
        value: number;
        color: string;
        dataKey: string;
    }>;
    label?: string;
}

export function ChartTooltipContent({
    active,
    payload,
    label,
}: ChartTooltipContentProps) {
    if (!active || !payload || payload.length === 0) {
        return null;
    }

    return (
        <div className="rounded-lg border border-border-secondary bg-bg-primary p-3 shadow-lg">
            {label && (
                <p className="mb-2 text-xs font-medium text-fg-quaternary_hover">
                    {label}
                </p>
            )}
            <div className="flex flex-col gap-1.5">
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div
                                className="size-2 rounded-full"
                                style={{ backgroundColor: entry.color }}
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
