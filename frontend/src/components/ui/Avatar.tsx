import { cn } from "../../utils/cn";

export const Avatar = ({ initials, className }: { initials: string, className?: string }) => {
  return (
    <div className={cn("flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-medium text-white", className)}>
      {initials}
    </div>
  );
};

export const Badge = ({ children, className, variant = "default" }: { children: React.ReactNode, className?: string, variant?: "default" | "success" | "warning" | "danger" }) => {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
      {
        "bg-surfaceHover text-textMuted": variant === "default",
        "bg-success/10 text-success": variant === "success",
        "bg-warning/10 text-warning": variant === "warning",
        "bg-danger/10 text-danger": variant === "danger",
      },
      className
    )}>
      {children}
    </span>
  );
};
