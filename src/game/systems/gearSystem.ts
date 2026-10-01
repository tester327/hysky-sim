import { GEAR_DIRECT_PURCHASE_COST, HYPERION_COST, HYPERION_GEAR_BONUS } from '../data/economy'
import type { GameState } from '../state/types'

export function buyGear(state: GameState): GameState {
  if (state.coins < GEAR_DIRECT_PURCHASE_COST) return state
  return { ...state, coins: state.coins - GEAR_DIRECT_PURCHASE_COST, gear: state.gear + 1 }
}

export function buyHyperion(state: GameState): GameState {
  if (state.coins < HYPERION_COST) return state
  return { ...state, coins: state.coins - HYPERION_COST, gear: state.gear + HYPERION_GEAR_BONUS }
}
