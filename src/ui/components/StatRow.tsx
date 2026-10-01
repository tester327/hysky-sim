import type { ReactNode } from 'react'

interface StatRowProps {
  label: string
  value: ReactNode
  tone?: 'default' | 'gold' | 'accent'
}

export function StatRow({ label, value, tone = 'default' }: StatRowProps) {
  const toneClass = tone === 'gold' ? 'stat-value--gold' : tone === 'accent' ? 'stat-value--accent' : ''
  return (
    <div className="stat-row">
      <span className="stat-label">{label}</span>
      <span className={`stat-value ${toneClass}`.trim()}>{value}</span>
    </div>
  )
}
