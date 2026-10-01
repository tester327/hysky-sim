import { create } from 'zustand'
import type { CropId } from '../game/data/farming'
import { AUTOSAVE_DELAY_MS, debounce } from '../game/save/autosave'
import { importSaveFromFile, exportSaveToFile } from '../game/save/fileTransfer'
import { clearLocalStorage, loadFromLocalStorage, saveToLocalStorage } from '../game/save/storage'
import { createInitialState } from '../game/state/initialState'
import type { GameState } from '../game/state/types'
import * as combatSys from '../game/systems/combatSystem'
import * as dungeonSys from '../game/systems/dungeonSystem'
import * as farmingSys from '../game/systems/farmingSystem'
import * as gearSys from '../game/systems/gearSystem'
import * as miningSys from '../game/systems/miningSystem'
import * as slayerSys from '../game/systems/slayerSystem'

export interface GameStore {
  game: GameState

  clickCrop: (id: CropId) => void
  unlockCrop: (id: CropId) => void
  buyFarmingExpUpgrade: () => void

  clickGryptGhoul: () => void
  clickZealot: () => void
  buySummoningEye: () => void

  mineGreyWool: () => void
  mineBlueWool: () => void
  mineHardstone: () => void
  mineGemstone: () => void
  sellGemsAndHardstone: () => void
  buyExtraCoinsUpgrade: () => void
  buyExtraXpUpgrade: () => void
  buyEfficientMinerUpgrade: () => void
  buyHotmFortune: () => void
  buyHotmPristine: () => void
  craftNextDrill: () => void

  startZombieT1: () => void
  clickZombieT1: () => void
  startZombieT2: () => void
  clickZombieT2: () => void
  startEndermanT1: () => void
  clickEndermanT1: () => void
  sellSlayerDrops: () => void
  craftWardenHelmet: () => void
  craftAxeOfTheShredded: () => void
  craftShredderArtifact: () => void

  startFloor: (floor: number) => void
  clickFloor: (floor: number) => void

  buyGear: () => void
  buyHyperion: () => void

  exportSave: () => void
  importSave: (file: File) => Promise<void>
  resetSave: () => void
}

const persistAutosave = debounce(saveToLocalStorage, AUTOSAVE_DELAY_MS)

export const useGameStore = create<GameStore>((set, get) => {
  // Wraps a pure `(state, ...args) => state` system function into a store
  // action: applies it, persists (debounced autosave), and triggers a
  // re-render by replacing `game`.
  function action<Args extends unknown[]>(fn: (state: GameState, ...args: Args) => GameState) {
    return (...args: Args) => {
      const next = fn(get().game, ...args)
      set({ game: next })
      persistAutosave(next)
    }
  }

  return {
    game: loadFromLocalStorage(),

    clickCrop: action(farmingSys.clickCrop),
    unlockCrop: action(farmingSys.unlockCrop),
    buyFarmingExpUpgrade: action(farmingSys.buyFarmingExpUpgrade),

    clickGryptGhoul: action(combatSys.clickGryptGhoul),
    clickZealot: action(combatSys.clickZealot),
    buySummoningEye: action(combatSys.buySummoningEye),

    mineGreyWool: action(miningSys.mineGreyWool),
    mineBlueWool: action(miningSys.mineBlueWool),
    mineHardstone: action(miningSys.mineHardstone),
    mineGemstone: action(miningSys.mineGemstone),
    sellGemsAndHardstone: action(miningSys.sellGemsAndHardstone),
    buyExtraCoinsUpgrade: action(miningSys.buyExtraCoinsUpgrade),
    buyExtraXpUpgrade: action(miningSys.buyExtraXpUpgrade),
    buyEfficientMinerUpgrade: action(miningSys.buyEfficientMinerUpgrade),
    buyHotmFortune: action(miningSys.buyHotmFortune),
    buyHotmPristine: action(miningSys.buyHotmPristine),
    craftNextDrill: action(miningSys.craftNextDrill),

    startZombieT1: action(slayerSys.startZombieT1),
    clickZombieT1: action(slayerSys.clickZombieT1),
    startZombieT2: action(slayerSys.startZombieT2),
    clickZombieT2: action(slayerSys.clickZombieT2),
    startEndermanT1: action(slayerSys.startEndermanT1),
    clickEndermanT1: action(slayerSys.clickEndermanT1),
    sellSlayerDrops: action(slayerSys.sellSlayerDrops),
    craftWardenHelmet: action(slayerSys.craftWardenHelmet),
    craftAxeOfTheShredded: action(slayerSys.craftAxeOfTheShredded),
    craftShredderArtifact: action(slayerSys.craftShredderArtifact),

    startFloor: action(dungeonSys.startFloor),
    clickFloor: action(dungeonSys.clickFloor),

    buyGear: action(gearSys.buyGear),
    buyHyperion: action(gearSys.buyHyperion),

    exportSave: () => exportSaveToFile(get().game),
    importSave: async (file: File) => {
      const imported = await importSaveFromFile(file)
      set({ game: imported })
      saveToLocalStorage(imported)
    },
    resetSave: () => {
      clearLocalStorage()
      set({ game: createInitialState() })
    },
  }
})
