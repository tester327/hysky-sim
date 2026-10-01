// Slayer: Zombie Slayer T1/T2 (original) plus Enderman Slayer T1 (approved
// new addition). All three share the same "pay entry cost -> click N times
// -> roll a reward table" structure from the original game.

export type SlayerQuestId = 'zombieT1' | 'zombieT2' | 'endermanT1'

export interface RewardRoll {
  /** Roll must be strictly greater than this to hit the tier (highest first). */
  threshold: number
  label: string
  coins?: number
  slayerExp?: number
  combatExp?: number
}

export const ZOMBIE_T1 = {
  entryCostCoins: 50_000,
  clicksRequired: 50,
  baseSlayerExp: 4,
  baseCombatExp: 700,
  // The original gated these bonus rolls behind near-unreachable float
  // brackets (e.g. "level > 6.9 and level < 7", impossible for an integer
  // level) which made them dead code except for the exact integer levels
  // 8, 9 and >=10. Rebuilt here as clean, reachable thresholds that match
  // what the original actually did at runtime.
  rollTiers: {
    low: { minLevel: 8, maxRoll: 100, rolls: [
      { threshold: 79, label: 'Rare drop', coins: 20_000 },
      { threshold: 69, label: 'Very Rare drop', slayerExp: 15 },
    ] as RewardRoll[] },
    high: { minLevel: 10, maxRoll: 1000, flatCombatExp: 300, rolls: [
      { threshold: 799, label: 'Rare drop', coins: 20_000 },
      { threshold: 699, label: 'Very Rare drop', slayerExp: 15 },
      { threshold: 649, label: 'Crazy Rare drop', coins: 1_000_000 },
      { threshold: 639, label: 'INSANE DROP', coins: 7_000_000 },
    ] as RewardRoll[] },
  },
}

export const ZOMBIE_T2 = {
  entryCostCoins: 500_000,
  clicksRequired: 175,
  axeOfTheShreddedClickDiscount: 25,
  wardenHelmetClickDiscount: 50,
  baseSlayerExp: 15,
  baseCombatExp: 5000,
  artifactBonusCombatExp: 500,
  // Material drop table, rolled 1-200, highest threshold first.
  dropRolls: [
    { threshold: 198, label: 'Warden Heart', wardenHearts: 1, revenantFlesh: 20 },
    { threshold: 194, label: 'Shard of the Shredded', shardOfTheShredded: 1, revenantFlesh: 20 },
    { threshold: 184, label: 'Sythe Blade', sytheBlades: 1, revenantFlesh: 20 },
    { threshold: 144, label: 'Viresca', viresca: 1, revenantFlesh: 20 },
  ],
  noDropFleshGain: 10,
  maxRoll: 200,
}

export const SELL_PRICES = {
  revenantFlesh: 100,
  viresca: 100_000,
  sytheBlades: 4_000_000,
  shardOfTheShredded: 10_000_000,
  wardenHearts: 60_000_000,
}

export const CRAFT_RECIPES = {
  wardenHelmet: { revenantFlesh: 2500, viresca: 50, sytheBlades: 5, wardenHearts: 1 },
  axeOfTheShredded: { revenantFlesh: 1000, viresca: 25, sytheBlades: 1, shardOfTheShredded: 2 },
  shredderArtifact: { shardOfTheShredded: 10 },
}

// New addition: Enderman Slayer T1. Reuses the existing Summoning Eyes
// resource (previously a near dead-end, see combat.ts) as its entry cost
// and the same click-quest/reward-roll shape as the Zombie Slayer tiers,
// scaled between T1 and T2 in difficulty and reward.
export const ENDERMAN_T1 = {
  entryCostSummoningEyes: 10,
  clicksRequired: 120,
  baseSlayerExp: 10,
  baseCombatExp: 1500,
  baseCoins: 50_000,
  maxRoll: 1000,
  rollTiers: [
    { threshold: 989, label: 'Mythical drop', coins: 15_000_000 },
    { threshold: 959, label: 'Very Rare drop', slayerExp: 25 },
    { threshold: 909, label: 'Crazy Rare drop', coins: 3_000_000 },
    { threshold: 859, label: 'Rare drop', coins: 1_000_000 },
  ] as RewardRoll[],
}
