"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSubscription, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

type Props = {
  conversationId: string | null;
};

export default function ChatWindow({ conversationId }: Props) {
  const messages = useSubscription(api.messages.byConversation, conversationId) || [];
  const sendMessage = useMutation(api.messages.send);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [input, setInput] = useState("");

  // smooth auto-scroll to bottom when messages change
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length, conversationId]);

  const handleSend = async () => {
    if (!input.trim() || !conversationId) return;
    const text = input.trim();
    setInput("");

    // optimistic append handled server-side by subscription; still call mutation
    try {
      await sendMessage({ conversationId, text });
    } catch (e) {
      console.error("send failed", e);
    }
  };

  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select or create a conversation
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-950">
      <div className="flex-1 overflow-auto px-6 py-4" ref={listRef}>
        <div className="space-y-4">
          {messages.map((m: any) => (
            <div key={m._id} className={`max-w-[75%] break-words ${m.isMine ? "ml-auto" : "mr-auto"}`}>
              <div className={`px-4 py-2 rounded-lg ${m.isMine ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-200"}`}>
                <div className="text-sm">{m.text}</div>
                <div className="text-xs text-gray-400 mt-1 text-right">
                  {new Date(m.createdAt).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-gray-800">
        <div className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Write a message..."
            className="flex-1 rounded-md bg-gray-900 border border-gray-800 px-4 py-2 text-white focus:outline-none"
          />
          <button onClick={handleSend} className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}