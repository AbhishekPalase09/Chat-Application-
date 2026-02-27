// components/Navbar.tsx
"use client";
import { UserButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export default function Navbar() {
  const { user } = useUser();
  const createUser = useMutation(api.users.createUser);

  useEffect(() => {
    if (user) {
      createUser({
        clerkId: user.id,
        name: user.fullName ?? user.primaryEmailAddress?.emailAddress ?? "User",
        image: user.profileImageUrl,
      });
    }
  }, [user, createUser]);

  return (
    <div className="flex items-center justify-between px-4 h-16">
      <div className="flex items-center gap-4">
        <div className="text-xl font-bold">StudyHub Chat</div>
        <Link href="/" className="text-sm text-gray-600">Home</Link>
      </div>

      <div className="flex items-center gap-3">
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <Link href="/sign-in" className="px-3 py-1 text-sm border rounded">Sign in</Link>
        </SignedOut>
      </div>
    </div>
  );
}