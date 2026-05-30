import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

export function Input({ label, hint, error, className, ...props }: InputProps) {
  return (
    <label className="grid gap-2 text-sm text-slate-200">
      {label ? <span className="font-medium">{label}</span> : null}
      <input
        className={cn(
          "h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-white outline-none transition placeholder:text-slate-500 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20",
          error && "border-red-400 focus:border-red-400 focus:ring-red-400/20",
          className,
        )}
        {...props}
      />
      {error ? <span className="text-xs text-red-300">{error}</span> : null}
      {!error && hint ? <span className="text-xs text-slate-400">{hint}</span> : null}
    </label>
  );
}
