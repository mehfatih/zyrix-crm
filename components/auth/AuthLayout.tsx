import Link from "next/link";
import Image from "next/image";
import { type ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  locale: string;
  title: string;
  subtitle: string;
}

export function AuthLayout({
  children,
  locale,
  title,
  subtitle,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 via-cyan-50 to-sky-100">
      {/* Header */}
      <header className="w-full px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-ink hover:text-primary-600 transition-colors"
          >
            <Image
              src="/logo.png"
              alt="Zyrix CRM"
              width={36}
              height={36}
              className="rounded-lg"
            />
            <span className="text-xl font-bold">Zyrix CRM</span>
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-line-soft p-8 sm:p-10">
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-ink mb-2">
                {title}
              </h1>
              <p className="text-ink-light text-sm sm:text-base">{subtitle}</p>
            </div>

            {children}
          </div>

          {/* Footer hint */}
          <p className="text-center text-xs text-ink-muted mt-6">
            &copy; {new Date().getFullYear()} Zyrix. Built for MENA & Turkey.
          </p>
        </div>
      </main>
    </div>
  );
}