import { Avatar } from "@/components/base/avatar/avatar";
import { cx } from "@/utils/cx";
import Link from "next/link";

export interface FeedItemProps {
    id: number | string;
    size?: "sm" | "md" | "lg";
    unseen?: boolean;
    user: {
        avatarUrl: string;
        href: string;
        name: string;
    };
    action: {
        href: string;
        content: string;
        target: string;
    };
}

export function FeedItem({ size = "md", unseen = false, user, action }: FeedItemProps) {
    return (
        <div className="flex items-start gap-3">
            {unseen && (
                <div className="mt-2 size-2 flex-shrink-0 rounded-full bg-bg-brand-solid" />
            )}
            <Link href={user.href} className="flex-shrink-0">
                <Avatar
                    size={size}
                    src={user.avatarUrl}
                    alt={user.name}
                    className="ring-1 ring-border-secondary"
                />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="text-sm text-fg-primary">
                    <Link
                        href={user.href}
                        className="font-semibold hover:text-fg-brand-primary_alt"
                    >
                        {user.name}
                    </Link>{" "}
                    <span className="text-fg-tertiary">{action.content}</span>{" "}
                    <Link
                        href={action.href}
                        className="font-medium text-fg-primary hover:text-fg-brand-primary_alt"
                    >
                        {action.target}
                    </Link>
                </p>
            </div>
        </div>
    );
}
