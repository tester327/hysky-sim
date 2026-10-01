import {
  ELEPHANT_TIERS,
  ENDERMAN_TIERS,
  MITHRIL_GOLEM_TIERS,
  RABBIT_TIERS,
  SILVERFISH_TIERS,
  WOLF_TIERS,
  highestUnlockedTier,
  type PetTier,
} from '../data/pets'
import type { GameState } from '../state/types'

// Pure selectors deriving the currently-active pet bonus per category from
// skill levels. See pets.ts for why there's no "equipped pet" state.

export function activeRabbitTier(state: GameState): PetTier | undefined {
  return highestUnlockedTier(RABBIT_TIERS, state.skills.farming.level)
}

export function activeElephantTier(state: GameState): PetTier | undefined {
  return highestUnlockedTier(ELEPHANT_TIERS, state.skills.farming.level)
}

export function activeWolfTier(state: GameState): PetTier | undefined {
  return highestUnlockedTier(WOLF_TIERS, state.skills.combat.level)
}

export function activeEndermanTier(state: GameState): PetTier | undefined {
  return highestUnlockedTier(ENDERMAN_TIERS, state.skills.combat.level)
}

export function activeSilverfishTier(state: GameState): PetTier | undefined {
  return highestUnlockedTier(SILVERFISH_TIERS, state.skills.mining.level)
}

export function activeMithrilGolemTier(state: GameState): PetTier | undefined {
  return highestUnlockedTier(MITHRIL_GOLEM_TIERS, state.skills.mining.level)
}
