import { CROPS } from '../data/farming'
import { FLOORS } from '../data/dungeons'
import { MINING_UPGRADES } from '../data/mining'
import { CURRENT_SAVE_VERSION, type GameState } from './types'

export function createInitialState(): GameState {
  const now = new Date().toISOString()
  return {
    saveVersion: CURRENT_SAVE_VERSION,
    meta: { createdAt: now, lastSavedAt: now },

    coins: 0,
    gear: 0,

    skills: {
      farming: { level: 0, exp: 0 },
      combat: { level: 0, exp: 0 },
      mining: { level: 0, exp: 0 },
      slayer: { level: 0, exp: 0 },
    },

    farming: {
      unlocked: Object.fromEntries(CROPS.map((c) => [c.id, c.unlockCost === undefined])) as GameState['farming']['unlocked'],
      extraExpUpgradeLevel: 0,
    },

    combat: {
      zealotsUnlocked: false,
      summoningEyes: 0,
      zealotsFarmed: 0,
    },

    mining: {
      mithrilPowder: 0,
      gemstonePowder: 0,
      hardstone: 0,
      roughGemstones: 0,
      fineGemstones: 0,
      extraCoinsLevel: 0,
      extraXpLevel: 0,
      efficientMinerLevel: MINING_UPGRADES.efficientMiner.startLevel,
      miningFortune: 0,
      pristineChancePercent: 0,
      hotmFortuneLevel: 0,
      hotmPristineLevel: 0,
      drillTier: 0,
    },

    slayer: {
      zombieT1: { active: false, clicksRemaining: 0 },
      zombieT2: { active: false, clicksRemaining: 0 },
      endermanT1: { active: false, clicksRemaining: 0 },
      materials: {
        revenantFlesh: 0,
        viresca: 0,
        sytheBlades: 0,
        shardOfTheShredded: 0,
        wardenHearts: 0,
      },
      crafted: {
        wardenHelmet: false,
        axeOfTheShredded: false,
        shredderArtifact: false,
      },
      lastDropLabel: null,
    },

    dungeons: {
      floors: Object.fromEntries(
        FLOORS.map((f) => [f.floor, { clicksRemaining: f.clicksRequired, inProgress: false }]),
      ),
      lastReward: null,
    },
  }
}
