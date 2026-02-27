// components/MessageInput.tsx
"use client";
import { useState } from "react";

export default function MessageInput({ onSend }: { onSend: (text: string) => Promise<void> | void; }) {
  const [text, setText] = useState("");

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!text.trim()) return;
    await onSend(text);
    setText("");
  }

  return (
    <form onSubmit={submit} className="flex gap-3">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 px-4 py-3 border rounded focus:outline-none focus:ring"
      />
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Send</button>
    </form>
  );
}