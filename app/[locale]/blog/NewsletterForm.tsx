"use client";

import { ArrowRight } from "lucide-react";

interface NewsletterFormProps {
  placeholder: string;
  cta: string;
}

export function NewsletterForm({ placeholder, cta }: NewsletterFormProps) {
  return (
    <form
      className="flex flex-wrap gap-3 justify-center max-w-md mx-auto"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder={placeholder}
        aria-label={placeholder}
        className="flex-1 min-w-[200px] px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
      />
      <button
        type="submit"
        className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        {cta}
        <ArrowRight className="w-4 h-4 rtl:rotate-180" />
      </button>
    </form>
  );
}
