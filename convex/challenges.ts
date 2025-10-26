import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createChallenge = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const challengeId = await ctx.db.insert("challenges", {
      ...args,
      createdBy: identity.subject,
      createdAt: Date.now(),
    });
    return challengeId;
  },
});

export const getChallenges = query({
  handler: async (ctx) => {
    return await ctx.db.query("challenges").collect();
  },
});