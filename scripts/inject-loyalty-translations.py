#!/usr/bin/env python3
"""Inject Loyalty + Nav.loyalty translations into en/ar/tr JSON files."""

import json
from pathlib import Path
from collections import OrderedDict

ROOT = Path(__file__).parent.parent / "messages"

TRANSLATIONS = {
    "en": {
        "Loyalty": {
            "title": "Customer Loyalty",
            "subtitle": "Reward repeat customers with points and tiers",
            "newTransaction": "New Transaction",
            "pts": "pts",
            "banner": {
                "inactiveTitle": "Your loyalty program is inactive",
                "inactiveSubtitle": "Activate it in the Program tab to start rewarding customers",
                "configure": "Configure",
            },
            "tabs": {
                "overview": "Overview",
                "members": "Members",
                "transactions": "Transactions",
                "program": "Program",
            },
            "stats": {
                "activeMembers": "Active Members",
                "totalEarned": "Total Earned",
                "totalRedeemed": "Total Redeemed",
                "txnsLast30d": "Transactions (30d)",
            },
            "overview": {
                "programConfig": "Program Configuration",
                "status": "Status",
                "active": "Active",
                "inactive": "Inactive",
                "ptsPer": "pts per",
                "pts": "pts",
                "topMembers": "Top Members",
                "noMembers": "No members yet. Start by creating a transaction.",
            },
            "table": {
                "member": "Member",
                "tier": "Tier",
                "balance": "Balance",
                "date": "Date",
                "type": "Type",
                "reason": "Reason",
                "points": "Points",
            },
            "txnType": {
                "earn": "Earn",
                "redeem": "Redeem",
                "adjust": "Adjust",
                "expire": "Expire",
            },
            "transactions": {
                "empty": "No transactions yet",
                "newTitle": "New Loyalty Transaction",
            },
            "program": {
                "basics": "Basics",
                "earnRedeem": "Earn & Redeem Rules",
                "tiers": "Membership Tiers",
                "name": "Program Name",
                "currency": "Currency",
                "isActive": "Program is active",
                "pointsPerUnit": "Points per unit of currency",
                "pointsPerUnitHint": "E.g. 1 means customer earns 1 point for every 1 TRY spent",
                "redeemValue": "Value per point on redemption",
                "redeemValueHint": "How much 1 point is worth when redeemed",
                "minRedeem": "Minimum points to redeem",
                "addTier": "Add tier",
                "noTiers": "No tiers defined. Tiers let you reward top customers with multipliers and perks.",
                "tierName": "Tier name",
                "multiplier": "multiplier",
                "save": "Save Program",
                "saved": "Program saved successfully",
            },
            "form": {
                "customer": "Customer",
                "selectCustomer": "Select a customer…",
                "type": "Transaction Type",
                "points": "Points",
                "pointsHint": "Always enter a positive number — redeem/expire will become negative automatically",
                "reason": "Reason",
                "reasonPlaceholder": "e.g. Invoice #1234, Birthday bonus, Redeemed for discount",
            },
            "actions": {
                "create": "Create",
                "cancel": "Cancel",
            },
            "confirm": {
                "deleteTxn": "Delete this transaction? This will change the customer's balance.",
            },
            "errors": {
                "selectCustomer": "Please select a customer",
                "enterPoints": "Please enter a points value",
            },
        },
    },
    "ar": {
        "Loyalty": {
            "title": "ولاء العملاء",
            "subtitle": "كافئ العملاء المتكررين بنقاط ومستويات",
            "newTransaction": "معاملة جديدة",
            "pts": "نقطة",
            "banner": {
                "inactiveTitle": "برنامج الولاء غير مفعّل",
                "inactiveSubtitle": "فعّله من تبويب البرنامج لتبدأ بمكافأة العملاء",
                "configure": "الإعداد",
            },
            "tabs": {
                "overview": "نظرة عامة",
                "members": "الأعضاء",
                "transactions": "المعاملات",
                "program": "البرنامج",
            },
            "stats": {
                "activeMembers": "الأعضاء النشطون",
                "totalEarned": "إجمالي المُكتسب",
                "totalRedeemed": "إجمالي المُستبدل",
                "txnsLast30d": "المعاملات (30 يومًا)",
            },
            "overview": {
                "programConfig": "إعدادات البرنامج",
                "status": "الحالة",
                "active": "مُفعّل",
                "inactive": "غير مُفعّل",
                "ptsPer": "نقطة لكل",
                "pts": "نقطة",
                "topMembers": "أفضل الأعضاء",
                "noMembers": "لا يوجد أعضاء بعد. ابدأ بإنشاء معاملة.",
            },
            "table": {
                "member": "العضو",
                "tier": "المستوى",
                "balance": "الرصيد",
                "date": "التاريخ",
                "type": "النوع",
                "reason": "السبب",
                "points": "النقاط",
            },
            "txnType": {
                "earn": "كسب",
                "redeem": "استبدال",
                "adjust": "تعديل",
                "expire": "انتهاء",
            },
            "transactions": {
                "empty": "لا توجد معاملات بعد",
                "newTitle": "معاملة ولاء جديدة",
            },
            "program": {
                "basics": "الأساسيات",
                "earnRedeem": "قواعد الكسب والاستبدال",
                "tiers": "مستويات العضوية",
                "name": "اسم البرنامج",
                "currency": "العملة",
                "isActive": "البرنامج نشط",
                "pointsPerUnit": "نقاط لكل وحدة من العملة",
                "pointsPerUnitHint": "مثال: 1 يعني أن العميل يكسب نقطة لكل 1 ليرة",
                "redeemValue": "قيمة النقطة عند الاستبدال",
                "redeemValueHint": "كم تساوي نقطة واحدة عند الاستبدال",
                "minRedeem": "الحد الأدنى للاستبدال",
                "addTier": "إضافة مستوى",
                "noTiers": "لا توجد مستويات. المستويات تتيح لك مكافأة كبار العملاء بمضاعفات ومزايا.",
                "tierName": "اسم المستوى",
                "multiplier": "مضاعف",
                "save": "حفظ البرنامج",
                "saved": "تم حفظ البرنامج بنجاح",
            },
            "form": {
                "customer": "العميل",
                "selectCustomer": "اختر عميلًا…",
                "type": "نوع المعاملة",
                "points": "النقاط",
                "pointsHint": "أدخل دائمًا رقمًا موجبًا — الاستبدال والانتهاء سيصبحان سالبين تلقائيًا",
                "reason": "السبب",
                "reasonPlaceholder": "مثال: فاتورة #1234، مكافأة عيد ميلاد، استبدال بخصم",
            },
            "actions": {
                "create": "إنشاء",
                "cancel": "إلغاء",
            },
            "confirm": {
                "deleteTxn": "حذف هذه المعاملة؟ سيتغير رصيد العميل.",
            },
            "errors": {
                "selectCustomer": "الرجاء اختيار عميل",
                "enterPoints": "الرجاء إدخال قيمة نقاط",
            },
        },
    },
    "tr": {
        "Loyalty": {
            "title": "Müşteri Sadakati",
            "subtitle": "Tekrar eden müşterileri puan ve seviyelerle ödüllendirin",
            "newTransaction": "Yeni İşlem",
            "pts": "puan",
            "banner": {
                "inactiveTitle": "Sadakat programınız pasif durumda",
                "inactiveSubtitle": "Müşterileri ödüllendirmeye başlamak için Program sekmesinden etkinleştirin",
                "configure": "Yapılandır",
            },
            "tabs": {
                "overview": "Genel Bakış",
                "members": "Üyeler",
                "transactions": "İşlemler",
                "program": "Program",
            },
            "stats": {
                "activeMembers": "Aktif Üyeler",
                "totalEarned": "Toplam Kazanılan",
                "totalRedeemed": "Toplam Kullanılan",
                "txnsLast30d": "İşlemler (30 gün)",
            },
            "overview": {
                "programConfig": "Program Yapılandırması",
                "status": "Durum",
                "active": "Aktif",
                "inactive": "Pasif",
                "ptsPer": "puan /",
                "pts": "puan",
                "topMembers": "En İyi Üyeler",
                "noMembers": "Henüz üye yok. Bir işlem oluşturarak başlayın.",
            },
            "table": {
                "member": "Üye",
                "tier": "Seviye",
                "balance": "Bakiye",
                "date": "Tarih",
                "type": "Tür",
                "reason": "Sebep",
                "points": "Puan",
            },
            "txnType": {
                "earn": "Kazanım",
                "redeem": "Kullanım",
                "adjust": "Düzeltme",
                "expire": "Süre Sonu",
            },
            "transactions": {
                "empty": "Henüz işlem yok",
                "newTitle": "Yeni Sadakat İşlemi",
            },
            "program": {
                "basics": "Temel Ayarlar",
                "earnRedeem": "Kazanım ve Kullanım Kuralları",
                "tiers": "Üyelik Seviyeleri",
                "name": "Program Adı",
                "currency": "Para Birimi",
                "isActive": "Program aktif",
                "pointsPerUnit": "Birim başına puan",
                "pointsPerUnitHint": "Örn: 1 değeri, her 1 TL harcamada 1 puan kazanılacağı anlamına gelir",
                "redeemValue": "Kullanım sırasında puan başına değer",
                "redeemValueHint": "1 puan kullanıldığında ne kadar değerindedir",
                "minRedeem": "Minimum kullanım puanı",
                "addTier": "Seviye ekle",
                "noTiers": "Tanımlı seviye yok. Seviyeler, en iyi müşterilere çarpanlar ve ek avantajlar sağlar.",
                "tierName": "Seviye adı",
                "multiplier": "çarpan",
                "save": "Programı Kaydet",
                "saved": "Program başarıyla kaydedildi",
            },
            "form": {
                "customer": "Müşteri",
                "selectCustomer": "Müşteri seçin…",
                "type": "İşlem Türü",
                "points": "Puan",
                "pointsHint": "Her zaman pozitif bir sayı girin — kullanım/süre sonu otomatik olarak negatif olur",
                "reason": "Sebep",
                "reasonPlaceholder": "Örn: Fatura #1234, Doğum günü bonusu, İndirim için kullanıldı",
            },
            "actions": {
                "create": "Oluştur",
                "cancel": "İptal",
            },
            "confirm": {
                "deleteTxn": "Bu işlem silinsin mi? Müşterinin bakiyesi değişecek.",
            },
            "errors": {
                "selectCustomer": "Lütfen bir müşteri seçin",
                "enterPoints": "Lütfen bir puan değeri girin",
            },
        },
    },
}

NAV_LOYALTY = {"en": "Loyalty", "ar": "الولاء", "tr": "Sadakat"}


def inject(lang: str):
    path = ROOT / f"{lang}.json"
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f, object_pairs_hook=OrderedDict)

    if "Nav" in data and isinstance(data["Nav"], dict):
        if "loyalty" not in data["Nav"]:
            new_nav = OrderedDict()
            inserted = False
            for k, v in data["Nav"].items():
                new_nav[k] = v
                if k == "quotes" and not inserted:
                    new_nav["loyalty"] = NAV_LOYALTY[lang]
                    inserted = True
            if not inserted:
                new_nav["loyalty"] = NAV_LOYALTY[lang]
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
