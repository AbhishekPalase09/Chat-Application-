// convex/users.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation(async ({ db }, { clerkId, name, image }:{ clerkId:string; name?:string; image?:string }) => {
  const existing = await db.query("users").filter((q)=> q.eq(q.field("clerkId"), clerkId)).first();
  const now = Date.now();
  if (existing) {
    await db.patch(existing._id, { name, image, lastSeen: now, online: true });
    return existing._id;
  } else {
    return await db.insert("users", { clerkId, name, image, online: true, lastSeen: now });
  }
});

export const getUsers = query(async ({ db }) => {
  return await db.query("users").collect();
});

export const setPresence = mutation({
  args: { clerkId: v.string(), online: v.boolean() },
  handler: async ({ db }, { clerkId, online }) => {
    const user = await db.query("users").filter((q) => q.eq(q.field("clerkId"), clerkId)).first();
    if (!user) return;
    await db.patch(user._id, { online, lastSeen: Date.now() });
  },
});