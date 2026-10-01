import { SKILL_MAX_LEVEL, expRequiredForLevel, type SkillId } from '../../game/data/skills'
import { useGameStore } from '../../state/store'
import { formatCoins, formatNumber } from '../format'

const SKILL_LABELS: Record<SkillId, string> = {
  farming: 'Farming',
  combat: 'Combat',
  mining: 'Mining',
  slayer: 'Slayer',
}

interface LiveStatsBarProps {
  skillIds?: SkillId[]
  showGear?: boolean
}

// Sticky bar pinned to the top of the page so Coins/Gear/skill XP stay
// visible while clicking, without having to scroll back up or switch to
// the Overview page to see what an action just earned.
export function LiveStatsBar({ skillIds = [], showGear = false }: LiveStatsBarProps) {
  const game = useGameStore((s) => s.game)

  return (
    <div className="live-stats">
      <span className="live-stats-item live-stats-item--gold">{formatCoins(game.coins)}</span>
      {showGear && <span className="live-stats-item live-stats-item--accent">Gear {formatNumber(game.gear)}</span>}
      {skillIds.map((id) => {
        const skill = game.skills[id]
        const maxLevel = SKILL_MAX_LEVEL[id]
        const maxed = skill.level >= maxLevel
        return (
          <span key={id} className="live-stats-item">
            {SKILL_LABELS[id]} Lv {skill.level}
            {maxed ? ' (MAX)' : ` (${formatNumber(skill.exp)} / ${formatNumber(expRequiredForLevel(skill.level))} XP)`}
          </span>
        )
      })}
    </div>
  )
}
