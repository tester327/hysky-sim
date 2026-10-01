// Shared randomness helper. Kept in one place so every reward roll in the
// game reads the same way: an integer in [1, max], inclusive.
export function rollInt(max: number): number {
  return Math.floor(Math.random() * max) + 1
}

export function rollRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
