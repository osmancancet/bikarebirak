import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "rose";
type Size = "default" | "lg" | "xl" | "icon";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-br from-[#c2a14d] to-[#b8935f] text-white shadow-md hover:brightness-105 active:scale-[0.98]",
  rose: "bg-gradient-to-br from-rose-gold to-[#a85c67] text-white shadow-md hover:brightness-105 active:scale-[0.98]",
  outline:
    "border border-sand bg-white/60 text-ink hover:bg-ivory active:scale-[0.98]",
  ghost: "text-ink-soft hover:bg-ivory hover:text-ink",
};

const sizes: Record<Size, string> = {
  default: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
  xl: "h-16 px-8 text-lg",
  icon: "h-11 w-11",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
