import { NavLink } from 'react-router-dom'
import { PixelIcon, type IconName } from './PixelIcon'

const LINKS: { to: string; label: string; icon: IconName }[] = [
  { to: '/', label: 'Overview', icon: 'coin' },
  { to: '/farming', label: 'Farming', icon: 'wheat' },
  { to: '/combat', label: 'Combat', icon: 'sword' },
  { to: '/slayer', label: 'Slayer', icon: 'skull' },
  { to: '/mining', label: 'Mining', icon: 'pickaxe' },
  { to: '/dungeons', label: 'Dungeons', icon: 'key' },
  { to: '/gear', label: 'Gear Shop', icon: 'gear' },
  { to: '/settings', label: 'Settings', icon: 'gem' },
]

export function NavBar() {
  return (
    <nav className="nav">
      <div className="nav-inner">
        {LINKS.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.to === '/'} className="nav-link">
            <PixelIcon name={link.icon} size={18} />
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
