import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../../utils/cn";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-textMain text-background hover:bg-white/90": variant === "primary",
            "bg-surfaceHover text-textMain hover:bg-border": variant === "secondary",
            "border border-border bg-transparent hover:bg-surfaceHover text-textMain": variant === "outline",
            "hover:bg-surfaceHover hover:text-textMain text-textMuted": variant === "ghost",
            "bg-danger/10 text-danger hover:bg-danger/20": variant === "danger",
            
            "h-8 px-3 text-xs": size === "sm",
            "h-10 py-2 px-4": size === "md",
            "h-11 px-8": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
