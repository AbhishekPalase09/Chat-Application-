// components/MessageBubble.tsx
"use client";
import React from "react";

function formatTimestamp(ts?: number) {
  if (!ts) return "";
  const d = new Date(ts);
  const now = new Date();
  if (d.getFullYear() !== now.getFullYear()) {
    return d.toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" });
  }
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "numeric" });
  }
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "numeric" });
}

export default function MessageBubble({ m, isMe }: { m: any; isMe: boolean }) {
  return (
    <div className={`max-w-[72%] p-2 rounded ${isMe ? "ml-auto bg-sky-600 text-white" : "bg-white text-slate-900"} shadow-sm`}>
      <div>{m.deleted ? <em>This message was deleted</em> : m.text}</div>
      <div className="text-xs text-slate-300 mt-1">{formatTimestamp(m.createdAt)}</div>
    </div>
  );
}