import { CROPS, FARMING_EXP_UPGRADE_BASE_COST, type CropId } from '../data/farming'
import type { GameState } from '../state/types'
import { addExp } from './leveling'
import { activeElephantTier, activeRabbitTier } from './petSystem'

function getCrop(id: CropId) {
  const crop = CROPS.find((c) => c.id === id)
  if (!crop) throw new Error(`Unknown crop: ${id}`)
  return crop
}

export function canUnlockCrop(state: GameState, id: CropId): boolean {
  const crop = getCrop(id)
  if (state.farming.unlocked[id]) return false
  if (crop.unlockCost === undefined) return false
  return state.coins >= crop.unlockCost
}

export function unlockCrop(state: GameState, id: CropId): GameState {
  const crop = getCrop(id)
  if (!canUnlockCrop(state, id) || crop.unlockCost === undefined) return state
  return {
    ...state,
    coins: state.coins - crop.unlockCost,
    farming: {
      ...state.farming,
      unlocked: { ...state.farming.unlocked, [id]: true },
    },
  }
}

export function clickCrop(state: GameState, id: CropId): GameState {
  const crop = getCrop(id)
  if (!state.farming.unlocked[id]) return state

  const level = state.skills.farming.level
  let coins = crop.coinsBase + crop.coinsPerLevel * level
  let xp = crop.xpPerClick + state.farming.extraExpUpgradeLevel

  if (crop.petTrack === 'rabbit') {
    xp += activeRabbitTier(state)?.bonus ?? 0
  } else {
    coins += activeElephantTier(state)?.bonus ?? 0
  }

  const leveled = addExp('farming', state.skills.farming, xp)

  return {
    ...state,
    coins: state.coins + coins,
    gear: state.gear + leveled.gearGained,
    skills: { ...state.skills, farming: leveled.skill },
  }
}

export function farmingExpUpgradeCost(state: GameState): number {
  return state.farming.extraExpUpgradeLevel * FARMING_EXP_UPGRADE_BASE_COST || FARMING_EXP_UPGRADE_BASE_COST
}

export function buyFarmingExpUpgrade(state: GameState): GameState {
  const cost = farmingExpUpgradeCost(state)
  if (state.coins < cost) return state
  return {
    ...state,
    coins: state.coins - cost,
    farming: {
      ...state.farming,
      extraExpUpgradeLevel: state.farming.extraExpUpgradeLevel + 1,
    },
  }
}
