# HySky Sim — Projektgedächtnis

> Diese Datei ist die Quelle der Wahrheit für den Projektstand. Neue Session: **zuerst diese Datei komplett lesen**, dann beim "Nächsten Schritt" weitermachen statt von vorne zu beginnen. Nach jedem abgeschlossenen Schritt wird diese Datei aktualisiert und ein Git-Commit gemacht.

## Projektziel

Das alte Tkinter-Clicker-Game `legacy/hysky simulator v 1.5(GEMSTONES).py` (Hypixel-Skyblock-inspiriert, ~1700 Zeilen, Anfängercode) wird als moderne, statische Single-Page-App komplett neu gebaut:

- **Stack:** TypeScript (strict) + React + Vite, kein Backend, Hosting auf Netlify (Subdomain von tester-327.com, DNS bei GoDaddy, Deploy über GitHub "tester327" macht der User selbst).
- Spiellogik strikt von UI getrennt (reine TS-Module), alle Werte zentral in Config/Daten-Dateien.
- Spielgefühl & Mechaniken bleiben Hypixel-Skyblock-artig, Original-Mechaniken bleiben klar in der Mehrheit. Sehr wenig, gut begründeter neuer Inhalt (siehe Abschnitt "Neue Inhalte").
- Spielsprache in der App: Englisch (Item-/Skill-Namen an Hypixel Skyblock angelehnt). Projekt-Doku (CLAUDE.md, Kommentare mit User) auf Deutsch, da der User Deutsch schreibt.
- Kein Idle/Offline-Progress. localStorage-Autosave mit versioniertem Schema, Export/Import als JSON, Reset mit Bestätigung.

## Tech-Stack & Architekturentscheidungen

| Bereich | Entscheidung | Kurzbegründung |
|---|---|---|
| Sprache/Build | TypeScript (strict) + Vite | Schnell, kein Backend nötig, exzellenter Netlify-Support |
| UI | React 18 | Vom User vorgegeben |
| State Management | **Zustand** | Leichtgewichtig, kein Boilerplate wie bei reinem useReducer/Context, Store-Logik ist reines TS (kein React-Import nötig in den Actions), `persist`-Middleware passt ideal zu localStorage-Autosave. Game-Engine (Berechnungen) bleibt trotzdem in `src/game/**` ohne Zustand-Import — der Store in `src/state/store.ts` ruft nur die reinen Funktionen auf. |
| Routing | React Router (`BrowserRouter`) | Mehrere "Seiten" gefordert; Netlify-SPA-Redirect (`/* -> /index.html 200` in `netlify.toml`) macht Reloads auf Unterseiten unproblematisch. Keine absoluten Base-Paths, `base: './'` in Vite-Config. |
| Persistenz | localStorage, eigenes versioniertes Save-Objekt (`saveVersion`), manuelles Serialisieren (kein Zustand-`persist`-Autopilot für den Payload, um Migrationscode klar kontrollieren zu können) | Volle Kontrolle über Migrationslogik für künftige Versionen; Export/Import als Datei ist so auch einfacher. |
| Styling | Reines CSS (CSS-Module oder einfache globale Tokens-Datei), keine UI-Kit-Libs | Entspricht "kein KI-Look", volle Kontrolle über minimalistisches, Minecraft-angehauchtes Design. |

## Ordnerstruktur (Vorschlag)

```
/src
  /game                     <- reine Spiellogik, KEIN React-Import
    /data                   <- alle Zahlenwerte zentral, nichts hardcoded im Code
      skills.ts             (Level-XP-Formel, Max-Level pro Skill)
      farming.ts            (Crops: Kosten, Coins/Klick, XP/Klick)
      combat.ts             (Grypt Ghouls, Zealots, Summoning Eyes)
      mining.ts             (Wolle, Hardstone, Gemstones, HOTM-Upgrades, Drills)
      slayer.ts             (Zombie Slayer T1/T2, Enderman Slayer, Droptabellen, Rezepte)
      dungeons.ts           (Floor 1–7 Configs, Reward-Tabellen)
      pets.ts               (Pet-Tier-Tabellen je Skill)
      economy.ts            (Gear-Käufe, Hyperion, generische Kostenkurven-Helper)
    /state
      types.ts              (GameState-Interface, versioniert)
      initialState.ts
    /systems                (reine Funktionen: (state, ...) => state, von Store-Actions aufgerufen)
      farmingSystem.ts
      combatSystem.ts
      miningSystem.ts
      slayerSystem.ts
      dungeonSystem.ts
      petSystem.ts          (Pet-Boni als Selector/Ableitung aus Skill-Level)
      leveling.ts           (gemeinsame Level-Up-Logik)
    /save
      serialize.ts          (Export/Import JSON)
      migrate.ts            (Versions-Migrationsgerüst, aktuell nur v1 Identity)
      autosave.ts
  /state
    store.ts                (Zustand-Store, bindet /game/systems an UI)
  /ui
    /components             (Button, Panel, StatRow, NavBar, ConfirmDialog, PixelIcon, ProgressBar ...)
    /pages
      OverviewPage.tsx
      FarmingPage.tsx
      CombatPage.tsx
      SlayerPage.tsx
      MiningPage.tsx
      DungeonsPage.tsx
      GearShopPage.tsx
      SettingsPage.tsx
    App.tsx
    routes.tsx
  /styles
    tokens.css               (Farbpalette, Pixel-Font-Vars, Spacing)
    global.css
  main.tsx
/legacy                       <- Altcode, nicht im Build, in .gitignore
/public
netlify.toml
README.md
BALANCING.md
CLAUDE.md
```

**Code-Konventionen:**
- `camelCase` für Variablen/Funktionen, `PascalCase` für Komponenten/Types, Dateien in `/game` nach Domäne benannt.
- Jede Zahl, die früher eine Magic Number war, wandert in `/game/data/*.ts` als benannte Konstante oder Tabelle.
- Kommentare nur an nicht-trivialen Stellen (z. B. Formelherkunft, bewusste Balancing-Entscheidung, Abweichung vom Original).
- Alle Spielaktionen laufen als reine Funktionen `(state, payload) => newState` in `/game/systems`, der Zustand-Store ruft sie nur auf — UI kennt keine Formeln.

## Datenmodell Spielstand (Save Schema v1 — Entwurf)

```ts
interface SaveGameV1 {
  saveVersion: 1;
  meta: { createdAt: string; lastSavedAt: string };
  coins: number;
  gear: number;
  skills: {
    farming: { level: number; exp: number };
    combat: { level: number; exp: number };
    mining: { level: number; exp: number };
    slayerXp: { level: number; exp: number }; // "Slayer-Level" aus dem Original (max 15)
  };
  farming: {
    unlocks: { cane: boolean; pumpkin: boolean; melon: boolean; netherwarts: boolean };
    extraExpUpgradeLevel: number; // ersetzt extra_farming_exp
  };
  combat: {
    zealotsUnlocked: boolean; // ab Combat Level 12
    summoningEyes: number;
    zealotsFarmed: number;
  };
  mining: {
    mithrilPowder: number;
    gemstonePowder: number;
    hardstone: number;
    roughGemstones: number;
    fineGemstones: number;
    extraCoinsLevel: number;
    extraXpLevel: number;
    efficientMinerLevel: number;
    miningFortune: number;
    pristineChancePercent: number;
    hotmFortuneLevel: number;
    hotmPristineLevel: number;
    drillTier: 0 | 1 | 2 | 3;
  };
  slayer: {
    zombieT1: { active: boolean; clicksRemaining: number };
    zombieT2: { active: boolean; clicksRemaining: number };
    endermanT1: { active: boolean; clicksRemaining: number }; // NEU, siehe unten
    materials: { revenantFlesh: number; viresca: number; sytheBlades: number; shardOfTheShredded: number; wardenHearts: number };
    crafted: { wardenHelmet: boolean; axeOfTheShredded: boolean; shredderArtifact: boolean };
  };
  dungeons: {
    floors: Record<1|2|3|4|5|6|7, { clicksRemaining: number; inProgress: boolean }>;
    lastReward: string | null;
  };
}
```

Pet-Boni werden **nicht** gespeichert, sondern aus den Skill-Leveln abgeleitet (`petSystem.ts`, reine Selector-Funktion) — siehe Bugfix-Hinweis unten.

## Bestandsaufnahme des Originals (`legacy/hysky simulator v 1.5(GEMSTONES).py`)

### Skills (Level-XP-Formel überall gleich: `expFürLevel = level * (level * 4) + 1`)
| Skill | Max-Level | Belohnung je Level-Up |
|---|---|---|
| Farming | 150 | +1 Gear |
| Combat | 100 | +1000 Coins, +1 Gear; ab Level 12 Zealots freigeschaltet |
| Mining | 150 | +1 Gear, +1 Mining Fortune |
| Slayer | 15 | +1 Gear |

### Ressourcen/Währungen
Coins, Gear (Score für Dungeon-Zugang & XP-Boni), Mithril Powder, Gemstone Powder, Rough Gemstones, Fine Gemstones, Hardstone, Summoning Eyes, Revenant Flesh, Viresca, Sythe Blades, Shard of the Shredded, Warden Hearts.

### Klick-Aktionen (Farmen/Minen)
- **Weizen farmen** (immer verfügbar): +farming_level Coins, +1 XP + Pet-Boni + Extra-XP-Upgrade.
- **Cane farmen** (Unlock 10.000 Coins): +farming_level×3 Coins + Elephant-Pet-Fortune-Bonus, +2.5 XP.
- **Pumpkin farmen** (Unlock 50.000 Coins): +farming_level×2 Coins, +4 XP + Rabbit-Pet-Bonus.
- **Netherwarts farmen** (Unlock 1.000.000 Coins): +farming_level×7 Coins + Elephant-Bonus. **Bug:** ruft `farming_up()` nie auf → keine XP. Wird im Remake gefixt.
- **Grypt Ghouls farmen** (Combat, immer verfügbar): +15 Coins, +7 XP + Wolf-Pet-Bonus.
- **Zealots farmen** (ab Combat 12): +Summoning-Eyes×3 Coins, Chance auf +1 Summoning Eye (Chance verbessert sich mit Enderman-Pet-Tier, Cap 2500 Eyes), +5 Combat-XP.
- **Graue Wolle minen**: +2×EfficientMiner XP, +1 Mithril Powder, +5×EfficientMiner Coins.
- **Blaue Wolle minen**: +1×EfficientMiner XP, +2 Mithril Powder, +1×EfficientMiner Coins.
- **Hardstone minen**: +1–3 Mithril Powder, +1–5 Gemstone Powder, +1–5 Hardstone (zufällig).
- **Gemstone minen**: +Mining-Fortune Rough Gems; Chance (= Pristine%) auf +round(Fortune/20) Fine Gems.

### Upgrades/Shops
- Farming-XP-Upgrade: Kosten = `extraExpLevel × 10.000` Coins, +1 Flat-XP/Klick je Kauf (unbegrenzt).
- Mining HOTM: Extra Coins (max 75, Kosten `lvl×(lvl×4)+100` Mithril Powder), Extra XP (max 50, gleiche Formel), Efficient Miner (max 50, Start bei 1, Kosten `lvl×(lvl×8)+200`, multipliziert Wolle-Erträge).
- HOTM Fortune (max 250, 500 Gemstone Powder/Level, +1 Fortune) und HOTM Pristine (max 60, 5000 Gemstone Powder/Level, +1 Pristine%).
- Drills: Ruby Drill (1500 Hardstone, +50 Fortune/+5 Pristine) → Gemstone Drill (1500 Rough Gems, netto +150/+15) → Perfect Drill (1500 Fine Gems, netto +300/+40, "Maxed").
- Sell-Buttons: Gems/Hardstone (Hardstone×3, Rough×10, Fine×2000 Coins), Slayer-T2-Material (Flesh×100, Viresca×100.000, Sythe×4.000.000, Shard×10.000.000, Warden Heart×60.000.000).
- Summoning Eye direkt kaufen: 60.000 Coins, Cap 2500.
- Gear direkt kaufen: 60.000 Coins = +1 Gear. "Hyperion" kaufen: 30.000.000 Coins = +550 Gear.

### Slayer
- **T1 ("Zombie Slayer I")**: 50.000 Coins → 50 Klicks → Reward-Roll (skaliert mit Slayer-Level 0–15: je höher, desto bessere Zusatz-Drops: 20k Coins / 1 Mio Coins / 7 Mio Coins / 15 Slayer-XP, Wahrscheinlichkeiten je Levelband unterschiedlich). Fix: +4 Slayer-XP, +700 Combat-XP, +1 Gear.
- **T2 ("Zombie Slayer II")**: 500.000 Coins → 175 Klicks (−25 mit Axe of the Shredded, −50 mit Warden Helmet) → Drop-Roll für Flesh/Viresca/Sythe Blade/Shard/Warden Heart. Fix: +15 Slayer-XP, +5000 Combat-XP (+500 mit Artifact), +1 Gear.
- Craftbar aus Materialien: Warden Helmet (2500 Flesh, 50 Viresca, 5 Sythe, 1 Heart), Axe of the Shredded (1000 Flesh, 25 Viresca, 1 Sythe, 2 Shard), Shredder Artifact (10 Shard).

### Dungeons (Floor 1–7)
Klick-Quest: fixe Klickzahl (50/75/100/150/200/300/350), danach Reward-Roll **nur wenn** Gear-Mindestwert erreicht ist (5/75/250/500/1250/2500/5000), sonst "Dungeon verloren". Rewards skalieren pro Floor stark (Coins von ~2k bis 22 Mio, Gear von wenigen bis 500, Combat-XP 30 bis 2000). Floor 7 nutzt eine 1–1000-Zufallsskala statt 1–100 für feinere Raritäten.

### Pet-System (Bug im Original)
Pets sind reine **Level-Schwellen-Boni** (keine wählbaren Items), pro Skill in Tiers:
- Farming: Rabbit (XP-Bonus, Wheat/Pumpkin) & Elephant (Fortune-Bonus, Cane/Netherwarts), je 7 Tiers bei Level 20/45/60/80/95/120/145.
- Combat: Wolf (Bonus-Combat-XP), 5 Tiers bei 20/45/60/80/95.
- Zealots-Farmen (Teil von Combat): Enderman (verbessert Eye-Drop-Chance), 5 Tiers bei 20/45/60/80/95.
- Mining: Silverfish (Extra-XP) & Mithril Golem (Extra-Mithril-Powder), je 4 Tiers bei 20/70/120/150.

**Bug:** Es gibt nur eine globale `active_pet`-Anzeige, die von der zuletzt geklickten Aktion überschrieben wird — die Boni selbst wirken aber unabhängig davon immer alle gleichzeitig (so als wären alle passenden Pets ständig aktiv). **Fix im Remake:** Die Boni bleiben wie im Original (alle unlockten Pet-Tiers wirken gleichzeitig je Aktivität), aber die Anzeige wird korrekt als "aktive Boni pro Kategorie"-Liste dargestellt statt als ein überschriebenes Label.

### Sonstige im Original gefundene Unsauberkeiten (werden im Remake bereinigt, nicht als "neuer Inhalt" gezählt)
- `slayerklicks`/`T2slayerklicks` sind mal `bool`, mal `int` (Typfehler im Original).
- `dungeon_clicks`-Variable wird gesetzt, aber nirgends sinnvoll verwendet.
- UI ist absolute Pixel-Positionierung (`.place(x=, y=)`) in 4 Spalten (Farming/Combat-Slayer/Mining/Gear-Dungeons) — wird durch echte Seiten/Navigation ersetzt.

## Neue Inhalte (Vorschlag — wartet auf Freigabe)

Bewusst sehr begrenzt, Original bleibt klar in der Mehrheit:

1. **Enderman Slayer T1** ("Voidgloom Seraph", klick-basiert wie Zombie Slayer T1/T2). Begründung: Summoning Eyes existieren im Original bereits (werden beim Zealots-Farmen gesammelt oder für 60k gekauft, Cap 2500), haben aber keinen echten Sink außer einem kleinen Coin-Trickle. In echtem Hypixel Skyblock summonen Summoning Eyes genau den Enderman-Slayer-Boss (Voidgloom Seraph) — das Original hat dieses System quasi schon zur Hälfte gebaut. Wir vervollständigen es nur mit dem bereits vorhandenen Klick-Quest/Reward-Roll-Muster (kein neues System, gleiche Mechanik wie bestehender Slayer), Eintrittspreis in Summoning Eyes statt Coins.
2. **Melon farmen** als 5. Crop, Unlock bei 250.000 Coins, eingeordnet zwischen Pumpkin (50k) und Netherwarts (1 Mio). Begründung: Melon ist eine reale Hypixel-Skyblock-Nutzpflanze; die Lücke zwischen 50k und 1 Mio Coins Unlock-Kosten ist im Original sehr groß, ein Zwischenschritt glättet die Progressionskurve ohne neue Mechanik (reine Kopie des Crop-Patterns mit interpolierten Werten).

Beide Punkte nutzen ausschließlich bereits vorhandene Mechanik-Muster (Klick-Quest-Belohnungsschema bzw. Crop-Schema) und bestehende Ressourcen — es wird kein neues System eingeführt.

**Warten auf Freigabe:** Ja/Nein zu 1 und 2 (auch einzeln ablehnbar), bevor Phase 2 beginnt.

## Balancing — Vorgehen

Balancing-Werte werden in Phase 2 mit nachvollziehbaren Formeln (z. B. bestehende `lvl*(lvl*4)+C`-Familie, exponentielle Kostenkurven) initial befüllt und an die Zielkurve angepasst (spürbarer Fortschritt in ersten Minuten, Großteil der Inhalte in einigen Stunden, komplett maxed erst nach mehreren Tagen aktiven Spielens). Phase 3 ist dann ein dedizierter Review-Pass: alte vs. neue Werte, Formel-Herkunft, grobe Zeitabschätzung — dokumentiert in `BALANCING.md`.

## Status

**Aktuelle Phase:** Phase 1 — Analyse & Plan. **Warte auf Freigabe des Users**, bevor Code geschrieben wird.

### Erledigt
- [x] Git-Repo initialisiert.
- [x] `legacy/hysky simulator v 1.5(GEMSTONES).py` verschoben, `/legacy` in `.gitignore`.
- [x] Komplette Analyse des Originalcodes (Mechaniken, Werte, Formeln, Bugs) — siehe oben.
- [x] Projektstruktur, Seitenaufteilung, Datenmodell (Entwurf) vorgeschlagen.
- [x] Neue Inhalte vorgeschlagen (Enderman Slayer T1, Melon-Crop).
- [x] CLAUDE.md mit Phase-1-Stand angelegt.

### Offen (Checkliste)
- [ ] **Freigabe des Users einholen** zu: Projektstruktur, Datenmodell, Zustand als State-Lib, Seitenaufteilung, neue Inhalte (Enderman Slayer, Melon).
- [ ] Vite + React + TS-Projekt gerüstet (Scaffolding, Grundkonfiguration, `netlify.toml`).
- [ ] `/game`-Module je Domäne implementieren (Daten + Systeme), Werte vorerst nach bestem Ermessen übernommen/leicht angepasst.
- [ ] Save/Load inkl. Export/Import/Reset implementieren.
- [ ] UI-Seiten + Navigation + responsives, minimalistisches Design (Pixel-Font, eigene SVG-Icons) implementieren.
- [ ] Balancing-Review (Phase 3) inkl. `BALANCING.md`.
- [ ] `README.md` finalisieren.
- [ ] CLAUDE.md auf Abschlussstand bringen.

## Nächster Schritt

**Warte auf User-Freigabe** zum Phase-1-Plan (Struktur, Datenmodell, State-Wahl, Seiten, neue Inhalte). Nach Freigabe: Vite/React/TS-Projekt aufsetzen und mit den Daten-/Systemmodulen für Farming beginnen (einfachster Skill, guter Startpunkt für das Muster, das alle anderen Skills übernehmen).

## Offene Fragen / Entscheidungen, auf die gewartet wird

1. Freigabe der neuen Inhalte (Enderman Slayer T1, Melon-Crop) — beide, nur eines, oder keines?
2. Falls Einwände gegen Zustand als State-Lib bestehen: alternativ useReducer+Context möglich, aber Zustand wird empfohlen.
3. Sonst keine offenen Blocker.
