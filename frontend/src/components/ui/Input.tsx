import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "../../utils/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-1.5 block text-sm font-medium text-textMain text-left">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-textMain placeholder:text-textMuted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
            error && "border-danger focus:ring-danger focus:border-danger",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-danger">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
