import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border border-gold-500/30 bg-gold-500/10 px-2.5 py-1 text-xs font-semibold text-gold-400",
        className,
      )}
      {...props}
    />
  );
}
