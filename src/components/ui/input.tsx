import * as React from "react";

import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-2xl border border-border/70 bg-background/72 px-4 py-2 text-sm text-black shadow-[inset_0_1px_0_hsl(0_0%_100%/0.28)] backdrop-blur transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";


