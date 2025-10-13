import Link from "next/link";

export default function SignOutPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-xl backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col items-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mb-4">
            <circle cx="12" cy="12" r="12" fill="#2563eb" fillOpacity="0.15" />
            <path d="M16 17v-1a4 4 0 00-8 0v1" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 11v-4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="7" r="1" fill="#2563eb" />
          </svg>
          <h1 className="text-2xl font-bold text-blue-700 dark:text-white mb-2">Signed Out</h1>
          <p className="text-gray-700 dark:text-gray-300 mb-6 text-center">You have been securely signed out of Routiva.<br />Thank you for using our app!</p>
          <Link href="/sign-in" className="inline-block px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">Sign In Again</Link>
        </div>
      </div>
    </div>
  );
}
