import type { GameState } from '../state/types'
import { migrateSave } from './migrate'

export function exportSaveToFile(state: GameState): void {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `hysky-sim-save-${new Date().toISOString().slice(0, 10)}.json`
  link.click()
  URL.revokeObjectURL(url)
}

export async function importSaveFromFile(file: File): Promise<GameState> {
  const text = await file.text()
  const raw = JSON.parse(text) as unknown
  return migrateSave(raw)
}
