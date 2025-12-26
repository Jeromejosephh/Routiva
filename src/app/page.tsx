import Image from "next/image";
import Link from "next/link";
import LandingCarousel from "@/components/LandingCarousel";

export default function Home() {
  return (
    <div
      className="landing-page min-h-screen w-full flex items-center justify-center px-8 py-12"
      style={{ backgroundColor: '#000000' }}
    >
      <main className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-start bg-transparent">
        {/* Left side - Content */}
        <div className="space-y-8 flex flex-col justify-start">
          <div className="flex items-center gap-4">
            <Image src="/Routivalogo.png" alt="Routiva Logo" width={60} height={60} className="rounded-xl shadow-lg" priority />
            <h1 className="text-4xl lg:text-5xl font-extrabold text-blue-900 dark:text-white">Routiva</h1>
          </div>
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-blue-900 dark:text-white">Transform Your Routine</h2>
            <p className="text-lg text-gray-700 dark:text-gray-200">
              A simple, effective habit tracking app that helps you build consistent habits, track your progress, and achieve your goals. 100% FREE, privacy-first, and beautifully designed.
            </p>
          </div>
          <Link href="/sign-in" className="inline-block px-8 py-4 rounded-lg bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition">
            Get Started
          </Link>
          <div className="grid grid-cols-1 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-gray-900 shadow ring-gradient-bb">
              <h3 className="text-lg font-bold mb-1 text-blue-800 dark:text-blue-200">Track Habits</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Easily add, organize, and manage your daily habits. Stay consistent and motivated.</p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-gray-900 shadow ring-gradient-bb">
              <h3 className="text-lg font-bold mb-1 text-blue-800 dark:text-blue-200">Beautiful Analytics</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Visualize your progress with streaks, heatmaps, and completion rates. Celebrate your wins!</p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-gray-900 shadow ring-gradient-bb">
              <h3 className="text-lg font-bold mb-1 text-blue-800 dark:text-blue-200">Privacy-First</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Your data is secure and never sold. Routiva is free, with no ads or tracking.</p>
            </div>
          </div>
        </div>
        {/* Right side - Carousel aligned with title */}
        <div className="hidden lg:flex flex-col items-center justify-start pt-2">
          <LandingCarousel />
        </div>
      </main>
    </div>
  );
}