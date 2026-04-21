#!/usr/bin/env python3
"""Inject Dashboard + Reports translations into en/ar/tr JSON files."""

import json
from pathlib import Path
from collections import OrderedDict

ROOT = Path(__file__).parent.parent / "messages"

TRANSLATIONS = {
    "en": {
        "Dashboard": {
            "title": "Dashboard",
            "scope": {
                "personal": "My View",
                "team": "Team View",
                "company": "Company View",
            },
            "scopeHint": {
                "personal": "Showing your deals, tasks, and customers",
                "team": "Team performance overview",
                "company": "Full company metrics",
            },
            "kpis": {
                "myRevenue": "My Revenue (30d)",
                "revenue": "Revenue (30d)",
                "wonDeals": "won deals",
                "weightedPipeline": "Weighted Pipeline",
                "openDeals": "open deals",
                "myCustomers": "My Customers",
                "customers": "Customers",
                "last30d": "last 30d",
                "myTasks": "My Open Tasks",
                "tasks": "Open Tasks",
                "overdue": "overdue",
                "onTrack": "on track",
                "totalUsers": "Team Members",
                "quotesAccepted30d": "Quotes Accepted (30d)",
                "activeContracts": "Active Contracts",
            },
            "panels": {
                "upcomingTasks": "My Upcoming Tasks",
                "myDeals": "My Open Deals",
                "teamLeaderboard": "Team Leaderboard (30d)",
                "topCustomers": "Top Customers",
            },
            "empty": {
                "noTasks": "No upcoming tasks",
                "noDeals": "No open deals",
                "noTeamSales": "No team sales in the last 30 days",
                "noCustomers": "No customers yet",
            },
            "quickLinks": {
                "pipeline": "Pipeline",
                "quotes": "Quotes",
                "aiCfo": "AI CFO",
                "tasks": "Tasks",
            },
        },
        "Reports": {
            "title": "Financial Reports",
            "subtitle": "Multi-currency analytics with automatic conversion",
            "baseCurrency": "Base currency",
            "manageRates": "Exchange rates",
            "refresh": "Refresh",
            "tabs": {
                "summary": "Summary",
                "revenue": "Revenue",
                "pipeline": "Pipeline",
            },
            "summary": {
                "revenue30d": "Revenue (30 days)",
                "revenue90d": "Revenue (90 days)",
                "openPipeline": "Open Pipeline",
                "weighted": "weighted",
                "deals": "deals",
                "currenciesInUse": "Currencies in Use",
                "base": "base",
            },
            "revenue": {
                "totalRevenue": "Total Revenue",
                "currencies": "currencies",
                "byCurrency": "Revenue by Currency",
                "currency": "Currency",
                "deals": "Deals",
                "native": "Native Total",
                "converted": "Converted",
                "recentDeals": "Recent Won Deals",
                "unconvertibleFlag": "No exchange rate configured",
            },
            "pipeline": {
                "totalOpen": "Total Open Pipeline",
                "weighted": "Weighted by Probability",
                "probability": "avg probability",
                "byStage": "Pipeline by Stage",
            },
            "rates": {
                "title": "Exchange Rates",
                "subtitle": "Configure custom rates. Built-in fallback rates are used when no custom rate is set.",
                "addNew": "Add new rate",
                "existing": "Configured rates",
                "from": "From",
                "to": "To",
                "rate": "Rate",
                "hint": "Example: 1 USD = 30 TRY means fromCurrency=USD, toCurrency=TRY, rate=30",
                "empty": "No custom rates yet — using built-in defaults",
                "done": "Done",
                "errors": {
                    "sameCurrency": "From and to currencies must differ",
                    "invalidRate": "Rate must be a positive number",
                },
            },
            "warnings": {
                "unconvertible": "Some currencies couldn't be converted",
                "unconvertibleHint": "Set a custom exchange rate for missing currencies to get accurate totals",
            },
            "empty": {
                "noCurrencies": "No closed deals yet",
            },
        },
    },
    "ar": {
        "Dashboard": {
            "title": "لوحة التحكم",
            "scope": {
                "personal": "عرضي الشخصي",
                "team": "عرض الفريق",
                "company": "عرض الشركة",
            },
            "scopeHint": {
                "personal": "عرض صفقاتك ومهامك وعملائك",
                "team": "نظرة عامة على أداء الفريق",
                "company": "مقاييس الشركة الكاملة",
            },
            "kpis": {
                "myRevenue": "إيراداتي (30 يوم)",
                "revenue": "الإيرادات (30 يوم)",
                "wonDeals": "صفقات رابحة",
                "weightedPipeline": "خط المبيعات المرجح",
                "openDeals": "صفقات مفتوحة",
                "myCustomers": "عملائي",
                "customers": "العملاء",
                "last30d": "آخر 30 يوم",
                "myTasks": "مهامي المفتوحة",
                "tasks": "المهام المفتوحة",
                "overdue": "متأخرة",
                "onTrack": "على المسار",
                "totalUsers": "أعضاء الفريق",
                "quotesAccepted30d": "العروض المقبولة (30 يوم)",
                "activeContracts": "العقود النشطة",
            },
            "panels": {
                "upcomingTasks": "مهامي القادمة",
                "myDeals": "صفقاتي المفتوحة",
                "teamLeaderboard": "ترتيب الفريق (30 يوم)",
                "topCustomers": "أهم العملاء",
            },
            "empty": {
                "noTasks": "لا توجد مهام قادمة",
                "noDeals": "لا توجد صفقات مفتوحة",
                "noTeamSales": "لا توجد مبيعات للفريق في آخر 30 يوم",
                "noCustomers": "لا يوجد عملاء بعد",
            },
            "quickLinks": {
                "pipeline": "خط المبيعات",
                "quotes": "العروض",
                "aiCfo": "المدير المالي",
                "tasks": "المهام",
            },
        },
        "Reports": {
            "title": "التقارير المالية",
            "subtitle": "تحليلات متعددة العملات مع التحويل التلقائي",
            "baseCurrency": "العملة الأساسية",
            "manageRates": "أسعار الصرف",
            "refresh": "تحديث",
            "tabs": {
                "summary": "ملخص",
                "revenue": "الإيرادات",
                "pipeline": "خط المبيعات",
            },
            "summary": {
                "revenue30d": "الإيرادات (30 يوم)",
                "revenue90d": "الإيرادات (90 يوم)",
                "openPipeline": "خط المبيعات المفتوح",
                "weighted": "مرجحة",
                "deals": "صفقات",
                "currenciesInUse": "العملات المستخدمة",
                "base": "أساسية",
            },
            "revenue": {
                "totalRevenue": "إجمالي الإيرادات",
                "currencies": "عملات",
                "byCurrency": "الإيرادات حسب العملة",
                "currency": "العملة",
                "deals": "الصفقات",
                "native": "الإجمالي الأصلي",
                "converted": "المحوّل",
                "recentDeals": "الصفقات الرابحة الأخيرة",
                "unconvertibleFlag": "لا يوجد سعر صرف مُكوّن",
            },
            "pipeline": {
                "totalOpen": "إجمالي الخط المفتوح",
                "weighted": "مرجّح بالاحتمالية",
                "probability": "احتمالية متوسطة",
                "byStage": "الخط حسب المرحلة",
            },
            "rates": {
                "title": "أسعار الصرف",
                "subtitle": "ضبط أسعار مخصصة. تُستخدم الأسعار الافتراضية المدمجة عند عدم ضبط سعر مخصص.",
                "addNew": "إضافة سعر جديد",
                "existing": "الأسعار المُكوّنة",
                "from": "من",
                "to": "إلى",
                "rate": "السعر",
                "hint": "مثال: 1 USD = 30 TRY يعني fromCurrency=USD, toCurrency=TRY, rate=30",
                "empty": "لا توجد أسعار مخصصة — استخدام الافتراضيات المدمجة",
                "done": "تم",
                "errors": {
                    "sameCurrency": "يجب اختلاف العملتين",
                    "invalidRate": "السعر يجب أن يكون رقمًا موجبًا",
                },
            },
            "warnings": {
                "unconvertible": "بعض العملات لم يتم تحويلها",
                "unconvertibleHint": "اضبط سعر صرف مخصص للعملات المفقودة للحصول على إجماليات دقيقة",
            },
            "empty": {
                "noCurrencies": "لا توجد صفقات مغلقة بعد",
            },
        },
    },
    "tr": {
        "Dashboard": {
            "title": "Panel",
            "scope": {
                "personal": "Kişisel Görünüm",
                "team": "Ekip Görünümü",
                "company": "Şirket Görünümü",
            },
            "scopeHint": {
                "personal": "Anlaşmalarınız, görevleriniz ve müşterileriniz gösteriliyor",
                "team": "Ekip performansı genel görünümü",
                "company": "Tüm şirket metrikleri",
            },
            "kpis": {
                "myRevenue": "Gelirim (30g)",
                "revenue": "Gelir (30g)",
                "wonDeals": "kazanılan anlaşma",
                "weightedPipeline": "Ağırlıklı Huni",
                "openDeals": "açık anlaşma",
                "myCustomers": "Müşterilerim",
                "customers": "Müşteriler",
                "last30d": "son 30 gün",
                "myTasks": "Açık Görevlerim",
                "tasks": "Açık Görevler",
                "overdue": "gecikmiş",
                "onTrack": "yolunda",
                "totalUsers": "Ekip Üyeleri",
                "quotesAccepted30d": "Kabul Edilen Teklifler (30g)",
                "activeContracts": "Aktif Sözleşmeler",
            },
            "panels": {
                "upcomingTasks": "Yaklaşan Görevlerim",
                "myDeals": "Açık Anlaşmalarım",
                "teamLeaderboard": "Ekip Sıralaması (30g)",
                "topCustomers": "En İyi Müşteriler",
            },
            "empty": {
                "noTasks": "Yaklaşan görev yok",
                "noDeals": "Açık anlaşma yok",
                "noTeamSales": "Son 30 günde ekip satışı yok",
                "noCustomers": "Henüz müşteri yok",
            },
            "quickLinks": {
                "pipeline": "Huni",
                "quotes": "Teklifler",
                "aiCfo": "AI CFO",
                "tasks": "Görevler",
            },
        },
        "Reports": {
            "title": "Finansal Raporlar",
            "subtitle": "Otomatik dönüşümlü çok para birimli analiz",
            "baseCurrency": "Temel para birimi",
            "manageRates": "Döviz kurları",
            "refresh": "Yenile",
            "tabs": {
                "summary": "Özet",
                "revenue": "Gelir",
                "pipeline": "Huni",
            },
            "summary": {
                "revenue30d": "Gelir (30 gün)",
                "revenue90d": "Gelir (90 gün)",
                "openPipeline": "Açık Huni",
                "weighted": "ağırlıklı",
                "deals": "anlaşma",
                "currenciesInUse": "Kullanılan Para Birimleri",
                "base": "temel",
            },
            "revenue": {
                "totalRevenue": "Toplam Gelir",
                "currencies": "para birimi",
                "byCurrency": "Para Birimine Göre Gelir",
                "currency": "Para Birimi",
                "deals": "Anlaşmalar",
                "native": "Orijinal Toplam",
                "converted": "Dönüştürülmüş",
                "recentDeals": "Son Kazanılan Anlaşmalar",
                "unconvertibleFlag": "Yapılandırılmış döviz kuru yok",
            },
            "pipeline": {
                "totalOpen": "Toplam Açık Huni",
                "weighted": "Olasılık Ağırlıklı",
                "probability": "ort. olasılık",
                "byStage": "Aşamaya Göre Huni",
            },
            "rates": {
                "title": "Döviz Kurları",
                "subtitle": "Özel kurlar yapılandırın. Özel kur ayarlanmadığında yerleşik varsayılan kurlar kullanılır.",
                "addNew": "Yeni kur ekle",
                "existing": "Yapılandırılmış kurlar",
                "from": "Kaynak",
                "to": "Hedef",
                "rate": "Kur",
                "hint": "Örnek: 1 USD = 30 TRY fromCurrency=USD, toCurrency=TRY, rate=30 demektir",
                "empty": "Özel kur yok — yerleşik varsayılanlar kullanılıyor",
                "done": "Tamam",
                "errors": {
                    "sameCurrency": "Kaynak ve hedef para birimleri farklı olmalı",
                    "invalidRate": "Kur pozitif bir sayı olmalı",
                },
            },
            "warnings": {
                "unconvertible": "Bazı para birimleri dönüştürülemedi",
                "unconvertibleHint": "Doğru toplamlar için eksik para birimleri için özel döviz kuru ayarlayın",
            },
            "empty": {
                "noCurrencies": "Henüz kapanan anlaşma yok",
            },
        },
    },
}

NAV_REPORTS = {"en": "Reports", "ar": "التقارير", "tr": "Raporlar"}


def inject(lang: str):
    path = ROOT / f"{lang}.json"
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f, object_pairs_hook=OrderedDict)

    if "Nav" in data and isinstance(data["Nav"], dict):
        if "reports" not in data["Nav"]:
            new_nav = OrderedDict()
            inserted = False
            for k, v in data["Nav"].items():
                new_nav[k] = v
                if k == "cashflow" and not inserted:
                    new_nav["reports"] = NAV_REPORTS[lang]
                    inserted = True
            if not inserted:
                new_nav["reports"] = NAV_REPORTS[lang]
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
