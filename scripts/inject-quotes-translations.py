#!/usr/bin/env python3
"""Inject Quotes + PublicQuote + Nav.quotes translations into en/ar/tr JSON files."""

import json
from pathlib import Path
from collections import OrderedDict

ROOT = Path(__file__).parent.parent / "messages"

TRANSLATIONS = {
    "en": {
        "Quotes": {
            "title": "Quotes & Proposals",
            "subtitle": "Send formal price proposals to customers and track their responses",
            "newQuote": "New Quote",
            "searchPlaceholder": "Search by number or title…",
            "stats": {
                "total": "Total",
                "pending": "Pending",
                "accepted": "Accepted",
                "acceptedValue": "Accepted Value",
            },
            "status": {
                "draft": "Draft",
                "sent": "Sent",
                "viewed": "Viewed",
                "accepted": "Accepted",
                "rejected": "Rejected",
                "expired": "Expired",
            },
            "filters": {"allStatuses": "All statuses"},
            "table": {
                "number": "Number",
                "customer": "Customer",
                "title": "Title",
                "status": "Status",
                "validUntil": "Valid Until",
                "total": "Total",
            },
            "empty": {
                "title": "No quotes yet",
                "subtitle": "Create your first quote to send to a customer",
            },
            "form": {
                "createTitle": "New Quote",
                "editTitle": "Edit Quote",
                "customer": "Customer",
                "selectCustomer": "Select a customer…",
                "titleLabel": "Title",
                "titlePlaceholder": "e.g. Q1 2026 Website Redesign Proposal",
                "currency": "Currency",
                "validUntil": "Valid Until",
                "items": "Line Items",
                "addItem": "Add item",
                "itemName": "Item name",
                "qty": "Qty",
                "unitPrice": "Unit price",
                "descriptionOptional": "Description (optional)",
                "discount": "Discount",
                "tax": "Tax",
                "subtotal": "Subtotal",
                "taxTotal": "Tax",
                "total": "Total",
                "notes": "Notes",
                "terms": "Terms & Conditions",
            },
            "detail": {
                "issuedAt": "Issued",
                "validUntil": "Valid Until",
                "createdBy": "Created By",
                "item": "Item",
                "qty": "Qty",
                "price": "Price",
                "total": "Line Total",
                "discount": "Discount",
            },
            "actions": {
                "save": "Save",
                "create": "Create",
                "cancel": "Cancel",
                "edit": "Edit",
                "delete": "Delete",
                "send": "Send to Customer",
                "accept": "Mark Accepted",
                "reject": "Mark Rejected",
                "copyLink": "Copy Link",
            },
            "confirm": {"delete": "Delete this quote? This cannot be undone."},
            "alerts": {"linkCopied": "Public link copied to clipboard"},
            "errors": {
                "selectCustomer": "Please select a customer",
                "enterTitle": "Please enter a title",
                "addItem": "Add at least one item with name and quantity",
                "saveFailed": "Failed to save quote",
                "deleteFailed": "Failed to delete quote",
                "actionFailed": "Action failed",
            },
        },
        "PublicQuote": {
            "notFound": {
                "title": "Quote not found",
                "subtitle": "This link may have expired or the quote has been removed.",
            },
            "status": {
                "draft": "Draft",
                "sent": "Pending",
                "viewed": "Under Review",
                "accepted": "Accepted",
                "rejected": "Rejected",
                "expired": "Expired",
            },
            "meta": {"issued": "Issued", "validUntil": "Valid Until"},
            "items": {
                "title": "Items",
                "item": "Item",
                "qty": "Qty",
                "price": "Price",
                "total": "Total",
            },
            "totals": {
                "subtotal": "Subtotal",
                "discount": "Discount",
                "tax": "Tax",
                "total": "Total",
            },
            "notes": "Notes",
            "terms": "Terms & Conditions",
            "actions": {"accept": "Accept Quote", "reject": "Decline"},
            "confirm": {
                "accept": "Accept this quote? The sender will be notified.",
                "reject": "Decline this quote? This action cannot be undone.",
            },
            "resolved": {
                "accepted": "You have accepted this quote. Thank you!",
                "rejected": "You have declined this quote.",
            },
            "poweredBy": "Powered by",
        },
    },
    "ar": {
        "Quotes": {
            "title": "عروض الأسعار والمقترحات",
            "subtitle": "أرسل عروض أسعار رسمية للعملاء وتابع ردودهم",
            "newQuote": "عرض جديد",
            "searchPlaceholder": "ابحث بالرقم أو العنوان…",
            "stats": {
                "total": "الإجمالي",
                "pending": "قيد الانتظار",
                "accepted": "مقبولة",
                "acceptedValue": "قيمة المقبولة",
            },
            "status": {
                "draft": "مسودة",
                "sent": "مُرسلة",
                "viewed": "تمت المشاهدة",
                "accepted": "مقبولة",
                "rejected": "مرفوضة",
                "expired": "منتهية",
            },
            "filters": {"allStatuses": "جميع الحالات"},
            "table": {
                "number": "الرقم",
                "customer": "العميل",
                "title": "العنوان",
                "status": "الحالة",
                "validUntil": "صالحة حتى",
                "total": "الإجمالي",
            },
            "empty": {
                "title": "لا توجد عروض بعد",
                "subtitle": "أنشئ أول عرض سعر لإرساله إلى عميل",
            },
            "form": {
                "createTitle": "عرض سعر جديد",
                "editTitle": "تعديل العرض",
                "customer": "العميل",
                "selectCustomer": "اختر عميلًا…",
                "titleLabel": "العنوان",
                "titlePlaceholder": "مثال: عرض إعادة تصميم الموقع Q1 2026",
                "currency": "العملة",
                "validUntil": "صالحة حتى",
                "items": "البنود",
                "addItem": "إضافة بند",
                "itemName": "اسم البند",
                "qty": "الكمية",
                "unitPrice": "السعر",
                "descriptionOptional": "الوصف (اختياري)",
                "discount": "الخصم",
                "tax": "الضريبة",
                "subtotal": "المجموع الفرعي",
                "taxTotal": "الضريبة",
                "total": "الإجمالي",
                "notes": "ملاحظات",
                "terms": "الشروط والأحكام",
            },
            "detail": {
                "issuedAt": "تاريخ الإصدار",
                "validUntil": "صالحة حتى",
                "createdBy": "أنشأها",
                "item": "البند",
                "qty": "الكمية",
                "price": "السعر",
                "total": "إجمالي البند",
                "discount": "الخصم",
            },
            "actions": {
                "save": "حفظ",
                "create": "إنشاء",
                "cancel": "إلغاء",
                "edit": "تعديل",
                "delete": "حذف",
                "send": "إرسال للعميل",
                "accept": "تحديد كمقبولة",
                "reject": "تحديد كمرفوضة",
                "copyLink": "نسخ الرابط",
            },
            "confirm": {"delete": "حذف هذا العرض؟ لا يمكن التراجع."},
            "alerts": {"linkCopied": "تم نسخ الرابط العام"},
            "errors": {
                "selectCustomer": "الرجاء اختيار عميل",
                "enterTitle": "الرجاء إدخال عنوان",
                "addItem": "أضف بندًا واحدًا على الأقل باسم وكمية",
                "saveFailed": "فشل حفظ العرض",
                "deleteFailed": "فشل حذف العرض",
                "actionFailed": "فشل التنفيذ",
            },
        },
        "PublicQuote": {
            "notFound": {
                "title": "العرض غير موجود",
                "subtitle": "قد يكون هذا الرابط منتهي الصلاحية أو تم حذف العرض.",
            },
            "status": {
                "draft": "مسودة",
                "sent": "قيد الانتظار",
                "viewed": "قيد المراجعة",
                "accepted": "مقبولة",
                "rejected": "مرفوضة",
                "expired": "منتهية",
            },
            "meta": {"issued": "تاريخ الإصدار", "validUntil": "صالحة حتى"},
            "items": {
                "title": "البنود",
                "item": "البند",
                "qty": "الكمية",
                "price": "السعر",
                "total": "الإجمالي",
            },
            "totals": {
                "subtotal": "المجموع الفرعي",
                "discount": "الخصم",
                "tax": "الضريبة",
                "total": "الإجمالي",
            },
            "notes": "ملاحظات",
            "terms": "الشروط والأحكام",
            "actions": {"accept": "قبول العرض", "reject": "رفض"},
            "confirm": {
                "accept": "هل تقبل هذا العرض؟ سيتم إبلاغ المُرسِل.",
                "reject": "هل ترفض هذا العرض؟ لا يمكن التراجع.",
            },
            "resolved": {
                "accepted": "لقد قبلت هذا العرض. شكرًا لك!",
                "rejected": "لقد رفضت هذا العرض.",
            },
            "poweredBy": "مدعوم من",
        },
    },
    "tr": {
        "Quotes": {
            "title": "Teklifler ve Öneriler",
            "subtitle": "Müşterilere resmi fiyat teklifleri gönderin ve yanıtlarını takip edin",
            "newQuote": "Yeni Teklif",
            "searchPlaceholder": "Numara veya başlık ile ara…",
            "stats": {
                "total": "Toplam",
                "pending": "Bekleyen",
                "accepted": "Kabul Edilen",
                "acceptedValue": "Kabul Edilen Tutar",
            },
            "status": {
                "draft": "Taslak",
                "sent": "Gönderildi",
                "viewed": "Görüntülendi",
                "accepted": "Kabul Edildi",
                "rejected": "Reddedildi",
                "expired": "Süresi Doldu",
            },
            "filters": {"allStatuses": "Tüm durumlar"},
            "table": {
                "number": "Numara",
                "customer": "Müşteri",
                "title": "Başlık",
                "status": "Durum",
                "validUntil": "Geçerlilik",
                "total": "Toplam",
            },
            "empty": {
                "title": "Henüz teklif yok",
                "subtitle": "Bir müşteriye göndermek için ilk teklifinizi oluşturun",
            },
            "form": {
                "createTitle": "Yeni Teklif",
                "editTitle": "Teklifi Düzenle",
                "customer": "Müşteri",
                "selectCustomer": "Müşteri seçin…",
                "titleLabel": "Başlık",
                "titlePlaceholder": "Örn: Q1 2026 Web Sitesi Yenileme Teklifi",
                "currency": "Para Birimi",
                "validUntil": "Geçerlilik Tarihi",
                "items": "Kalemler",
                "addItem": "Kalem ekle",
                "itemName": "Kalem adı",
                "qty": "Adet",
                "unitPrice": "Birim fiyat",
                "descriptionOptional": "Açıklama (opsiyonel)",
                "discount": "İndirim",
                "tax": "KDV",
                "subtotal": "Ara Toplam",
                "taxTotal": "KDV",
                "total": "Toplam",
                "notes": "Notlar",
                "terms": "Şartlar ve Koşullar",
            },
            "detail": {
                "issuedAt": "Düzenlenme",
                "validUntil": "Geçerlilik",
                "createdBy": "Oluşturan",
                "item": "Kalem",
                "qty": "Adet",
                "price": "Fiyat",
                "total": "Satır Toplamı",
                "discount": "İndirim",
            },
            "actions": {
                "save": "Kaydet",
                "create": "Oluştur",
                "cancel": "İptal",
                "edit": "Düzenle",
                "delete": "Sil",
                "send": "Müşteriye Gönder",
                "accept": "Kabul Edildi Olarak İşaretle",
                "reject": "Reddedildi Olarak İşaretle",
                "copyLink": "Bağlantıyı Kopyala",
            },
            "confirm": {"delete": "Bu teklif silinsin mi? Geri alınamaz."},
            "alerts": {"linkCopied": "Genel bağlantı kopyalandı"},
            "errors": {
                "selectCustomer": "Lütfen bir müşteri seçin",
                "enterTitle": "Lütfen bir başlık girin",
                "addItem": "İsim ve miktar içeren en az bir kalem ekleyin",
                "saveFailed": "Teklif kaydedilemedi",
                "deleteFailed": "Teklif silinemedi",
                "actionFailed": "İşlem başarısız",
            },
        },
        "PublicQuote": {
            "notFound": {
                "title": "Teklif bulunamadı",
                "subtitle": "Bağlantının süresi dolmuş veya teklif kaldırılmış olabilir.",
            },
            "status": {
                "draft": "Taslak",
                "sent": "Beklemede",
                "viewed": "İncelemede",
                "accepted": "Kabul Edildi",
                "rejected": "Reddedildi",
                "expired": "Süresi Doldu",
            },
            "meta": {"issued": "Düzenlenme", "validUntil": "Geçerlilik"},
            "items": {
                "title": "Kalemler",
                "item": "Kalem",
                "qty": "Adet",
                "price": "Fiyat",
                "total": "Toplam",
            },
            "totals": {
                "subtotal": "Ara Toplam",
                "discount": "İndirim",
                "tax": "KDV",
                "total": "Toplam",
            },
            "notes": "Notlar",
            "terms": "Şartlar ve Koşullar",
            "actions": {"accept": "Teklifi Kabul Et", "reject": "Reddet"},
            "confirm": {
                "accept": "Bu teklifi kabul ediyor musunuz? Gönderen bilgilendirilecek.",
                "reject": "Bu teklifi reddediyor musunuz? Geri alınamaz.",
            },
            "resolved": {
                "accepted": "Bu teklifi kabul ettiniz. Teşekkürler!",
                "rejected": "Bu teklifi reddettiniz.",
            },
            "poweredBy": "Sağlayan:",
        },
    },
}

NAV_QUOTES = {"en": "Quotes", "ar": "عروض الأسعار", "tr": "Teklifler"}


def inject(lang: str):
    path = ROOT / f"{lang}.json"
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f, object_pairs_hook=OrderedDict)

    # Add Nav.quotes (after tasks if present)
    if "Nav" in data and isinstance(data["Nav"], dict):
        if "quotes" not in data["Nav"]:
            new_nav = OrderedDict()
            inserted = False
            for k, v in data["Nav"].items():
                new_nav[k] = v
                if k == "tasks" and not inserted:
                    new_nav["quotes"] = NAV_QUOTES[lang]
                    inserted = True
            if not inserted:
                new_nav["quotes"] = NAV_QUOTES[lang]
            data["Nav"] = new_nav

    # Add Quotes + PublicQuote namespaces
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
