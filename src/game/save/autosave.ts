// Debounces autosave writes so rapid clicking doesn't hit localStorage on
// every single state change.
export const AUTOSAVE_DELAY_MS = 800

export function debounce<Args extends unknown[]>(fn: (...args: Args) => void, delayMs: number): (...args: Args) => void {
  let handle: ReturnType<typeof setTimeout> | undefined
  return (...args: Args) => {
    if (handle) clearTimeout(handle)
    handle = setTimeout(() => fn(...args), delayMs)
  }
}
