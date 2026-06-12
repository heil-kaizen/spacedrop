import React from "react";
import { cn } from "@/src/utils";

export function Button({
  className,
  variant = "default",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-sm px-4 py-2 text-sm font-mono font-medium transition-colors focus:outline-hidden",
        {
          "bg-white text-black hover:bg-neutral-200": variant === "default",
          "border border-white/20 bg-transparent text-white hover:bg-white/10":
            variant === "outline",
          "bg-transparent text-white hover:bg-white/10": variant === "ghost",
        },
        className
      )}
      {...props}
    />
  );
}
