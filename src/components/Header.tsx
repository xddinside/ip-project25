 import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
 import { Button } from '@/components/ui/button';
 import { Code2, Target } from 'lucide-react';
 import Link from 'next/link';

export default function Header() {
  return (
    <header className="flex justify-between items-center p-6 bg-white border-b shadow-sm">
      <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
         <Code2 size={32} className="text-primary" />
         <h1 className="text-2xl font-bold text-gray-900">CodeFun</h1>
       </Link>
      <div className="flex items-center gap-4">
        <SignedIn>
           <Link href="/challenges">
             <Button
               variant="secondary"
               size="sm"
               className="group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-md hover:shadow-primary/20 active:scale-95 gap-2"
             >
               <Target size={16} className="transition-transform duration-200 group-hover:rotate-12" />
               Challenges
               <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
             </Button>
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