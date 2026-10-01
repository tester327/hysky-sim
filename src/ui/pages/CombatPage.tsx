import { SUMMONING_EYE_BUY_COST, SUMMONING_EYE_CAP } from '../../game/data/combat'
import { ZEALOTS_UNLOCK_COMBAT_LEVEL } from '../../game/data/skills'
import { activeEndermanTier, activeWolfTier } from '../../game/systems/petSystem'
import { useGameStore } from '../../state/store'
import { Button } from '../components/Button'
import { Panel } from '../components/Panel'
import { StatRow } from '../components/StatRow'
import { formatCoins, formatNumber } from '../format'

export function CombatPage() {
  const game = useGameStore((s) => s.game)
  const clickGryptGhoul = useGameStore((s) => s.clickGryptGhoul)
  const clickZealot = useGameStore((s) => s.clickZealot)
  const buySummoningEye = useGameStore((s) => s.buySummoningEye)

  const wolf = activeWolfTier(game)
  const enderman = activeEndermanTier(game)

  return (
    <div>
      <h1>Combat</h1>

      <Panel title="Active pet bonuses">
        <StatRow label="Wolf (bonus Combat XP)" value={wolf ? `+${wolf.bonus} XP (${wolf.name})` : 'Locked'} />
        <StatRow label="Enderman (Summoning Eye drop chance)" value={enderman ? enderman.name : 'Locked'} />
      </Panel>

      <Panel title="Grypt Ghouls">
        <Button variant="primary" onClick={clickGryptGhoul}>
          Fight Grypt Ghouls
        </Button>
      </Panel>

      <Panel title="Zealots">
        {game.combat.zealotsUnlocked ? (
          <>
            <StatRow label="Summoning Eyes" value={`${formatNumber(game.combat.summoningEyes)} / ${SUMMONING_EYE_CAP}`} />
            <StatRow label="Zealots farmed" value={formatNumber(game.combat.zealotsFarmed)} />
            <div className="btn-row">
              <Button variant="primary" onClick={clickZealot}>
                Farm Zealots
              </Button>
              <Button
                onClick={buySummoningEye}
                disabled={game.coins < SUMMONING_EYE_BUY_COST || game.combat.summoningEyes >= SUMMONING_EYE_CAP}
              >
                Buy Summoning Eye ({formatCoins(SUMMONING_EYE_BUY_COST)})
              </Button>
            </div>
          </>
        ) : (
          <p className="muted">Unlocks at Combat level {ZEALOTS_UNLOCK_COMBAT_LEVEL}.</p>
        )}
      </Panel>
    </div>
  )
}
