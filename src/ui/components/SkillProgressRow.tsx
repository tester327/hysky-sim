import { SKILL_MAX_LEVEL, expRequiredForLevel, type SkillId } from '../../game/data/skills'
import type { SkillState } from '../../game/state/types'
import { formatNumber } from '../format'
import { ProgressBar } from './ProgressBar'

interface SkillProgressRowProps {
  skillId: SkillId
  label: string
  skill: SkillState
}

export function SkillProgressRow({ skillId, label, skill }: SkillProgressRowProps) {
  const maxLevel = SKILL_MAX_LEVEL[skillId]
  const maxed = skill.level >= maxLevel
  const needed = maxed ? 1 : expRequiredForLevel(skill.level)
  const current = maxed ? 1 : skill.exp
  const text = maxed
    ? `${label} Lv ${maxLevel} (MAX)`
    : `${label} Lv ${skill.level} (${formatNumber(skill.exp)} / ${formatNumber(needed)} XP)`

  return <ProgressBar current={current} max={needed} label={text} />
}
