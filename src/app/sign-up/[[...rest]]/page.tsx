import { SignUp } from '@clerk/nextjs';
import Header from '@/components/Header';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <SignUp />
        </div>
      </div>
    </div>
  );
}