import { SignUp } from '@clerk/nextjs';
import Header from '@/components/Header';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex items-center justify-center py-12">
        <SignUp />
      </div>
    </div>
  );
}