# 🌹 GLOW HUNTRESS

Aplicație PWA gamificată pentru fitness & wellness, adaptată unui program **glute-focused 5 zile/săptămână** pentru începătoare.

## ✨ Features

- **Program 5 zile**: Lower A (Glute+Quad) → Upper+Core → Lower B (Glute+Ham) → Lower C (Glute Pump) → Core+Mobility
- **Misiuni zilnice principale** (5): Rutină Matinală, Rugăciune AM, Afirmații, Recunoștință PM, Antrenament
- **~50 misiuni bonus** generate aleatoriu zilnic (common / rare / legendary)
- **Boss Day săptămânal** joi/vineri/sâmbătă cu 5× XP
- **Hunter Stats**: STR / END / MND / WIL — uncapped progression
- **Streak shields** — streak-ul nu se resetează la 0, scade cu 30% per zi ratată
- **Achievements** — 21 badges (bronze / silver / gold / legendary)
- **Weekly Report** automat duminica seara
- **Rest Timer** integrat cu preset-uri 45s–3min
- **Glute-focused tips** rotative zilnic
- **Sunset Coral theme** — `#ff7a8a` + `#ffb380` peste `#1a1115`

## 🚀 Deploy

### Vercel
```bash
npm i -g vercel
vercel
```
Atât. Site-ul e static — fără build step.

### GitHub Pages
1. Push pe repo GitHub.
2. Settings → Pages → Source: `main` branch, root folder.
3. URL: `https://<user>.github.io/<repo>/`

### Local
Orice server static:
```bash
python3 -m http.server 8000
# sau
npx serve .
```

## 📱 Instalare ca PWA

**iPhone (Safari)**: deschide URL-ul → Share → "Add to Home Screen"
**Android (Chrome)**: deschide URL-ul → meniu → "Install app"

Datele se salvează local în `localStorage` — nu există server, nu există tracking.

## 🗂 Structură

```
HUNTRESS_APP/
├── index.html       # entry point + tab bar + modale
├── style.css        # Sunset Coral theme
├── app.js           # logica completă (state, XP, achievements, etc.)
├── data.js          # programul de antrenamente + pool-uri misiuni
├── sw.js            # service worker (offline + auto-update)
├── manifest.json    # PWA manifest (icon embedded SVG)
├── vercel.json      # config deploy Vercel (no-cache pe SW)
└── README.md
```

## 💾 Backup & Import

Tab **Profil → Date** are butoane pentru:
- Export JSON (descărcat local)
- Import JSON (suprascrie tot)
- Recalculează streak (din istoricul de habits)
- Șterge toate datele

## 🎨 Customizare

**Schimbă paleta de culori**: editează variabilele CSS din `:root` în `style.css`.

**Adaugă misiuni bonus**: extinde array-ul `BONUS_MISSION_POOL` din `data.js`. Fiecare item: `{ id, title, desc, xp, rarity, stat }`.

**Modifică programul de antrenamente**: editează obiectul `PROGRAM` din `data.js`. Fiecare zi are listă de `exercises` cu `{ id, name, target, defaultUnit, note }`.

## 📜 Credits

Built with vanilla HTML/CSS/JS — zero dependencies, zero frameworks.
Inspirat din **Solo Leveling** + cultul progresiei prin disciplină.

---

**Versiune**: v1.0
**Licență**: MIT — folosește, modifică, distribuie liber.
