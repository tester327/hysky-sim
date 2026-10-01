interface ProgressBarProps {
  current: number
  max: number
  label: string
}

export function ProgressBar({ current, max, label }: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (current / max) * 100)) : 0
  return (
    <div className="progress" role="progressbar" aria-valuenow={current} aria-valuemin={0} aria-valuemax={max}>
      <div className="progress-fill" style={{ width: `${pct}%` }} />
      <span className="progress-label">{label}</span>
    </div>
  )
}
