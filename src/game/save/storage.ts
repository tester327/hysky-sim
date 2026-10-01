import { createInitialState } from '../state/initialState'
import type { GameState } from '../state/types'
import { migrateSave } from './migrate'

export const STORAGE_KEY = 'hysky-sim-save'

export function loadFromLocalStorage(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createInitialState()
    return migrateSave(JSON.parse(raw))
  } catch {
    return createInitialState()
  }
}

export function saveToLocalStorage(state: GameState): void {
  try {
    const withTimestamp: GameState = { ...state, meta: { ...state.meta, lastSavedAt: new Date().toISOString() } }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(withTimestamp))
  } catch {
    // localStorage can be unavailable (private mode, quota) - autosave is
    // best-effort, the player can still export a backup manually.
  }
}

export function clearLocalStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
