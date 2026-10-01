import { useRef, useState, type ChangeEvent } from 'react'
import { useGameStore } from '../../state/store'
import { Button } from '../components/Button'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { Panel } from '../components/Panel'
import { StatRow } from '../components/StatRow'

export function SettingsPage() {
  const game = useGameStore((s) => s.game)
  const exportSave = useGameStore((s) => s.exportSave)
  const importSave = useGameStore((s) => s.importSave)
  const resetSave = useGameStore((s) => s.resetSave)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [confirmingReset, setConfirmingReset] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      await importSave(file)
      setImportError(null)
    } catch {
      setImportError('Could not read this save file. It may be corrupted or not a HySky Sim save.')
    }
  }

  return (
    <div>
      <h1>Settings</h1>

      <Panel title="Save info">
        <StatRow label="Save version" value={game.saveVersion} />
        <StatRow label="Created" value={new Date(game.meta.createdAt).toLocaleString()} />
        <StatRow label="Last saved" value={new Date(game.meta.lastSavedAt).toLocaleString()} />
        <p className="muted">
          Progress autosaves to this browser's local storage. There is no offline/idle progress - the game only advances
          while you are actively clicking.
        </p>
      </Panel>

      <Panel title="Backup">
        <div className="btn-row">
          <Button onClick={exportSave}>Export save (.json)</Button>
          <Button onClick={() => fileInputRef.current?.click()}>Import save (.json)</Button>
        </div>
        <input ref={fileInputRef} type="file" accept="application/json" onChange={handleFileChange} style={{ display: 'none' }} />
        {importError && <p className="muted">{importError}</p>}
      </Panel>

      <Panel title="Reset">
        <Button variant="danger" onClick={() => setConfirmingReset(true)}>
          Reset save
        </Button>
      </Panel>

      {confirmingReset && (
        <ConfirmDialog
          title="Reset save?"
          message="This permanently deletes your current progress in this browser. Export a backup first if you want to keep it."
          confirmLabel="Reset"
          onConfirm={() => {
            resetSave()
            setConfirmingReset(false)
          }}
          onCancel={() => setConfirmingReset(false)}
        />
      )}
    </div>
  )
}
