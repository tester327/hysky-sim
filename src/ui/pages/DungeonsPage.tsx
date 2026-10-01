import { FLOORS } from '../../game/data/dungeons'
import { useGameStore } from '../../state/store'
import { Button } from '../components/Button'
import { LiveStatsBar } from '../components/LiveStatsBar'
import { Panel } from '../components/Panel'
import { ProgressBar } from '../components/ProgressBar'
import { StatRow } from '../components/StatRow'
import { formatNumber } from '../format'

export function DungeonsPage() {
  const game = useGameStore((s) => s.game)
  const startFloor = useGameStore((s) => s.startFloor)
  const clickFloor = useGameStore((s) => s.clickFloor)

  return (
    <div>
      <h1>Dungeons</h1>
      <LiveStatsBar skillIds={['combat']} showGear />

      {game.dungeons.lastReward && (
        <Panel title="Last reward">
          <p className="drop-label">{game.dungeons.lastReward}</p>
        </Panel>
      )}

      {FLOORS.map((floor) => {
        const floorState = game.dungeons.floors[floor.floor]
        const hasEnoughGear = game.gear >= floor.gearRequired

        return (
          <Panel key={floor.floor} title={`Floor ${floor.floor}`}>
            <StatRow label="Gear required" value={`${formatNumber(floor.gearRequired)} (you have ${formatNumber(game.gear)})`} />
            {floorState.inProgress ? (
              <>
                <ProgressBar
                  current={floor.clicksRequired - floorState.clicksRemaining}
                  max={floor.clicksRequired}
                  label={`${floorState.clicksRemaining} clicks left`}
                />
                <Button variant="primary" onClick={() => clickFloor(floor.floor)}>
                  Dive
                </Button>
              </>
            ) : (
              <Button onClick={() => startFloor(floor.floor)} disabled={!hasEnoughGear}>
                {hasEnoughGear ? 'Start Floor' : 'Not enough Gear'}
              </Button>
            )}
          </Panel>
        )
      })}
    </div>
  )
}
