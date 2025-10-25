import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="flex justify-between items-center p-6 bg-white border-b shadow-sm">
      <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <Image src="/globe.svg" alt="CodeFun" width={32} height={32} />
        <h1 className="text-2xl font-bold text-gray-900">CodeFun</h1>
      </Link>
      <div className="flex items-center gap-4">
        <SignedIn>
          <Link href="/challenges">
            <Button variant="secondary" size="sm">Challenges</Button>
          </Link>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <Link href="/sign-in">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/sign-up">
            <Button variant="default">Sign Up</Button>
          </Link>
        </SignedOut>
      </div>
    </header>
  );
}