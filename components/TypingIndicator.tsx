// components/TypingIndicator.tsx
"use client";
import React from "react";

export default function TypingIndicator({ names }: { names: string[] }) {
  const label = names.length === 1 ? "is typing..." : "are typing...";
  return (
    <div className="text-sm text-slate-500 flex items-center gap-2">
      <div className="flex gap-1 items-center">
        <span className="w-2 h-2 rounded-full animate-pulse bg-slate-400 inline-block" />
        <span className="w-2 h-2 rounded-full animate-pulse bg-slate-400 inline-block" />
        <span className="w-2 h-2 rounded-full animate-pulse bg-slate-400 inline-block" />
      </div>
      <div>{label}</div>
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: .25 } 50% { opacity: 1 } 100% { opacity: .25 }
        }
        .animate-pulse { animation: pulse 1s infinite; }
      `}</style>
    </div>
  );
}