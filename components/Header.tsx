'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ConnectWalletButton from './ConnectWalletButton'

export default function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const nav = [
    { href: '/', label: 'Dashboard' },
    { href: '/pnl', label: 'PNL' },
    { href: '/badges', label: 'Challenges' },
  ]

  return (
    <header>
      <div className="w-full px-0 py-3 backdrop-blur-lg glass-shadow" style={{ border: 'none', marginLeft: 0, marginRight: 0, borderRadius: 12, overflow: 'visible' }}>
        {/* Row */}
        <div className="relative flex items-center" style={{ minHeight: 48 }}>
          {/* Left: Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-accent rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">◎</span>
            </div>
            <h1 className="text-xl font-bold text-deep-green">Challenge.fun</h1>
          </div>

          {/* Center: Nav (desktop) - truly centered via absolute positioning */}
          <nav className="hidden md:flex items-center gap-2" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
            {nav.map((n) => {
              const isActive = pathname === n.href
              const className = isActive ? 'nav-link nav-link-active' : 'nav-link'
              return (
                <Link key={n.href} href={n.href} className={className}>
                  {n.label}
                </Link>
              )
            })}
          </nav>

          {/* Right: Wallet + Hamburger - pinned to far right */}
          <div className="flex items-center gap-2" style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)' }}>
            <button aria-label="Menu" className="md:hidden nav-link" onClick={() => setOpen((o) => !o)}>Menu</button>
            <ConnectWalletButton />
          </div>
        </div>

        {/* Mobile in-flow menu */}
        {open && (
          <div className="menu-panel md:hidden">
            <div className="menu-header">
              <div className="menu-title">Navigate</div>
              <button className="nav-link" onClick={() => setOpen(false)}>✕</button>
            </div>
            <div className="px-4 py-2">
              {nav.map((n) => {
                const isActive = pathname === n.href
                return (
                  <Link key={n.href} href={n.href} className={`menu-link ${isActive ? 'menu-link-active' : ''}`} onClick={() => setOpen(false)}>
                    <span>{n.label}</span>
                    <span className="menu-link-icon">➜</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  )
} 