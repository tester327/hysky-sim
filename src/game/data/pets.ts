// Pet bonuses from the original game: not equippable items, just passive
// bonuses that unlock at skill level thresholds. In the original, only one
// "active pet" label was shown (and kept getting overwritten by whichever
// action was clicked last), but every bonus was actually always applied
// regardless of the label. The remake keeps that functional behaviour
// (all unlocked tiers of a track are simultaneously active) and just fixes
// the display bug by showing every active bonus per category instead of a
// single overwritten label.

export interface PetTier {
  level: number
  name: string
  bonus: number
}

// Farming - XP track (Rabbit): boosts Wheat, Pumpkin, Melon.
export const RABBIT_TIERS: PetTier[] = [
  { level: 20, name: 'Rabbit (1)', bonus: 1 },
  { level: 45, name: 'Rabbit (2)', bonus: 3 },
  { level: 60, name: 'Rabbit (3)', bonus: 4.5 },
  { level: 80, name: 'Rabbit (4)', bonus: 6 },
  { level: 95, name: 'Rabbit (5)', bonus: 10 },
  { level: 120, name: 'Rabbit (6)', bonus: 15 },
  { level: 145, name: 'Rabbit (7)', bonus: 20 },
]

// Farming - Fortune/coin track (Elephant): boosts Cane, Netherwarts.
export const ELEPHANT_TIERS: PetTier[] = [
  { level: 20, name: 'Elephant (1)', bonus: 20 },
  { level: 45, name: 'Elephant (2)', bonus: 40 },
  { level: 60, name: 'Elephant (3)', bonus: 80 },
  { level: 80, name: 'Elephant (4)', bonus: 150 },
  { level: 95, name: 'Elephant (5)', bonus: 300 },
  { level: 120, name: 'Elephant (6)', bonus: 400 },
  { level: 145, name: 'Elephant (7)', bonus: 600 },
]

// Combat: bonus Combat XP on every Grypt Ghoul kill.
// The original had a non-monotonic tier (2 -> 1 at tier 3), clearly a typo
// since every other track strictly increases with tier. Fixed here.
export const WOLF_TIERS: PetTier[] = [
  { level: 20, name: 'Wolf (1)', bonus: 1 },
  { level: 45, name: 'Wolf (2)', bonus: 2 },
  { level: 60, name: 'Wolf (3)', bonus: 4 },
  { level: 80, name: 'Wolf (4)', bonus: 8 },
  { level: 95, name: 'Wolf (5)', bonus: 10 },
]

// Combat (Zealot farming): lowers the Summoning Eye drop threshold out of
// 420, i.e. raises the drop chance. Chance = (420 - threshold + 1) / 420.
export const ENDERMAN_TIERS: PetTier[] = [
  { level: 20, name: 'Enderman (1)', bonus: 410 },
  { level: 45, name: 'Enderman (2)', bonus: 390 },
  { level: 60, name: 'Enderman (3)', bonus: 370 },
  { level: 80, name: 'Enderman (4)', bonus: 350 },
  { level: 95, name: 'Enderman (5)', bonus: 300 },
]
export const BASE_EYE_DROP_THRESHOLD = 420

// Mining - XP track (Silverfish).
export const SILVERFISH_TIERS: PetTier[] = [
  { level: 20, name: 'Silverfish (1)', bonus: 1 },
  { level: 70, name: 'Silverfish (2)', bonus: 2 },
  { level: 120, name: 'Silverfish (3)', bonus: 3 },
  { level: 150, name: 'Silverfish (4)', bonus: 4 },
]

// Mining - Mithril Powder track (Mithril Golem).
export const MITHRIL_GOLEM_TIERS: PetTier[] = [
  { level: 20, name: 'Mithril Golem (1)', bonus: 1 },
  { level: 70, name: 'Mithril Golem (2)', bonus: 2 },
  { level: 120, name: 'Mithril Golem (3)', bonus: 3 },
  { level: 150, name: 'Mithril Golem (4)', bonus: 4 },
]

// Returns the highest unlocked tier for a skill level, or undefined if none.
export function highestUnlockedTier(tiers: PetTier[], skillLevel: number): PetTier | undefined {
  let best: PetTier | undefined
  for (const tier of tiers) {
    if (skillLevel >= tier.level) best = tier
  }
  return best
}
