#!/usr/bin/env python3
"""Inject Contracts translations into en/ar/tr JSON files."""

import json
from pathlib import Path
from collections import OrderedDict

ROOT = Path(__file__).parent.parent / "messages"

TRANSLATIONS = {
    "en": {
        "Contracts": {
            "title": "Contracts",
            "subtitle": "Manage customer contracts, signatures, and renewal reminders",
            "newContract": "New Contract",
            "searchPlaceholder": "Search by number or title…",
            "stats": {
                "total": "Total",
                "active": "Active",
                "pending": "Pending Signature",
                "expiringSoon": "Expiring in 30d",
            },
            "filters": {
                "allStatuses": "All statuses",
                "expiringOnly": "Only expiring (30d)",
            },
            "status": {
                "draft": "Draft",
                "pending_signature": "Pending Signature",
                "signed": "Signed",
                "active": "Active",
                "expired": "Expired",
                "terminated": "Terminated",
            },
            "table": {
                "number": "Number",
                "customer": "Customer",
                "title": "Title",
                "status": "Status",
                "endDate": "End Date",
                "value": "Value",
                "expiringSoon": "Expiring soon",
            },
            "empty": {
                "title": "No contracts yet",
                "subtitle": "Create your first contract to track customer agreements",
            },
            "form": {
                "createTitle": "New Contract",
                "editTitle": "Edit Contract",
                "customer": "Customer",
                "selectCustomer": "Select a customer…",
                "status": "Status",
                "titleLabel": "Contract Title",
                "titlePlaceholder": "e.g. Annual SaaS Subscription 2026",
                "description": "Description",
                "startDate": "Start Date",
                "endDate": "End Date",
                "renewalDate": "Renewal Date",
                "value": "Value",
                "currency": "Currency",
                "fileUrl": "File URL",
                "fileUrlHint": "Link to contract file in Google Drive, Dropbox, etc.",
                "notes": "Notes",
            },
            "detail": {
                "startDate": "Start",
                "endDate": "End",
                "renewal": "Renewal",
                "value": "Contract Value",
                "notes": "Notes",
                "terms": "Terms",
            },
            "actions": {
                "cancel": "Cancel",
                "save": "Save",
                "create": "Create",
                "edit": "Edit",
                "delete": "Delete",
                "createReminder": "Create Renewal Reminder",
                "reminderDone": "Reminder created ✓",
            },
            "confirm": {
                "delete": "Delete this contract? This cannot be undone.",
            },
            "alerts": {
                "reminderCreated": "A high-priority task has been created for contract renewal follow-up.",
            },
            "errors": {
                "selectCustomer": "Please select a customer",
                "enterTitle": "Please enter a title",
            },
        },
    },
    "ar": {
        "Contracts": {
            "title": "العقود",
            "subtitle": "إدارة عقود العملاء والتوقيعات وتذكيرات التجديد",
            "newContract": "عقد جديد",
            "searchPlaceholder": "ابحث بالرقم أو العنوان…",
            "stats": {
                "total": "الإجمالي",
                "active": "نشطة",
                "pending": "بانتظار التوقيع",
                "expiringSoon": "تنتهي خلال 30 يومًا",
            },
            "filters": {
                "allStatuses": "جميع الحالات",
                "expiringOnly": "المنتهية خلال 30 يومًا فقط",
            },
            "status": {
                "draft": "مسودة",
                "pending_signature": "بانتظار التوقيع",
                "signed": "مُوقّعة",
                "active": "نشطة",
                "expired": "منتهية",
                "terminated": "مُلغاة",
            },
            "table": {
                "number": "الرقم",
                "customer": "العميل",
                "title": "العنوان",
                "status": "الحالة",
                "endDate": "تاريخ الانتهاء",
                "value": "القيمة",
                "expiringSoon": "تنتهي قريبًا",
            },
            "empty": {
                "title": "لا توجد عقود بعد",
                "subtitle": "أنشئ أول عقد لتتبع اتفاقيات العملاء",
            },
            "form": {
                "createTitle": "عقد جديد",
                "editTitle": "تعديل العقد",
                "customer": "العميل",
                "selectCustomer": "اختر عميلًا…",
                "status": "الحالة",
                "titleLabel": "عنوان العقد",
                "titlePlaceholder": "مثال: اشتراك SaaS سنوي 2026",
                "description": "الوصف",
                "startDate": "تاريخ البداية",
                "endDate": "تاريخ الانتهاء",
                "renewalDate": "تاريخ التجديد",
                "value": "القيمة",
                "currency": "العملة",
                "fileUrl": "رابط الملف",
                "fileUrlHint": "رابط لملف العقد في Google Drive أو Dropbox إلخ.",
                "notes": "ملاحظات",
            },
            "detail": {
                "startDate": "البداية",
                "endDate": "الانتهاء",
                "renewal": "التجديد",
                "value": "قيمة العقد",
                "notes": "ملاحظات",
                "terms": "الشروط",
            },
            "actions": {
                "cancel": "إلغاء",
                "save": "حفظ",
                "create": "إنشاء",
                "edit": "تعديل",
                "delete": "حذف",
                "createReminder": "إنشاء تذكير بالتجديد",
                "reminderDone": "تم إنشاء التذكير ✓",
            },
            "confirm": {
                "delete": "حذف هذا العقد؟ لا يمكن التراجع.",
            },
            "alerts": {
                "reminderCreated": "تم إنشاء مهمة عالية الأولوية لمتابعة تجديد العقد.",
            },
            "errors": {
                "selectCustomer": "الرجاء اختيار عميل",
                "enterTitle": "الرجاء إدخال عنوان",
            },
        },
    },
    "tr": {
        "Contracts": {
            "title": "Sözleşmeler",
            "subtitle": "Müşteri sözleşmelerini, imzaları ve yenileme hatırlatıcılarını yönetin",
            "newContract": "Yeni Sözleşme",
            "searchPlaceholder": "Numara veya başlık ile ara…",
            "stats": {
                "total": "Toplam",
                "active": "Aktif",
                "pending": "İmza Bekleyen",
                "expiringSoon": "30g içinde biten",
            },
            "filters": {
                "allStatuses": "Tüm durumlar",
                "expiringOnly": "Sadece bitenler (30g)",
            },
            "status": {
                "draft": "Taslak",
                "pending_signature": "İmza Bekliyor",
                "signed": "İmzalandı",
                "active": "Aktif",
                "expired": "Süresi Doldu",
                "terminated": "Feshedildi",
            },
            "table": {
                "number": "Numara",
                "customer": "Müşteri",
                "title": "Başlık",
                "status": "Durum",
                "endDate": "Bitiş",
                "value": "Değer",
                "expiringSoon": "Yakında bitiyor",
            },
            "empty": {
                "title": "Henüz sözleşme yok",
                "subtitle": "Müşteri sözleşmelerini takip etmek için ilk sözleşmenizi oluşturun",
            },
            "form": {
                "createTitle": "Yeni Sözleşme",
                "editTitle": "Sözleşmeyi Düzenle",
                "customer": "Müşteri",
                "selectCustomer": "Müşteri seçin…",
                "status": "Durum",
                "titleLabel": "Sözleşme Başlığı",
                "titlePlaceholder": "Örn: Yıllık SaaS Aboneliği 2026",
                "description": "Açıklama",
                "startDate": "Başlangıç",
                "endDate": "Bitiş",
                "renewalDate": "Yenileme",
                "value": "Değer",
                "currency": "Para Birimi",
                "fileUrl": "Dosya Bağlantısı",
                "fileUrlHint": "Google Drive, Dropbox vb. içindeki sözleşme bağlantısı",
                "notes": "Notlar",
            },
            "detail": {
                "startDate": "Başlangıç",
                "endDate": "Bitiş",
                "renewal": "Yenileme",
                "value": "Sözleşme Değeri",
                "notes": "Notlar",
                "terms": "Şartlar",
            },
            "actions": {
                "cancel": "İptal",
                "save": "Kaydet",
                "create": "Oluştur",
                "edit": "Düzenle",
                "delete": "Sil",
                "createReminder": "Yenileme Hatırlatıcısı Oluştur",
                "reminderDone": "Hatırlatıcı oluşturuldu ✓",
            },
            "confirm": {
                "delete": "Bu sözleşme silinsin mi? Geri alınamaz.",
            },
            "alerts": {
                "reminderCreated": "Sözleşme yenilemesi için yüksek öncelikli görev oluşturuldu.",
            },
            "errors": {
                "selectCustomer": "Lütfen bir müşteri seçin",
                "enterTitle": "Lütfen bir başlık girin",
            },
        },
    },
}

NAV_CONTRACTS = {"en": "Contracts", "ar": "العقود", "tr": "Sözleşmeler"}


def inject(lang: str):
    path = ROOT / f"{lang}.json"
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f, object_pairs_hook=OrderedDict)

    if "Nav" in data and isinstance(data["Nav"], dict):
        if "contracts" not in data["Nav"]:
            new_nav = OrderedDict()
            inserted = False
            for k, v in data["Nav"].items():
                new_nav[k] = v
                if k == "quotes" and not inserted:
                    new_nav["contracts"] = NAV_CONTRACTS[lang]
                    inserted = True
            if not inserted:
                new_nav["contracts"] = NAV_CONTRACTS[lang]
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
