import { cx } from "@/utils/cx";
import { ReactNode } from "react";

interface ContentDividerProps {
    type: "single-line" | "double-line";
    children?: ReactNode;
    className?: string;
}

export function ContentDivider({ type, children, className }: ContentDividerProps) {
    if (type === "single-line") {
        return (
            <div className={cx("flex items-center gap-4", className)}>
                <div className="h-px flex-1 bg-border-secondary" />
                {children}
                <div className="h-px flex-1 bg-border-secondary" />
            </div>
        );
    }

    return (
        <div className={cx("flex flex-col gap-2", className)}>
            <div className="h-px w-full bg-border-secondary" />
            {children && <div className="flex justify-center">{children}</div>}
            <div className="h-px w-full bg-border-secondary" />
        </div>
    );
}
