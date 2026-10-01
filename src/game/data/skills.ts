// Central skill definitions. The leveling curve is the one quadratic formula
// the original game used for every skill (farming/combat/mining/slayer):
// expRequiredForLevel(level) = level * (level * 4) + 1

export type SkillId = 'farming' | 'combat' | 'mining' | 'slayer'

export const SKILL_MAX_LEVEL: Record<SkillId, number> = {
  farming: 150,
  combat: 100,
  mining: 150,
  slayer: 15,
}

export function expRequiredForLevel(level: number): number {
  return level * (level * 4) + 1
}

// Every skill grants +1 Gear per level gained, in addition to any
// skill-specific level-up bonus (e.g. Mining Fortune for Mining).
export const GEAR_PER_LEVEL_UP = 1

// Combat level at which Zealot farming unlocks.
export const ZEALOTS_UNLOCK_COMBAT_LEVEL = 12
