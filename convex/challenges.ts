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

export const getUserProgress = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userProgress")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const markChallengeSolved = mutation({
  args: { challengeId: v.id("challenges"), solved: v.boolean() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const existing = await ctx.db
      .query("userProgress")
      .withIndex("by_user_challenge", (q) =>
        q.eq("userId", identity.subject).eq("challengeId", args.challengeId)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        solved: args.solved,
        solvedAt: args.solved ? Date.now() : undefined,
      });
    } else {
      await ctx.db.insert("userProgress", {
        userId: identity.subject,
        challengeId: args.challengeId,
        solved: args.solved,
        solvedAt: args.solved ? Date.now() : undefined,
      });
    }
  },
});

export const rateChallenge = mutation({
  args: { challengeId: v.id("challenges"), rating: v.number() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    if (args.rating < 1 || args.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    const existing = await ctx.db
      .query("ratings")
      .withIndex("by_challenge_user", (q) =>
        q.eq("challengeId", args.challengeId).eq("userId", identity.subject)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        rating: args.rating,
        ratedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("ratings", {
        challengeId: args.challengeId,
        userId: identity.subject,
        rating: args.rating,
        ratedAt: Date.now(),
      });
    }
  },
});

export const getChallengeRating = query({
  args: { challengeId: v.id("challenges") },
  handler: async (ctx, args) => {
    const ratings = await ctx.db
      .query("ratings")
      .withIndex("by_challenge", (q) => q.eq("challengeId", args.challengeId))
      .collect();

    if (ratings.length === 0) {
      return { average: 0, total: 0, userRating: null };
    }

    const total = ratings.length;
    const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    const average = sum / total;

    return {
      average: Math.round(average * 10) / 10, // Round to 1 decimal
      total,
      userRating: null, // Will be set by the component
    };
  },
});

export const getUserRating = query({
  args: { challengeId: v.id("challenges"), userId: v.string() },
  handler: async (ctx, args) => {
    const rating = await ctx.db
      .query("ratings")
      .withIndex("by_challenge_user", (q) =>
        q.eq("challengeId", args.challengeId).eq("userId", args.userId)
      )
      .first();

    return rating?.rating || null;
  },
});