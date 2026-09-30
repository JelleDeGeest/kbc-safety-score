import type { CSSProperties, ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

export function Icon({ name, size = 20, className, style }: { name: string; size?: number; className?: string; style?: CSSProperties }) {
  return <svg width={size} height={size} className={className} style={style} aria-hidden="true"><use href={`#${name}`} /></svg>
}

export function KateBadge({ size = 30 }: { size?: number }) {
  return <span className="kate-ic" style={{ width: size, height: size }}><Icon name="kate" size={size * 0.6} /></span>
}

export function StatusBar() {
  return <div className="fake-status">11:23 <svg width="64" height="14"><use href="#status" /></svg></div>
}

export function TopBar({ title, back = true, right = 'kate', onClose }: { title: string; back?: boolean; right?: 'kate' | 'close' | 'none'; onClose?: () => void }) {
  const nav = useNavigate()
  return (
    <header className="topbar">
      {back ? <button className="icon-btn" aria-label="Back" onClick={() => nav(-1)}><Icon name="back" size={22} /></button> : <span className="icon-btn" />}
      <h2>{title}</h2>
      {right === 'kate' && <KateBadge />}
      {right === 'close' && <button className="icon-btn" aria-label="Close" onClick={onClose}><Icon name="close" size={20} /></button>}
      {right === 'none' && <span className="icon-btn" />}
    </header>
  )
}

export function NavBar() {
  const items = [
    { to: '/', icon: 'wallet', label: 'Start', end: true },
    { to: '/cyber', icon: 'list', label: 'My KBC', end: false },
    { to: '/investments', icon: 'pig', label: 'Investments', end: false },
    { to: '/offer', icon: 'layers', label: 'Offer', end: false },
  ]
  return (
    <nav className="navbar">
      {items.map(i => (
        <NavLink key={i.to} to={i.to} end={i.end} className={({ isActive }) => (isActive ? 'on' : '')}>
          <Icon name={i.icon} size={22} />{i.label}
        </NavLink>
      ))}
    </nav>
  )
}

export function Sheet({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  if (!open) return null
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="sheet-grip" />
        {children}
      </div>
    </div>
  )
}
