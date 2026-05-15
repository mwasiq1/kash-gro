import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F6FA]">
      <SignUp routing="hash" signInUrl="/sign-in" />
    </div>
  );
}
