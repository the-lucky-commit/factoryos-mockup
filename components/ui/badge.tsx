import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "success" | "danger" | "warning" | "info" | "outline";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles = {
    default: "bg-blue-600 text-white border-transparent hover:bg-blue-700",
    secondary: "bg-slate-100 text-slate-800 border-transparent hover:bg-slate-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200/60 hover:bg-emerald-100/60",
    danger: "bg-rose-50 text-rose-700 border-rose-200/60 hover:bg-rose-100/60",
    warning: "bg-amber-50 text-amber-700 border-amber-200/60 hover:bg-amber-100/60",
    info: "bg-indigo-50 text-indigo-700 border-indigo-200/60 hover:bg-indigo-100/60",
    outline: "text-slate-900 border-slate-200 bg-transparent hover:bg-slate-50"
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950/20 focus:ring-offset-2",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
