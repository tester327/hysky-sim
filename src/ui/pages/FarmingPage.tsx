import { CROPS } from '../../game/data/farming'
import { farmingExpUpgradeCost } from '../../game/systems/farmingSystem'
import { activeElephantTier, activeRabbitTier } from '../../game/systems/petSystem'
import { useGameStore } from '../../state/store'
import { Button } from '../components/Button'
import { LiveStatsBar } from '../components/LiveStatsBar'
import { Panel } from '../components/Panel'
import { StatRow } from '../components/StatRow'
import { formatCoins, formatNumber } from '../format'

export function FarmingPage() {
  const game = useGameStore((s) => s.game)
  const clickCrop = useGameStore((s) => s.clickCrop)
  const unlockCrop = useGameStore((s) => s.unlockCrop)
  const buyFarmingExpUpgrade = useGameStore((s) => s.buyFarmingExpUpgrade)

  const rabbit = activeRabbitTier(game)
  const elephant = activeElephantTier(game)
  const upgradeCost = farmingExpUpgradeCost(game)

  return (
    <div>
      <h1>Farming</h1>
      <LiveStatsBar skillIds={['farming']} />

      <Panel title="Active pet bonuses">
        <StatRow label="Rabbit (XP bonus: Wheat/Pumpkin/Melon)" value={rabbit ? `+${rabbit.bonus} XP (${rabbit.name})` : 'Locked'} />
        <StatRow label="Elephant (Coin bonus: Cane/Netherwarts)" value={elephant ? `+${elephant.bonus} coins (${elephant.name})` : 'Locked'} />
      </Panel>

      {CROPS.map((crop) => {
        const unlocked = game.farming.unlocked[crop.id]
        return (
          <Panel key={crop.id} title={crop.label}>
            {unlocked ? (
              <Button variant="primary" onClick={() => clickCrop(crop.id)}>
                Farm {crop.label}
              </Button>
            ) : (
              <Button onClick={() => unlockCrop(crop.id)} disabled={game.coins < (crop.unlockCost ?? 0)}>
                Unlock for {formatCoins(crop.unlockCost ?? 0)}
              </Button>
            )}
          </Panel>
        )
      })}

      <Panel title="Farming XP Upgrade">
        <StatRow label="Current bonus" value={`+${formatNumber(game.farming.extraExpUpgradeLevel)} XP / click`} />
        <Button onClick={buyFarmingExpUpgrade} disabled={game.coins < upgradeCost}>
          Upgrade for {formatCoins(upgradeCost)}
        </Button>
      </Panel>
    </div>
  )
}
