// convex/schema.ts

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    lastSeen: v.optional(v.number()),
    online: v.optional(v.boolean()),
  }),

  conversations: defineTable({
    members: v.array(v.string()),
    isGroup: v.optional(v.boolean()),
    name: v.optional(v.string()),
    lastMessage: v.optional(v.string()),
    lastMessageAt: v.optional(v.number()),
    lastReadBy: v.optional(v.record(v.string(), v.number())),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  }),

  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.string(),
    text: v.string(),
    createdAt: v.number(),
    deleted: v.optional(v.boolean()),
    reactions: v.optional(v.record(v.string(), v.array(v.string()))),
  }),

  typing: defineTable({
    conversationId: v.id("conversations"),
    clerkId: v.string(),
    lastTypingAt: v.number(),
  }),

  presence: defineTable({
    clerkId: v.string(),
    online: v.boolean(),
    lastActiveAt: v.number(),
  }),
});