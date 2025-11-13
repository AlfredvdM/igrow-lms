"use client";

import type { HTMLAttributes } from "react";
import { cx } from "@/utils/cx";
import { UntitledLogoMinimal } from "./untitledui-logo-minimal";

export const UntitledLogo = (props: HTMLAttributes<HTMLOrSVGElement>) => {
    return (
        <div {...props} className={cx("flex h-8 w-max items-center justify-start overflow-visible gap-3", props.className)}>
            {/* Minimal logo */}
            <UntitledLogoMinimal className="aspect-square h-full w-auto shrink-0" />

            {/* Text content */}
            <div className="flex flex-col justify-center">
                <p className="text-3xl font-semibold text-fg-primary leading-tight">IGrow</p>
                <p className="text-xs text-fg-tertiary leading-tight">Lead Management System</p>
            </div>
        </div>
    );
};
