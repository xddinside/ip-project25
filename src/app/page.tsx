 import { SignedIn, SignedOut } from '@clerk/nextjs';
 import Header from '@/components/Header';
 import { Button } from '@/components/ui/button';
 import Link from 'next/link';
 import { Code2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Code2 size={64} className="text-primary opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-xl"></div>
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              CodeFun
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Master coding through challenges. Create, share, and conquer programming exercises that push your skills to the next level.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <SignedOut>
              <Link href="/sign-up">
                <Button size="lg" className="text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-shadow">
                  Start Coding
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                  Sign In
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/challenges">
                <Button size="lg" className="text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-shadow">
                  Explore Challenges
                </Button>
              </Link>
              <Link href="/create">
                <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                  Create Challenge
                </Button>
              </Link>
            </SignedIn>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center space-y-4 p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/70 transition-colors">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Create Challenges</h3>
            <p className="text-muted-foreground">Design custom coding exercises with test cases and solutions</p>
          </div>

          <div className="text-center space-y-4 p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/70 transition-colors">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Practice & Learn</h3>
            <p className="text-muted-foreground">Solve challenges at your own pace and track your progress</p>
          </div>

          <div className="text-center space-y-4 p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/70 transition-colors">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Share & Collaborate</h3>
            <p className="text-muted-foreground">Share your challenges with the community and learn from others</p>
          </div>
        </div>
      </main>
    </div>
  );
}
