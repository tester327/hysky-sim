import { DRILLS, HOTM_UPGRADES, MINING_UPGRADES, quadraticCost } from '../../game/data/mining'
import { nextDrill } from '../../game/systems/miningSystem'
import { activeMithrilGolemTier, activeSilverfishTier } from '../../game/systems/petSystem'
import { useGameStore } from '../../state/store'
import { Button } from '../components/Button'
import { LiveStatsBar } from '../components/LiveStatsBar'
import { Panel } from '../components/Panel'
import { StatRow } from '../components/StatRow'
import { formatNumber } from '../format'

export function MiningPage() {
  const game = useGameStore((s) => s.game)
  const mineGreyWool = useGameStore((s) => s.mineGreyWool)
  const mineBlueWool = useGameStore((s) => s.mineBlueWool)
  const mineHardstone = useGameStore((s) => s.mineHardstone)
  const mineGemstone = useGameStore((s) => s.mineGemstone)
  const sellGemsAndHardstone = useGameStore((s) => s.sellGemsAndHardstone)
  const buyExtraCoinsUpgrade = useGameStore((s) => s.buyExtraCoinsUpgrade)
  const buyExtraXpUpgrade = useGameStore((s) => s.buyExtraXpUpgrade)
  const buyEfficientMinerUpgrade = useGameStore((s) => s.buyEfficientMinerUpgrade)
  const buyHotmFortune = useGameStore((s) => s.buyHotmFortune)
  const buyHotmPristine = useGameStore((s) => s.buyHotmPristine)
  const craftNextDrill = useGameStore((s) => s.craftNextDrill)

  const silverfish = activeSilverfishTier(game)
  const mithrilGolem = activeMithrilGolemTier(game)

  const extraCoinsCost = quadraticCost(
    game.mining.extraCoinsLevel,
    MINING_UPGRADES.extraCoins.costMultiplier,
    MINING_UPGRADES.extraCoins.costBase,
  )
  const extraXpCost = quadraticCost(
    game.mining.extraXpLevel,
    MINING_UPGRADES.extraXp.costMultiplier,
    MINING_UPGRADES.extraXp.costBase,
  )
  const effiCost = quadraticCost(
    game.mining.efficientMinerLevel,
    MINING_UPGRADES.efficientMiner.costMultiplier,
    MINING_UPGRADES.efficientMiner.costBase,
  )

  const drill = nextDrill(game.mining.drillTier)
  const currentDrillLabel = DRILLS.find((d) => d.tier === game.mining.drillTier)?.label ?? 'None'

  return (
    <div>
      <h1>Mining</h1>
      <LiveStatsBar skillIds={['mining']} />

      <Panel title="Active pet bonuses">
        <StatRow label="Silverfish (bonus Mining XP)" value={silverfish ? `+${silverfish.bonus} XP (${silverfish.name})` : 'Locked'} />
        <StatRow
          label="Mithril Golem (bonus Powder)"
          value={mithrilGolem ? `+${mithrilGolem.bonus} Powder (${mithrilGolem.name})` : 'Locked'}
        />
      </Panel>

      <Panel title="Wool mining">
        <StatRow label="Mithril Powder" value={formatNumber(game.mining.mithrilPowder)} />
        <div className="btn-row">
          <Button variant="primary" onClick={mineGreyWool}>
            Mine Grey Wool
          </Button>
          <Button variant="primary" onClick={mineBlueWool}>
            Mine Blue Wool
          </Button>
        </div>
      </Panel>

      <Panel title="Mining upgrades (Mithril Powder)">
        <StatRow
          label="Extra Coins"
          value={game.mining.extraCoinsLevel >= MINING_UPGRADES.extraCoins.maxLevel ? 'MAXED' : formatNumber(game.mining.extraCoinsLevel)}
        />
        {game.mining.extraCoinsLevel < MINING_UPGRADES.extraCoins.maxLevel && (
          <Button onClick={buyExtraCoinsUpgrade} disabled={game.mining.mithrilPowder < extraCoinsCost}>
            Upgrade ({formatNumber(extraCoinsCost)} Powder)
          </Button>
        )}

        <StatRow
          label="Extra XP"
          value={game.mining.extraXpLevel >= MINING_UPGRADES.extraXp.maxLevel ? 'MAXED' : formatNumber(game.mining.extraXpLevel)}
        />
        {game.mining.extraXpLevel < MINING_UPGRADES.extraXp.maxLevel && (
          <Button onClick={buyExtraXpUpgrade} disabled={game.mining.mithrilPowder < extraXpCost}>
            Upgrade ({formatNumber(extraXpCost)} Powder)
          </Button>
        )}

        <StatRow
          label="Efficient Miner"
          value={
            game.mining.efficientMinerLevel >= MINING_UPGRADES.efficientMiner.maxLevel
              ? 'MAXED'
              : formatNumber(game.mining.efficientMinerLevel)
          }
        />
        {game.mining.efficientMinerLevel < MINING_UPGRADES.efficientMiner.maxLevel && (
          <Button onClick={buyEfficientMinerUpgrade} disabled={game.mining.mithrilPowder < effiCost}>
            Upgrade ({formatNumber(effiCost)} Powder)
          </Button>
        )}
      </Panel>

      <Panel title="Hardstone & Gemstones">
        <StatRow label="Gemstone Powder" value={formatNumber(game.mining.gemstonePowder)} />
        <StatRow label="Hardstone" value={formatNumber(game.mining.hardstone)} />
        <StatRow label="Rough Gemstones" value={formatNumber(game.mining.roughGemstones)} />
        <StatRow label="Fine Gemstones" value={formatNumber(game.mining.fineGemstones)} />
        <StatRow label="Mining Fortune" value={formatNumber(game.mining.miningFortune)} tone="accent" />
        <StatRow label="Pristine Chance" value={`${formatNumber(game.mining.pristineChancePercent)}%`} />
        <div className="btn-row">
          <Button variant="primary" onClick={mineHardstone}>
            Mine Hardstone
          </Button>
          <Button variant="primary" onClick={mineGemstone}>
            Mine Gemstone
          </Button>
          <Button onClick={sellGemsAndHardstone}>Sell gems + hardstone</Button>
        </div>
      </Panel>

      <Panel title="Heart of the Mountain">
        <StatRow label="Fortune Level" value={`${formatNumber(game.mining.hotmFortuneLevel)} / ${HOTM_UPGRADES.fortune.maxLevel}`} />
        {game.mining.hotmFortuneLevel < HOTM_UPGRADES.fortune.maxLevel && (
          <Button onClick={buyHotmFortune} disabled={game.mining.gemstonePowder < HOTM_UPGRADES.fortune.costPerLevel}>
            Upgrade ({HOTM_UPGRADES.fortune.costPerLevel} Gemstone Powder)
          </Button>
        )}

        <StatRow label="Pristine Level" value={`${formatNumber(game.mining.hotmPristineLevel)} / ${HOTM_UPGRADES.pristine.maxLevel}`} />
        {game.mining.hotmPristineLevel < HOTM_UPGRADES.pristine.maxLevel && (
          <Button onClick={buyHotmPristine} disabled={game.mining.gemstonePowder < HOTM_UPGRADES.pristine.costPerLevel}>
            Upgrade ({HOTM_UPGRADES.pristine.costPerLevel} Gemstone Powder)
          </Button>
        )}
      </Panel>

      <Panel title="Drill">
        <StatRow label="Current Drill" value={currentDrillLabel} />
        {drill ? (
          <Button onClick={craftNextDrill} disabled={game.mining[drill.costResource] < drill.cost}>
            Craft {drill.label} ({formatNumber(drill.cost)} {drill.costResource})
          </Button>
        ) : (
          <p className="muted">Maxed Drill GG! :D</p>
        )}
      </Panel>
    </div>
  )
}
