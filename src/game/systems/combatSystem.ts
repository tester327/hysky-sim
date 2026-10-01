import {
  COMBAT_LEVEL_UP_COINS,
  GRYPT_GHOUL_COINS,
  GRYPT_GHOUL_XP,
  SUMMONING_EYE_BUY_COST,
  SUMMONING_EYE_CAP,
  SUMMONING_EYE_OVERFLOW_COINS,
  ZEALOT_COINS_PER_EYE,
  ZEALOT_XP,
} from '../data/combat'
import { BASE_EYE_DROP_THRESHOLD } from '../data/pets'
import { ZEALOTS_UNLOCK_COMBAT_LEVEL } from '../data/skills'
import type { GameState } from '../state/types'
import { rollInt } from './dice'
import { addExp } from './leveling'
import { activeEndermanTier, activeWolfTier } from './petSystem'

function applyCombatLevelUp(state: GameState, xp: number): GameState {
  const leveled = addExp('combat', state.skills.combat, xp)
  const zealotsUnlocked =
    state.combat.zealotsUnlocked || leveled.skill.level >= ZEALOTS_UNLOCK_COMBAT_LEVEL
  return {
    ...state,
    gear: state.gear + leveled.gearGained,
    coins: state.coins + leveled.levelsGained * COMBAT_LEVEL_UP_COINS,
    skills: { ...state.skills, combat: leveled.skill },
    combat: { ...state.combat, zealotsUnlocked },
  }
}

export function clickGryptGhoul(state: GameState): GameState {
  const bonusXp = activeWolfTier(state)?.bonus ?? 0
  const next = applyCombatLevelUp(state, GRYPT_GHOUL_XP + bonusXp)
  return { ...next, coins: next.coins + GRYPT_GHOUL_COINS }
}

export function clickZealot(state: GameState): GameState {
  if (!state.combat.zealotsUnlocked) return state

  let coins = state.coins + state.combat.summoningEyes * ZEALOT_COINS_PER_EYE
  let summoningEyes = state.combat.summoningEyes

  const threshold = activeEndermanTier(state)?.bonus ?? BASE_EYE_DROP_THRESHOLD
  const dropRoll = rollInt(BASE_EYE_DROP_THRESHOLD)
  if (dropRoll >= threshold) {
    if (summoningEyes >= SUMMONING_EYE_CAP) {
      coins += SUMMONING_EYE_OVERFLOW_COINS
    } else {
      summoningEyes += 1
    }
  }

  const next = applyCombatLevelUp(
    { ...state, coins, combat: { ...state.combat, summoningEyes } },
    ZEALOT_XP,
  )
  return {
    ...next,
    combat: { ...next.combat, zealotsFarmed: next.combat.zealotsFarmed + 1 },
  }
}

export function buySummoningEye(state: GameState): GameState {
  if (state.combat.summoningEyes >= SUMMONING_EYE_CAP) return state
  if (state.coins < SUMMONING_EYE_BUY_COST) return state
  return {
    ...state,
    coins: state.coins - SUMMONING_EYE_BUY_COST,
    combat: { ...state.combat, summoningEyes: state.combat.summoningEyes + 1 },
  }
}
