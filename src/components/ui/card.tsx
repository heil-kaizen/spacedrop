import React from "react";
import { cn } from "@/src/utils";

export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-white/10 bg-black/20 backdrop-blur-xl p-6 overflow-hidden relative shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
        className
      )}
      {...props}
    >
      {/* Subtle top glare */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      {/* Space glow */}
      <div className="absolute -bottom-10 inset-x-0 h-20 bg-blue-500/10 blur-[40px] pointer-events-none" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
