#!/usr/bin/env python3
"""Inject Chat translations into en/ar/tr JSON files."""

import json
from pathlib import Path
from collections import OrderedDict

ROOT = Path(__file__).parent.parent / "messages"

TRANSLATIONS = {
    "en": {
        "Chat": {
            "title": "Team Chat",
            "subtitle": "Direct messages with your team",
            "newChat": "Start new chat",
            "searchTeam": "Search team…",
            "noTeamMembers": "No other team members",
            "noThreads": "No conversations yet",
            "noThreadsHint": "Tap + to start a chat with a teammate",
            "selectChat": "Select a conversation",
            "selectChatHint": "Choose someone from the sidebar to start chatting",
            "emptyConversation": "No messages yet",
            "emptyConversationHint": "Say hello to start the conversation",
            "messagePlaceholder": "Type a message…",
            "send": "Send",
            "you": "You",
            "noMessagesYet": "No messages yet",
        },
    },
    "ar": {
        "Chat": {
            "title": "دردشة الفريق",
            "subtitle": "رسائل مباشرة مع فريقك",
            "newChat": "بدء محادثة جديدة",
            "searchTeam": "ابحث في الفريق…",
            "noTeamMembers": "لا يوجد أعضاء آخرون في الفريق",
            "noThreads": "لا توجد محادثات بعد",
            "noThreadsHint": "اضغط + لبدء محادثة مع زميل",
            "selectChat": "اختر محادثة",
            "selectChatHint": "اختر شخصًا من القائمة الجانبية لبدء الدردشة",
            "emptyConversation": "لا توجد رسائل بعد",
            "emptyConversationHint": "قل مرحبًا لبدء المحادثة",
            "messagePlaceholder": "اكتب رسالة…",
            "send": "إرسال",
            "you": "أنت",
            "noMessagesYet": "لا توجد رسائل بعد",
        },
    },
    "tr": {
        "Chat": {
            "title": "Ekip Sohbeti",
            "subtitle": "Ekibinizle doğrudan mesajlaşma",
            "newChat": "Yeni sohbet başlat",
            "searchTeam": "Ekipte ara…",
            "noTeamMembers": "Başka ekip üyesi yok",
            "noThreads": "Henüz konuşma yok",
            "noThreadsHint": "Bir ekip üyesiyle sohbet başlatmak için + simgesine dokunun",
            "selectChat": "Bir konuşma seçin",
            "selectChatHint": "Sohbete başlamak için kenar çubuğundan birini seçin",
            "emptyConversation": "Henüz mesaj yok",
            "emptyConversationHint": "Konuşmayı başlatmak için merhaba deyin",
            "messagePlaceholder": "Mesaj yazın…",
            "send": "Gönder",
            "you": "Sen",
            "noMessagesYet": "Henüz mesaj yok",
        },
    },
}

NAV_CHAT = {"en": "Team Chat", "ar": "دردشة الفريق", "tr": "Ekip Sohbeti"}


def inject(lang: str):
    path = ROOT / f"{lang}.json"
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f, object_pairs_hook=OrderedDict)

    if "Nav" in data and isinstance(data["Nav"], dict):
        if "chat" not in data["Nav"]:
            new_nav = OrderedDict()
            inserted = False
            for k, v in data["Nav"].items():
                new_nav[k] = v
                if k == "tasks" and not inserted:
                    new_nav["chat"] = NAV_CHAT[lang]
                    inserted = True
            if not inserted:
                new_nav["chat"] = NAV_CHAT[lang]
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
