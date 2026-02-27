// convex/conversations.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/* CREATE CONVERSATION */
export const createConversation = mutation({
  args: {
    members: v.array(v.string()),
    name: v.optional(v.string()),
    isGroup: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const conversationId = await ctx.db.insert("conversations", {
      members: args.members,
      name: args.name,
      isGroup: args.isGroup,
      createdAt: now,
      updatedAt: now,
      lastMessage: undefined,
      lastMessageAt: undefined,
    });

    return conversationId;
  },
});

/* EXPORT EXACT NAME CLIENT CALLS: getConversationsForUser */
export const getConversationsForUser = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, { clerkId }) => {
    const conversations = await ctx.db.query("conversations").collect();

    const filtered = conversations.filter((c) => c.members.includes(clerkId));

    return filtered.sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
  },
});