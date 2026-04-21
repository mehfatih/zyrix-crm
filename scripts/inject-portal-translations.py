#!/usr/bin/env python3
"""Inject Portal translations into en/ar/tr JSON files."""

import json
from pathlib import Path
from collections import OrderedDict

ROOT = Path(__file__).parent.parent / "messages"

TRANSLATIONS = {
    "en": {
        "Portal": {
            "login": {
                "brandTitle": "Customer Portal",
                "brandSubtitle": "Secure access to your account",
                "title": "Sign in",
                "subtitle": "Enter your email and we'll send you a magic link to sign in — no password required.",
                "emailLabel": "Email address",
                "emailPlaceholder": "you@company.com",
                "submit": "Send me a sign-in link",
                "footerHint": "If your email is registered, you'll receive a link within a minute.",
                "sent": {
                    "title": "Check your inbox",
                    "sentTo": "We sent a sign-in link to",
                    "hint": "The link expires in 15 minutes. If you don't see it, check your spam folder.",
                    "tryAgain": "Use a different email",
                },
            },
            "callback": {
                "title": "Signing you in…",
                "subtitle": "Verifying your magic link",
                "errorTitle": "Couldn't sign you in",
                "backToLogin": "Back to sign in",
                "errors": {
                    "missingToken": "No token found in URL",
                    "invalidToken": "Invalid or expired token",
                },
            },
            "dashboard": {
                "customerPortal": "Customer Portal",
                "welcome": "Welcome, {name}",
                "welcomeSubtitle": "Here's an overview of your account",
                "logout": "Sign out",
                "backToLogin": "Back to sign in",
                "profile": {
                    "title": "Your Profile",
                    "company": "Company",
                    "email": "Email",
                    "phone": "Phone",
                },
                "stats": {
                    "quotes": "Quotes",
                    "contracts": "Contracts",
                    "loyaltyBalance": "Loyalty Points",
                },
                "quotes": {
                    "title": "Your Quotes",
                    "subtitle": "Recent quotes and proposals",
                    "empty": "No quotes yet",
                    "validUntil": "Valid until",
                },
                "contracts": {
                    "title": "Your Contracts",
                    "subtitle": "Active and past agreements",
                    "empty": "No contracts yet",
                    "until": "Until",
                },
                "status": {
                    "draft": "Draft",
                    "sent": "Sent",
                    "viewed": "Viewed",
                    "accepted": "Accepted",
                    "rejected": "Rejected",
                    "expired": "Expired",
                },
                "contractStatus": {
                    "draft": "Draft",
                    "pending_signature": "Pending",
                    "signed": "Signed",
                    "active": "Active",
                    "expired": "Expired",
                    "terminated": "Terminated",
                },
                "footer": {
                    "needHelp": "Need help? Contact",
                },
            },
        },
    },
    "ar": {
        "Portal": {
            "login": {
                "brandTitle": "بوابة العملاء",
                "brandSubtitle": "وصول آمن إلى حسابك",
                "title": "تسجيل الدخول",
                "subtitle": "أدخل بريدك الإلكتروني وسنرسل لك رابط دخول مباشر — لا حاجة لكلمة مرور.",
                "emailLabel": "عنوان البريد",
                "emailPlaceholder": "you@company.com",
                "submit": "أرسل لي رابط الدخول",
                "footerHint": "إذا كان بريدك مسجّلاً، ستستلم الرابط خلال دقيقة.",
                "sent": {
                    "title": "تفقّد بريدك",
                    "sentTo": "أرسلنا رابط الدخول إلى",
                    "hint": "الرابط صالح لمدة 15 دقيقة. إن لم تراه، تفقّد مجلد الرسائل غير المرغوب فيها.",
                    "tryAgain": "استخدم بريدًا آخر",
                },
            },
            "callback": {
                "title": "جاري تسجيل دخولك…",
                "subtitle": "التحقق من الرابط السحري",
                "errorTitle": "تعذّر تسجيل الدخول",
                "backToLogin": "العودة لتسجيل الدخول",
                "errors": {
                    "missingToken": "لم يتم العثور على رمز في الرابط",
                    "invalidToken": "رمز غير صالح أو منتهي",
                },
            },
            "dashboard": {
                "customerPortal": "بوابة العميل",
                "welcome": "مرحبًا، {name}",
                "welcomeSubtitle": "إليك نظرة عامة على حسابك",
                "logout": "تسجيل الخروج",
                "backToLogin": "العودة لتسجيل الدخول",
                "profile": {
                    "title": "ملفّك الشخصي",
                    "company": "الشركة",
                    "email": "البريد",
                    "phone": "الهاتف",
                },
                "stats": {
                    "quotes": "عروض الأسعار",
                    "contracts": "العقود",
                    "loyaltyBalance": "نقاط الولاء",
                },
                "quotes": {
                    "title": "عروض الأسعار الخاصة بك",
                    "subtitle": "العروض والاقتراحات الأخيرة",
                    "empty": "لا توجد عروض بعد",
                    "validUntil": "صالح حتى",
                },
                "contracts": {
                    "title": "عقودك",
                    "subtitle": "الاتفاقيات النشطة والسابقة",
                    "empty": "لا توجد عقود بعد",
                    "until": "حتى",
                },
                "status": {
                    "draft": "مسودة",
                    "sent": "مُرسل",
                    "viewed": "تمّت المعاينة",
                    "accepted": "مقبول",
                    "rejected": "مرفوض",
                    "expired": "منتهي",
                },
                "contractStatus": {
                    "draft": "مسودة",
                    "pending_signature": "بانتظار التوقيع",
                    "signed": "موقّع",
                    "active": "نشط",
                    "expired": "منتهي",
                    "terminated": "مُنهى",
                },
                "footer": {
                    "needHelp": "تحتاج مساعدة؟ تواصل مع",
                },
            },
        },
    },
    "tr": {
        "Portal": {
            "login": {
                "brandTitle": "Müşteri Portalı",
                "brandSubtitle": "Hesabınıza güvenli erişim",
                "title": "Giriş yap",
                "subtitle": "E-postanızı girin, giriş için sihirli bağlantı gönderelim — şifre gerekmez.",
                "emailLabel": "E-posta adresi",
                "emailPlaceholder": "you@company.com",
                "submit": "Giriş bağlantısı gönder",
                "footerHint": "E-postanız kayıtlıysa, bir dakika içinde bağlantıyı alacaksınız.",
                "sent": {
                    "title": "Gelen kutunuzu kontrol edin",
                    "sentTo": "Giriş bağlantısını şu adrese gönderdik:",
                    "hint": "Bağlantı 15 dakika geçerlidir. Görmüyorsanız spam klasörünü kontrol edin.",
                    "tryAgain": "Farklı bir e-posta kullan",
                },
            },
            "callback": {
                "title": "Giriş yapılıyor…",
                "subtitle": "Sihirli bağlantı doğrulanıyor",
                "errorTitle": "Giriş yapılamadı",
                "backToLogin": "Girişe dön",
                "errors": {
                    "missingToken": "URL'de token bulunamadı",
                    "invalidToken": "Geçersiz veya süresi dolmuş token",
                },
            },
            "dashboard": {
                "customerPortal": "Müşteri Portalı",
                "welcome": "Hoş geldin, {name}",
                "welcomeSubtitle": "Hesabınıza genel bakış",
                "logout": "Çıkış yap",
                "backToLogin": "Girişe dön",
                "profile": {
                    "title": "Profiliniz",
                    "company": "Şirket",
                    "email": "E-posta",
                    "phone": "Telefon",
                },
                "stats": {
                    "quotes": "Teklifler",
                    "contracts": "Sözleşmeler",
                    "loyaltyBalance": "Sadakat Puanı",
                },
                "quotes": {
                    "title": "Tekliflerin",
                    "subtitle": "Son teklifler ve öneriler",
                    "empty": "Henüz teklif yok",
                    "validUntil": "Geçerlilik",
                },
                "contracts": {
                    "title": "Sözleşmelerin",
                    "subtitle": "Aktif ve geçmiş anlaşmalar",
                    "empty": "Henüz sözleşme yok",
                    "until": "Bitiş",
                },
                "status": {
                    "draft": "Taslak",
                    "sent": "Gönderildi",
                    "viewed": "Görüntülendi",
                    "accepted": "Kabul",
                    "rejected": "Red",
                    "expired": "Süresi doldu",
                },
                "contractStatus": {
                    "draft": "Taslak",
                    "pending_signature": "İmza Bekliyor",
                    "signed": "İmzalandı",
                    "active": "Aktif",
                    "expired": "Süresi doldu",
                    "terminated": "Feshedildi",
                },
                "footer": {
                    "needHelp": "Yardım mı lazım? İletişim:",
                },
            },
        },
    },
}


def inject(lang: str):
    path = ROOT / f"{lang}.json"
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f, object_pairs_hook=OrderedDict)
    for key, value in TRANSLATIONS[lang].items():
        data[key] = value
    with path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"  wrote {path}")


def main():
    for lang in ("en", "ar", "tr"):
        inject(lang)
    print("translations injected")


if __name__ == "__main__":
    main()
