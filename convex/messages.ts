import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/* =========================
   SEND MESSAGE
========================= */
export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    senderClerkId: v.string(),
    text: v.string(),
  },

  handler: async (ctx, args) => {
    const now = Date.now();

    // Insert message
    const messageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: args.senderClerkId,
      text: args.text,
      createdAt: now,
      deleted: false,
    });

    // Update conversation preview
    await ctx.db.patch(args.conversationId, {
      lastMessage: args.text,
      lastMessageAt: now,
      updatedAt: now,
    });

    return messageId;
  },
});

/* =========================
   GET MESSAGES
========================= */
export const getMessages = query({
  args: {
    conversationId: v.id("conversations"),
  },

  handler: async (ctx, { conversationId }) => {
    const messages = await ctx.db
      .query("messages")
      .collect();

    return messages
      .filter((m) => m.conversationId === conversationId)
      .sort((a, b) => a.createdAt - b.createdAt);
  },
});