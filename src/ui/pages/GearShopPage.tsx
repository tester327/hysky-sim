import { GEAR_DIRECT_PURCHASE_COST, HYPERION_COST, HYPERION_GEAR_BONUS } from '../../game/data/economy'
import { useGameStore } from '../../state/store'
import { Button } from '../components/Button'
import { Panel } from '../components/Panel'
import { StatRow } from '../components/StatRow'
import { formatCoins, formatNumber } from '../format'

export function GearShopPage() {
  const game = useGameStore((s) => s.game)
  const buyGear = useGameStore((s) => s.buyGear)
  const buyHyperion = useGameStore((s) => s.buyHyperion)

  return (
    <div>
      <h1>Gear Shop</h1>

      <Panel title="Gear">
        <StatRow label="Current Gear" value={formatNumber(game.gear)} tone="accent" />
        <Button onClick={buyGear} disabled={game.coins < GEAR_DIRECT_PURCHASE_COST}>
          Buy +1 Gear ({formatCoins(GEAR_DIRECT_PURCHASE_COST)})
        </Button>
      </Panel>

      <Panel title="Hyperion">
        <p className="muted">A one-time, very expensive Gear boost for late-game Dungeon floors.</p>
        <Button variant="primary" onClick={buyHyperion} disabled={game.coins < HYPERION_COST}>
          Buy Hyperion (+{HYPERION_GEAR_BONUS} Gear, {formatCoins(HYPERION_COST)})
        </Button>
      </Panel>
    </div>
  )
}
