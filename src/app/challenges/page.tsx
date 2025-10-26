'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Header from '@/components/Header';
import ChallengeCard from '@/components/ChallengeCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ChallengesPage() {
  const challenges = useQuery(api.challenges.getChallenges);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Coding Challenges</h1>
            <p className="text-muted-foreground mt-2">Explore and create coding challenges to improve your skills</p>
          </div>
          <Link href="/create">
            <Button size="lg">Create Challenge</Button>
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {challenges?.map((challenge) => (
            <ChallengeCard key={challenge._id} challenge={challenge} />
          )) || (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">Loading challenges...</p>
            </div>
          )}
        </div>
        {challenges && challenges.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No challenges yet. Be the first to create one!</p>
            <Link href="/create">
              <Button>Get Started</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
