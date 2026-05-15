import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-[#1C1C1C] mb-2">KashGro Admin</h1>
          <p className="text-gray-500 font-medium">Please sign in to access the dashboard</p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: "bg-[#F8C200] hover:bg-[#E6B400] text-[#1C1C1C] font-black",
              card: "shadow-xl border-none rounded-2xl",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
            }
          }}
        />
      </div>
    </div>
  );
}
