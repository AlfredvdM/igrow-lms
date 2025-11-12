import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">IGrow Rentals</h1>
          <p className="mt-2 text-sm text-gray-600">Lead Management System</p>
        </div>

        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-lg rounded-lg border border-gray-200",
              headerTitle: "text-2xl font-bold text-gray-900",
              headerSubtitle: "text-sm text-gray-600",
              socialButtonsBlockButton: "border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium",
              formButtonPrimary: "bg-brand-600 hover:bg-brand-700 text-white font-semibold",
              formFieldInput: "border-gray-300 focus:border-brand-500 focus:ring-brand-500",
              footerActionLink: "text-brand-600 hover:text-brand-700 font-medium",
            }
          }}
        />
      </div>
    </div>
  );
}
