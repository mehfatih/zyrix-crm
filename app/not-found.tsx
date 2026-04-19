import Link from "next/link";
import Image from "next/image";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center hero-bg relative overflow-hidden px-4 font-inter">
      <div
        className="absolute inset-0 bg-grid-pattern bg-grid-lg opacity-30 pointer-events-none"
        aria-hidden="true"
      />

      <div
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-200 rounded-full opacity-30 blur-3xl animate-float pointer-events-none"
        aria-hidden="true"
      />

      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-sky-200 rounded-full opacity-30 blur-3xl animate-float pointer-events-none"
        style={{ animationDelay: "1s" }}
        aria-hidden="true"
      />

      <div className="relative max-w-2xl mx-auto text-center">
        <Link
          href="/en"
          className="inline-flex items-center gap-3 mb-12 group"
          aria-label="Zyrix CRM Home"
        >
          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white shadow-md border border-line-soft group-hover:shadow-lg transition-shadow duration-300">
            <Image
              src="/logo.png"
              alt="Zyrix"
              fill
              sizes="48px"
              className="object-contain p-1"
              priority
            />
          </div>
          <span className="text-xl font-bold text-ink-mid">
            <span className="text-primary-600">CRM</span>
          </span>
        </Link>

        <div className="mb-8 animate-fade-in">
          <h1 className="text-[120px] md:text-[180px] font-black leading-none text-gradient tracking-tighter select-none">
            404
          </h1>
        </div>

        <div className="animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-bold text-ink-mid mb-4">
            Page not found
          </h2>

          <p className="text-lg text-ink-light mb-10 max-w-lg mx-auto leading-relaxed">
            The page you are looking for does not exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/en"
              className="btn-cta text-base py-4 px-8 w-full sm:w-auto"
            >
              <Home className="w-5 h-5" />
              Back to home
            </Link>

            <Link
              href="/en/contact"
              className="btn-secondary text-base py-4 px-8 w-full sm:w-auto"
            >
              Contact support
            </Link>
          </div>
        </div>

        <p className="text-sm text-ink-light mt-16">
          Need help? Email our team at support@zyrix.co
        </p>
      </div>
    </main>
  );
}