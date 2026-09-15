import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#0F6D3A] text-white hover:bg-[#0B4F2A]",
        outline:
          "border border-[#E5E7EB] bg-white text-[#0F6D3A] hover:bg-[#EAF6EF]",
        warning:
         "bg-[#F59E0B] text-white hover:bg-[#D97706]",
        secondary:
          "bg-[#EAF6EF] text-[#0B4F2A] hover:bg-[#d8f0e2]",
        cancel:
          "bg-[#E5E7EB] text-[#374151] hover:bg-[#D1D5DB]",
        destructive:
          "bg-[#DC2626] text-white hover:bg-[#b91c1c]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(
          buttonVariants({ variant, size, className })
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };