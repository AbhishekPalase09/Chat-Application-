// app/users/page.tsx
"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function UsersPage() {
  const me = useUser();
  const users = useQuery(api.users.getUsers);
  const createOrOpen = useMutation(api.chat.getOrCreateDirectConversation);
  const [q, setQ] = useState("");

  if (!users) return <div className="p-6">Loading users…</div>;

  const filtered = users.filter((u: any) => u.clerkId !== me.user?.id && (!q || (u.name || "").toLowerCase().includes(q.toLowerCase())));

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Find users</h2>
      <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search by name..." className="w-full p-2 rounded border" />
      <div className="mt-4 space-y-2">
        {filtered.length === 0 ? <div className="p-6 text-slate-500">No users found.</div> :
          filtered.map((u: any) => (
            <div key={u._id} className="flex items-center gap-3 p-2 border rounded">
              <img src={u.image || "/avatar_placeholder.png"} className="w-12 h-12 rounded-full" />
              <div className="flex-1">
                <div className="font-medium">{u.name || "Unknown"}</div>
                <div className="text-xs text-slate-500">{u.online ? "Online" : "Offline"}</div>
              </div>
              <button onClick={async ()=> {
                const convId = await createOrOpen({ a: me.user?.id, b: u.clerkId });
                window.location.href = `/conversations/${convId}`;
              }} className="px-3 py-1 bg-sky-600 text-white rounded">Chat</button>
            </div>
          ))
        }
      </div>
    </div>
  );
}