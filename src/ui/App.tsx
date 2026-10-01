import { Route, Routes } from 'react-router-dom'
import { NavBar } from './components/NavBar'
import { CombatPage } from './pages/CombatPage'
import { DungeonsPage } from './pages/DungeonsPage'
import { FarmingPage } from './pages/FarmingPage'
import { GearShopPage } from './pages/GearShopPage'
import { MiningPage } from './pages/MiningPage'
import { OverviewPage } from './pages/OverviewPage'
import { SettingsPage } from './pages/SettingsPage'
import { SlayerPage } from './pages/SlayerPage'

export function App() {
  return (
    <>
      <NavBar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/farming" element={<FarmingPage />} />
          <Route path="/combat" element={<CombatPage />} />
          <Route path="/slayer" element={<SlayerPage />} />
          <Route path="/mining" element={<MiningPage />} />
          <Route path="/dungeons" element={<DungeonsPage />} />
          <Route path="/gear" element={<GearShopPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<OverviewPage />} />
        </Routes>
      </main>
    </>
  )
}
