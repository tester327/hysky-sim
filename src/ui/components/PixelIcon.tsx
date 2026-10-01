// Tiny hand-authored pixel-grid icons (no external assets, nothing from
// Mojang/Hypixel). Each icon is an NxN grid of '0'/'1' rows rendered as a
// crisp-edged SVG so it stays a deliberate "blocky" pixel look at any size.

export type IconGrid = string[]

export const ICONS = {
  coin: ['00111100', '01111110', '11111111', '11111111', '11111111', '11111111', '01111110', '00111100'],
  gear: ['00100100', '01111110', '11111111', '11011011', '11011011', '11111111', '01111110', '00100100'],
  pickaxe: ['11000000', '11100000', '01110000', '00111001', '00011111', '00001111', '00000110', '00000011'],
  sword: ['00010000', '00010000', '00010000', '00010000', '01111100', '00010000', '00010000', '00111000'],
  wheat: ['00100100', '01010100', '00101000', '01010100', '00101000', '01010100', '00101000', '00111000'],
  skull: ['00111100', '01111110', '11011011', '11111111', '11100111', '01111110', '00111100', '00100100'],
  key: ['00011000', '00100100', '00100100', '00011000', '00001000', '00001000', '00011100', '00010100'],
  gem: ['00011000', '00111100', '01111110', '11111111', '01111110', '00111100', '00011000', '00000000'],
} as const

export type IconName = keyof typeof ICONS

interface PixelIconProps {
  name: IconName
  size?: number
  color?: string
  title?: string
}

export function PixelIcon({ name, size = 16, color = 'currentColor', title }: PixelIconProps) {
  const grid = ICONS[name]
  const n = grid.length
  const cells: { x: number; y: number }[] = []
  grid.forEach((row, y) => {
    row.split('').forEach((cell, x) => {
      if (cell === '1') cells.push({ x, y })
    })
  })

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${n} ${n}`}
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      shapeRendering="crispEdges"
    >
      {cells.map((c) => (
        <rect key={`${c.x}-${c.y}`} x={c.x} y={c.y} width={1} height={1} fill={color} />
      ))}
    </svg>
  )
}
