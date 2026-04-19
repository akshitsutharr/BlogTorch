import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-border/70 bg-background/70 px-3 py-1 text-[0.67rem] font-semibold tracking-[0.04em] text-foreground shadow-[inset_0_1px_0_hsl(0_0%_100%/0.2)] backdrop-blur transition-colors",
  {
    variants: {
      variant: {
        default: "hover:bg-accent",
        secondary:
          "bg-secondary/80 text-secondary-foreground hover:bg-secondary",
        outline: "bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}


