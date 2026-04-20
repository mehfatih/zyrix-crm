#!/usr/bin/env python3
"""Inject Cashflow translations into en/ar/tr JSON files."""

import json
from pathlib import Path
from collections import OrderedDict

ROOT = Path(__file__).parent.parent / "messages"

TRANSLATIONS = {
    "en": {
        "Cashflow": {
            "title": "Cash Flow Forecast",
            "subtitle": "Probability-weighted revenue projection from your pipeline",
            "kpi": {
                "weighted": "Weighted Forecast",
                "weightedHint": "Value × probability",
                "potential": "Total Pipeline",
                "potentialHint": "If every deal closes",
                "deals": "Active Deals",
                "dealsHint": "Closing in next {horizon} days",
                "avgProbability": "Avg. Probability",
                "avgProbabilityHint": "Across forecast deals",
            },
            "historical": {
                "title": "Last 30 Days — Historical Baseline",
                "subtitle": "Context for calibrating your forecast",
                "wonCount": "Deals Won",
                "wonValue": "Revenue",
                "winRate": "Win Rate",
                "avgDealSize": "Avg. Deal Size",
            },
            "chart": {
                "title": "Projected Cash Flow by Period — Next {horizon} days",
                "empty": "No deals with expected close dates in this window",
                "emptyHint": "Set expected close dates on your deals to populate the forecast",
            },
            "byStage": {
                "title": "Weighted Value by Stage",
                "empty": "No active deals in forecast window",
            },
            "topDeals": {
                "title": "Top 10 Deals by Weighted Value",
                "empty": "No deals in forecast window",
                "of": "of",
            },
        },
    },
    "ar": {
        "Cashflow": {
            "title": "توقعات التدفق النقدي",
            "subtitle": "توقع الإيرادات المرجّح بالاحتمالية من خط مبيعاتك",
            "kpi": {
                "weighted": "التوقع المرجّح",
                "weightedHint": "القيمة × الاحتمالية",
                "potential": "إجمالي خط المبيعات",
                "potentialHint": "لو أُغلقت كل الصفقات",
                "deals": "الصفقات النشطة",
                "dealsHint": "ستُغلق خلال {horizon} يومًا",
                "avgProbability": "متوسط الاحتمالية",
                "avgProbabilityHint": "عبر صفقات التوقع",
            },
            "historical": {
                "title": "آخر 30 يومًا — الأساس التاريخي",
                "subtitle": "سياق لمعايرة توقعاتك",
                "wonCount": "صفقات رابحة",
                "wonValue": "الإيرادات",
                "winRate": "معدل الفوز",
                "avgDealSize": "متوسط حجم الصفقة",
            },
            "chart": {
                "title": "التدفق النقدي المتوقع حسب الفترة — {horizon} يومًا",
                "empty": "لا توجد صفقات بتواريخ إغلاق متوقعة في هذه الفترة",
                "emptyHint": "حدّد تواريخ الإغلاق المتوقعة لصفقاتك لتفعيل التوقعات",
            },
            "byStage": {
                "title": "القيمة المرجّحة حسب المرحلة",
                "empty": "لا توجد صفقات نشطة في نافذة التوقع",
            },
            "topDeals": {
                "title": "أفضل 10 صفقات بالقيمة المرجّحة",
                "empty": "لا توجد صفقات في نافذة التوقع",
                "of": "من",
            },
        },
    },
    "tr": {
        "Cashflow": {
            "title": "Nakit Akışı Tahmini",
            "subtitle": "Satış hunisinden olasılık-ağırlıklı gelir projeksiyonu",
            "kpi": {
                "weighted": "Ağırlıklı Tahmin",
                "weightedHint": "Değer × olasılık",
                "potential": "Toplam Huni",
                "potentialHint": "Tüm anlaşmalar kapansa",
                "deals": "Aktif Anlaşmalar",
                "dealsHint": "{horizon} gün içinde kapanacak",
                "avgProbability": "Ort. Olasılık",
                "avgProbabilityHint": "Tahmindeki anlaşmalar",
            },
            "historical": {
                "title": "Son 30 Gün — Geçmiş Baz Çizgisi",
                "subtitle": "Tahmininizi kalibre etmek için referans",
                "wonCount": "Kazanılan Anlaşma",
                "wonValue": "Gelir",
                "winRate": "Kazanma Oranı",
                "avgDealSize": "Ort. Anlaşma Büyüklüğü",
            },
            "chart": {
                "title": "Döneme Göre Tahmini Nakit Akışı — {horizon} gün",
                "empty": "Bu pencerede beklenen kapanış tarihi olan anlaşma yok",
                "emptyHint": "Tahmini doldurmak için anlaşmalarınıza beklenen kapanış tarihi ekleyin",
            },
            "byStage": {
                "title": "Aşamaya Göre Ağırlıklı Değer",
                "empty": "Tahmin penceresinde aktif anlaşma yok",
            },
            "topDeals": {
                "title": "Ağırlıklı Değere Göre En İyi 10 Anlaşma",
                "empty": "Tahmin penceresinde anlaşma yok",
                "of": "/",
            },
        },
    },
}

NAV_CASHFLOW = {"en": "Cash Flow", "ar": "التدفق النقدي", "tr": "Nakit Akışı"}


def inject(lang: str):
    path = ROOT / f"{lang}.json"
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f, object_pairs_hook=OrderedDict)

    if "Nav" in data and isinstance(data["Nav"], dict):
        if "cashflow" not in data["Nav"]:
            new_nav = OrderedDict()
            inserted = False
            for k, v in data["Nav"].items():
                new_nav[k] = v
                if k == "tax" and not inserted:
                    new_nav["cashflow"] = NAV_CASHFLOW[lang]
                    inserted = True
            if not inserted:
                new_nav["cashflow"] = NAV_CASHFLOW[lang]
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
