#!/usr/bin/env python3
"""Inject Whatsapp translations into en/ar/tr JSON files."""

import json
from pathlib import Path
from collections import OrderedDict

ROOT = Path(__file__).parent.parent / "messages"

TRANSLATIONS = {
    "en": {
        "Whatsapp": {
            "title": "WhatsApp CRM",
            "subtitle": "Real-time inbox powered by Meta Cloud API",
            "refresh": "Refresh inbox",
            "searchPlaceholder": "Search by name, phone, or company…",
            "noResults": "No matches",
            "msgs": "msgs",
            "empty": {
                "title": "No conversations yet",
                "subtitle": "Incoming WhatsApp messages from Meta Cloud webhook will appear here. AI automatically extracts customer info and creates records.",
            },
            "pickConversation": "Select a conversation",
            "pickConversationHint": "Choose a chat from the inbox to start messaging",
            "emptyThread": "No messages yet",
            "notACustomer": "Not a customer yet",
            "aiSuggest": "AI suggest reply",
            "messagePlaceholder": "Type a WhatsApp message…",
            "send": "Send",
            "alerts": {
                "sendWarning": "Meta Cloud not configured — message saved locally only.",
                "noIncomingForSuggest": "No incoming messages yet to suggest a reply for.",
            },
        },
    },
    "ar": {
        "Whatsapp": {
            "title": "واتساب CRM",
            "subtitle": "صندوق وارد مباشر عبر Meta Cloud API",
            "refresh": "تحديث الصندوق",
            "searchPlaceholder": "ابحث بالاسم أو الهاتف أو الشركة…",
            "noResults": "لا نتائج",
            "msgs": "رسالة",
            "empty": {
                "title": "لا توجد محادثات بعد",
                "subtitle": "ستظهر رسائل واتساب الواردة عبر Meta Cloud هنا. يقوم الذكاء الاصطناعي تلقائيًا باستخراج بيانات العملاء وإنشاء السجلات.",
            },
            "pickConversation": "اختر محادثة",
            "pickConversationHint": "اختر دردشة من الصندوق لبدء المراسلة",
            "emptyThread": "لا توجد رسائل بعد",
            "notACustomer": "ليس عميلاً بعد",
            "aiSuggest": "اقتراح رد بالذكاء الاصطناعي",
            "messagePlaceholder": "اكتب رسالة واتساب…",
            "send": "إرسال",
            "alerts": {
                "sendWarning": "Meta Cloud غير مُهيّأ — تم حفظ الرسالة محليًا فقط.",
                "noIncomingForSuggest": "لا توجد رسائل واردة لاقتراح رد عليها.",
            },
        },
    },
    "tr": {
        "Whatsapp": {
            "title": "WhatsApp CRM",
            "subtitle": "Meta Cloud API ile gerçek zamanlı gelen kutusu",
            "refresh": "Gelen kutusunu yenile",
            "searchPlaceholder": "Ad, telefon veya şirkete göre ara…",
            "noResults": "Eşleşme yok",
            "msgs": "mesaj",
            "empty": {
                "title": "Henüz konuşma yok",
                "subtitle": "Meta Cloud webhook'undan gelen WhatsApp mesajları burada görünür. AI otomatik olarak müşteri bilgilerini çıkarır ve kayıt oluşturur.",
            },
            "pickConversation": "Bir konuşma seçin",
            "pickConversationHint": "Mesajlaşmaya başlamak için gelen kutusundan bir sohbet seçin",
            "emptyThread": "Henüz mesaj yok",
            "notACustomer": "Henüz müşteri değil",
            "aiSuggest": "AI ile yanıt öner",
            "messagePlaceholder": "WhatsApp mesajı yazın…",
            "send": "Gönder",
            "alerts": {
                "sendWarning": "Meta Cloud yapılandırılmamış — mesaj yalnızca yerel olarak kaydedildi.",
                "noIncomingForSuggest": "Yanıt önerisi için henüz gelen mesaj yok.",
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
