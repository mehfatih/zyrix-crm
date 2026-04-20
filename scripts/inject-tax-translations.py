#!/usr/bin/env python3
"""Inject Tax + Nav.tax translations into en/ar/tr JSON files."""

import json
from pathlib import Path
from collections import OrderedDict

ROOT = Path(__file__).parent.parent / "messages"

TRANSLATIONS = {
    "en": {
        "Tax": {
            "title": "Tax Engine",
            "subtitle": "Configure VAT and KDV rates for Turkey, Saudi Arabia, UAE, and more",
            "addRate": "Add Rate",
            "default": "Default",
            "active": "Active",
            "inactive": "Inactive",
            "noCountry": "Uncategorized",
            "presets": {
                "title": "Quick Seed: Preset Rates",
                "subtitle": "Instantly add standard tax rates for a country",
                "rates": "rates",
                "added": "added",
            },
            "table": {
                "name": "Name",
                "code": "Code",
                "rate": "Rate",
                "status": "Status",
            },
            "empty": {
                "title": "No tax rates yet",
                "subtitle": "Seed presets for your country or add a custom rate",
            },
            "form": {
                "createTitle": "New Tax Rate",
                "editTitle": "Edit Tax Rate",
                "name": "Name",
                "namePlaceholder": "e.g. KDV 18%, Standard VAT",
                "ratePercent": "Rate",
                "code": "Code",
                "countryCode": "Country",
                "noCountry": "No country",
                "description": "Description",
                "isDefault": "Default for country",
                "isActive": "Active",
            },
            "actions": {
                "create": "Create",
                "save": "Save",
                "cancel": "Cancel",
            },
            "confirm": {
                "delete": "Delete this tax rate?",
                "seed": "Add preset tax rates for {country}?",
            },
            "alerts": {
                "seeded": "Added {created} new rates, skipped {skipped} existing.",
            },
            "errors": {
                "enterName": "Please enter a name",
                "invalidRate": "Rate must be between 0 and 100",
            },
        },
    },
    "ar": {
        "Tax": {
            "title": "محرك الضرائب",
            "subtitle": "إعداد معدلات ضريبة القيمة المضافة وKDV لتركيا والسعودية والإمارات وغيرها",
            "addRate": "إضافة معدل",
            "default": "افتراضي",
            "active": "نشط",
            "inactive": "غير نشط",
            "noCountry": "غير مصنّف",
            "presets": {
                "title": "إعداد سريع: معدلات جاهزة",
                "subtitle": "أضِف معدلات الضرائب القياسية لدولة ما بنقرة واحدة",
                "rates": "معدلات",
                "added": "مُضاف",
            },
            "table": {
                "name": "الاسم",
                "code": "الرمز",
                "rate": "النسبة",
                "status": "الحالة",
            },
            "empty": {
                "title": "لا توجد معدلات ضرائب بعد",
                "subtitle": "أضِف معدلات دولتك أو أنشئ معدلًا مخصصًا",
            },
            "form": {
                "createTitle": "معدل ضريبة جديد",
                "editTitle": "تعديل معدل الضريبة",
                "name": "الاسم",
                "namePlaceholder": "مثال: KDV 18%، ضريبة القيمة المضافة القياسية",
                "ratePercent": "النسبة",
                "code": "الرمز",
                "countryCode": "الدولة",
                "noCountry": "بدون دولة",
                "description": "الوصف",
                "isDefault": "افتراضي للدولة",
                "isActive": "نشط",
            },
            "actions": {
                "create": "إنشاء",
                "save": "حفظ",
                "cancel": "إلغاء",
            },
            "confirm": {
                "delete": "حذف هذا المعدل؟",
                "seed": "إضافة معدلات الضرائب الجاهزة لـ {country}؟",
            },
            "alerts": {
                "seeded": "تمت إضافة {created} معدل جديد، تم تخطي {skipped} موجود.",
            },
            "errors": {
                "enterName": "الرجاء إدخال اسم",
                "invalidRate": "يجب أن تكون النسبة بين 0 و 100",
            },
        },
    },
    "tr": {
        "Tax": {
            "title": "Vergi Motoru",
            "subtitle": "Türkiye KDV, Suudi Arabistan, BAE ve diğer ülkeler için KDV oranlarını yapılandırın",
            "addRate": "Oran Ekle",
            "default": "Varsayılan",
            "active": "Aktif",
            "inactive": "Pasif",
            "noCountry": "Sınıflandırılmamış",
            "presets": {
                "title": "Hızlı Kurulum: Hazır Oranlar",
                "subtitle": "Bir ülkenin standart vergi oranlarını tek tıkla ekleyin",
                "rates": "oran",
                "added": "eklendi",
            },
            "table": {
                "name": "Ad",
                "code": "Kod",
                "rate": "Oran",
                "status": "Durum",
            },
            "empty": {
                "title": "Henüz vergi oranı yok",
                "subtitle": "Ülkenizin hazır oranlarını ekleyin veya özel oran oluşturun",
            },
            "form": {
                "createTitle": "Yeni Vergi Oranı",
                "editTitle": "Vergi Oranını Düzenle",
                "name": "Ad",
                "namePlaceholder": "Örn: KDV 18%, Standart KDV",
                "ratePercent": "Oran",
                "code": "Kod",
                "countryCode": "Ülke",
                "noCountry": "Ülke yok",
                "description": "Açıklama",
                "isDefault": "Ülke için varsayılan",
                "isActive": "Aktif",
            },
            "actions": {
                "create": "Oluştur",
                "save": "Kaydet",
                "cancel": "İptal",
            },
            "confirm": {
                "delete": "Bu vergi oranı silinsin mi?",
                "seed": "{country} için hazır vergi oranları eklensin mi?",
            },
            "alerts": {
                "seeded": "{created} yeni oran eklendi, {skipped} mevcut oran atlandı.",
            },
            "errors": {
                "enterName": "Lütfen bir ad girin",
                "invalidRate": "Oran 0 ile 100 arasında olmalıdır",
            },
        },
    },
}

NAV_TAX = {"en": "Tax", "ar": "الضرائب", "tr": "Vergi"}


def inject(lang: str):
    path = ROOT / f"{lang}.json"
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f, object_pairs_hook=OrderedDict)

    if "Nav" in data and isinstance(data["Nav"], dict):
        if "tax" not in data["Nav"]:
            new_nav = OrderedDict()
            inserted = False
            for k, v in data["Nav"].items():
                new_nav[k] = v
                if k == "loyalty" and not inserted:
                    new_nav["tax"] = NAV_TAX[lang]
                    inserted = True
            if not inserted:
                new_nav["tax"] = NAV_TAX[lang]
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
