"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import {
  Mail,
  MessageCircle,
  MapPin,
  Loader2,
  CheckCircle2,
  Send,
  Phone,
} from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";

// ============================================================================
// CONTACT VIEW
// ============================================================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type FormState = "idle" | "submitting" | "sent" | "error";

interface Props {
  locale: string;
}

export default function ContactView({ locale: _locale }: Props) {
  const t = useTranslations("Contact");

  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    topic: "sales",
    message: "",
  });
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setErrorMsg(t("errorRequired"));
      setState("error");
      return;
    }

    setState("submitting");
    setErrorMsg(null);
    try {
      await axios.post(`${API_URL}/api/public/contact`, form);
      setState("sent");
      setForm({
        name: "",
        email: "",
        company: "",
        phone: "",
        topic: "sales",
        message: "",
      });
    } catch (err: unknown) {
      setState("error");
      const msg =
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { error?: { message?: string } } } })
          .response?.data?.error?.message === "string"
          ? (err as { response: { data: { error: { message: string } } } })
              .response.data.error.message
          : t("errorGeneric");
      setErrorMsg(msg);
    }
  }

  return (
    <div className="container mx-auto px-4 max-w-6xl py-12 md:py-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
            {t("eyebrow")}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact info */}
          <div className="lg:col-span-2 space-y-4">
            <InfoCard
              icon={<Mail className="w-5 h-5" />}
              title={t("channels.email.title")}
              primary="hello@zyrix.co"
              secondary={t("channels.email.subtitle")}
              href="mailto:hello@zyrix.co"
            />
            <InfoCard
              icon={<MessageCircle className="w-5 h-5" />}
              title={t("channels.whatsapp.title")}
              primary="+90 545 221 0888"
              secondary={t("channels.whatsapp.subtitle")}
              href="https://wa.me/905452210888"
            />
            <InfoCard
              icon={<Phone className="w-5 h-5" />}
              title={t("channels.support.title")}
              primary="+90 545 221 0888"
              secondary={t("channels.support.subtitle")}
              href="tel:+905452210888"
            />
            <InfoCard
              icon={<MapPin className="w-5 h-5" />}
              title={t("channels.office.title")}
              primary={t("channels.office.primary")}
              secondary={t("channels.office.subtitle")}
            />

            <div className="rounded-2xl bg-card p-6 border border-border">
              <h3 className="text-sm font-bold text-foreground mb-2">
                {t("hours.title")}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("hours.body")}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm">
              {state === "sent" ? (
                <div className="py-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4 ring-4 ring-emerald-500/10">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    {t("sentTitle")}
                  </h2>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    {t("sentBody")}
                  </p>
                  <button
                    onClick={() => setState("idle")}
                    className="mt-6 text-sm font-semibold text-primary hover:text-primary/80 hover:underline"
                  >
                    {t("sendAnother")}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="text-xl font-bold text-foreground mb-1">
                    {t("formTitle")}
                  </h2>
                  <p className="text-sm text-muted-foreground">{t("formSubtitle")}</p>

                  {errorMsg && (
                    <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label={t("fields.name")} required>
                      <input
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        className="zx-input"
                        autoComplete="name"
                      />
                    </Field>
                    <Field label={t("fields.email")} required>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        className="zx-input"
                        autoComplete="email"
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label={t("fields.company")}>
                      <input
                        value={form.company}
                        onChange={(e) =>
                          setForm({ ...form, company: e.target.value })
                        }
                        className="zx-input"
                        autoComplete="organization"
                      />
                    </Field>
                    <Field label={t("fields.phone")}>
                      <input
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        className="zx-input"
                        autoComplete="tel"
                      />
                    </Field>
                  </div>

                  <Field label={t("fields.topic")}>
                    <select
                      value={form.topic}
                      onChange={(e) =>
                        setForm({ ...form, topic: e.target.value })
                      }
                      className="zx-input"
                    >
                      <option value="sales">{t("topics.sales")}</option>
                      <option value="support">{t("topics.support")}</option>
                      <option value="partnership">
                        {t("topics.partnership")}
                      </option>
                      <option value="press">{t("topics.press")}</option>
                      <option value="other">{t("topics.other")}</option>
                    </select>
                  </Field>

                  <Field label={t("fields.message")} required>
                    <textarea
                      rows={5}
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      className="zx-input resize-y"
                      placeholder={t("fields.messagePlaceholder")}
                    />
                  </Field>

                  <p className="text-xs text-muted-foreground">
                    {t("consent")}
                  </p>

                  <Button
                    type="submit"
                    disabled={state === "submitting"}
                    className="w-full justify-center"
                  >
                    {state === "submitting" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        {t("sending")}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        {t("submit")}
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        :global(.zx-input) {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--card));
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          color: hsl(var(--foreground));
          outline: none;
          transition: border-color 120ms, box-shadow 120ms;
        }
        :global(.zx-input:focus) {
          border-color: hsl(var(--primary));
          box-shadow: 0 0 0 3px hsl(var(--primary) / 0.2);
        }
        :global(.zx-input::placeholder) {
          color: hsl(var(--muted-foreground));
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
        {label}
        {required && <span className="text-destructive ms-0.5">*</span>}
      </span>
      {children}
    </label>
  );
}

function InfoCard({
  icon,
  title,
  primary,
  secondary,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  primary: string;
  secondary: string;
  href?: string;
}) {
  const inner = (
    <div className="flex items-start gap-3 p-4 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-md transition-all duration-300">
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
        {icon}
      </div>
      <div className="min-w-0">
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-1">
          {title}
        </h3>
        <div className="text-sm font-semibold text-foreground truncate" dir="ltr" style={{ unicodeBidi: "embed" }}>{primary}</div>
        <p className="text-xs text-muted-foreground mt-0.5">{secondary}</p>
      </div>
    </div>
  );
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {inner}
      </a>
    );
  }
  return inner;
}
