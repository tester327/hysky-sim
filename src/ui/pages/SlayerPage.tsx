import { CRAFT_RECIPES, ENDERMAN_T1, ZOMBIE_T1, ZOMBIE_T2 } from '../../game/data/slayer'
import { zombieT2ClicksRequired } from '../../game/systems/slayerSystem'
import { useGameStore } from '../../state/store'
import { Button } from '../components/Button'
import { LiveStatsBar } from '../components/LiveStatsBar'
import { Panel } from '../components/Panel'
import { ProgressBar } from '../components/ProgressBar'
import { StatRow } from '../components/StatRow'
import { formatCoins, formatNumber } from '../format'

export function SlayerPage() {
  const game = useGameStore((s) => s.game)
  const startZombieT1 = useGameStore((s) => s.startZombieT1)
  const clickZombieT1 = useGameStore((s) => s.clickZombieT1)
  const startZombieT2 = useGameStore((s) => s.startZombieT2)
  const clickZombieT2 = useGameStore((s) => s.clickZombieT2)
  const startEndermanT1 = useGameStore((s) => s.startEndermanT1)
  const clickEndermanT1 = useGameStore((s) => s.clickEndermanT1)
  const sellSlayerDrops = useGameStore((s) => s.sellSlayerDrops)
  const craftWardenHelmet = useGameStore((s) => s.craftWardenHelmet)
  const craftAxeOfTheShredded = useGameStore((s) => s.craftAxeOfTheShredded)
  const craftShredderArtifact = useGameStore((s) => s.craftShredderArtifact)

  const m = game.slayer.materials
  const zombieT2Clicks = zombieT2ClicksRequired(game)

  return (
    <div>
      <h1>Slayer</h1>
      <LiveStatsBar skillIds={['slayer', 'combat']} />

      {game.slayer.lastDropLabel && (
        <Panel title="Last drop">
          <p className="drop-label">{game.slayer.lastDropLabel}</p>
        </Panel>
      )}

      <Panel title="Zombie Slayer I">
        {game.slayer.zombieT1.active ? (
          <>
            <ProgressBar
              current={ZOMBIE_T1.clicksRequired - game.slayer.zombieT1.clicksRemaining}
              max={ZOMBIE_T1.clicksRequired}
              label={`${game.slayer.zombieT1.clicksRemaining} clicks left`}
            />
            <Button variant="primary" onClick={clickZombieT1}>
              Fight
            </Button>
          </>
        ) : (
          <Button onClick={startZombieT1} disabled={game.coins < ZOMBIE_T1.entryCostCoins}>
            Start ({formatCoins(ZOMBIE_T1.entryCostCoins)})
          </Button>
        )}
      </Panel>

      <Panel title="Zombie Slayer II">
        {game.slayer.zombieT2.active ? (
          <>
            <ProgressBar
              current={zombieT2Clicks - game.slayer.zombieT2.clicksRemaining}
              max={zombieT2Clicks}
              label={`${game.slayer.zombieT2.clicksRemaining} clicks left`}
            />
            <Button variant="primary" onClick={clickZombieT2}>
              Fight
            </Button>
          </>
        ) : (
          <Button onClick={startZombieT2} disabled={game.coins < ZOMBIE_T2.entryCostCoins}>
            Start ({formatCoins(ZOMBIE_T2.entryCostCoins)})
          </Button>
        )}
      </Panel>

      <Panel title="Enderman Slayer I">
        <p className="muted">Entry cost: {ENDERMAN_T1.entryCostSummoningEyes} Summoning Eyes (farmed from Zealots on the Combat page).</p>
        {game.slayer.endermanT1.active ? (
          <>
            <ProgressBar
              current={ENDERMAN_T1.clicksRequired - game.slayer.endermanT1.clicksRemaining}
              max={ENDERMAN_T1.clicksRequired}
              label={`${game.slayer.endermanT1.clicksRemaining} clicks left`}
            />
            <Button variant="primary" onClick={clickEndermanT1}>
              Fight
            </Button>
          </>
        ) : (
          <Button onClick={startEndermanT1} disabled={game.combat.summoningEyes < ENDERMAN_T1.entryCostSummoningEyes}>
            Start ({ENDERMAN_T1.entryCostSummoningEyes} Summoning Eyes)
          </Button>
        )}
      </Panel>

      <Panel title="Materials">
        <StatRow label="Revenant Flesh" value={formatNumber(m.revenantFlesh)} />
        <StatRow label="Viresca" value={formatNumber(m.viresca)} />
        <StatRow label="Sythe Blades" value={formatNumber(m.sytheBlades)} />
        <StatRow label="Shard of the Shredded" value={formatNumber(m.shardOfTheShredded)} />
        <StatRow label="Warden Hearts" value={formatNumber(m.wardenHearts)} />
        <Button onClick={sellSlayerDrops}>Sell all drops</Button>
      </Panel>

      <Panel title="Crafting">
        <StatRow
          label="Warden Helmet"
          value={
            game.slayer.crafted.wardenHelmet
              ? 'Crafted'
              : `${CRAFT_RECIPES.wardenHelmet.revenantFlesh}F / ${CRAFT_RECIPES.wardenHelmet.viresca}V / ${CRAFT_RECIPES.wardenHelmet.sytheBlades}B / ${CRAFT_RECIPES.wardenHelmet.wardenHearts}H`
          }
        />
        {!game.slayer.crafted.wardenHelmet && <Button onClick={craftWardenHelmet}>Craft Warden Helmet</Button>}

        <StatRow
          label="Axe of the Shredded"
          value={
            game.slayer.crafted.axeOfTheShredded
              ? 'Crafted'
              : `${CRAFT_RECIPES.axeOfTheShredded.revenantFlesh}F / ${CRAFT_RECIPES.axeOfTheShredded.viresca}V / ${CRAFT_RECIPES.axeOfTheShredded.sytheBlades}B / ${CRAFT_RECIPES.axeOfTheShredded.shardOfTheShredded}S`
          }
        />
        {!game.slayer.crafted.axeOfTheShredded && <Button onClick={craftAxeOfTheShredded}>Craft Axe of the Shredded</Button>}

        <StatRow
          label="Shredder Artifact"
          value={game.slayer.crafted.shredderArtifact ? 'Crafted' : `${CRAFT_RECIPES.shredderArtifact.shardOfTheShredded}S`}
        />
        {!game.slayer.crafted.shredderArtifact && <Button onClick={craftShredderArtifact}>Craft Shredder Artifact</Button>}
      </Panel>
    </div>
  )
}
