// Farming crops. Each crop has a flat base yield plus a per-level multiplier,
// so clicking is never worth 0 coins even at Farming level 0 (the original
// paid exactly `farming_level` coins per Wheat click, i.e. nothing at level
// 0 - a cold-start bug fixed here).
//
// Pet tracks: Rabbit (flat XP bonus) applies to Wheat/Pumpkin/Melon.
// Elephant (flat coin/"fortune" bonus) applies to Cane/Netherwarts.

export type CropId = 'wheat' | 'cane' | 'pumpkin' | 'melon' | 'netherwarts'

export interface CropConfig {
  id: CropId
  label: string
  /** Coins unlock cost. `undefined` means always unlocked (Wheat). */
  unlockCost?: number
  coinsBase: number
  coinsPerLevel: number
  xpPerClick: number
  petTrack: 'rabbit' | 'elephant'
}

export const CROPS: CropConfig[] = [
  {
    id: 'wheat',
    label: 'Wheat',
    coinsBase: 2,
    coinsPerLevel: 1,
    xpPerClick: 1,
    petTrack: 'rabbit',
  },
  {
    id: 'cane',
    label: 'Sugar Cane',
    unlockCost: 10_000,
    coinsBase: 5,
    coinsPerLevel: 3,
    xpPerClick: 2.5,
    petTrack: 'elephant',
  },
  {
    id: 'pumpkin',
    label: 'Pumpkin',
    unlockCost: 50_000,
    coinsBase: 4,
    coinsPerLevel: 2,
    xpPerClick: 4,
    petTrack: 'rabbit',
  },
  // New crop (approved addition): smooths the large 50k -> 1m unlock gap
  // between Pumpkin and Netherwarts with the same crop pattern.
  {
    id: 'melon',
    label: 'Melon',
    unlockCost: 250_000,
    coinsBase: 8,
    coinsPerLevel: 5,
    xpPerClick: 5,
    petTrack: 'rabbit',
  },
  {
    id: 'netherwarts',
    label: 'Netherwart',
    unlockCost: 1_000_000,
    coinsBase: 10,
    coinsPerLevel: 7,
    // Original never granted Farming XP for Netherwarts (missing function
    // call) - clear bug, fixed here with a value in line with the other
    // high-tier crops.
    xpPerClick: 6,
    petTrack: 'elephant',
  },
]

// Cost to buy +1 flat Farming XP per click. cost(level) = level * 10,000.
export const FARMING_EXP_UPGRADE_BASE_COST = 10_000
