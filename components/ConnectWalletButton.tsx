"use client"

import React, { useEffect, useRef, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'

export default function ConnectWalletButton({ className = '' }: { className?: string }) {
  const { connected, disconnect } = useWallet()
  const { setVisible } = useWalletModal()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const onClick = () => {
    if (!connected) {
      setVisible(true)
      return
    }
    setOpen((o) => !o)
  }

  const handleChange = () => {
    setOpen(false)
    setVisible(true)
  }

  const handleDisconnect = async () => {
    setOpen(false)
    try { await disconnect() } catch {}
  }

  return (
    <div className="relative inline-block" ref={rootRef}>
      <button type="button" className={`wallet-btn ${className}`} onClick={onClick} aria-haspopup="menu" aria-expanded={connected && open ? 'true' : 'false'}>
        {connected ? 'Connected' : 'Connect Wallet'}
      </button>
      {connected && (
        <div className="dropdown-panel" role="menu" style={{ display: open ? 'block' : 'none' }}>
          <button className="dropdown-item" onClick={handleChange}>Change wallet</button>
          <button className="dropdown-item" onClick={handleDisconnect}>Disconnect</button>
        </div>
      )}
    </div>
  )
}
