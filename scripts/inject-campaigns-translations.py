#!/usr/bin/env python3
"""Inject Campaigns translations into en/ar/tr JSON files."""

import json
from pathlib import Path
from collections import OrderedDict

ROOT = Path(__file__).parent.parent / "messages"

TRANSLATIONS = {
    "en": {
        "Campaigns": {
            "title": "Campaigns",
            "subtitle": "Email marketing and multi-channel outreach — send to segmented audiences",
            "newCampaign": "New Campaign",
            "channel": {
                "email": "Email",
                "whatsapp": "WhatsApp",
                "sms": "SMS",
            },
            "status": {
                "draft": "Draft",
                "scheduled": "Scheduled",
                "sending": "Sending",
                "sent": "Sent",
                "failed": "Failed",
                "cancelled": "Cancelled",
            },
            "recipientStatus": {
                "queued": "Queued",
                "sent": "Sent",
                "delivered": "Delivered",
                "opened": "Opened",
                "clicked": "Clicked",
                "bounced": "Bounced",
                "failed": "Failed",
            },
            "stats": {
                "total": "Total",
                "totalSent": "Messages Sent",
                "totalOpens": "Opens",
                "openRate": "Open Rate",
            },
            "table": {
                "name": "Name",
                "channel": "Channel",
                "status": "Status",
                "recipients": "Recipients",
                "sent": "Sent",
                "created": "Created",
            },
            "empty": {
                "title": "No campaigns yet",
                "subtitle": "Create your first email campaign to reach segmented audiences",
            },
            "wizard": {
                "title": "New Campaign",
                "step": "Step {step} of {total}",
                "beta": "beta",
                "scheduleHint": "Leave empty to send immediately from the list, or pick a future time",
                "steps": {
                    "channel": "Channel",
                    "audience": "Audience",
                    "content": "Content",
                    "review": "Review",
                },
                "fields": {
                    "name": "Campaign name",
                    "namePlaceholder": "e.g. March promo to all customers",
                    "channel": "Choose channel",
                    "targetType": "Who receives this campaign?",
                    "statusValue": "Customer status",
                    "tagValue": "Tag name",
                    "tagPlaceholder": "e.g. vip",
                    "subject": "Subject line",
                    "fromName": "From name",
                    "replyTo": "Reply to",
                    "body": "Message body",
                    "bodyPlaceholder": "Write your message. You can use plain text — line breaks will be preserved in the email.",
                    "scheduledAt": "Schedule for later (optional)",
                },
                "target": {
                    "all": "All active customers",
                    "status": "Customers with specific status",
                    "tag": "Customers with specific tag",
                    "manual": "Manual selection",
                },
                "review": {
                    "name": "Name",
                    "channel": "Channel",
                    "audience": "Audience",
                    "subject": "Subject",
                },
                "actions": {
                    "cancel": "Cancel",
                    "back": "Back",
                    "next": "Next",
                    "saveDraft": "Save as draft",
                    "sendNow": "Send now",
                },
                "errors": {
                    "enterName": "Please enter a campaign name",
                },
            },
            "detail": {
                "recipients": "Recipients",
                "sent": "Sent",
                "opened": "Opened",
                "failed": "Failed",
                "body": "Message body",
                "recipientsList": "Recipients",
                "noRecipients": "No recipients — check audience settings",
                "moreRecipients": "more recipients",
            },
            "actions": {
                "sendNow": "Send now",
                "delete": "Delete",
            },
            "confirm": {
                "send": "Send campaign to {count} recipients now?",
                "delete": "Delete this campaign? All recipient records will be lost.",
            },
        },
    },
    "ar": {
        "Campaigns": {
            "title": "الحملات التسويقية",
            "subtitle": "التسويق عبر البريد والقنوات المتعددة — أرسل لفئات محددة من العملاء",
            "newCampaign": "حملة جديدة",
            "channel": {
                "email": "بريد إلكتروني",
                "whatsapp": "واتساب",
                "sms": "رسالة نصية",
            },
            "status": {
                "draft": "مسودة",
                "scheduled": "مجدولة",
                "sending": "جاري الإرسال",
                "sent": "مُرسَلة",
                "failed": "فشلت",
                "cancelled": "ملغاة",
            },
            "recipientStatus": {
                "queued": "في الانتظار",
                "sent": "مُرسَلة",
                "delivered": "وصلت",
                "opened": "فُتحت",
                "clicked": "تم النقر",
                "bounced": "مرتدّة",
                "failed": "فشلت",
            },
            "stats": {
                "total": "الإجمالي",
                "totalSent": "رسائل مُرسَلة",
                "totalOpens": "فتحات",
                "openRate": "معدل الفتح",
            },
            "table": {
                "name": "الاسم",
                "channel": "القناة",
                "status": "الحالة",
                "recipients": "المستلمون",
                "sent": "مُرسَلة",
                "created": "تاريخ الإنشاء",
            },
            "empty": {
                "title": "لا توجد حملات بعد",
                "subtitle": "أنشئ أول حملة بريدية للوصول إلى فئات محددة من العملاء",
            },
            "wizard": {
                "title": "حملة جديدة",
                "step": "الخطوة {step} من {total}",
                "beta": "تجريبي",
                "scheduleHint": "اترك فارغًا للإرسال الفوري من القائمة، أو اختر وقتًا مستقبليًا",
                "steps": {
                    "channel": "القناة",
                    "audience": "الجمهور",
                    "content": "المحتوى",
                    "review": "المراجعة",
                },
                "fields": {
                    "name": "اسم الحملة",
                    "namePlaceholder": "مثال: عرض مارس لكل العملاء",
                    "channel": "اختر القناة",
                    "targetType": "من يستقبل هذه الحملة؟",
                    "statusValue": "حالة العميل",
                    "tagValue": "اسم الوسم",
                    "tagPlaceholder": "مثال: vip",
                    "subject": "عنوان الرسالة",
                    "fromName": "اسم المُرسِل",
                    "replyTo": "الرد على",
                    "body": "نص الرسالة",
                    "bodyPlaceholder": "اكتب رسالتك. يمكنك استخدام نص عادي — سيتم الحفاظ على فواصل الأسطر في البريد.",
                    "scheduledAt": "جدولة للإرسال لاحقًا (اختياري)",
                },
                "target": {
                    "all": "كل العملاء النشطين",
                    "status": "العملاء بحالة محددة",
                    "tag": "العملاء بوسم محدد",
                    "manual": "اختيار يدوي",
                },
                "review": {
                    "name": "الاسم",
                    "channel": "القناة",
                    "audience": "الجمهور",
                    "subject": "العنوان",
                },
                "actions": {
                    "cancel": "إلغاء",
                    "back": "رجوع",
                    "next": "التالي",
                    "saveDraft": "حفظ كمسودة",
                    "sendNow": "إرسال الآن",
                },
                "errors": {
                    "enterName": "الرجاء إدخال اسم للحملة",
                },
            },
            "detail": {
                "recipients": "المستلمون",
                "sent": "مُرسَلة",
                "opened": "فُتحت",
                "failed": "فشلت",
                "body": "نص الرسالة",
                "recipientsList": "المستلمون",
                "noRecipients": "لا يوجد مستلمون — تحقق من إعدادات الجمهور",
                "moreRecipients": "مستلم إضافي",
            },
            "actions": {
                "sendNow": "إرسال الآن",
                "delete": "حذف",
            },
            "confirm": {
                "send": "إرسال الحملة إلى {count} مستلم الآن؟",
                "delete": "حذف هذه الحملة؟ ستُفقد كل سجلات المستلمين.",
            },
        },
    },
    "tr": {
        "Campaigns": {
            "title": "Kampanyalar",
            "subtitle": "E-posta pazarlama ve çok kanallı ulaşım — segmentli kitlelere gönderin",
            "newCampaign": "Yeni Kampanya",
            "channel": {
                "email": "E-posta",
                "whatsapp": "WhatsApp",
                "sms": "SMS",
            },
            "status": {
                "draft": "Taslak",
                "scheduled": "Planlandı",
                "sending": "Gönderiliyor",
                "sent": "Gönderildi",
                "failed": "Başarısız",
                "cancelled": "İptal",
            },
            "recipientStatus": {
                "queued": "Beklemede",
                "sent": "Gönderildi",
                "delivered": "Ulaştı",
                "opened": "Açıldı",
                "clicked": "Tıklandı",
                "bounced": "Geri döndü",
                "failed": "Başarısız",
            },
            "stats": {
                "total": "Toplam",
                "totalSent": "Gönderilen Mesaj",
                "totalOpens": "Açılışlar",
                "openRate": "Açılma Oranı",
            },
            "table": {
                "name": "Ad",
                "channel": "Kanal",
                "status": "Durum",
                "recipients": "Alıcılar",
                "sent": "Gönderildi",
                "created": "Oluşturulma",
            },
            "empty": {
                "title": "Henüz kampanya yok",
                "subtitle": "Segmentli kitlelere ulaşmak için ilk e-posta kampanyanızı oluşturun",
            },
            "wizard": {
                "title": "Yeni Kampanya",
                "step": "Adım {step}/{total}",
                "beta": "beta",
                "scheduleHint": "Listeden hemen göndermek için boş bırakın veya gelecek bir zaman seçin",
                "steps": {
                    "channel": "Kanal",
                    "audience": "Kitle",
                    "content": "İçerik",
                    "review": "Özet",
                },
                "fields": {
                    "name": "Kampanya adı",
                    "namePlaceholder": "Örn: Tüm müşterilere Mart promosyonu",
                    "channel": "Kanal seçin",
                    "targetType": "Bu kampanyayı kim alacak?",
                    "statusValue": "Müşteri durumu",
                    "tagValue": "Etiket adı",
                    "tagPlaceholder": "Örn: vip",
                    "subject": "Konu satırı",
                    "fromName": "Gönderen adı",
                    "replyTo": "Yanıt adresi",
                    "body": "Mesaj içeriği",
                    "bodyPlaceholder": "Mesajınızı yazın. Düz metin kullanabilirsiniz — satır sonları e-postada korunur.",
                    "scheduledAt": "Daha sonra gönder (opsiyonel)",
                },
                "target": {
                    "all": "Tüm aktif müşteriler",
                    "status": "Belirli durumdaki müşteriler",
                    "tag": "Belirli etiketli müşteriler",
                    "manual": "Manuel seçim",
                },
                "review": {
                    "name": "Ad",
                    "channel": "Kanal",
                    "audience": "Kitle",
                    "subject": "Konu",
                },
                "actions": {
                    "cancel": "İptal",
                    "back": "Geri",
                    "next": "İleri",
                    "saveDraft": "Taslak olarak kaydet",
                    "sendNow": "Şimdi gönder",
                },
                "errors": {
                    "enterName": "Lütfen bir kampanya adı girin",
                },
            },
            "detail": {
                "recipients": "Alıcılar",
                "sent": "Gönderildi",
                "opened": "Açıldı",
                "failed": "Başarısız",
                "body": "Mesaj içeriği",
                "recipientsList": "Alıcılar",
                "noRecipients": "Alıcı yok — kitle ayarlarını kontrol edin",
                "moreRecipients": "alıcı daha",
            },
            "actions": {
                "sendNow": "Şimdi gönder",
                "delete": "Sil",
            },
            "confirm": {
                "send": "Kampanya {count} alıcıya şimdi gönderilsin mi?",
                "delete": "Bu kampanya silinsin mi? Tüm alıcı kayıtları kaybolacak.",
            },
        },
    },
}

NAV_CAMPAIGNS = {"en": "Campaigns", "ar": "الحملات", "tr": "Kampanyalar"}


def inject(lang: str):
    path = ROOT / f"{lang}.json"
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f, object_pairs_hook=OrderedDict)

    if "Nav" in data and isinstance(data["Nav"], dict):
        if "campaigns" not in data["Nav"]:
            new_nav = OrderedDict()
            inserted = False
            for k, v in data["Nav"].items():
                new_nav[k] = v
                if k == "followup" and not inserted:
                    new_nav["campaigns"] = NAV_CAMPAIGNS[lang]
                    inserted = True
            if not inserted:
                new_nav["campaigns"] = NAV_CAMPAIGNS[lang]
            data["Nav"] = new_nav

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
