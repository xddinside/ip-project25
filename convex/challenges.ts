import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

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

export const seedChallenges = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if challenges already exist
    const existingChallenges = await ctx.db.query("challenges").collect();
    if (existingChallenges.length > 0) {
      return { message: "Challenges already seeded", count: existingChallenges.length };
    }

    const mockChallenges = [
      {
        title: "Hello World",
        description: "Write a program that prints 'Hello, World!' to the console. This is the classic first program that every programmer writes.",
        difficulty: "easy" as const,
        tags: ["javascript", "basics", "console"],
      },
      {
        title: "FizzBuzz",
        description: "Write a program that prints the numbers from 1 to 100. But for multiples of three print 'Fizz' instead of the number and for the multiples of five print 'Buzz'. For numbers which are multiples of both three and five print 'FizzBuzz'.",
        difficulty: "easy" as const,
        tags: ["javascript", "loops", "conditionals"],
      },
      {
        title: "Palindrome Checker",
        description: "Create a function that checks if a given string is a palindrome. A palindrome is a word, phrase, number, or other sequence of characters that reads the same forward and backward (ignoring spaces, punctuation, and capitalization).",
        difficulty: "easy" as const,
        tags: ["javascript", "strings", "algorithms"],
      },
      {
        title: "Two Sum",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
        difficulty: "easy" as const,
        tags: ["javascript", "arrays", "hash-table"],
      },
      {
        title: "Reverse String",
        description: "Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory.",
        difficulty: "easy" as const,
        tags: ["javascript", "strings", "two-pointers"],
      },
      {
        title: "Valid Parentheses",
        description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets, and open brackets must be closed in the correct order.",
        difficulty: "medium" as const,
        tags: ["javascript", "stack", "string"],
      },
      {
        title: "Merge Two Sorted Lists",
        description: "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.",
        difficulty: "easy" as const,
        tags: ["javascript", "linked-list", "recursion"],
      },
      {
        title: "Maximum Subarray",
        description: "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum. This is a classic dynamic programming problem.",
        difficulty: "medium" as const,
        tags: ["javascript", "array"],
      },
      {
        title: "Climbing Stairs",
        description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
        difficulty: "easy" as const,
        tags: ["javascript", "math"],
      },
      {
        title: "Binary Tree Inorder Traversal",
        description: "Given the root of a binary tree, return the inorder traversal of its nodes' values. Inorder traversal visits left subtree, then root, then right subtree.",
        difficulty: "medium" as const,
        tags: ["javascript", "tree", "depth-first-search"],
      },
      {
        title: "Same Tree",
        description: "Given the roots of two binary trees p and q, write a function to check if they are the same or not. Two binary trees are considered the same if they are structurally identical, and the nodes have the same value.",
        difficulty: "easy" as const,
        tags: ["javascript", "tree", "depth-first-search"],
      },
      {
        title: "Maximum Depth of Binary Tree",
        description: "Given the root of a binary tree, return its maximum depth. A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.",
        difficulty: "easy" as const,
        tags: ["javascript", "tree", "depth-first-search"],
      },
      {
        title: "Best Time to Buy and Sell Stock",
        description: "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.",
        difficulty: "easy" as const,
        tags: ["javascript", "array"],
      },
      {
        title: "Valid Anagram",
        description: "Given two strings s and t, return true if t is an anagram of s, and false otherwise. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
        difficulty: "easy" as const,
        tags: ["javascript", "string", "hash-table"],
      },
      {
        title: "Group Anagrams",
        description: "Given an array of strings strs, group the anagrams together. You can return the answer in any order. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
        difficulty: "medium" as const,
        tags: ["javascript", "string", "hash-table"],
      },
      {
        title: "Median of Two Sorted Arrays",
        description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
        difficulty: "hard" as const,
        tags: ["javascript", "array", "binary-search"],
      },
      {
        title: "Regular Expression Matching",
        description: "Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*' where '.' matches any single character and '*' matches zero or more of the preceding element.",
        difficulty: "hard" as const,
        tags: ["javascript", "string", "recursion"],
      },
      {
        title: "N-Queens",
        description: "The n-queens puzzle is the problem of placing n queens on an n×n chessboard so that no two queens attack each other. Given an integer n, return all distinct solutions to the n-queens puzzle.",
        difficulty: "hard" as const,
        tags: ["javascript", "array", "backtracking"],
      },
      {
        title: "Word Ladder",
        description: "Given two words, beginWord and endWord, and a dictionary wordList, return the length of the shortest transformation sequence from beginWord to endWord, such that only one letter can be changed at a time and each transformed word must exist in the wordList.",
        difficulty: "hard" as const,
        tags: ["javascript", "string", "breadth-first-search"],
      },
      {
        title: "3Sum",
        description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0. Notice that the solution set must not contain duplicate triplets.",
        difficulty: "medium" as const,
        tags: ["javascript", "array", "two-pointers"],
      },
    ];

    const challengeIds: Id<"challenges">[] = [];

    // Insert all challenges
    for (const challenge of mockChallenges) {
      const challengeId = await ctx.db.insert("challenges", {
        ...challenge,
        createdBy: identity.subject,
        createdAt: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000, // Random date within last 30 days
      });
      challengeIds.push(challengeId);
    }

    // Add some mock ratings and progress for the first few challenges
    const mockUserId = identity.subject;

    // Mark some challenges as solved
    const solvedChallenges = challengeIds.slice(0, 5); // First 5 challenges solved
    for (const challengeId of solvedChallenges) {
      await ctx.db.insert("userProgress", {
        userId: mockUserId,
        challengeId: challengeId,
        solved: true,
        solvedAt: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000, // Solved within last week
      });
    }

    // Add some ratings from multiple dummy users
    const dummyUsers = ["user1", "user2", "user3", "user4", "user5"];
    for (let i = 0; i < challengeIds.length; i++) {
      // Each challenge gets 1-3 random ratings from different users
      const numRatings = Math.floor(Math.random() * 3) + 1;
      const shuffledUsers = dummyUsers.sort(() => 0.5 - Math.random());
      for (let j = 0; j < numRatings; j++) {
        const rating = Math.floor(Math.random() * 5) + 1; // 1-5 stars
        await ctx.db.insert("ratings", {
          challengeId: challengeIds[i],
          userId: shuffledUsers[j],
          rating,
          ratedAt: Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000, // Rated within last 2 weeks
        });
      }
    }

    return {
      message: "Challenges seeded successfully",
      count: challengeIds.length,
      solvedCount: solvedChallenges.length
    };
  },
});
