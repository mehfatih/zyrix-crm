#!/usr/bin/env python3
"""Inject AICFO translations into en/ar/tr JSON files."""

import json
from pathlib import Path
from collections import OrderedDict

ROOT = Path(__file__).parent.parent / "messages"

TRANSLATIONS = {
    "en": {
        "AICFO": {
            "title": "AI CFO",
            "subtitle": "Your AI-powered fractional CFO — analyzes your data and gives actionable advice",
            "poweredBy": "Gemini 2.0",
            "templates": {
                "title": "Quick Questions",
            },
            "snapshot": {
                "title": "Live Business Snapshot",
                "subtitle": "Real-time metrics feeding the AI — click to expand",
                "customers": "Customers",
                "last30d": "last 30d",
                "wonRevenue": "Won Revenue (30d)",
                "wonDeals": "deals won",
                "weightedPipeline": "Weighted Pipeline",
                "openDeals": "open deals",
                "quotesAccepted": "Quotes Accepted (30d)",
                "acceptRate": "accept rate",
                "staleCustomers": "Stale Customers",
                "critical": "critical",
                "pendingQuotes": "Pending Quotes",
                "awaitingResponse": "awaiting response",
                "avgDealSize": "Avg Deal Size",
                "fromWonDeals": "from won deals",
                "loyaltyMembers": "Loyalty Members",
                "ptsIssued": "pts issued",
            },
            "input": {
                "placeholder": "Ask anything about your business — revenue, risks, opportunities, customers…",
                "send": "Ask",
            },
            "ai": {
                "poweredBy": "AI-generated insight",
            },
        },
    },
    "ar": {
        "AICFO": {
            "title": "المدير المالي الذكي",
            "subtitle": "مستشارك المالي الذكي — يحلّل بياناتك ويعطيك توصيات قابلة للتنفيذ",
            "poweredBy": "Gemini 2.0",
            "templates": {
                "title": "أسئلة سريعة",
            },
            "snapshot": {
                "title": "لقطة حية للأعمال",
                "subtitle": "مؤشرات حية يستخدمها الذكاء الاصطناعي — اضغط للتوسيع",
                "customers": "العملاء",
                "last30d": "آخر 30 يومًا",
                "wonRevenue": "الإيرادات المُحقّقة (30 يومًا)",
                "wonDeals": "صفقات رابحة",
                "weightedPipeline": "خط المبيعات المرجّح",
                "openDeals": "صفقات مفتوحة",
                "quotesAccepted": "عروض مقبولة (30 يومًا)",
                "acceptRate": "معدل القبول",
                "staleCustomers": "عملاء خاملون",
                "critical": "حرج",
                "pendingQuotes": "عروض قيد الانتظار",
                "awaitingResponse": "بانتظار الرد",
                "avgDealSize": "متوسط حجم الصفقة",
                "fromWonDeals": "من الصفقات الرابحة",
                "loyaltyMembers": "أعضاء الولاء",
                "ptsIssued": "نقطة مُصدرة",
            },
            "input": {
                "placeholder": "اسأل أي شيء عن عملك — الإيرادات، المخاطر، الفرص، العملاء…",
                "send": "اسأل",
            },
            "ai": {
                "poweredBy": "رؤية مُولّدة بالذكاء الاصطناعي",
            },
        },
    },
    "tr": {
        "AICFO": {
            "title": "AI CFO",
            "subtitle": "Yapay zekâ destekli CFO'nuz — verilerinizi analiz eder ve eyleme yönelik tavsiyeler verir",
            "poweredBy": "Gemini 2.0",
            "templates": {
                "title": "Hızlı Sorular",
            },
            "snapshot": {
                "title": "Canlı İşletme Görünümü",
                "subtitle": "AI'nın kullandığı gerçek zamanlı metrikler — genişletmek için tıklayın",
                "customers": "Müşteriler",
                "last30d": "son 30g",
                "wonRevenue": "Kazanılan Gelir (30g)",
                "wonDeals": "kazanılan anlaşma",
                "weightedPipeline": "Ağırlıklı Huni",
                "openDeals": "açık anlaşma",
                "quotesAccepted": "Kabul Edilen Teklifler (30g)",
                "acceptRate": "kabul oranı",
                "staleCustomers": "Pasif Müşteriler",
                "critical": "kritik",
                "pendingQuotes": "Bekleyen Teklifler",
                "awaitingResponse": "yanıt bekliyor",
                "avgDealSize": "Ort. Anlaşma Büyüklüğü",
                "fromWonDeals": "kazanılan anlaşmalardan",
                "loyaltyMembers": "Sadakat Üyeleri",
                "ptsIssued": "puan verildi",
            },
            "input": {
                "placeholder": "İşletmeniz hakkında her şeyi sorun — gelir, riskler, fırsatlar, müşteriler…",
                "send": "Sor",
            },
            "ai": {
                "poweredBy": "AI tarafından üretilen içgörü",
            },
        },
    },
}

NAV_AI = {"en": "AI CFO", "ar": "المدير المالي", "tr": "AI CFO"}


def inject(lang: str):
    path = ROOT / f"{lang}.json"
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f, object_pairs_hook=OrderedDict)

    if "Nav" in data and isinstance(data["Nav"], dict):
        if "aiCfo" not in data["Nav"]:
            new_nav = OrderedDict()
            inserted = False
            for k, v in data["Nav"].items():
                new_nav[k] = v
                if k == "followup" and not inserted:
                    new_nav["aiCfo"] = NAV_AI[lang]
                    inserted = True
            if not inserted:
                new_nav["aiCfo"] = NAV_AI[lang]
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
