// ────────────────────────────────────────────────────────────────────
// Sprint 14ah — Testimonials
// One REAL founder note (Mehmet) + two PLACEHOLDER cards that invite
// the visitor to be the next testimonial. When real customers go live,
// edit the placeholder objects in place — the layout stays identical.
// See messages/PLACEHOLDERS.md for the replacement checklist.
// ────────────────────────────────────────────────────────────────────

type I18n = { en: string; ar: string; tr: string };

export interface Testimonial {
  id: string;
  isFounder: boolean;
  name: string;
  initials: string;
  role: I18n;
  quote: I18n;
}

export const TESTIMONIALS: ReadonlyArray<Testimonial> = [
  // REAL — Mehmet's founder note. Stays.
  {
    id: "founder",
    isFounder: true,
    name: "Mehmet",
    initials: "M",
    role: {
      en: "Founder, Zyrix CRM",
      ar: "المؤسس، Zyrix CRM",
      tr: "Kurucu, Zyrix CRM",
    },
    quote: {
      en: "I built Zyrix because I run an e-commerce business across MENA and Türkiye, and every CRM I tried either ignored Arabic, mispriced for our markets, or was bloated with features I didn't need. Zyrix is the CRM I wished existed — fast, regional, and built around how Arab and Turkish merchants actually sell.",
      ar: "بنيت Zyrix لأنني أدير تجارة إلكترونية في الشرق الأوسط وتركيا، وكل CRM جرّبته إما تجاهل العربية، أو سعّر بشكل خاطئ لأسواقنا، أو كان مثقلاً بميزات لا أحتاجها. Zyrix هو الـ CRM الذي تمنّيت وجوده — سريع، إقليمي، ومبني حول الطريقة التي يبيع بها التجار العرب والأتراك فعلاً.",
      tr: "Zyrix'i kurma sebebim şu: MENA ve Türkiye'de bir e-ticaret işi yürütüyorum ve denediğim her CRM ya Arapça'yı görmezden geldi, ya pazarlarımız için yanlış fiyatlandırma yaptı, ya da ihtiyacım olmayan özelliklerle şişkindi. Zyrix, var olmasını dilediğim CRM — hızlı, bölgesel ve Arap ile Türk tüccarların gerçekte nasıl sattığına göre tasarlanmış.",
    },
  },

  // PLACEHOLDER — replace with a real customer testimonial when one becomes available.
  // The card visually invites the visitor to be the next testimonial.
  {
    id: "placeholder-1",
    isFounder: false,
    name: "Your story",
    initials: "Y",
    role: {
      en: "CEO, [Company]",
      ar: "الرئيس التنفيذي، [الشركة]",
      tr: "CEO, [Şirket]",
    },
    quote: {
      en: "Tell us how Zyrix helped your business — we'd love to feature your story here.",
      ar: "أخبرنا كيف ساعد Zyrix عملك — يسعدنا عرض قصتك هنا.",
      tr: "Zyrix'in işinize nasıl yardımcı olduğunu anlatın — hikayenizi burada paylaşmaktan mutluluk duyarız.",
    },
  },

  // PLACEHOLDER — replace with a real customer testimonial when one becomes available.
  {
    id: "placeholder-2",
    isFounder: false,
    name: "Your team",
    initials: "Y",
    role: {
      en: "Sales Director, [Company]",
      ar: "مدير المبيعات، [الشركة]",
      tr: "Satış Direktörü, [Şirket]",
    },
    quote: {
      en: "Share what you love about Zyrix — your testimonial will appear in this spot.",
      ar: "شاركنا ما تحبّه في Zyrix — ستظهر شهادتك في هذا المكان.",
      tr: "Zyrix hakkında sevdiklerinizi paylaşın — referansınız bu konumda görünecek.",
    },
  },
];
