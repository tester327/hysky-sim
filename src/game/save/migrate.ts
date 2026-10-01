import { createInitialState } from '../state/initialState'
import { CURRENT_SAVE_VERSION, type GameState } from '../state/types'

// Versioned migration entry point. Right now there is only v1, so this is
// an identity pass-through for valid saves and a reset for anything else.
// Future updates should add one `if (version === N) { ...upgrade...}` step
// per old version instead of discarding unrecognized saves.
export function migrateSave(raw: unknown): GameState {
  if (!raw || typeof raw !== 'object') return createInitialState()

  const version = (raw as { saveVersion?: unknown }).saveVersion
  if (version === CURRENT_SAVE_VERSION) {
    return raw as GameState
  }

  return createInitialState()
}
