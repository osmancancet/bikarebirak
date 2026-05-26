import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-24 w-full rounded-xl border border-sand bg-white/70 px-4 py-3 text-base text-ink placeholder:text-ink-soft/60 transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30",
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";
