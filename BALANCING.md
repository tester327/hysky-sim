# HySky Sim — Balancing

This document records every numeric change from the original `legacy/hysky simulator v 1.5(GEMSTONES).py`,
why it changed, and a rough time-to-progress estimate. All live values are defined in `src/game/data/*.ts`;
this file explains the reasoning, it does not duplicate the numbers as a second source of truth.

## Methodology

Most per-click formulas carry over from the original unchanged (see table below) - the original's shape
(`base + level * multiplier` style scaling, `level * (level * k) + c` cost curves) was already reasonable,
it just had a few concrete bugs. To check whether the **leveling curve** itself needed rebalancing, it was
extracted into a standalone simulation (not part of the shipped app) that plays the game with a simple
always-click-the-lowest-level-skill strategy, buying every affordable unlock/upgrade greedily, at an assumed
sustained rate of **1 click/second**. This is a simplification - a real player clicks in bursts with breaks,
so real elapsed *calendar* time will stretch out well beyond the simulated numbers below. What the simulation
is useful for is the *relative* shape of the curve and whether orders of magnitude are sane.

## Leveling formula: unchanged

```
expRequiredForLevel(level) = level * (level * 4) + 1
```

This is the exact formula the original used for Farming, Combat, Mining and Slayer. The simulation (Farming
level 0->150, Mining level 0->150, Combat level 0->100, run together with round-robin clicking) landed at:

| Milestone | Simulated time (1 click/s) |
|---|---|
| Farming: Sugar Cane unlocked (10k coins) | ~20 min |
| Combat 12 (Zealots unlocked) | ~38 min |
| Farming: Pumpkin unlocked (50k coins) | ~1.1 h |
| Zombie Slayer I affordable (50k coins) | ~1.7 h |
| Farming: Melon unlocked (250k coins, new) | ~5.8 h |
| Zombie Slayer II affordable (500k coins) | ~10.9 h |
| Farming: Netherwarts unlocked (1m coins) | ~25.7 h |
| Combat level 100 (MAX) | ~44.6 h |
| Farming level 150 (MAX) | ~56.3 h |
| Mining level 150 (MAX) | ~56.4 h |

That already matches the target curve reasonably well: noticeable progress in the first minutes (first
level-up within single-digit seconds, first unlock within ~20 minutes), most unlockable content within a
single-digit number of hours, full core-skill completion after what amounts to several days of real play
sessions. **Conclusion: the formula itself was not the problem, so it was kept unchanged.** The real issues
were the bugs below, which made the early game feel unrewarding regardless of the curve.

Mining's *full* completion (Hardstone/Gemstone Powder, HOTM Fortune+Pristine, all three Drills) takes
noticeably longer than the 56h above, because the simulation only exercises wool mining for the Mining
skill - Hardstone mining, Gemstone mining and the HOTM upgrade currencies are separate click loops on top of
that. Likewise, Slayer maxing, Dungeon Floor 7, and buying Hyperion are long-tail completionist goals gated
by Gear and coins far beyond what's needed to max the four skills. This mirrors the original's structure
(a skill cap is reachable, "100%" is a much longer grind) and was intentionally left as-is.

## Bug fixes (not rebalancing, just correctness)

| Issue in the original | Fix |
|---|---|
| Wheat (and every crop) paid `farming_level` coins - **0 coins per click at level 0**, a dead cold start | Every crop now pays `coinsBase + coinsPerLevel * level`, so level 0 already earns something |
| Netherwarts click never called `farming_up()` - **0 Farming XP ever**, regardless of level | Netherwarts now grants 6 XP/click, in line with its tier |
| Wolf pet tiers: `1, 2, 1, 8, 10` - tier 3 is *lower* than tier 2, clearly a typo since every other pet track strictly increases | Changed to `1, 2, 4, 8, 10` |
| Zombie Slayer I bonus-roll brackets used float comparisons like `level > 6.9 and level < 7`, which can never be true for an integer level - most of the "level-scaled bonus roll" logic was dead code, only reachable at the exact integer levels 8, 9, and >=10 | Rebuilt as clean thresholds (`level >= 8` small roll, `level >= 10` big roll) that reproduce what the original actually did at runtime, just without the unreachable dead branches |
| Only one global "active pet" label, overwritten by whichever action was clicked last, even though every action's bonus applied independently of the label | All unlocked pet-tier bonuses for a category now display correctly at once (Rabbit/Elephant on Farming, Wolf/Enderman on Combat, Silverfish/Mithril Golem on Mining) - the underlying bonuses behave exactly as before |
| Dungeon Floor 7 granted *less* Combat XP (1200) than Floor 6 (2000) despite requiring more Gear and paying out more coins/Gear - looks like an authoring slip | Left as-is for v1 (ported faithfully); flagged here as a candidate for a future balance pass since fixing it is a judgment call about *how much* more XP it should give, not a bug with one obvious correct value |

## New content values

- **Melon** (new crop): unlock cost 250,000 coins, `coinsBase 8 / coinsPerLevel 5`, 5 XP/click. Interpolated
  between Pumpkin (50k, `4/2`, 4 XP) and Netherwarts (1m, `10/7`, 6 XP) on both cost and yield, confirmed by
  the simulation to land at ~5.8h - comfortably between Pumpkin's ~1.1h and Netherwarts' ~25.7h.
- **Enderman Slayer I** (new): entry cost 10 Summoning Eyes (not coins - reuses the existing, previously
  near-dead-end resource), 120 clicks (between Zombie Slayer I's 50 and II's 175), base reward 50,000 coins +
  1,500 Combat XP + 10 Slayer XP, with a 1-1000 bonus roll table (1,000,000 to 15,000,000 coins / +25 Slayer
  XP) modeled directly on Zombie Slayer I's high-level roll table, just shifted to feel rarer/more premium
  since the entry currency is capped at 2,500 and takes real investment to farm.

## Unlock / upgrade cost curves

All quadratic-shaped costs (`level * (level * multiplier) + base`) are unchanged from the original:
Farming XP upgrade (`level * 10,000`), Mining Extra Coins/Extra XP (`level*(level*4)+100`), Efficient Miner
(`level*(level*8)+200`). HOTM Fortune/Pristine stay flat-cost-per-level (500 / 5,000 Gemstone Powder) as in
the original. These were kept because nothing in the simulation or the manual playtest suggested they were
out of step with the (unchanged) leveling curve they gate.

## Known trade-off

Dungeon Floors can only be *started* when the player already has enough Gear (the original let you start
and then silently fail with zero reward if under-geared, wasting all the clicks). The remake disables the
Start button in that case instead. This changes no numeric value and produces identical outcomes - it is a
UX fix, not a balance change.
