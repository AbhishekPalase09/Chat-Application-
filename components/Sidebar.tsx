// components/Sidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  // ✅ Prevent query until user loads
  const convos =
    useQuery(
      api.conversations.getConversationsForUser,
      isLoaded && user ? { clerkId: user.id } : "skip"
    ) || [];

  const createConvo = useMutation(api.conversations.createConversation);

  async function handleNew() {
    if (!user) return router.push("/sign-in");

    const id = await createConvo({
      members: [user.id],
      name: "Conversation",
      isGroup: false,
    });

    router.push(`/conversations/${id}`);
  }

  // loading state
  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="text-lg font-semibold">Chats</h3>
        <button onClick={handleNew} className="text-sm text-blue-600">
          New
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-3">
        {convos.length === 0 ? (
          <div className="text-sm text-gray-500">No conversations yet</div>
        ) : (
          convos.map((c: any) => (
            <Link
              key={c._id}
              href={`/conversations/${c._id}`}
              className="block p-3 border rounded hover:bg-gray-50"
            >
              <div className="font-semibold">
                {c.name ?? "Conversation"}
              </div>
              <div className="text-sm text-gray-500 truncate">
                {c.lastMessage ?? "No messages yet"}
              </div>
            </Link>
          ))
        )}
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500 rounded-full" />
          <div className="flex-1">
            <div className="text-sm font-medium">
              {user?.fullName ?? "Guest"}
            </div>
            <div className="text-xs text-gray-500">
              {user?.primaryEmailAddress?.emailAddress ?? ""}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}