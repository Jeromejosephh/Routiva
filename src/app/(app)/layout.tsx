import Link from "next/link";
import Toaster from "@/components/Toaster";
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";
import Image from "next/image";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProviderWrapper>
      <div className="min-h-screen grid grid-rows-[56px_1fr]">
  <nav className="flex items-center justify-between px-4 border-b" style={{ background: '#000515' }}>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="font-semibold">
            <Image src="/Routivalogoname.png" alt="Routiva Logo" className="h-8 w-auto" style={{maxWidth:120}} width={120} height={32} />
            </Link>
            <Link href="/habits" className="text-sm">
              Habits
            </Link>
            <Link href="/analytics" className="text-sm">
              Analytics
            </Link>
            <Link href="/settings" className="text-sm">
              Settings
            </Link>
          </div>
          <form action="/api/auth/signout" method="post">
            <button className="text-sm border px-3 py-1 rounded transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98] hover:bg-gray-50 dark:hover:bg-gray-700">Sign out</button>
          </form>
        </nav>

        <main className="p-4 max-w-5xl mx-auto w-full">{children}</main>
        <Toaster />
      </div>
    </ThemeProviderWrapper>
  );
}
