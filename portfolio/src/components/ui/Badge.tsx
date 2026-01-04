import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    children: React.ReactNode;
    variant?: 'default' | 'outline' | 'secondary' | 'accent';
}

export function Badge({ children, className, variant = 'default', ...props }: BadgeProps) {
    const variants = {
        default: "bg-primary/10 text-primary border border-primary/20",
        outline: "border border-border text-muted-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        accent: "bg-accent text-accent-foreground"
    };

    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
}
