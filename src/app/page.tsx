import { SignedIn, SignedOut } from '@clerk/nextjs';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-foreground">Welcome to CodeFun</h1>
          <p className="text-xl text-muted-foreground max-w-md">
            Store and review coding exercises. Challenge yourself and grow your skills.
          </p>
          <SignedOut>
            <Link href="/sign-in">
              <Button size="lg" className="text-lg px-8 py-3">
                Get Started
              </Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/challenges">
              <Button size="lg" className="text-lg px-8 py-3">
                Get Started
              </Button>
            </Link>
          </SignedIn>
        </div>
      </main>
    </div>
  );
}
