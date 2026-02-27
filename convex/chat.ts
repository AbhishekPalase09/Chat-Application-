// /convex/chat.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// 1) list users
export const getUsers = query(async ({ db }) => {
  return await db.query("users").collect();
});

// 2) get or create one-on-one conversation (unique sorted members)
export const getOrCreateDirectConversation = mutation(async ({ db }, { a, b } : { a: string; b: string }) => {
  const members = [a, b].sort();
  // Try to find conversation with exact members
  const existing = await db
    .query("conversations")
    .filter((q) => q.eq(q.field("members"), members))
    .first();
  if (existing) return existing._id;
  const now = Date.now();
  return await db.insert("conversations", {
    members,
    isGroup: false,
    createdAt: now,
    updatedAt: now,
    lastReadBy: {},
  });
});

// 3) list conversations for a user (include participant names)
export const listConversationsForUser = query(async ({ db }, { clerkId } : { clerkId: string }) => {
  const all = await db.query("conversations").collect();
  const convs = all.filter((c) => (c.members || []).includes(clerkId));
  // attach member names for preview (fetch users)
  const users = await db.query("users").collect();
  const map: Record<string,string> = {};
  for (const u of users) map[u.clerkId] = u.name || "Unknown";
  return convs.map((c) => ({
    _id: c._id,
    members: c.members,
    name: c.name,
    lastMessage: c.lastMessage,
    lastMessageAt: c.lastMessageAt,
    updatedAt: c.updatedAt,
    previewName: c.isGroup ? c.name : c.members.filter((m:string)=>m!==clerkId).map((m:string)=>map[m]).join(", "),
    lastReadAt: (c.lastReadBy && (c.lastReadBy as any)[clerkId]) || 0,
  }));
});

// 4) send message
export const sendMessage = mutation(async ({ db }, { conversationId, senderId, text } : { conversationId: any; senderId: string; text: string }) => {
  const now = Date.now();
  const msgId = await db.insert("messages", { conversationId, senderId, text, createdAt: now, deleted: false, reactions: {} });
  await db.patch(conversationId, { lastMessage: text, lastMessageAt: now, updatedAt: now });
  return msgId;
});

// 5) messages by conversation (subscription query)
export const messagesByConversation = query(async ({ db }, { conversationId }:{ conversationId:any }) => {
  const msgs = await db.query("messages").filter((q) => q.eq(q.field("conversationId"), conversationId)).collect();
  msgs.sort((a,b) => a.createdAt - b.createdAt);
  return msgs;
});

// 6) typing indicator (set/unset)
export const setTyping = mutation(async ({ db }, { conversationId, clerkId, typing } : { conversationId:any; clerkId:string; typing:boolean }) => {
  if (typing) {
    const now = Date.now();
    const existing = await db
  .query("typing")
  .filter((q) =>
    q.and(
      q.eq(q.field("conversationId"), conversationId),
      q.eq(q.field("clerkId"), clerkId)
    )
  )
  .first();
    if (existing) {
      await db.patch(existing._id, { lastTypingAt: now });
      return existing._id;
    } else {
      return await db.insert("typing", { conversationId, clerkId, lastTypingAt: now });
    }
  } else {
    const existing = await db
  .query("typing")
  .filter((q) =>
    q.and(
      q.eq(q.field("conversationId"), conversationId),
      q.eq(q.field("clerkId"), clerkId)
    )
  )
  .first();
    if (existing) await db.delete(existing._id);
    return null;
  }
});

// 7) get typing list for conv (subscription)
export const typingByConversation = query(async ({ db }, { conversationId }:{ conversationId:any }) => {
  return db.query("typing").filter((q)=> q.eq(q.field("conversationId"), conversationId)).collect();
});

// 8) presence set (online/offline)
export const setPresence = mutation(async ({ db }, { clerkId, online }:{ clerkId:string; online:boolean }) => {
  const now = Date.now();
  const existing = await db.query("presence").filter((q)=> q.eq(q.field("clerkId"), clerkId)).first();
  if (existing) {
    await db.patch(existing._id, { online, lastActiveAt: now });
    return existing._id;
  } else {
    return await db.insert("presence", { clerkId, online, lastActiveAt: now });
  }
});

// 9) subscription to presence (all)
export const listPresence = query(async ({ db }) => {
  return db.query("presence").collect();
});

// 10) mark conversation read
export const markConversationRead = mutation(async ({ db }, { conversationId, clerkId }:{ conversationId:any; clerkId:string }) => {
  const conv = await db.get(conversationId);
  const map = (conv as any).lastReadBy || {};
  map[clerkId] = Date.now();
  await db.patch(conversationId, { lastReadBy: map });
  return true;
});

// 11) compute unread counts for user (subscription)
export const unreadCountsForUser = query(async ({ db }, { clerkId }:{ clerkId:string }) => {
  const convs = await db.query("conversations").collect();
  const result: Array<{ conversationId: any; unread: number }> = [];
  for (const c of convs) {
    if (!c.members.includes(clerkId)) continue;
    const lastRead = (c.lastReadBy && (c.lastReadBy as any)[clerkId]) || 0;
    const unread = (
  await db
    .query("messages")
    .filter((q) =>
      q.and(
        q.eq(q.field("conversationId"), c._id),
        q.gt(q.field("createdAt"), lastRead)
      )
    )
    .collect()
).length;
    result.push({ conversationId: c._id, unread });
  }
  return result;
});