# HySky Sim — Projektgedächtnis

> Diese Datei ist die Quelle der Wahrheit für den Projektstand. Neue Session: **zuerst diese Datei komplett lesen**, dann beim "Nächsten Schritt" weitermachen statt von vorne zu beginnen. Nach jedem abgeschlossenen Schritt wird diese Datei aktualisiert und ein Git-Commit gemacht.

## Projektziel

Das alte Tkinter-Clicker-Game `legacy/hysky simulator v 1.5(GEMSTONES).py` (Hypixel-Skyblock-inspiriert, ~1700 Zeilen, Anfängercode) wurde als moderne, statische Single-Page-App komplett neu gebaut:

- **Stack:** TypeScript (strict) + React 19 + Vite, kein Backend, Hosting auf Netlify (Subdomain von tester-327.com, DNS bei GoDaddy, Deploy über GitHub "tester327" macht der User selbst).
- Spiellogik strikt von UI getrennt (reine TS-Module in `src/game/**`), alle Werte zentral in Config/Daten-Dateien.
- Spielgefühl & Mechaniken bleiben Hypixel-Skyblock-artig, Original-Mechaniken bleiben klar in der Mehrheit. Sehr wenig, gut begründeter neuer Inhalt (siehe Abschnitt "Neue Inhalte" — beide vom User freigegeben).
- Spielsprache in der App: Englisch (Item-/Skill-Namen an Hypixel Skyblock angelehnt). Projekt-Doku (CLAUDE.md, Kommentare mit User) auf Deutsch, da der User Deutsch schreibt.
- Kein Idle/Offline-Progress. localStorage-Autosave mit versioniertem Schema, Export/Import als JSON, Reset mit Bestätigung.

## Tech-Stack & Architekturentscheidungen

| Bereich | Entscheidung | Kurzbegründung |
|---|---|---|
| Sprache/Build | TypeScript 5.9 (strict) + Vite 8 | Schnell, kein Backend nötig, exzellenter Netlify-Support. TS bewusst auf 5.9.x gepinnt statt des brandneuen TS-7-Majors, um Tooling-Reibung zu vermeiden. |
| UI | React 19 | Vom User vorgegeben, aktuelle stabile Version verwendet |
| State Management | **Zustand** (`src/state/store.ts`) | Leichtgewichtig, kein Boilerplate wie bei reinem useReducer/Context. Store ist nur eine dünne Bindeschicht: jede Action ruft eine reine `(state, ...args) => state`-Funktion aus `src/game/systems/*` auf und persistiert danach (debounced). Die Spiellogik selbst hat keinen Zustand-Import. |
| Routing | React Router (`BrowserRouter`) | Netlify-SPA-Redirect (`/* -> /index.html 200` in `netlify.toml`) macht Reloads auf Unterseiten unproblematisch. `base: './'` in Vite-Config, keine absoluten Base-Paths. |
| Persistenz | localStorage, eigenes versioniertes Save-Objekt (`saveVersion`), manuelles Serialisieren in `src/game/save/*` | Volle Kontrolle über Migrationslogik für künftige Versionen; Export/Import als Datei ist so auch einfacher. |
| Styling | Reines CSS (`src/styles/tokens.css` + `global.css`), keine UI-Kit-Libs | Entspricht "kein KI-Look": erdige Palette, VT323-Pixel-Font nur für Überschriften/Zahlen, selbst gezeichnete Pixel-SVG-Icons (`PixelIcon.tsx`), keine Verläufe/Glow/Emoji. |

## Ordnerstruktur (umgesetzt)

```
/src
  /game                     <- reine Spiellogik, KEIN React-Import
    /data                   <- alle Zahlenwerte zentral, nichts hardcoded im Code
      skills.ts, farming.ts, combat.ts, mining.ts, slayer.ts, dungeons.ts, pets.ts, economy.ts
    /state
      types.ts              (GameState-Interface, versioniert)
      initialState.ts
    /systems                (reine Funktionen (state, ...args) => state)
      farmingSystem.ts, combatSystem.ts, miningSystem.ts, slayerSystem.ts,
      dungeonSystem.ts, gearSystem.ts, petSystem.ts (Selector), leveling.ts, dice.ts
    /save
      storage.ts             (localStorage read/write)
      migrate.ts              (Versions-Migrationsgerüst, aktuell nur v1 Identity)
      fileTransfer.ts         (Export/Import als .json)
      autosave.ts             (Debounce-Helper)
  /state
    store.ts                 (Zustand-Store, bindet /game/systems an UI)
  /ui
    /components              (Button, Panel, StatRow, SkillProgressRow, NavBar, ConfirmDialog, PixelIcon, ProgressBar)
    /pages                   (OverviewPage, FarmingPage, CombatPage, SlayerPage, MiningPage, DungeonsPage, GearShopPage, SettingsPage)
    App.tsx
    format.ts                 (Zahlenformatierung)
  /styles
    tokens.css, global.css
  main.tsx
  vite-env.d.ts
/legacy                       <- Altcode, nicht im Build, in .gitignore
netlify.toml
README.md
BALANCING.md
CLAUDE.md
```

**Code-Konventionen:**
- `camelCase` für Variablen/Funktionen, `PascalCase` für Komponenten/Types, Dateien in `/game` nach Domäne benannt.
- Jede Zahl, die früher eine Magic Number war, liegt in `/game/data/*.ts` als benannte Konstante oder Tabelle.
- Kommentare nur an nicht-trivialen Stellen (Formelherkunft, bewusste Balancing-Entscheidung, Abweichung vom Original).
- Alle Spielaktionen laufen als reine Funktionen `(state, payload) => newState` in `/game/systems`, der Zustand-Store ruft sie nur auf — UI kennt keine Formeln.

## Datenmodell Spielstand (Save Schema v1 — umgesetzt in `src/game/state/types.ts`)

Siehe `types.ts` für die vollständige, aktuelle `GameState`-Definition (Quelle der Wahrheit, hier nicht dupliziert). Kernstruktur: `saveVersion`, `meta`, `coins`, `gear`, `skills` (farming/combat/mining/slayer), `farming` (Unlocks + XP-Upgrade-Level), `combat` (Zealots/Summoning Eyes), `mining` (Powder/Gems/Upgrades/Fortune/Pristine/Drill), `slayer` (3 Quests inkl. Enderman-Slayer, Materialien, Crafting), `dungeons` (Floors 1–7).

Pet-Boni werden **nicht** gespeichert, sondern aus den Skill-Leveln abgeleitet (`petSystem.ts`, reine Selector-Funktionen) — siehe Bugfix-Hinweis unten.

## Bestandsaufnahme des Originals (`legacy/hysky simulator v 1.5(GEMSTONES).py`)

### Skills (Level-XP-Formel überall gleich: `expFürLevel = level * (level * 4) + 1`, **unverändert übernommen** — siehe `BALANCING.md`)
| Skill | Max-Level | Belohnung je Level-Up |
|---|---|---|
| Farming | 150 | +1 Gear |
| Combat | 100 | +1000 Coins, +1 Gear; ab Level 12 Zealots freigeschaltet |
| Mining | 150 | +1 Gear, +1 Mining Fortune |
| Slayer | 15 | +1 Gear |

### Ressourcen/Währungen
Coins, Gear (Score für Dungeon-Zugang & XP-Boni), Mithril Powder, Gemstone Powder, Rough Gemstones, Fine Gemstones, Hardstone, Summoning Eyes, Revenant Flesh, Viresca, Sythe Blades, Shard of the Shredded, Warden Hearts.

### Klick-Aktionen, Upgrades, Slayer, Dungeons, Pet-System
Vollständige Mechanik-Liste inkl. aller Original-Formeln/-Werte und gefundener Bugs steht weiterhin unten (unverändert aus Phase 1) — als Referenz, falls künftig an einzelnen Werten weitergearbeitet wird. Für die tatsächlich verbauten Werte ist `src/game/data/*.ts` die Quelle der Wahrheit, für die Begründung jeder Abweichung `BALANCING.md`.

<details>
<summary>Original-Mechanik-Referenz (Phase-1-Analyse, Details)</summary>

**Klick-Aktionen:**
- Weizen farmen (immer verfügbar): +farming_level Coins, +1 XP + Pet-Boni + Extra-XP-Upgrade.
- Cane farmen (Unlock 10.000 Coins): +farming_level×3 Coins + Elephant-Bonus, +2.5 XP.
- Pumpkin farmen (Unlock 50.000 Coins): +farming_level×2 Coins, +4 XP + Rabbit-Bonus.
- Netherwarts farmen (Unlock 1.000.000 Coins): +farming_level×7 Coins + Elephant-Bonus. Bug: keine XP (gefixt).
- Grypt Ghouls farmen: +15 Coins, +7 XP + Wolf-Bonus.
- Zealots farmen (ab Combat 12): +Summoning-Eyes×3 Coins, Chance auf +1 Summoning Eye (Cap 2500), +5 Combat-XP.
- Graue Wolle minen: +2×EfficientMiner XP, +1 Mithril Powder, +5×EfficientMiner Coins.
- Blaue Wolle minen: +1×EfficientMiner XP, +2 Mithril Powder, +1×EfficientMiner Coins.
- Hardstone minen: +1–3 Mithril Powder, +1–5 Gemstone Powder, +1–5 Hardstone.
- Gemstone minen: +Mining-Fortune Rough Gems; Chance (Pristine%) auf +round(Fortune/20) Fine Gems.

**Upgrades/Shops:** Farming-XP-Upgrade (`extraExpLevel×10.000` Coins), Mining HOTM Extra Coins/XP (max 75/50, `lvl×(lvl×4)+100` Mithril Powder), Efficient Miner (max 50, Start 1, `lvl×(lvl×8)+200`), HOTM Fortune/Pristine (max 250/60, 500/5000 Gemstone Powder pro Level), Drills (Ruby/Gemstone/Perfect, 1500 Hardstone/Rough/Fine), Sell-Buttons, Summoning Eye kaufen (60k, Cap 2500), Gear kaufen (60k), Hyperion (30 Mio = +550 Gear).

**Slayer:** T1 (50k, 50 Klicks, Reward-Roll skaliert mit Slayer-Level), T2 (500k, 175 Klicks, −25/−50 mit Axe/Helmet, Material-Drops), Crafting (Warden Helmet, Axe of the Shredded, Shredder Artifact).

**Dungeons Floor 1–7:** Klickzahl 50/75/100/150/200/300/350, Gear-Mindestwert 5/75/250/500/1250/2500/5000, sonst "Dungeon verloren". Floor 7 nutzt 1–1000-Zufallsskala.

**Pet-System:** Reine Level-Schwellen-Boni (kein Equip). Farming: Rabbit (XP) & Elephant (Fortune), je 7 Tiers (20/45/60/80/95/120/145). Combat: Wolf (Bonus-XP), 5 Tiers. Zealots: Enderman (Eye-Chance), 5 Tiers. Mining: Silverfish (XP) & Mithril Golem (Powder), je 4 Tiers (20/70/120/150).

**Bugs im Original (alle gefixt, Details in `BALANCING.md`):** 0 Coins/Klick bei Level 0 (Cold-Start), Netherwarts ohne XP, nicht-monotone Wolf-Pet-Tiers, tote Float-Vergleichs-Branches bei Slayer-T1-Bonusrollen, überschriebenes Pet-Label statt gleichzeitig wirkender Boni, `slayerklicks` mal bool/mal int, ungenutzte `dungeon_clicks`-Variable.

</details>

## Neue Inhalte (vom User freigegeben, implementiert)

1. **Enderman Slayer I** (`src/game/data/slayer.ts: ENDERMAN_T1`): Eintritt 10 Summoning Eyes (statt Coins), 120 Klicks, Basis 50.000 Coins + 1.500 Combat-XP + 10 Slayer-XP, 1–1000-Bonusroll analog zu Zombie Slayer I. Macht die zuvor fast nutzlose Summoning-Eyes-Ressource sinnvoll.
2. **Melon** (`src/game/data/farming.ts: CROPS`): 5. Crop, Unlock 250.000 Coins zwischen Pumpkin (50k) und Netherwarts (1 Mio.), Werte interpoliert. Glättet die große Lücke in der Unlock-Kostenkurve.

Beide nutzen ausschließlich bereits vorhandene Mechanik-Muster und Ressourcen, kein neues System. Simulation bestätigt sinnvolle zeitliche Einordnung (Melon ~5.8h, siehe `BALANCING.md`).

## Balancing — Ergebnis

Phase-3-Review durchgeführt (Methodik + alle Werte/Begründungen in `BALANCING.md`): Eine eigens gebaute Simulation (Klick-für-Klick, 1 Klick/s, ausgewogenes Skillen) zeigt, dass die **unveränderte** Original-Level-Formel (`level*(level*4)+1`) in Kombination mit den Bugfixes bereits die Zielkurve trifft (erste Level-Ups in Sekunden, erste Unlocks nach Minuten, Großteil der Inhalte in 1–26h, alle drei Kernskills maxed nach ~56h verteilt über mehrere Tage). Die Formel wurde deshalb bewusst **nicht** verändert — die eigentlichen Probleme waren die Bugs (0-Coins-Cold-Start etc.), nicht die Kurve selbst. Alle Kostenkurven (Upgrades) ebenfalls unverändert übernommen.

## Status

**Aktuelle Phase:** Abgeschlossen (Phase 1–3 durchlaufen). Bereit für Deploy durch den User.

### Erledigt
- [x] Git-Repo initialisiert, `legacy/` verschoben + gitignored.
- [x] Phase 1: Vollständige Analyse des Originalcodes, Plan, neue Inhalte vorgeschlagen — vom User pauschal freigegeben.
- [x] Phase 2: Vite + React 19 + TS-Projekt aufgesetzt (strict, `netlify.toml`, relative Base-Path).
- [x] Komplette Spiellogik in `src/game/**` (Daten, Typen, reine Systeme für Farming/Combat/Mining/Slayer/Dungeons/Gear, Pet-Selectoren, Save/Load inkl. Versionierung, Export/Import, Autosave-Debounce).
- [x] Zustand-Store (`src/state/store.ts`) bindet alle Systeme an die UI.
- [x] Alle 8 Seiten + Navigation + responsives, minimalistisches Design (VT323-Pixel-Font, erdige Palette, eigene Pixel-SVG-Icons, Touch-Targets ≥44px) implementiert.
- [x] Manuell im Browser verifiziert: Dev-Server lief, alle 8 Seiten durchgeklickt, Rechenwege für Coins/XP/Level-Up Schritt für Schritt nachgerechnet und bestätigt, Reload-Persistenz + SPA-Deep-Link (`/mining` direkt per Reload) funktioniert, keine Konsolenfehler.
- [x] `npm run typecheck` fehlerfrei (TS strict).
- [x] Phase 3: Balancing-Review per Simulation, Ergebnis + alle Werte/Begründungen in `BALANCING.md` dokumentiert.
- [x] `README.md` (Projektbeschreibung, lokal starten, bauen, Netlify-Deploy-Hinweise).
- [x] CLAUDE.md auf Abschlussstand gebracht.

- [x] Nachträglich (User-Feedback): Sticky "Live Stats"-Leiste (`LiveStatsBar.tsx`) auf allen Aktions-Seiten (Farming/Combat/Mining/Slayer/Dungeons/Gear Shop) ergänzt — zeigt Coins/Gear/relevante Skill-Level+XP direkt während des Klickens, bleibt beim Scrollen oben fixiert.

### Offen
- Nichts Blockierendes. Deploy (Netlify-Projekt anlegen, GitHub-Repo pushen, DNS bei GoDaddy) macht der User selbst, wie vereinbart.

## Nächster Schritt

Keiner zwingend — Projekt ist aus Code-Sicht fertig. Falls eine neue Session hier weitermacht: zuerst `npm install && npm run dev` lokal prüfen, dann bei Bedarf eine der "Mögliche nächste Ideen" unten mit dem User abstimmen.

## Mögliche nächste Ideen (nicht beauftragt, nur Vorschläge für später)

- Dungeon-Floor-7-Combat-XP-Inkonsistenz (siehe `BALANCING.md`, "Known trade-off"-nahe Fundstelle) ggf. bewusst nachjustieren.
- Automatisierte Tests (User hat explizit "keine Tests nötig" gesagt — nur falls sich das später ändert).
- Optionales Light/Dark-Theme-Umschalten in den Settings (aktuell folgt die App automatisch `prefers-color-scheme`, beide Paletten sind in `tokens.css` definiert).

## Offene Fragen / Entscheidungen, auf die gewartet wird

Keine. Alle Phase-1-Fragen wurden vom User pauschal freigegeben ("ich find alles gut was du vorgeschlagen hast").
