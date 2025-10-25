import { ConvexReactClient } from 'convex/react';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;

export const convex = new ConvexReactClient(convexUrl);