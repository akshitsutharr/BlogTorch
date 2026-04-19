"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] outline-none disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-ring/50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_16px_30px_-18px_hsl(24_95%_53%/0.95)] hover:-translate-y-0.5 hover:brightness-[1.03]",
        secondary:
          "bg-secondary/90 text-secondary-foreground shadow-[0_14px_24px_-18px_hsl(240_16%_10%/0.58)] hover:-translate-y-0.5",
        outline:
          "border border-border bg-background/70 shadow-[inset_0_1px_0_hsl(0_0%_100%/0.24)] backdrop-blur hover:bg-accent/70",
        ghost: "hover:bg-accent/70 hover:text-accent-foreground",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[0_14px_24px_-18px_hsl(0_84%_60%/0.9)] hover:-translate-y-0.5",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-11 w-11 px-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };


