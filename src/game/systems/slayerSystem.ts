import {
  CRAFT_RECIPES,
  ENDERMAN_T1,
  SELL_PRICES,
  ZOMBIE_T1,
  ZOMBIE_T2,
  type RewardRoll,
} from '../data/slayer'
import type { GameState } from '../state/types'
import { rollInt } from './dice'
import { addExp } from './leveling'

export type QuestId = 'zombieT1' | 'zombieT2' | 'endermanT1'

function applySlayerAndCombatExp(state: GameState, slayerExp: number, combatExp: number): GameState {
  const slayerLeveled = addExp('slayer', state.skills.slayer, slayerExp)
  const combatLeveled = addExp('combat', state.skills.combat, combatExp)
  return {
    ...state,
    gear: state.gear + slayerLeveled.gearGained + combatLeveled.gearGained,
    skills: {
      ...state.skills,
      slayer: slayerLeveled.skill,
      combat: combatLeveled.skill,
    },
  }
}

function pickRoll(rolls: RewardRoll[], roll: number): RewardRoll | undefined {
  return rolls.find((r) => roll > r.threshold)
}

// --- Zombie Slayer T1 ---

export function startZombieT1(state: GameState): GameState {
  if (state.slayer.zombieT1.active) return state
  if (state.coins < ZOMBIE_T1.entryCostCoins) return state
  return {
    ...state,
    coins: state.coins - ZOMBIE_T1.entryCostCoins,
    slayer: {
      ...state.slayer,
      zombieT1: { active: true, clicksRemaining: ZOMBIE_T1.clicksRequired },
      lastDropLabel: 'Reward: ',
    },
  }
}

export function clickZombieT1(state: GameState): GameState {
  if (!state.slayer.zombieT1.active) return state
  const clicksRemaining = state.slayer.zombieT1.clicksRemaining - 1
  if (clicksRemaining > 0) {
    return { ...state, slayer: { ...state.slayer, zombieT1: { active: true, clicksRemaining } } }
  }
  return resolveZombieT1(state)
}

function resolveZombieT1(state: GameState): GameState {
  const slayerLevel = state.skills.slayer.level
  let coins = 0
  let bonusSlayerExp = 0
  let bonusCombatExp = 0
  let label = 'No bonus drop'

  if (slayerLevel >= ZOMBIE_T1.rollTiers.high.minLevel) {
    bonusCombatExp += ZOMBIE_T1.rollTiers.high.flatCombatExp
    const roll = rollInt(ZOMBIE_T1.rollTiers.high.maxRoll)
    const hit = pickRoll(ZOMBIE_T1.rollTiers.high.rolls, roll)
    if (hit) {
      label = hit.label
      coins += hit.coins ?? 0
      bonusSlayerExp += hit.slayerExp ?? 0
    }
  } else if (slayerLevel >= ZOMBIE_T1.rollTiers.low.minLevel) {
    const roll = rollInt(ZOMBIE_T1.rollTiers.low.maxRoll)
    const hit = pickRoll(ZOMBIE_T1.rollTiers.low.rolls, roll)
    if (hit) {
      label = hit.label
      coins += hit.coins ?? 0
      bonusSlayerExp += hit.slayerExp ?? 0
    }
  }

  const next = applySlayerAndCombatExp(
    { ...state, coins: state.coins + coins },
    ZOMBIE_T1.baseSlayerExp + bonusSlayerExp,
    ZOMBIE_T1.baseCombatExp + bonusCombatExp,
  )
  return {
    ...next,
    slayer: {
      ...next.slayer,
      zombieT1: { active: false, clicksRemaining: ZOMBIE_T1.clicksRequired },
      lastDropLabel: label,
    },
  }
}

// --- Zombie Slayer T2 ---

export function zombieT2ClicksRequired(state: GameState): number {
  let clicks = ZOMBIE_T2.clicksRequired
  if (state.slayer.crafted.axeOfTheShredded) clicks -= ZOMBIE_T2.axeOfTheShreddedClickDiscount
  if (state.slayer.crafted.wardenHelmet) clicks -= ZOMBIE_T2.wardenHelmetClickDiscount
  return clicks
}

export function startZombieT2(state: GameState): GameState {
  if (state.slayer.zombieT2.active) return state
  if (state.coins < ZOMBIE_T2.entryCostCoins) return state
  return {
    ...state,
    coins: state.coins - ZOMBIE_T2.entryCostCoins,
    slayer: {
      ...state.slayer,
      zombieT2: { active: true, clicksRemaining: zombieT2ClicksRequired(state) },
      lastDropLabel: 'Reward: ',
    },
  }
}

export function clickZombieT2(state: GameState): GameState {
  if (!state.slayer.zombieT2.active) return state
  const clicksRemaining = state.slayer.zombieT2.clicksRemaining - 1
  if (clicksRemaining > 0) {
    return { ...state, slayer: { ...state.slayer, zombieT2: { active: true, clicksRemaining } } }
  }
  return resolveZombieT2(state)
}

function resolveZombieT2(state: GameState): GameState {
  const roll = rollInt(ZOMBIE_T2.maxRoll)
  const hit = ZOMBIE_T2.dropRolls.find((r) => roll > r.threshold)

  const materials = { ...state.slayer.materials }
  let label: string
  if (hit) {
    label = hit.label
    materials.revenantFlesh += hit.revenantFlesh ?? 0
    materials.viresca += (hit as { viresca?: number }).viresca ?? 0
    materials.sytheBlades += (hit as { sytheBlades?: number }).sytheBlades ?? 0
    materials.shardOfTheShredded += (hit as { shardOfTheShredded?: number }).shardOfTheShredded ?? 0
    materials.wardenHearts += (hit as { wardenHearts?: number }).wardenHearts ?? 0
  } else {
    label = 'No material drop'
    materials.revenantFlesh += ZOMBIE_T2.noDropFleshGain
  }

  const bonusCombatExp = state.slayer.crafted.shredderArtifact ? ZOMBIE_T2.artifactBonusCombatExp : 0
  const next = applySlayerAndCombatExp(state, ZOMBIE_T2.baseSlayerExp, ZOMBIE_T2.baseCombatExp + bonusCombatExp)

  return {
    ...next,
    slayer: {
      ...next.slayer,
      materials,
      zombieT2: { active: false, clicksRemaining: zombieT2ClicksRequired(next) },
      lastDropLabel: label,
    },
  }
}

// --- Enderman Slayer T1 (new) ---

export function startEndermanT1(state: GameState): GameState {
  if (state.slayer.endermanT1.active) return state
  if (state.combat.summoningEyes < ENDERMAN_T1.entryCostSummoningEyes) return state
  return {
    ...state,
    combat: { ...state.combat, summoningEyes: state.combat.summoningEyes - ENDERMAN_T1.entryCostSummoningEyes },
    slayer: {
      ...state.slayer,
      endermanT1: { active: true, clicksRemaining: ENDERMAN_T1.clicksRequired },
      lastDropLabel: 'Reward: ',
    },
  }
}

export function clickEndermanT1(state: GameState): GameState {
  if (!state.slayer.endermanT1.active) return state
  const clicksRemaining = state.slayer.endermanT1.clicksRemaining - 1
  if (clicksRemaining > 0) {
    return { ...state, slayer: { ...state.slayer, endermanT1: { active: true, clicksRemaining } } }
  }
  return resolveEndermanT1(state)
}

function resolveEndermanT1(state: GameState): GameState {
  const roll = rollInt(ENDERMAN_T1.maxRoll)
  const hit = pickRoll(ENDERMAN_T1.rollTiers, roll)

  const coins = ENDERMAN_T1.baseCoins + (hit?.coins ?? 0)
  const bonusSlayerExp = hit?.slayerExp ?? 0
  const label = hit?.label ?? 'No bonus drop'

  const next = applySlayerAndCombatExp(
    { ...state, coins: state.coins + coins },
    ENDERMAN_T1.baseSlayerExp + bonusSlayerExp,
    ENDERMAN_T1.baseCombatExp,
  )
  return {
    ...next,
    slayer: {
      ...next.slayer,
      endermanT1: { active: false, clicksRemaining: ENDERMAN_T1.clicksRequired },
      lastDropLabel: label,
    },
  }
}

// --- Materials: sell & crafting ---

export function sellSlayerDrops(state: GameState): GameState {
  const m = state.slayer.materials
  const coins =
    state.coins +
    m.revenantFlesh * SELL_PRICES.revenantFlesh +
    m.viresca * SELL_PRICES.viresca +
    m.sytheBlades * SELL_PRICES.sytheBlades +
    m.shardOfTheShredded * SELL_PRICES.shardOfTheShredded +
    m.wardenHearts * SELL_PRICES.wardenHearts
  return {
    ...state,
    coins,
    slayer: {
      ...state.slayer,
      materials: { revenantFlesh: 0, viresca: 0, sytheBlades: 0, shardOfTheShredded: 0, wardenHearts: 0 },
    },
  }
}

export function craftWardenHelmet(state: GameState): GameState {
  if (state.slayer.crafted.wardenHelmet) return state
  const m = state.slayer.materials
  const r = CRAFT_RECIPES.wardenHelmet
  if (m.revenantFlesh < r.revenantFlesh || m.viresca < r.viresca || m.sytheBlades < r.sytheBlades || m.wardenHearts < r.wardenHearts) {
    return state
  }
  return {
    ...state,
    slayer: {
      ...state.slayer,
      crafted: { ...state.slayer.crafted, wardenHelmet: true },
      materials: {
        ...m,
        revenantFlesh: m.revenantFlesh - r.revenantFlesh,
        viresca: m.viresca - r.viresca,
        sytheBlades: m.sytheBlades - r.sytheBlades,
        wardenHearts: m.wardenHearts - r.wardenHearts,
      },
    },
  }
}

export function craftAxeOfTheShredded(state: GameState): GameState {
  if (state.slayer.crafted.axeOfTheShredded) return state
  const m = state.slayer.materials
  const r = CRAFT_RECIPES.axeOfTheShredded
  if (m.revenantFlesh < r.revenantFlesh || m.viresca < r.viresca || m.sytheBlades < r.sytheBlades || m.shardOfTheShredded < r.shardOfTheShredded) {
    return state
  }
  return {
    ...state,
    slayer: {
      ...state.slayer,
      crafted: { ...state.slayer.crafted, axeOfTheShredded: true },
      materials: {
        ...m,
        revenantFlesh: m.revenantFlesh - r.revenantFlesh,
        viresca: m.viresca - r.viresca,
        sytheBlades: m.sytheBlades - r.sytheBlades,
        shardOfTheShredded: m.shardOfTheShredded - r.shardOfTheShredded,
      },
    },
  }
}

export function craftShredderArtifact(state: GameState): GameState {
  if (state.slayer.crafted.shredderArtifact) return state
  const m = state.slayer.materials
  const r = CRAFT_RECIPES.shredderArtifact
  if (m.shardOfTheShredded < r.shardOfTheShredded) return state
  return {
    ...state,
    slayer: {
      ...state.slayer,
      crafted: { ...state.slayer.crafted, shredderArtifact: true },
      materials: { ...m, shardOfTheShredded: m.shardOfTheShredded - r.shardOfTheShredded },
    },
  }
}
