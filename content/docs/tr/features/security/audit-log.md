---
title: "Gelişmiş Denetim Günlüğü"
slug: "audit-log"
category: "security"
order: 25
plans: ["enterprise"]
updatedAt: "2026-04-24"
readTime: "4 min"
featureNumber: 25
---

# Gelişmiş Denetim Günlüğü

**Ne yapar:** Her eylemin eksiksiz adli kaydı: kimin ne görüntülediği, ne düzenlediği, ne sildiği, ne zaman, hangi IP'den. Her değişikliğin öncesi/sonrası anlık görüntüleri. Uyumluluk incelemeleri için CSV ve JSON dışa aktarma.

## Gerçek Hayattan Örnek

**Gerçek Dünya Örneği: "İzmir Sigorta Aracısı"**

Bir müşteri, kendisine 40.000$'a mal olan bir poliçe değişikliğini asla yetkilendirmediğini iddia etti. Aracı yönetimi kanıta ihtiyaç duydu. Bir denetim günlüğü olmadan, savunmaları yoktu.

Zyrix'ten sonra, denetim günlükleri gösterir: "15-03-2024 14:22 — Kullanıcı Ahmet Ali IP 82.223.x.x'den poliçe #12345'i değiştirmeyi yetkilendirdi — önce: 200$/ay kapsam, sonra: 240$/ay kapsam." **Anlaşmazlık kesin olarak çözüldü. 40.000$ kurtarıldı.**
