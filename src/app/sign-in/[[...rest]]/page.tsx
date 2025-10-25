import { SignIn } from '@clerk/nextjs';
import Header from '@/components/Header';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex items-center justify-center py-12">
        <SignIn />
      </div>
    </div>
  );
}