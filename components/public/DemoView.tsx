"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  Loader2,
  CheckCircle2,
  CalendarCheck2,
  Play,
  MessageCircle,
  Users,
  Zap,
} from "lucide-react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type FormState = "idle" | "submitting" | "sent" | "error";

interface Props {
  locale: string;
}

export default function DemoView({ locale }: Props) {
  const t = useTranslations("Demo");

  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    teamSize: "1-5",
    message: "",
  });
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setErrorMsg(t("errorRequired"));
      setState("error");
      return;
    }

    setState("submitting");
    setErrorMsg(null);
    try {
      await axios.post(`${API_URL}/api/public/contact`, {
        name: form.name,
        email: form.email,
        company: form.company,
        phone: form.phone,
        topic: "sales",
        message: `[DEMO REQUEST] Team size: ${form.teamSize}. ${form.message || "(no additional message)"}`,
      });
      setState("sent");
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
    <div className="container-zyrix py-12 md:py-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Left: pitch */}
        <div className="lg:col-span-2">
          <p className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-3">
            {t("eyebrow")}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-ink-mid mb-4">
            {t("title")}
          </h1>
          <p className="text-base md:text-lg text-ink-light leading-relaxed mb-8">
            {t("subtitle")}
          </p>

          <div className="space-y-4 mb-8">
            <PitchItem
              icon={<Play className="w-4 h-4" />}
              title={t("included.walkthrough.title")}
              body={t("included.walkthrough.body")}
            />
            <PitchItem
              icon={<MessageCircle className="w-4 h-4" />}
              title={t("included.whatsapp.title")}
              body={t("included.whatsapp.body")}
            />
            <PitchItem
              icon={<Zap className="w-4 h-4" />}
              title={t("included.qa.title")}
              body={t("included.qa.body")}
            />
            <PitchItem
              icon={<Users className="w-4 h-4" />}
              title={t("included.team.title")}
              body={t("included.team.body")}
            />
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-primary-50 via-sky-50 to-cyan-50 border border-primary-100 p-5">
            <p className="text-sm font-semibold text-ink-mid mb-1">
              {t("prefer.title")}
            </p>
            <p className="text-sm text-ink-light leading-relaxed">
              {t("prefer.body")}{" "}
              <Link
                href={`/${locale}/signup`}
                className="text-primary-600 font-semibold hover:underline"
              >
                {t("prefer.cta")}
              </Link>
            </p>
          </div>
        </div>

        {/* Right: form */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-line-soft p-6 md:p-8 shadow-sm">
            {state === "sent" ? (
              <div className="py-10 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5 ring-4 ring-emerald-50">
                  <CalendarCheck2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-ink-mid mb-3">
                  {t("sentTitle")}
                </h2>
                <p className="text-base text-ink-light max-w-md mx-auto mb-6">
                  {t("sentBody")}
                </p>
                <Link
                  href={`/${locale}/features`}
                  className="text-sm font-semibold text-primary-600 hover:text-primary-700 hover:underline"
                >
                  {t("meanwhile")}
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-ink-mid mb-1">
                    {t("formTitle")}
                  </h2>
                  <p className="text-sm text-ink-light">
                    {t("formSubtitle")}
                  </p>
                </div>

                {errorMsg && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-800">
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

                <Field label={t("fields.teamSize")}>
                  <select
                    value={form.teamSize}
                    onChange={(e) =>
                      setForm({ ...form, teamSize: e.target.value })
                    }
                    className="zx-input"
                  >
                    <option value="1-5">{t("teamSizes.s1")}</option>
                    <option value="6-20">{t("teamSizes.s2")}</option>
                    <option value="21-50">{t("teamSizes.s3")}</option>
                    <option value="51-200">{t("teamSizes.s4")}</option>
                    <option value="200+">{t("teamSizes.s5")}</option>
                  </select>
                </Field>

                <Field label={t("fields.message")}>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    className="zx-input resize-y"
                    placeholder={t("fields.messagePlaceholder")}
                  />
                </Field>

                <p className="text-xs text-ink-light">{t("consent")}</p>

                <button
                  type="submit"
                  disabled={state === "submitting"}
                  className="btn-cta w-full justify-center"
                >
                  {state === "submitting" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t("sending")}
                    </>
                  ) : (
                    <>
                      <CalendarCheck2 className="w-4 h-4" />
                      {t("submit")}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .zx-input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid rgb(186 230 253);
          background: white;
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          color: rgb(22 78 99);
          outline: none;
          transition: border-color 120ms, box-shadow 120ms;
        }
        .zx-input:focus {
          border-color: rgb(8 145 178);
          box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.15);
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
      <span className="block text-xs font-bold uppercase tracking-wider text-ink-mid mb-1.5">
        {label}
        {required && <span className="text-red-500 ms-0.5">*</span>}
      </span>
      {children}
    </label>
  );
}

function PitchItem({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center mt-0.5">
        <CheckCircle2 className="w-4 h-4" />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-primary-600">{icon}</span>
          <h4 className="text-sm font-bold text-ink-mid">{title}</h4>
        </div>
        <p className="text-sm text-ink-light leading-relaxed">{body}</p>
      </div>
    </div>
  );
}
