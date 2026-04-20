"use client";

import { useState, type FormEvent } from "react";
import { X, Loader2 } from "lucide-react";
import { createCustomer } from "@/lib/api/customers";
import { extractErrorMessage } from "@/lib/api/client";
import { cn } from "@/lib/utils";

interface CreateCustomerModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateCustomerModal({
  onClose,
  onSuccess,
}: CreateCustomerModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    position: "",
    country: "",
    city: "",
    status: "new",
    notes: "",
  });

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
      await createCustomer({
        fullName: form.fullName,
        email: form.email || undefined,
        phone: form.phone || undefined,
        companyName: form.companyName || undefined,
        position: form.position || undefined,
        country: form.country || undefined,
        city: form.city || undefined,
        status: form.status,
        notes: form.notes || undefined,
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
          <h2 className="text-lg font-semibold text-ink">Add new customer</h2>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full name" name="fullName" value={form.fullName} onChange={handleChange} required />
            <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
            <Field label="Phone / WhatsApp" name="phone" value={form.phone} onChange={handleChange} />
            <Field label="Company" name="companyName" value={form.companyName} onChange={handleChange} />
            <Field label="Position" name="position" value={form.position} onChange={handleChange} />
            <SelectField
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
              options={[
                { value: "new", label: "New" },
                { value: "qualified", label: "Qualified" },
                { value: "customer", label: "Customer" },
                { value: "lost", label: "Lost" },
              ]}
            />
            <Field label="Country" name="country" value={form.country} onChange={handleChange} />
            <Field label="City" name="city" value={form.city} onChange={handleChange} />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 text-sm bg-white border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="Any additional context..."
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
              disabled={isSubmitting}
              className={cn(
                "flex-1 py-2.5 text-sm font-medium rounded-lg",
                "bg-primary-600 text-white hover:bg-primary-700",
                "disabled:opacity-60",
                "flex items-center justify-center gap-2"
              )}
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Create customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field(props: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink mb-1.5">
        {props.label}{" "}
        {props.required && <span className="text-danger">*</span>}
      </label>
      <input
        type={props.type || "text"}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        required={props.required}
        className="w-full px-3 py-2 text-sm bg-white border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
    </div>
  );
}

function SelectField(props: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink mb-1.5">
        {props.label}
      </label>
      <select
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        className="w-full px-3 py-2 text-sm bg-white border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        {props.options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
