#!/usr/bin/env python3
"""Inject Commission translations into en/ar/tr JSON files."""

import json
from pathlib import Path
from collections import OrderedDict

ROOT = Path(__file__).parent.parent / "messages"

TRANSLATIONS = {
    "en": {
        "Commission": {
            "title": "Commission Engine",
            "subtitle": "Auto-compute and track sales commissions when deals are won",
            "newRule": "New Rule",
            "recompute": "Recompute",
            "tabs": {
                "rules": "Rules",
                "entries": "Entries",
                "stats": "Stats",
            },
            "rules": {
                "empty": "No commission rules yet",
                "emptyHint": "Create your first rule to auto-compute commissions when deals close",
                "appliesAll": "All won deals",
                "appliesStage": "Stage: {stage}",
                "appliesMin": "Value ≥ {value}",
                "col": {
                    "name": "Name",
                    "type": "Type",
                    "formula": "Formula",
                    "appliesTo": "Applies To",
                    "entries": "Entries",
                },
            },
            "entries": {
                "filter": "Filter",
                "all": "All",
                "empty": "No commission entries yet",
                "col": {
                    "date": "Date",
                    "user": "User",
                    "deal": "Deal",
                    "rule": "Rule",
                    "amount": "Amount",
                    "status": "Status",
                },
            },
            "status": {
                "pending": "Pending",
                "approved": "Approved",
                "paid": "Paid",
                "cancelled": "Cancelled",
            },
            "stats": {
                "pending": "Pending",
                "approved": "Approved",
                "paid": "Paid",
                "topUsers": "Top Earners",
                "entries": "entries",
                "noUsers": "No commissions yet",
            },
            "actions": {
                "cancel": "Cancel",
                "save": "Save",
                "create": "Create",
                "approve": "Approve",
                "markPaid": "Mark paid",
            },
            "confirm": {
                "deleteRule": "Delete this rule? Existing entries will remain.",
                "deleteEntry": "Delete this commission entry?",
                "recompute": "Recompute commissions for all won deals? This will create entries for any that are missing.",
            },
            "alerts": {
                "recomputed": "Processed {deals} deals, created {entries} new entries.",
            },
            "errors": {
                "enterName": "Please enter a name",
            },
            "modal": {
                "createTitle": "New Commission Rule",
                "editTitle": "Edit Commission Rule",
                "name": "Name",
                "namePlaceholder": "e.g. Standard 10% on won deals",
                "description": "Description",
                "type": "Type",
                "types": {
                    "percent": "% of value",
                    "flat": "Flat amount",
                    "tiered": "Tiered",
                },
                "rate": "Rate",
                "amount": "Amount",
                "tiers": "Tiers",
                "addTier": "Add tier",
                "from": "From",
                "to": "To (empty = ∞)",
                "appliesTo": "Applies To",
                "applies": {
                    "all": "All won deals",
                    "deal_stage": "Specific stage",
                    "min_value": "Min deal value",
                },
                "stageValue": "Stage name",
                "minValue": "Min value",
                "isActive": "Active",
            },
        },
    },
    "ar": {
        "Commission": {
            "title": "محرك العمولات",
            "subtitle": "احتساب ومتابعة عمولات المبيعات تلقائيًا عند ربح الصفقات",
            "newRule": "قاعدة جديدة",
            "recompute": "إعادة الحساب",
            "tabs": {
                "rules": "القواعد",
                "entries": "السجلات",
                "stats": "الإحصائيات",
            },
            "rules": {
                "empty": "لا توجد قواعد عمولات بعد",
                "emptyHint": "أنشئ أول قاعدة لحساب العمولات تلقائيًا عند إغلاق الصفقات",
                "appliesAll": "كل الصفقات الرابحة",
                "appliesStage": "المرحلة: {stage}",
                "appliesMin": "القيمة ≥ {value}",
                "col": {
                    "name": "الاسم",
                    "type": "النوع",
                    "formula": "الصيغة",
                    "appliesTo": "تنطبق على",
                    "entries": "السجلات",
                },
            },
            "entries": {
                "filter": "تصفية",
                "all": "الكل",
                "empty": "لا توجد سجلات عمولات بعد",
                "col": {
                    "date": "التاريخ",
                    "user": "المستخدم",
                    "deal": "الصفقة",
                    "rule": "القاعدة",
                    "amount": "المبلغ",
                    "status": "الحالة",
                },
            },
            "status": {
                "pending": "قيد الانتظار",
                "approved": "معتمدة",
                "paid": "مدفوعة",
                "cancelled": "ملغاة",
            },
            "stats": {
                "pending": "قيد الانتظار",
                "approved": "معتمدة",
                "paid": "مدفوعة",
                "topUsers": "أفضل المُكتسبين",
                "entries": "سجل",
                "noUsers": "لا توجد عمولات بعد",
            },
            "actions": {
                "cancel": "إلغاء",
                "save": "حفظ",
                "create": "إنشاء",
                "approve": "اعتماد",
                "markPaid": "تحديد كمدفوعة",
            },
            "confirm": {
                "deleteRule": "حذف هذه القاعدة؟ السجلات الموجودة ستبقى.",
                "deleteEntry": "حذف هذه السجل؟",
                "recompute": "إعادة حساب العمولات لكل الصفقات الرابحة؟ سيتم إنشاء سجلات للمفقودة.",
            },
            "alerts": {
                "recomputed": "تمت معالجة {deals} صفقة، وإنشاء {entries} سجل جديد.",
            },
            "errors": {
                "enterName": "الرجاء إدخال اسم",
            },
            "modal": {
                "createTitle": "قاعدة عمولة جديدة",
                "editTitle": "تعديل قاعدة العمولة",
                "name": "الاسم",
                "namePlaceholder": "مثال: 10% قياسي على الصفقات الرابحة",
                "description": "الوصف",
                "type": "النوع",
                "types": {
                    "percent": "% من القيمة",
                    "flat": "مبلغ ثابت",
                    "tiered": "متدرّج",
                },
                "rate": "النسبة",
                "amount": "المبلغ",
                "tiers": "المستويات",
                "addTier": "إضافة مستوى",
                "from": "من",
                "to": "إلى (فارغ = ∞)",
                "appliesTo": "تنطبق على",
                "applies": {
                    "all": "كل الصفقات الرابحة",
                    "deal_stage": "مرحلة محددة",
                    "min_value": "الحد الأدنى للقيمة",
                },
                "stageValue": "اسم المرحلة",
                "minValue": "الحد الأدنى",
                "isActive": "نشطة",
            },
        },
    },
    "tr": {
        "Commission": {
            "title": "Komisyon Motoru",
            "subtitle": "Anlaşmalar kazanıldığında satış komisyonlarını otomatik hesapla ve takip et",
            "newRule": "Yeni Kural",
            "recompute": "Yeniden Hesapla",
            "tabs": {
                "rules": "Kurallar",
                "entries": "Kayıtlar",
                "stats": "İstatistikler",
            },
            "rules": {
                "empty": "Henüz komisyon kuralı yok",
                "emptyHint": "Anlaşmalar kapandığında komisyonları otomatik hesaplamak için ilk kuralınızı oluşturun",
                "appliesAll": "Tüm kazanılan anlaşmalar",
                "appliesStage": "Aşama: {stage}",
                "appliesMin": "Değer ≥ {value}",
                "col": {
                    "name": "Ad",
                    "type": "Tür",
                    "formula": "Formül",
                    "appliesTo": "Kapsam",
                    "entries": "Kayıtlar",
                },
            },
            "entries": {
                "filter": "Filtre",
                "all": "Tümü",
                "empty": "Henüz komisyon kaydı yok",
                "col": {
                    "date": "Tarih",
                    "user": "Kullanıcı",
                    "deal": "Anlaşma",
                    "rule": "Kural",
                    "amount": "Tutar",
                    "status": "Durum",
                },
            },
            "status": {
                "pending": "Beklemede",
                "approved": "Onaylı",
                "paid": "Ödendi",
                "cancelled": "İptal",
            },
            "stats": {
                "pending": "Beklemede",
                "approved": "Onaylı",
                "paid": "Ödendi",
                "topUsers": "En Çok Kazananlar",
                "entries": "kayıt",
                "noUsers": "Henüz komisyon yok",
            },
            "actions": {
                "cancel": "İptal",
                "save": "Kaydet",
                "create": "Oluştur",
                "approve": "Onayla",
                "markPaid": "Ödendi olarak işaretle",
            },
            "confirm": {
                "deleteRule": "Bu kural silinsin mi? Mevcut kayıtlar kalır.",
                "deleteEntry": "Bu komisyon kaydı silinsin mi?",
                "recompute": "Tüm kazanılan anlaşmalar için komisyonlar yeniden hesaplansın mı? Eksik olanlar için kayıt oluşturulur.",
            },
            "alerts": {
                "recomputed": "{deals} anlaşma işlendi, {entries} yeni kayıt oluşturuldu.",
            },
            "errors": {
                "enterName": "Lütfen bir ad girin",
            },
            "modal": {
                "createTitle": "Yeni Komisyon Kuralı",
                "editTitle": "Komisyon Kuralını Düzenle",
                "name": "Ad",
                "namePlaceholder": "Örn: Kazanılan anlaşmalarda standart %10",
                "description": "Açıklama",
                "type": "Tür",
                "types": {
                    "percent": "Değerin %'si",
                    "flat": "Sabit tutar",
                    "tiered": "Kademeli",
                },
                "rate": "Oran",
                "amount": "Tutar",
                "tiers": "Kademeler",
                "addTier": "Kademe ekle",
                "from": "Kimden",
                "to": "Kime (boş = ∞)",
                "appliesTo": "Kapsam",
                "applies": {
                    "all": "Tüm kazanılan anlaşmalar",
                    "deal_stage": "Belirli aşama",
                    "min_value": "Min anlaşma değeri",
                },
                "stageValue": "Aşama adı",
                "minValue": "Min değer",
                "isActive": "Aktif",
            },
        },
    },
}

NAV_COMMISSION = {"en": "Commission", "ar": "العمولات", "tr": "Komisyon"}


def inject(lang: str):
    path = ROOT / f"{lang}.json"
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f, object_pairs_hook=OrderedDict)

    if "Nav" in data and isinstance(data["Nav"], dict):
        if "commission" not in data["Nav"]:
            new_nav = OrderedDict()
            inserted = False
            for k, v in data["Nav"].items():
                new_nav[k] = v
                if k == "tax" and not inserted:
                    new_nav["commission"] = NAV_COMMISSION[lang]
                    inserted = True
            if not inserted:
                new_nav["commission"] = NAV_COMMISSION[lang]
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
