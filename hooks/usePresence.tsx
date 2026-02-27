// /hooks/usePresence.tsx
"use client";
import { useEffect } from "react";
import { useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../convex/_generated/api";

export default function UsePresence() {
  const { user } = useUser();
  const setPresence = useMutation(api.chat.setPresence);

  useEffect(() => {
    if (!user) return;
    const id = user.id;
    const goOnline = () => setPresence({ clerkId: id, online: true });
    const goOffline = () => setPresence({ clerkId: id, online: false });

    window.addEventListener("focus", goOnline);
    window.addEventListener("blur", goOffline);
    window.addEventListener("beforeunload", goOffline);

    goOnline();

    return () => {
      goOffline();
      window.removeEventListener("focus", goOnline);
      window.removeEventListener("blur", goOffline);
      window.removeEventListener("beforeunload", goOffline);
    };
  }, [user, setPresence]);

  return null;
}