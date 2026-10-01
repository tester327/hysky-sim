import type { CropId } from '../data/farming'
import type { DrillTier } from '../data/mining'

export interface SkillState {
  level: number
  exp: number
}

export interface FloorState {
  clicksRemaining: number
  inProgress: boolean
}

export interface SlayerQuestState {
  active: boolean
  clicksRemaining: number
}

export const CURRENT_SAVE_VERSION = 1 as const

export interface GameState {
  saveVersion: typeof CURRENT_SAVE_VERSION
  meta: {
    createdAt: string
    lastSavedAt: string
  }

  coins: number
  gear: number

  skills: {
    farming: SkillState
    combat: SkillState
    mining: SkillState
    slayer: SkillState
  }

  farming: {
    unlocked: Record<CropId, boolean>
    extraExpUpgradeLevel: number
  }

  combat: {
    zealotsUnlocked: boolean
    summoningEyes: number
    zealotsFarmed: number
  }

  mining: {
    mithrilPowder: number
    gemstonePowder: number
    hardstone: number
    roughGemstones: number
    fineGemstones: number
    extraCoinsLevel: number
    extraXpLevel: number
    efficientMinerLevel: number
    miningFortune: number
    pristineChancePercent: number
    hotmFortuneLevel: number
    hotmPristineLevel: number
    drillTier: DrillTier
  }

  slayer: {
    zombieT1: SlayerQuestState
    zombieT2: SlayerQuestState
    endermanT1: SlayerQuestState
    materials: {
      revenantFlesh: number
      viresca: number
      sytheBlades: number
      shardOfTheShredded: number
      wardenHearts: number
    }
    crafted: {
      wardenHelmet: boolean
      axeOfTheShredded: boolean
      shredderArtifact: boolean
    }
    lastDropLabel: string | null
  }

  dungeons: {
    floors: Record<number, FloorState>
    lastReward: string | null
  }
}
