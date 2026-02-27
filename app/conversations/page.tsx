"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function ConversationsPage() {
  const { user, isLoaded } = useUser();

  const convs = useQuery(
    api.chat.listConversationsForUser,
    isLoaded && user ? { clerkId: user.id } : "skip"
  );

  if (!isLoaded || !convs) {
    return <div className="p-6">Loading conversations…</div>;
  }

  return <div>{/* your UI */}</div>;
}
