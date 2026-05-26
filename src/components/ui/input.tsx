import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "h-12 w-full rounded-xl border border-sand bg-white/70 px-4 text-base text-ink placeholder:text-ink-soft/60 transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";
