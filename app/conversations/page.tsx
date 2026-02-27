"use client";

import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { api } from "../../convex/_generated/api";

export default function ConversationsPage() {
  const me = useUser();
  const convs = useQuery(
    api.chat.listConversationsForUser,
    { clerkId: me.user?.id }
  );

  if (!convs) return <div className="p-6">Loading conversations…</div>;

  if (convs.length === 0)
    return (
      <div className="p-6 text-slate-600 font-medium">
        No conversations yet. Find users to start chatting.
      </div>
    );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Conversations</h2>

      <div className="space-y-2">
        {convs.map((c: any) => (
          <Link
            key={c._id}
            href={`/conversations/${c._id}`}
            className="block p-3 border rounded hover:bg-white flex justify-between"
          >
            <div>
              <div className="font-medium">
                {c.previewName || c.name || "Conversation"}
              </div>
              <div className="text-sm text-slate-500">
                {c.lastMessage || "No messages yet"}
              </div>
            </div>

            <div className="text-xs text-slate-400">
              {c.lastMessageAt
                ? new Date(c.lastMessageAt).toLocaleString()
                : ""}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}