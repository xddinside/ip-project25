 import { SignedIn, SignedOut } from '@clerk/nextjs';
 import Header from '@/components/Header';
 import { Button } from '@/components/ui/button';
 import Link from 'next/link';
 import { Code2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      <main className="flex-1 flex items-center justify-center px-6 pt-12">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto space-y-8 -translate-y-30">
            <div className="flex justify-center">
              <div className="relative">
                <Code2 size={64} className="text-primary opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-xl"></div>
              </div>
            </div>
          <div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-6">
              CodeFun
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Master coding through challenges. Create, share, and conquer programming exercises that push your skills to the next level.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <SignedOut>
              <Link href="/sign-up">
                <Button size="lg" className="text-xl px-12 py-4 bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary hover:to-primary shadow-2xl hover:shadow-primary/40 transition-all duration-300 font-semibold border-0">
                  Start Coding
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button variant="outline" size="lg" className="text-xl px-12 py-4 font-semibold">
                  Sign In
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/challenges">
                <Button size="lg" className="text-xl px-12 py-4 bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary hover:to-primary shadow-2xl hover:shadow-primary/40 transition-all duration-300 font-semibold border-0">
                  Explore Challenges
                </Button>
              </Link>
              <Link href="/create">
                <Button variant="outline" size="lg" className="text-xl px-12 py-4 font-semibold">
                  Create Challenge
                </Button>
              </Link>
            </SignedIn>
          </div>
        </div>
      </main>
    </div>
  );
}
