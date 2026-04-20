"use client";

import { useState, type FormEvent } from "react";
import { Loader2, CheckCircle2, User, Phone, Mail } from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import { updateProfileApi } from "@/lib/api/auth";
import { extractErrorMessage } from "@/lib/api/client";
import { cn } from "@/lib/utils";

export function ProfileTab() {
  const { user, refresh } = useAuth();

  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      await updateProfileApi({
        fullName: form.fullName,
        phone: form.phone || undefined,
      });
      await refresh();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
      <h2 className="text-lg font-bold text-ink">Personal Information</h2>

      {error && (
        <div className="bg-danger-light text-danger-dark text-sm p-3 rounded-lg border border-danger/20">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-success-light text-success-dark text-sm p-3 rounded-lg border border-success/20 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Profile updated successfully
        </div>
      )}

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-ink">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-bg-subtle border border-line rounded-lg text-ink-light cursor-not-allowed"
          />
        </div>
        <p className="text-xs text-ink-muted">Email cannot be changed</p>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="fullName" className="block text-sm font-medium text-ink">
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <input
            id="fullName"
            type="text"
            required
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="phone" className="block text-sm font-medium text-ink">
          Phone
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+90 555 000 0000"
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "px-6 py-2.5 text-sm font-medium rounded-lg bg-primary-600 text-white",
          "hover:bg-primary-700 disabled:opacity-60",
          "flex items-center gap-2 transition-all"
        )}
      >
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        Save changes
      </button>
    </form>
  );
}
