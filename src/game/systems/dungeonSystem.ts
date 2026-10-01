import { FLOORS } from '../data/dungeons'
import type { GameState } from '../state/types'
import { rollInt } from './dice'
import { addExp } from './leveling'

function getFloorConfig(floor: number) {
  const config = FLOORS.find((f) => f.floor === floor)
  if (!config) throw new Error(`Unknown dungeon floor: ${floor}`)
  return config
}

export function startFloor(state: GameState, floor: number): GameState {
  const config = getFloorConfig(floor)
  const current = state.dungeons.floors[floor]
  if (current?.inProgress) return state
  return {
    ...state,
    dungeons: {
      ...state.dungeons,
      floors: {
        ...state.dungeons.floors,
        [floor]: { clicksRemaining: config.clicksRequired, inProgress: true },
      },
    },
  }
}

export function clickFloor(state: GameState, floor: number): GameState {
  const current = state.dungeons.floors[floor]
  if (!current?.inProgress) return state

  const clicksRemaining = current.clicksRemaining - 1
  if (clicksRemaining > 0) {
    return {
      ...state,
      dungeons: {
        ...state.dungeons,
        floors: { ...state.dungeons.floors, [floor]: { clicksRemaining, inProgress: true } },
      },
    }
  }
  return resolveFloor(state, floor)
}

function resolveFloor(state: GameState, floor: number): GameState {
  const config = getFloorConfig(floor)
  const resetFloorState = { clicksRemaining: config.clicksRequired, inProgress: false }

  if (state.gear < config.gearRequired) {
    return {
      ...state,
      dungeons: {
        ...state.dungeons,
        floors: { ...state.dungeons.floors, [floor]: resetFloorState },
        lastReward: 'Dungeon failed: not enough Gear',
      },
    }
  }

  const roll = rollInt(config.maxRoll)
  const reward = config.rewards.find((r) => roll > r.threshold) ?? config.rewards[config.rewards.length - 1]

  const leveled = addExp('combat', state.skills.combat, config.combatExpOnSuccess)

  return {
    ...state,
    coins: state.coins + reward.coins,
    gear: state.gear + reward.gear + leveled.gearGained,
    skills: { ...state.skills, combat: leveled.skill },
    dungeons: {
      ...state.dungeons,
      floors: { ...state.dungeons.floors, [floor]: resetFloorState },
      lastReward: reward.label,
    },
  }
}
