// components/ConversationClient.tsx
"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useUser } from "@clerk/nextjs";

type Props = {
  conversationId: string;
};

export default function ConversationClient({ conversationId }: Props) {
  const { user, isLoaded } = useUser();

  // Convex query (undefined while loading)
  const messages =
    useQuery(api.messages.getMessagesByConversation, {
      conversationId,
    }) ?? [];

  const sendMessage = useMutation(api.messages.createMessage);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [isSending, setIsSending] = useState(false);

  // Auto-scroll when new message appears
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages.length]);

  const handleSend = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      if (!user || !isLoaded || isSending) return;

      try {
        setIsSending(true);

        await sendMessage({
          conversationId,
          text: text.trim(),
          senderClerkId: user.id,
          senderName:
            user.fullName ||
            user.primaryEmailAddress?.emailAddress ||
            "Me",
        });
      } catch (error) {
        console.error("Failed to send message:", error);
      } finally {
        setIsSending(false);
      }
    },
    [conversationId, user, isLoaded, isSending, sendMessage]
  );

  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-gray-500">
        Loading user...
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-gray-50">
        <h2 className="font-semibold">Conversation</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-auto">
        <MessageList
          messages={messages}
          currentClerkId={user?.id ?? null}
        />
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white">
        <MessageInput
          onSend={handleSend}
          disabled={isSending || !user}
        />
      </div>
    </div>
  );
}