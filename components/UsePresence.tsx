"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function UsePresence() {
  const { user, isLoaded } = useUser();

  const setPresence = useMutation(api.users.setPresence);

  useEffect(() => {
    if (!isLoaded || !user) return;

    // user comes online
    setPresence({
      clerkId: user.id,
      online: true,
      lastSeen: Date.now(),
    });

    // when tab closes / refresh
    const handleOffline = () => {
      setPresence({
        clerkId: user.id,
        online: false,
        lastSeen: Date.now(),
      });
    };

    window.addEventListener("beforeunload", handleOffline);

    return () => {
      handleOffline();
      window.removeEventListener("beforeunload", handleOffline);
    };
  }, [isLoaded, user, setPresence]);

  return null;
}