import { Link } from 'react-router-dom'
import { useGameStore } from '../../state/store'
import { Panel } from '../components/Panel'
import { PixelIcon } from '../components/PixelIcon'
import { SkillProgressRow } from '../components/SkillProgressRow'
import { StatRow } from '../components/StatRow'
import { formatCoins, formatNumber } from '../format'

export function OverviewPage() {
  const game = useGameStore((s) => s.game)

  return (
    <div>
      <h1>HySky Sim</h1>
      <Panel title="Status">
        <StatRow label="Coins" value={formatCoins(game.coins)} tone="gold" />
        <StatRow label="Gear" value={formatNumber(game.gear)} tone="accent" />
      </Panel>

      <Panel title="Skills">
        <SkillProgressRow skillId="farming" label="Farming" skill={game.skills.farming} />
        <SkillProgressRow skillId="combat" label="Combat" skill={game.skills.combat} />
        <SkillProgressRow skillId="mining" label="Mining" skill={game.skills.mining} />
        <SkillProgressRow skillId="slayer" label="Slayer" skill={game.skills.slayer} />
      </Panel>

      <div className="tile-grid">
        <Link to="/farming" className="tile">
          <div className="tile-heading">
            <PixelIcon name="wheat" /> Farming
          </div>
          <div className="tile-sub">Crops, pet bonuses, XP upgrades</div>
        </Link>
        <Link to="/combat" className="tile">
          <div className="tile-heading">
            <PixelIcon name="sword" /> Combat
          </div>
          <div className="tile-sub">Grypt Ghouls, Zealots, Summoning Eyes</div>
        </Link>
        <Link to="/slayer" className="tile">
          <div className="tile-heading">
            <PixelIcon name="skull" /> Slayer
          </div>
          <div className="tile-sub">Zombie Slayer I/II, Enderman Slayer</div>
        </Link>
        <Link to="/mining" className="tile">
          <div className="tile-heading">
            <PixelIcon name="pickaxe" /> Mining
          </div>
          <div className="tile-sub">Wool, Gemstones, HOTM, Drills</div>
        </Link>
        <Link to="/dungeons" className="tile">
          <div className="tile-heading">
            <PixelIcon name="key" /> Dungeons
          </div>
          <div className="tile-sub">Floor 1 - Floor 7</div>
        </Link>
        <Link to="/gear" className="tile">
          <div className="tile-heading">
            <PixelIcon name="gear" /> Gear Shop
          </div>
          <div className="tile-sub">Buy Gear, Hyperion</div>
        </Link>
      </div>
    </div>
  )
}
