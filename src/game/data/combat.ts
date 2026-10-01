// Combat: Grypt Ghouls (always available) and Zealots (unlocked at Combat
// level 12). Zealots have a chance to drop a Summoning Eye, used to enter
// the Enderman Slayer (see slayer.ts).

export const GRYPT_GHOUL_COINS = 15
export const GRYPT_GHOUL_XP = 7

export const ZEALOT_COINS_PER_EYE = 3
export const ZEALOT_XP = 5

export const SUMMONING_EYE_CAP = 2500
// Original behaviour once capped: the click that would have produced an
// eye instead gives a small coin bonus so the button stays useful.
export const SUMMONING_EYE_OVERFLOW_COINS = 1000
export const SUMMONING_EYE_BUY_COST = 60_000

// Combat level-up bonus: flat coins on top of the generic +1 Gear.
export const COMBAT_LEVEL_UP_COINS = 1000
