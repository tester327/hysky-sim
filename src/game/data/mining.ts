// Mining: Wool mining (Mithril Powder), Hardstone/Gemstone mining
// (Gemstone Powder, Rough/Fine Gemstones), HOTM-style upgrades and Drills.

export const WOOL = {
  grey: { mithrilPowder: 1, coinsBase: 5, xpBase: 2 },
  blue: { mithrilPowder: 2, coinsBase: 1, xpBase: 1 },
}

export const HARDSTONE_MINE = {
  mithrilPowderMin: 1,
  mithrilPowderMax: 3,
  gemstonePowderMin: 1,
  gemstonePowderMax: 5,
  hardstoneMin: 1,
  hardstoneMax: 5,
}

export const SELL_PRICES = {
  hardstone: 3,
  roughGemstone: 10,
  fineGemstone: 2000,
}

// Generic upgrade-cost curve helper, mirrors the original's
// `level * (level * multiplier) + base` family used everywhere.
export function quadraticCost(level: number, multiplier: number, base: number): number {
  return level * (level * multiplier) + base
}

export const MINING_UPGRADES = {
  extraCoins: { maxLevel: 75, costMultiplier: 4, costBase: 100 },
  extraXp: { maxLevel: 50, costMultiplier: 4, costBase: 100 },
  efficientMiner: { maxLevel: 50, startLevel: 1, costMultiplier: 8, costBase: 200 },
}

export const HOTM_UPGRADES = {
  fortune: { maxLevel: 250, costPerLevel: 500 },
  pristine: { maxLevel: 60, costPerLevel: 5000 },
}

export type DrillTier = 0 | 1 | 2 | 3

export interface DrillConfig {
  tier: DrillTier
  label: string
  cost: number
  costResource: 'hardstone' | 'roughGemstones' | 'fineGemstones'
  fortuneBonus: number
  pristineBonus: number
}

// Each tier's bonus replaces the previous tier's (net gain = difference),
// exactly like the original craft_*_drill functions.
export const DRILLS: DrillConfig[] = [
  { tier: 1, label: 'Ruby Drill', cost: 1500, costResource: 'hardstone', fortuneBonus: 50, pristineBonus: 5 },
  { tier: 2, label: 'Gemstone Drill', cost: 1500, costResource: 'roughGemstones', fortuneBonus: 150, pristineBonus: 15 },
  { tier: 3, label: 'Perfect Drill', cost: 1500, costResource: 'fineGemstones', fortuneBonus: 300, pristineBonus: 40 },
]
