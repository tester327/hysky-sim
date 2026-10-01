export function formatNumber(value: number): string {
  return Math.floor(value).toLocaleString('en-US')
}

export function formatCoins(value: number): string {
  return `${formatNumber(value)} coins`
}
