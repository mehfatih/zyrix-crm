"use client";

import { useState, useEffect, type FormEvent } from "react";
import { X, Loader2 } from "lucide-react";
import { createDeal } from "@/lib/api/deals";
import { listCustomers, type Customer } from "@/lib/api/customers";
import { extractErrorMessage } from "@/lib/api/client";
import { cn } from "@/lib/utils";

interface CreateDealModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateDealModal({ onClose, onSuccess }: CreateDealModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [form, setForm] = useState({
    customerId: "",
    title: "",
    value: "",
    currency: "USD",
    stage: "lead",
    probability: "10",
    expectedCloseDate: "",
    description: "",
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const result = await listCustomers({ limit: 100 });
        setCustomers(result.customers);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCustomers(false);
      }
    };
    fetchCustomers();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await createDeal({
        customerId: form.customerId,
        title: form.title,
        value: form.value ? Number(form.value) : 0,
        currency: form.currency,
        stage: form.stage as "lead" | "qualified" | "proposal" | "negotiation" | "won" | "lost",
        probability: form.probability ? Number(form.probability) : 0,
        expectedCloseDate: form.expectedCloseDate || undefined,
        description: form.description || undefined,
      });
      onSuccess();
    } catch (err) {
      setError(extractErrorMessage(err));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-line-soft px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-semibold text-ink">Create new deal</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-ink-muted hover:text-ink hover:bg-bg-subtle rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-danger-light text-danger-dark text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          {customers.length === 0 && !loadingCustomers && (
            <div className="bg-amber-50 text-amber-800 text-sm p-3 rounded-lg">
              You need to create a customer first before adding a deal.
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">
              Customer <span className="text-danger">*</span>
            </label>
            <select
              name="customerId"
              value={form.customerId}
              onChange={handleChange}
              required
              disabled={loadingCustomers || customers.length === 0}
              className="w-full px-3 py-2 text-sm bg-white border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-bg-subtle"
            >
              <option value="">Select a customer...</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName}{c.companyName ? ` — ${c.companyName}` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">
              Title <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="e.g. Website redesign project"
              className="w-full px-3 py-2 text-sm bg-white border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Value</label>
              <input
                type="number"
                name="value"
                value={form.value}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full px-3 py-2 text-sm bg-white border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Currency</label>
              <select
                name="currency"
                value={form.currency}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm bg-white border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="SAR">SAR</option>
                <option value="AED">AED</option>
                <option value="TRY">TRY</option>
                <option value="EGP">EGP</option>
                <option value="IQD">IQD</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Stage</label>
              <select
                name="stage"
                value={form.stage}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm bg-white border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="lead">Lead</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Proposal</option>
                <option value="negotiation">Negotiation</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">
                Probability (%)
              </label>
              <input
                type="number"
                name="probability"
                value={form.probability}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full px-3 py-2 text-sm bg-white border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">
              Expected close date
            </label>
            <input
              type="date"
              name="expectedCloseDate"
              value={form.expectedCloseDate}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-white border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 text-sm bg-white border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="Deal details, notes, or context..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-medium text-ink-light border border-line rounded-lg hover:bg-bg-subtle"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || customers.length === 0}
              className={cn(
                "flex-1 py-2.5 text-sm font-medium rounded-lg",
                "bg-primary-600 text-white hover:bg-primary-700",
                "disabled:opacity-60 disabled:cursor-not-allowed",
                "flex items-center justify-center gap-2"
              )}
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Create deal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
