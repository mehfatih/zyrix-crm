#!/usr/bin/env python3
"""Inject Followup translations into en/ar/tr JSON files."""

import json
from pathlib import Path
from collections import OrderedDict

ROOT = Path(__file__).parent.parent / "messages"

TRANSLATIONS = {
    "en": {
        "Followup": {
            "title": "Smart Follow-up",
            "subtitle": "Automatically surface customers going cold and create follow-up tasks in one click",
            "settings": "Settings",
            "daysSinceContact": "{days} days since last contact",
            "thresholds": {
                "label": "Thresholds",
                "warning": "Warning: {days}+ days",
                "critical": "Critical: {days}+ days",
                "disabled": "Disabled",
            },
            "stats": {
                "totalStale": "Total Stale",
                "critical": "Critical",
                "warning": "Warning",
                "valueAtRisk": "Value at Risk",
            },
            "empty": {
                "title": "All caught up!",
                "subtitle": "Every customer has been contacted recently. Great work.",
            },
            "groups": {
                "critical": "Critical — needs immediate attention",
                "criticalSubtitle": "Not contacted for {days}+ days",
                "warning": "Warning — getting cold",
                "warningSubtitle": "Not contacted for {days}+ days",
            },
            "actions": {
                "createTask": "Create Task",
                "createAll": "Create for all",
                "save": "Save",
                "cancel": "Cancel",
            },
            "confirm": {
                "bulk": "Create follow-up tasks for {count} customers?",
            },
            "alerts": {
                "bulkCreated": "Created {created} tasks, skipped {skipped}.",
            },
            "settingsModal": {
                "title": "Follow-up Settings",
                "isEnabled": "Enable smart follow-up alerts",
                "warningDays": "Warning threshold (days)",
                "warningHint": "Customers not contacted this long appear in 'Warning'",
                "criticalDays": "Critical threshold (days)",
                "criticalHint": "Customers not contacted this long appear in 'Critical'",
                "excludeInactive": "Exclude lost/disabled customers",
                "errors": {
                    "thresholds": "Critical days must be ≥ warning days",
                },
            },
        },
    },
    "ar": {
        "Followup": {
            "title": "المتابعة الذكية",
            "subtitle": "اكتشف العملاء الذين يبدأون بالفتور وأنشئ مهام متابعة بنقرة واحدة",
            "settings": "الإعدادات",
            "daysSinceContact": "{days} يوم منذ آخر تواصل",
            "thresholds": {
                "label": "الحدود",
                "warning": "تحذير: {days}+ يوم",
                "critical": "حرج: {days}+ يوم",
                "disabled": "مُعطّل",
            },
            "stats": {
                "totalStale": "إجمالي الخاملين",
                "critical": "حرج",
                "warning": "تحذير",
                "valueAtRisk": "القيمة المعرضة للخطر",
            },
            "empty": {
                "title": "لا شيء يحتاج متابعة!",
                "subtitle": "تم التواصل مع جميع العملاء مؤخرًا. عمل رائع.",
            },
            "groups": {
                "critical": "حرج — يتطلب اهتمامًا فوريًا",
                "criticalSubtitle": "لم يتم التواصل منذ {days}+ يوم",
                "warning": "تحذير — بدأ بالفتور",
                "warningSubtitle": "لم يتم التواصل منذ {days}+ يوم",
            },
            "actions": {
                "createTask": "إنشاء مهمة",
                "createAll": "إنشاء للجميع",
                "save": "حفظ",
                "cancel": "إلغاء",
            },
            "confirm": {
                "bulk": "إنشاء مهام متابعة لـ {count} عميل؟",
            },
            "alerts": {
                "bulkCreated": "تم إنشاء {created} مهمة، تخطي {skipped}.",
            },
            "settingsModal": {
                "title": "إعدادات المتابعة",
                "isEnabled": "تفعيل تنبيهات المتابعة الذكية",
                "warningDays": "حد التحذير (أيام)",
                "warningHint": "العملاء الذين لم يتم التواصل معهم لهذه المدة يظهرون في 'تحذير'",
                "criticalDays": "حد الحرج (أيام)",
                "criticalHint": "العملاء الذين لم يتم التواصل معهم لهذه المدة يظهرون في 'حرج'",
                "excludeInactive": "استبعاد العملاء المفقودين/المعطّلين",
                "errors": {
                    "thresholds": "يجب أن يكون حد الحرج أكبر من أو يساوي حد التحذير",
                },
            },
        },
    },
    "tr": {
        "Followup": {
            "title": "Akıllı Takip",
            "subtitle": "Soğumaya başlayan müşterileri otomatik keşfedin ve tek tıkla takip görevi oluşturun",
            "settings": "Ayarlar",
            "daysSinceContact": "Son iletişimden {days} gün sonra",
            "thresholds": {
                "label": "Eşikler",
                "warning": "Uyarı: {days}+ gün",
                "critical": "Kritik: {days}+ gün",
                "disabled": "Devre dışı",
            },
            "stats": {
                "totalStale": "Toplam Pasif",
                "critical": "Kritik",
                "warning": "Uyarı",
                "valueAtRisk": "Risk Altındaki Değer",
            },
            "empty": {
                "title": "Her şey yolunda!",
                "subtitle": "Tüm müşterilerle yakın zamanda iletişim kuruldu. Harika iş.",
            },
            "groups": {
                "critical": "Kritik — acil ilgi gerekiyor",
                "criticalSubtitle": "{days}+ gündür iletişim yok",
                "warning": "Uyarı — soğumaya başlıyor",
                "warningSubtitle": "{days}+ gündür iletişim yok",
            },
            "actions": {
                "createTask": "Görev Oluştur",
                "createAll": "Tümü için oluştur",
                "save": "Kaydet",
                "cancel": "İptal",
            },
            "confirm": {
                "bulk": "{count} müşteri için takip görevi oluşturulsun mu?",
            },
            "alerts": {
                "bulkCreated": "{created} görev oluşturuldu, {skipped} atlandı.",
            },
            "settingsModal": {
                "title": "Takip Ayarları",
                "isEnabled": "Akıllı takip uyarılarını etkinleştir",
                "warningDays": "Uyarı eşiği (gün)",
                "warningHint": "Bu süre iletişim kurulmayan müşteriler 'Uyarı'da görünür",
                "criticalDays": "Kritik eşik (gün)",
                "criticalHint": "Bu süre iletişim kurulmayan müşteriler 'Kritik'te görünür",
                "excludeInactive": "Kaybedilen/devre dışı müşterileri hariç tut",
                "errors": {
                    "thresholds": "Kritik gün sayısı ≥ uyarı gün sayısı olmalıdır",
                },
            },
        },
    },
}

NAV_FOLLOWUP = {"en": "Follow-up", "ar": "المتابعة", "tr": "Takip"}


def inject(lang: str):
    path = ROOT / f"{lang}.json"
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f, object_pairs_hook=OrderedDict)

    if "Nav" in data and isinstance(data["Nav"], dict):
        if "followup" not in data["Nav"]:
            new_nav = OrderedDict()
            inserted = False
            for k, v in data["Nav"].items():
                new_nav[k] = v
                if k == "cashflow" and not inserted:
                    new_nav["followup"] = NAV_FOLLOWUP[lang]
                    inserted = True
            if not inserted:
                new_nav["followup"] = NAV_FOLLOWUP[lang]
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
