"use client";

import { useState, useEffect, useRef, use } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import MessageBubble from "../../../components/MessageBubble";
import TypingIndicator from "../../../components/TypingIndicator";

export default function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { user } = useUser();

  const msgs = useQuery(api.chat.messagesByConversation, {
    conversationId: id,
  });

  const typing = useQuery(api.chat.typingByConversation, {
    conversationId: id,
  });

  const sendMessage = useMutation(api.chat.sendMessage);
  const setTyping = useMutation(api.chat.setTyping);
  const markRead = useMutation(api.chat.markConversationRead);

  const [text, setText] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);

  const [showNewButton, setShowNewButton] = useState(false);
  const typingTimeoutRef = useRef<any>(null);

  // mark read when opening conversation
  useEffect(() => {
    if (!user) return;
    markRead({
      conversationId: id,
      clerkId: user.id,
    });
  }, [id, user, markRead]);

  // smart autoscroll
  useEffect(() => {
    if (!listRef.current || !msgs) return;

    const el = listRef.current;
    const atBottom =
      el.scrollTop + el.clientHeight >= el.scrollHeight - 120;

    if (atBottom) {
      el.scrollTop = el.scrollHeight;
      setShowNewButton(false);
    } else {
      setShowNewButton(true);
    }
  }, [msgs]);

  // detect manual scrolling
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const onScroll = () => {
      const atBottom =
        el.scrollTop + el.clientHeight >= el.scrollHeight - 100;
      if (atBottom) setShowNewButton(false);
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // send message
  const onSend = async () => {
    if (!text.trim() || !user) return;

    await sendMessage({
      conversationId: id,
      senderId: user.id,
      text: text.trim(),
    });

    setText("");

    await setTyping({
      conversationId: id,
      clerkId: user.id,
      typing: false,
    });

    setTimeout(() => {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    }, 60);
  };

  // typing handler (optimized)
  const onTyping = async (val: boolean) => {
    if (!user) return;

    await setTyping({
      conversationId: id,
      clerkId: user.id,
      typing: val,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setTyping({
        conversationId: id,
        clerkId: user.id,
        typing: false,
      });
    }, 1200);
  };

  const otherTyping =
    typing &&
    typing.filter(
      (t: any) =>
        t.clerkId !== user?.id &&
        Date.now() - t.lastTypingAt < 2000
    );

  return (
    <div className="h-[calc(100vh-80px)] rounded-lg border bg-white grid grid-rows-[auto_1fr_auto] shadow-sm">

      {/* HEADER */}
      <div className="px-4 py-3 border-b bg-white flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-lg">Conversation</h2>
          <p className="text-xs text-slate-500">
            Real-time messaging
          </p>
        </div>
      </div>

      {/* MESSAGE LIST */}
      <div
        ref={listRef}
        className="overflow-auto p-4 space-y-3 bg-slate-50"
      >
        {!msgs ? (
          <div className="text-slate-500">Loading messages...</div>
        ) : msgs.length === 0 ? (
          <div className="text-slate-500">
            No messages yet. Say hi 👋
          </div>
        ) : (
          msgs.map((m: any) => (
            <MessageBubble
              key={m._id}
              m={m}
              isMe={m.senderId === user?.id}
            />
          ))
        )}
      </div>

      {/* INPUT AREA */}
      <div className="p-3 border-t bg-white">
        {otherTyping && otherTyping.length > 0 ? (
          <TypingIndicator
            names={otherTyping.map((t: any) => t.clerkId)}
          />
        ) : null}

        <div className="flex gap-2 mt-2">
          <input
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              onTyping(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSend();
            }}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />

          <button
            onClick={onSend}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition"
          >
            Send
          </button>
        </div>
      </div>

      {/* NEW MESSAGE BUTTON */}
      {showNewButton && (
        <button
          onClick={() => {
            if (listRef.current) {
              listRef.current.scrollTop =
                listRef.current.scrollHeight;
              setShowNewButton(false);
            }
          }}
          className="fixed bottom-24 right-6 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-full shadow-lg transition"
        >
          ↓ New messages
        </button>
      )}
    </div>
  );
}