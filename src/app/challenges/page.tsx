 'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Header from '@/components/Header';
import ChallengeCard from '@/components/ChallengeCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Code2, Plus, Sparkles } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

export default function ChallengesPage() {
  const { user } = useUser();
  const challenges = useQuery(api.challenges.getChallenges);
  const userProgress = useQuery(api.challenges.getUserProgress, {
    userId: user?.id || ""
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pb-16">
      <Header />
      <main className="container mx-auto px-6 py-12 pb-20">
        {/* Enhanced Header Section */}
        <div className="mb-20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Code2 size={28} className="text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent leading-[1.2] pb-4">
                  Coding Challenges
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Explore a curated collection of programming challenges. Test your skills, learn new concepts, and push your coding abilities to the next level.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
              <Link href="/create">
                <Button size="lg" className="bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary hover:to-primary shadow-lg hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 gap-2 font-semibold border-0 hover:scale-[1.02] active:scale-95">
                  <Plus size={20} className="transition-transform duration-200 group-hover:rotate-90" />
                  Create Challenge
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats/Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12">
            {/* Solved/Total Combined Stat - Premium Neutral Gradient */}
            <div className="group bg-gradient-to-br from-neutral-900 via-neutral-700 to-neutral-900 hover:from-emerald-900 hover:via-emerald-800 hover:to-emerald-900 backdrop-blur-sm border border-neutral-600/50 hover:border-emerald-500/30 rounded-lg p-4 text-center hover:shadow-2xl hover:shadow-emerald-900/25 hover:outline-2 hover:outline-emerald-400/30 transition-all duration-300 hover:-translate-y-1">
              <div className="text-2xl font-bold text-white mb-1">
                {userProgress?.filter(p => p.solved).length || 0}/{challenges?.length || 0}
              </div>
              <div className="text-sm text-gray-300 group-hover:text-white transition-colors">Solved</div>
              <div className="mt-2 w-full bg-white/20 rounded-full h-1 group-hover:bg-white/30 transition-colors">
                <div
                  className="bg-white h-1 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(((userProgress?.filter(p => p.solved).length || 0) / (challenges?.length || 1)) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Easy Stat - Now Green */}
            <div className="group bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-4 text-center hover:shadow-lg hover:shadow-green-500/10 hover:outline hover:outline-1 hover:outline-green-500/30 transition-all duration-300 hover:-translate-y-1 hover:bg-card/70">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {userProgress?.filter(p => p.solved && challenges?.find(c => c._id === p.challengeId)?.difficulty === 'easy').length || 0}/{challenges?.filter(c => c.difficulty === 'easy').length || 0}
              </div>
              <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Easy</div>
            </div>

            {/* Medium Stat */}
            <div className="group bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-4 text-center hover:shadow-lg hover:shadow-yellow-500/10 hover:outline hover:outline-1 hover:outline-yellow-500/30 transition-all duration-300 hover:-translate-y-1 hover:bg-card/70">
              <div className="text-2xl font-bold text-yellow-600 mb-1">
                {userProgress?.filter(p => p.solved && challenges?.find(c => c._id === p.challengeId)?.difficulty === 'medium').length || 0}/{challenges?.filter(c => c.difficulty === 'medium').length || 0}
              </div>
              <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Medium</div>
            </div>

            {/* Hard Stat */}
            <div className="group bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-4 text-center hover:shadow-lg hover:shadow-red-500/10 hover:outline hover:outline-1 hover:outline-red-500/30 transition-all duration-300 hover:-translate-y-1 hover:bg-card/70">
              <div className="text-2xl font-bold text-red-600 mb-1">
                {userProgress?.filter(p => p.solved && challenges?.find(c => c._id === p.challengeId)?.difficulty === 'hard').length || 0}/{challenges?.filter(c => c.difficulty === 'hard').length || 0}
              </div>
              <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Hard</div>
            </div>

            {/* Progress Stat */}
            <div className="group bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-4 text-center hover:shadow-lg hover:shadow-purple-500/10 hover:outline hover:outline-1 hover:outline-purple-500/30 transition-all duration-300 hover:-translate-y-1 hover:bg-card/70">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {Math.round(((userProgress?.filter(p => p.solved).length || 0) / (challenges?.length || 1)) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Progress</div>
              <div className="mt-2 w-full bg-purple-100 rounded-full h-1 group-hover:bg-purple-200 transition-colors">
                <div
                  className="bg-purple-600 h-1 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(((userProgress?.filter(p => p.solved).length || 0) / (challenges?.length || 1)) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Challenges Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {challenges?.map((challenge) => {
            const progress = userProgress?.find(p => p.challengeId === challenge._id);
            return (
              <ChallengeCard
                key={challenge._id}
                challenge={challenge}
                isSolved={progress?.solved || false}
                userId={user?.id}
              />
            );
          }) || (
            <div className="col-span-full text-center py-16">
              <div className="animate-pulse">
                <div className="w-16 h-16 bg-muted rounded-lg mx-auto mb-4"></div>
                <div className="h-4 bg-muted rounded w-48 mx-auto mb-2"></div>
                <div className="h-3 bg-muted rounded w-32 mx-auto"></div>
              </div>
              <p className="text-muted-foreground mt-4">Loading challenges...</p>
            </div>
          )}
        </div>

        {/* Enhanced Empty State */}
        {challenges && challenges.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto space-y-6">
              <div className="relative">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={32} className="text-primary" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-xl"></div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold text-foreground">No challenges yet</h3>
                <p className="text-muted-foreground text-lg">
                  Be the first to create a coding challenge and help others improve their programming skills!
                </p>
              </div>
              <Link href="/create">
                <Button size="lg" className="shadow-lg hover:shadow-xl transition-shadow gap-2">
                  <Plus size={20} />
                  Create Your First Challenge
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
