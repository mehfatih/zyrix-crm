"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Mail, MapPin, Phone } from "lucide-react";

// ============================================================================
// PUBLIC FOOTER — professional, with brand-colored social icons (SVG inline)
// ============================================================================

const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/company/zyrixpaymentgateway/",
  youtube: "https://www.youtube.com/channel/UCVyXMyeREfajczEsDTzjWjg",
  instagram: "https://www.instagram.com/zyrixglobaltechnology/",
  facebook: "https://www.facebook.com/profile.php?id=61577528348196",
  x: "https://x.com/Zyrixglobal",
};

const FOOTER_LABELS: Record<
  string,
  {
    tagline: string;
    sections: {
      product: string;
      company: string;
      resources: string;
      legal: string;
    };
    links: {
      features: string;
      pricing: string;
      demo: string;
      aiCfo: string;
      whatsapp: string;
      about: string;
      contact: string;
      blog: string;
      changelog: string;
      status: string;
      docs: string;
      api: string;
      support: string;
      privacy: string;
      terms: string;
      security: string;
    };
    contact: { headquarters: string; address: string; email: string };
    rights: string;
    madeIn: string;
  }
> = {
  en: {
    tagline:
      "The WhatsApp-native CRM built for MENA, Turkey, and emerging markets. AI-powered. Arabic-first. Trusted by growing businesses.",
    sections: {
      product: "Product",
      company: "Company",
      resources: "Resources",
      legal: "Legal",
    },
    links: {
      features: "Features",
      pricing: "Pricing",
      demo: "Book a demo",
      aiCfo: "AI CFO",
      whatsapp: "WhatsApp CRM",
      about: "About us",
      contact: "Contact",
      blog: "Blog",
      changelog: "Changelog",
      status: "System status",
      docs: "Documentation",
      api: "API reference",
      support: "Help center",
      privacy: "Privacy policy",
      terms: "Terms of service",
      security: "Security",
    },
    contact: {
      headquarters: "Headquarters",
      address: "Istanbul, Türkiye",
      email: "hello@zyrix.co",
    },
    rights: "All rights reserved.",
    madeIn: "Made with ♡ in Istanbul",
  },
  ar: {
    tagline:
      "نظام إدارة علاقات العملاء الأول المدمج مع واتساب لأسواق الشرق الأوسط وتركيا. مدعوم بالذكاء الاصطناعي. عربي أولاً.",
    sections: {
      product: "المنتج",
      company: "الشركة",
      resources: "المصادر",
      legal: "قانوني",
    },
    links: {
      features: "المميزات",
      pricing: "الأسعار",
      demo: "احجز تجربة",
      aiCfo: "المدير المالي الذكي",
      whatsapp: "واتساب CRM",
      about: "من نحن",
      contact: "تواصل معنا",
      blog: "المدوّنة",
      changelog: "آخر التحديثات",
      status: "حالة النظام",
      docs: "الوثائق",
      api: "مرجع API",
      support: "مركز المساعدة",
      privacy: "سياسة الخصوصية",
      terms: "شروط الخدمة",
      security: "الأمان",
    },
    contact: {
      headquarters: "المقر الرئيسي",
      address: "إسطنبول، تركيا",
      email: "hello@zyrix.co",
    },
    rights: "جميع الحقوق محفوظة.",
    madeIn: "صُنع بـ ♡ في إسطنبول",
  },
  tr: {
    tagline:
      "MENA, Türkiye ve gelişen pazarlar için WhatsApp tabanlı CRM. Yapay zeka destekli. Arapça öncelikli. Büyüyen işletmelerin tercihi.",
    sections: {
      product: "Ürün",
      company: "Şirket",
      resources: "Kaynaklar",
      legal: "Yasal",
    },
    links: {
      features: "Özellikler",
      pricing: "Fiyatlandırma",
      demo: "Demo al",
      aiCfo: "AI CFO",
      whatsapp: "WhatsApp CRM",
      about: "Hakkımızda",
      contact: "İletişim",
      blog: "Blog",
      changelog: "Güncellemeler",
      status: "Sistem durumu",
      docs: "Dokümantasyon",
      api: "API referansı",
      support: "Yardım merkezi",
      privacy: "Gizlilik politikası",
      terms: "Kullanım şartları",
      security: "Güvenlik",
    },
    contact: {
      headquarters: "Genel Merkez",
      address: "İstanbul, Türkiye",
      email: "hello@zyrix.co",
    },
    rights: "Tüm hakları saklıdır.",
    madeIn: "İstanbul'da ♡ ile yapıldı",
  },
};

export default function PublicFooter() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const t = FOOTER_LABELS[locale] || FOOTER_LABELS.en;

  return (
    <footer className="bg-slate-900 text-slate-300 relative overflow-hidden">
      {/* Top decorative gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-40 bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Top grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-4">
            <Link
              href={`/${locale}`}
              className="flex items-center gap-3 mb-4 group"
            >
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-cyan-500 to-sky-600 shadow-lg shadow-cyan-500/20">
                <Image
                  src="/logo.png"
                  alt="Zyrix"
                  fill
                  sizes="40px"
                  className="object-contain p-1"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-bold text-white tracking-tight">
                  Zyrix
                </span>
                <span className="text-[10px] font-semibold tracking-[0.2em] text-cyan-400 uppercase">
                  CRM
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mb-6">
              {t.tagline}
            </p>

            {/* Social icons with brand colors */}
            <div className="flex items-center gap-2">
              <SocialLink href={SOCIAL_LINKS.linkedin} label="LinkedIn">
                <LinkedInIcon />
              </SocialLink>
              <SocialLink href={SOCIAL_LINKS.x} label="X (Twitter)">
                <XIcon />
              </SocialLink>
              <SocialLink href={SOCIAL_LINKS.facebook} label="Facebook">
                <FacebookIcon />
              </SocialLink>
              <SocialLink href={SOCIAL_LINKS.instagram} label="Instagram">
                <InstagramIcon />
              </SocialLink>
              <SocialLink href={SOCIAL_LINKS.youtube} label="YouTube">
                <YouTubeIcon />
              </SocialLink>
            </div>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            <FooterColumn title={t.sections.product}>
              <FooterLink href={`/${locale}/features`}>{t.links.features}</FooterLink>
              <FooterLink href={`/${locale}/pricing`}>{t.links.pricing}</FooterLink>
              <FooterLink href={`/${locale}/demo`}>{t.links.demo}</FooterLink>
              <FooterLink href={`/${locale}/features#ai-cfo`}>{t.links.aiCfo}</FooterLink>
              <FooterLink href={`/${locale}/features#whatsapp`}>{t.links.whatsapp}</FooterLink>
            </FooterColumn>

            <FooterColumn title={t.sections.company}>
              <FooterLink href={`/${locale}/about`}>{t.links.about}</FooterLink>
              <FooterLink href={`/${locale}/contact`}>{t.links.contact}</FooterLink>
              <FooterLink href="#" disabled>{t.links.blog}</FooterLink>
              <FooterLink href="#" disabled>{t.links.changelog}</FooterLink>
            </FooterColumn>

            <FooterColumn title={t.sections.resources}>
              <FooterLink href="#" disabled>{t.links.docs}</FooterLink>
              <FooterLink href="#" disabled>{t.links.api}</FooterLink>
              <FooterLink href={`/${locale}/contact`}>{t.links.support}</FooterLink>
              <FooterLink href="#" disabled>{t.links.status}</FooterLink>
            </FooterColumn>

            <FooterColumn title={t.sections.legal}>
              <FooterLink href={`/${locale}/privacy`}>{t.links.privacy}</FooterLink>
              <FooterLink href={`/${locale}/terms`}>{t.links.terms}</FooterLink>
              <FooterLink href="#" disabled>{t.links.security}</FooterLink>
            </FooterColumn>
          </div>
        </div>

        {/* Contact strip */}
        <div className="border-t border-slate-800 py-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <ContactItem icon={MapPin} label={t.contact.headquarters} value={t.contact.address} />
          <ContactItem icon={Mail} label="Email" value={t.contact.email} href={`mailto:${t.contact.email}`} />
          <ContactItem
            icon={Phone}
            label="WhatsApp"
            value="+90 545 221 0888"
            href="https://wa.me/905452210888"
          />
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-4 flex-wrap">
            <span>
              © {new Date().getFullYear()} Zyrix Global Technology. {t.rights}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-500">{t.madeIn}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================================================
// Reusable bits
// ============================================================================
function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
        {title}
      </h4>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
  disabled,
}: {
  href: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  if (disabled) {
    return (
      <li>
        <span className="text-sm text-slate-500 cursor-not-allowed">
          {children}
        </span>
      </li>
    );
  }
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-slate-400 hover:text-cyan-400 transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}

function ContactItem({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-center gap-3 group">
      <div className="w-9 h-9 rounded-lg bg-slate-800 group-hover:bg-slate-700 flex items-center justify-center flex-shrink-0 transition-colors">
        <Icon className="w-4 h-4 text-cyan-400" />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] uppercase text-slate-500 font-semibold tracking-wider">
          {label}
        </div>
        <div className="text-sm text-slate-300 truncate">{value}</div>
      </div>
    </div>
  );
  if (href) {
    return <a href={href}>{content}</a>;
  }
  return content;
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg"
    >
      {children}
    </a>
  );
}

// ============================================================================
// Brand-colored social icons (SVG — inline)
// ============================================================================
function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="#0A66C2"
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="#FFFFFF"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="#1877F2"
        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ig-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFDC80" />
          <stop offset="20%" stopColor="#FCAF45" />
          <stop offset="40%" stopColor="#F77737" />
          <stop offset="60%" stopColor="#F56040" />
          <stop offset="80%" stopColor="#FD1D1D" />
          <stop offset="100%" stopColor="#833AB4" />
        </linearGradient>
      </defs>
      <path
        fill="url(#ig-gradient)"
        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
      />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="#FF0000"
        d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
      />
    </svg>
  );
}
