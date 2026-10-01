// Dungeons: Floor 1-7, click-quest completion gated by a Gear requirement.
// Reward tables ported value-for-value from the original (including item
// flavor names), rolled highest-threshold-first.

export interface FloorReward {
  threshold: number
  label: string
  coins: number
  gear: number
}

export interface FloorConfig {
  floor: number
  clicksRequired: number
  gearRequired: number
  maxRoll: number
  combatExpOnSuccess: number
  rewards: FloorReward[]
}

export const FLOORS: FloorConfig[] = [
  {
    floor: 1,
    clicksRequired: 50,
    gearRequired: 5,
    maxRoll: 100,
    combatExpOnSuccess: 30,
    rewards: [
      { threshold: 49, label: 'Rejuvinate + 2k coins + 1 gear', coins: 2_000, gear: 1 },
      { threshold: 19, label: 'Ultimate Wise + 5 gear', coins: 0, gear: 5 },
      { threshold: 4, label: "Bonzo's Staff + 100k", coins: 100_000, gear: 0 },
      { threshold: -1, label: 'Recombobulator + 250k + 20 gear', coins: 250_000, gear: 20 },
    ],
  },
  {
    floor: 2,
    clicksRequired: 75,
    gearRequired: 75,
    maxRoll: 100,
    combatExpOnSuccess: 40,
    rewards: [
      { threshold: 79, label: 'Rejuvinate + 5k coins + 3 gear', coins: 5_000, gear: 3 },
      { threshold: 59, label: 'Ultimate Wise + 8 gear', coins: 0, gear: 8 },
      { threshold: 39, label: 'Scarf Hat + 100k', coins: 100_000, gear: 0 },
      { threshold: 19, label: 'Golden Scarf Hat + 150k + 5 gear', coins: 150_000, gear: 5 },
      { threshold: 9, label: 'Diamond Scarf Hat + 200k', coins: 200_000, gear: 0 },
      { threshold: -1, label: 'Recombobulator + 300k + 25 gear', coins: 300_000, gear: 25 },
    ],
  },
  {
    floor: 3,
    clicksRequired: 100,
    gearRequired: 250,
    maxRoll: 100,
    combatExpOnSuccess: 80,
    rewards: [
      { threshold: 79, label: 'Rejuvinate + 7k coins + 3 gear', coins: 7_000, gear: 3 },
      { threshold: 59, label: 'Ultimate Wise + 10 gear', coins: 0, gear: 10 },
      { threshold: 39, label: 'Wisdom + 30k + 5 gear', coins: 30_000, gear: 5 },
      { threshold: 19, label: 'Adaptive Armor + 125k', coins: 125_000, gear: 0 },
      { threshold: 9, label: 'Fuming Potato Book + 75k + 10 gear', coins: 75_000, gear: 10 },
      { threshold: -1, label: 'Recombobulator + 400k + 30 gear', coins: 400_000, gear: 30 },
    ],
  },
  {
    floor: 4,
    clicksRequired: 150,
    gearRequired: 500,
    maxRoll: 100,
    combatExpOnSuccess: 150,
    rewards: [
      { threshold: 59, label: 'Rejuvinate + 15k coins + 6 gear', coins: 15_000, gear: 6 },
      { threshold: 39, label: 'Ultimate Wise + 20 gear', coins: 0, gear: 20 },
      { threshold: 19, label: 'Spirit Bow + 80k', coins: 80_000, gear: 0 },
      { threshold: 9, label: 'Spirit Boots + 200k + 15 gear', coins: 200_000, gear: 15 },
      { threshold: 4, label: 'Bonemerang + 250k + 50 gear', coins: 250_000, gear: 50 },
      { threshold: -1, label: 'Spirit Sceptre + 500k + 50 gear', coins: 500_000, gear: 50 },
    ],
  },
  {
    floor: 5,
    clicksRequired: 200,
    gearRequired: 1250,
    maxRoll: 100,
    combatExpOnSuccess: 300,
    rewards: [
      { threshold: 74, label: 'Rejuvinate + 20k coins + 8 gear', coins: 20_000, gear: 8 },
      { threshold: 49, label: 'Ultimate Wise + 30 gear', coins: 0, gear: 30 },
      { threshold: 29, label: 'Overload + 50k + 15 gear', coins: 50_000, gear: 15 },
      { threshold: 14, label: 'Golden Livid Hat + 250k', coins: 250_000, gear: 0 },
      { threshold: 7, label: 'Diamond Livid Hat + 400k', coins: 400_000, gear: 0 },
      { threshold: 3, label: 'Livid Dagger + 250k + 75 gear', coins: 250_000, gear: 75 },
      { threshold: -1, label: 'Shadow Assassin Armor + 1.5m + 100 gear', coins: 1_500_000, gear: 100 },
    ],
  },
  {
    floor: 6,
    clicksRequired: 300,
    gearRequired: 2500,
    maxRoll: 100,
    combatExpOnSuccess: 2000,
    rewards: [
      { threshold: 75, label: 'Rejuvinate + 20k coins + 5 gear', coins: 20_000, gear: 5 },
      { threshold: 55, label: 'Ultimate Wise + 10 gear', coins: 0, gear: 10 },
      { threshold: 40, label: 'Golden Sadan Head + 1m', coins: 1_000_000, gear: 0 },
      { threshold: 25, label: "Necromancer Lord's Sword + 100k + 10 gear", coins: 100_000, gear: 10 },
      { threshold: 15, label: 'Recombobulator + 400k + 50 gear', coins: 400_000, gear: 50 },
      { threshold: 7, label: 'Necromancer Lord Armor + 100k + 100 gear', coins: 100_000, gear: 100 },
      { threshold: 2, label: 'Flower of Truth + 500k + 100 gear', coins: 500_000, gear: 100 },
      { threshold: -1, label: 'Giant Sword + 6m + 150 gear', coins: 6_000_000, gear: 150 },
    ],
  },
  {
    floor: 7,
    clicksRequired: 350,
    gearRequired: 5000,
    maxRoll: 1000,
    combatExpOnSuccess: 1200,
    rewards: [
      { threshold: 750, label: 'Rejuvinate + 30k coins + 10 gear', coins: 30_000, gear: 10 },
      { threshold: 500, label: 'Ultimate Wise + 30 gear', coins: 0, gear: 30 },
      { threshold: 375, label: "Necron's Mask + 1m", coins: 1_000_000, gear: 0 },
      { threshold: 250, label: 'Recombobulator + 450k + 30 gear', coins: 450_000, gear: 30 },
      { threshold: 150, label: 'One for All + 500k + 10 gear', coins: 500_000, gear: 10 },
      { threshold: 50, label: 'Wither the Fish + 200k + 30 gear', coins: 200_000, gear: 30 },
      { threshold: 20, label: 'Scroll + 500k + 100 gear', coins: 500_000, gear: 100 },
      { threshold: 5, label: 'Wither Armor + 2m + 300 gear', coins: 2_000_000, gear: 300 },
      { threshold: -1, label: "Necron's Handle + 22m + 500 gear", coins: 22_000_000, gear: 500 },
    ],
  },
]
