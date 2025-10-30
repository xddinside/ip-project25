import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  }).index("by_clerk_id", ["clerkId"]),
  challenges: defineTable({
    title: v.string(),
    description: v.string(),
    difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
    tags: v.array(v.string()),
    link: v.optional(v.string()),
    createdBy: v.string(),
    createdAt: v.number(),
  }),
  userProgress: defineTable({
    userId: v.string(),
    challengeId: v.id("challenges"),
    solved: v.boolean(),
    solvedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_challenge", ["challengeId"])
    .index("by_user_challenge", ["userId", "challengeId"]),
  ratings: defineTable({
    challengeId: v.id("challenges"),
    userId: v.string(),
    rating: v.number(), // 1-5 stars
    ratedAt: v.number(),
  })
    .index("by_challenge", ["challengeId"])
    .index("by_user", ["userId"])
    .index("by_challenge_user", ["challengeId", "userId"]),
  solutions: defineTable({
    challengeId: v.id("challenges"),
    userId: v.string(),
    code: v.string(),
    language: v.string(),
    submittedAt: v.number(),
  }),
  reviews: defineTable({
    solutionId: v.id("solutions"),
    reviewerId: v.string(),
    rating: v.number(), // 1-5
    comment: v.string(),
    reviewedAt: v.number(),
  }),
});