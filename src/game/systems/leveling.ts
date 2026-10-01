import { GEAR_PER_LEVEL_UP, SKILL_MAX_LEVEL, expRequiredForLevel, type SkillId } from '../data/skills'
import type { SkillState } from '../state/types'

export interface LevelUpResult {
  skill: SkillState
  levelsGained: number
  gearGained: number
}

// Adds exp and resolves every level-up it triggers (the original only ever
// resolved one level-up per action; using a loop here is a strict
// improvement, not a new mechanic - per-click exp gains are always far
// smaller than one level's requirement in practice).
export function addExp(skillId: SkillId, skill: SkillState, amount: number): LevelUpResult {
  const maxLevel = SKILL_MAX_LEVEL[skillId]
  let { level, exp } = skill
  exp += amount
  let levelsGained = 0

  while (level < maxLevel) {
    const needed = expRequiredForLevel(level)
    if (exp < needed) break
    exp -= needed
    level += 1
    levelsGained += 1
  }

  if (level >= maxLevel) {
    exp = 0
  }

  return {
    skill: { level, exp },
    levelsGained,
    gearGained: levelsGained * GEAR_PER_LEVEL_UP,
  }
}
