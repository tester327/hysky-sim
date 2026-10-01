import {
  DRILLS,
  HARDSTONE_MINE,
  HOTM_UPGRADES,
  MINING_UPGRADES,
  SELL_PRICES,
  WOOL,
  quadraticCost,
  type DrillTier,
} from '../data/mining'
import type { GameState } from '../state/types'
import { rollRange } from './dice'
import { addExp } from './leveling'
import { activeMithrilGolemTier, activeSilverfishTier } from './petSystem'

function applyMiningLevelUp(state: GameState, xp: number): GameState {
  const leveled = addExp('mining', state.skills.mining, xp)
  return {
    ...state,
    gear: state.gear + leveled.gearGained,
    skills: { ...state.skills, mining: leveled.skill },
    // The original increased Mining Fortune by 1 on every Mining level-up.
    mining: { ...state.mining, miningFortune: state.mining.miningFortune + leveled.levelsGained },
  }
}

function mineWool(state: GameState, wool: 'grey' | 'blue'): GameState {
  const config = WOOL[wool]
  const effi = state.mining.efficientMinerLevel
  const petXp = activeSilverfishTier(state)?.bonus ?? 0
  const petPowder = activeMithrilGolemTier(state)?.bonus ?? 0

  const xp = (config.xpBase + state.mining.extraXpLevel + petXp) * effi
  const coins = (config.coinsBase + state.mining.extraCoinsLevel) * effi
  const mithrilPowder = config.mithrilPowder + petPowder

  const next = applyMiningLevelUp(state, xp)
  return {
    ...next,
    coins: next.coins + coins,
    mining: { ...next.mining, mithrilPowder: next.mining.mithrilPowder + mithrilPowder },
  }
}

export const mineGreyWool = (state: GameState) => mineWool(state, 'grey')
export const mineBlueWool = (state: GameState) => mineWool(state, 'blue')

export function mineHardstone(state: GameState): GameState {
  return {
    ...state,
    mining: {
      ...state.mining,
      mithrilPowder: state.mining.mithrilPowder + rollRange(HARDSTONE_MINE.mithrilPowderMin, HARDSTONE_MINE.mithrilPowderMax),
      gemstonePowder: state.mining.gemstonePowder + rollRange(HARDSTONE_MINE.gemstonePowderMin, HARDSTONE_MINE.gemstonePowderMax),
      hardstone: state.mining.hardstone + rollRange(HARDSTONE_MINE.hardstoneMin, HARDSTONE_MINE.hardstoneMax),
    },
  }
}

export function mineGemstone(state: GameState): GameState {
  const roughGemstones = state.mining.roughGemstones + state.mining.miningFortune
  let fineGemstones = state.mining.fineGemstones
  if (rollRange(1, 100) <= state.mining.pristineChancePercent) {
    fineGemstones += Math.round(state.mining.miningFortune / 20)
  }
  return { ...state, mining: { ...state.mining, roughGemstones, fineGemstones } }
}

export function sellGemsAndHardstone(state: GameState): GameState {
  const coins =
    state.coins +
    state.mining.hardstone * SELL_PRICES.hardstone +
    state.mining.roughGemstones * SELL_PRICES.roughGemstone +
    state.mining.fineGemstones * SELL_PRICES.fineGemstone
  return {
    ...state,
    coins,
    mining: { ...state.mining, hardstone: 0, roughGemstones: 0, fineGemstones: 0 },
  }
}

function buyLinearUpgrade(
  state: GameState,
  key: 'extraCoinsLevel' | 'extraXpLevel' | 'efficientMinerLevel',
  maxLevel: number,
  costMultiplier: number,
  costBase: number,
): GameState {
  const level = state.mining[key]
  if (level >= maxLevel) return state
  const cost = quadraticCost(level, costMultiplier, costBase)
  if (state.mining.mithrilPowder < cost) return state
  return {
    ...state,
    mining: { ...state.mining, [key]: level + 1, mithrilPowder: state.mining.mithrilPowder - cost },
  }
}

export const buyExtraCoinsUpgrade = (state: GameState) =>
  buyLinearUpgrade(state, 'extraCoinsLevel', MINING_UPGRADES.extraCoins.maxLevel, MINING_UPGRADES.extraCoins.costMultiplier, MINING_UPGRADES.extraCoins.costBase)

export const buyExtraXpUpgrade = (state: GameState) =>
  buyLinearUpgrade(state, 'extraXpLevel', MINING_UPGRADES.extraXp.maxLevel, MINING_UPGRADES.extraXp.costMultiplier, MINING_UPGRADES.extraXp.costBase)

export const buyEfficientMinerUpgrade = (state: GameState) =>
  buyLinearUpgrade(state, 'efficientMinerLevel', MINING_UPGRADES.efficientMiner.maxLevel, MINING_UPGRADES.efficientMiner.costMultiplier, MINING_UPGRADES.efficientMiner.costBase)

export function buyHotmFortune(state: GameState): GameState {
  const { maxLevel, costPerLevel } = HOTM_UPGRADES.fortune
  if (state.mining.hotmFortuneLevel >= maxLevel) return state
  if (state.mining.gemstonePowder < costPerLevel) return state
  return {
    ...state,
    mining: {
      ...state.mining,
      hotmFortuneLevel: state.mining.hotmFortuneLevel + 1,
      miningFortune: state.mining.miningFortune + 1,
      gemstonePowder: state.mining.gemstonePowder - costPerLevel,
    },
  }
}

export function buyHotmPristine(state: GameState): GameState {
  const { maxLevel, costPerLevel } = HOTM_UPGRADES.pristine
  if (state.mining.hotmPristineLevel >= maxLevel) return state
  if (state.mining.gemstonePowder < costPerLevel) return state
  return {
    ...state,
    mining: {
      ...state.mining,
      hotmPristineLevel: state.mining.hotmPristineLevel + 1,
      pristineChancePercent: state.mining.pristineChancePercent + 1,
      gemstonePowder: state.mining.gemstonePowder - costPerLevel,
    },
  }
}

export function nextDrill(currentTier: DrillTier) {
  return DRILLS.find((d) => d.tier === currentTier + 1)
}

export function craftNextDrill(state: GameState): GameState {
  const drill = nextDrill(state.mining.drillTier)
  if (!drill) return state

  const currentDrill = DRILLS.find((d) => d.tier === state.mining.drillTier)
  const resourceAmount = state.mining[drill.costResource]
  if (resourceAmount < drill.cost) return state

  const fortuneBonus = drill.fortuneBonus - (currentDrill?.fortuneBonus ?? 0)
  const pristineBonus = drill.pristineBonus - (currentDrill?.pristineBonus ?? 0)

  return {
    ...state,
    mining: {
      ...state.mining,
      [drill.costResource]: resourceAmount - drill.cost,
      drillTier: drill.tier,
      miningFortune: state.mining.miningFortune + fortuneBonus,
      pristineChancePercent: state.mining.pristineChancePercent + pristineBonus,
    },
  }
}
