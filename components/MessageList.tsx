// components/MessageList.tsx
"use client";
import React from "react";

type Message = {
  _id: string;
  conversationId: string;
  text: string;
  senderClerkId: string;
  senderName?: string;
  createdAt: number;
};

export default function MessageList({ messages, currentClerkId }: { messages: Message[]; currentClerkId: string | null; }) {
  return (
    <div className="space-y-4">
      {messages.map((m) => {
        const mine = currentClerkId && m.senderClerkId === currentClerkId;
        return (
          <div key={m._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
            <div className={`${mine ? "bg-blue-600 text-white rounded-tr-lg rounded-bl-lg" : "bg-gray-100 text-gray-900 rounded-tl-lg rounded-br-lg"} max-w-[75%] p-3 shadow-sm`}>
              {!mine && <div className="text-sm font-semibold mb-1">{m.senderName ?? "Unknown"}</div>}
              <div className="text-sm leading-relaxed">{m.text}</div>
              <div className="text-xs text-gray-400 mt-2 text-right">{new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}