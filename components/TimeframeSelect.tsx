"use client"

import React, { useEffect, useRef, useState } from 'react'

export type TimeframeValue =
  | '1s' | '5s' | '15s' | '30s'
  | '1m' | '2m' | '3m' | '5m' | '10m' | '15m' | '30m' | '45m'
  | '1h' | '2h' | '3h' | '4h' | '6h' | '8h' | '12h'
  | '1D' | '3D' | '1W' | '1M' | '3M' | '6M' | '1Y'

export interface TimeframeOption { label: string; value: TimeframeValue }

const GROUPS: { key: string; label: string; options: TimeframeOption[] }[] = [
  { key: 'minute', label: 'Minute', options: [
      { label: '1m', value: '1m' }, { label: '2m', value: '2m' }, { label: '3m', value: '3m' }, { label: '5m', value: '5m' },
      { label: '10m', value: '10m' }, { label: '15m', value: '15m' }, { label: '30m', value: '30m' }, { label: '45m', value: '45m' },
  ]},
  { key: 'hour', label: 'Hour', options: [
      { label: '1h', value: '1h' }, { label: '2h', value: '2h' }, { label: '3h', value: '3h' }, { label: '4h', value: '4h' },
      { label: '6h', value: '6h' }, { label: '8h', value: '8h' }, { label: '12h', value: '12h' },
  ]},
  { key: 'day', label: 'Day', options: [ { label: '1D', value: '1D' }, { label: '3D', value: '3D' } ]},
  { key: 'month', label: 'Month', options: [ { label: '1W', value: '1W' }, { label: '1M', value: '1M' }, { label: '3M', value: '3M' }, { label: '6M', value: '6M' } ]},
  { key: 'year', label: 'Year', options: [ { label: '1Y', value: '1Y' } ]},
]

type MenuPos = { left: number; top: number }

export default function TimeframeSelect({ value, onChange }: { value: TimeframeValue; onChange: (v: TimeframeValue) => void }) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('minute')
  const [pos, setPos] = useState<MenuPos>({ left: 0, top: 0 })
  const rootRef = useRef<HTMLDivElement | null>(null)
  const btnRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    function updatePos() {
      if (!btnRef.current) return
      const r = btnRef.current.getBoundingClientRect()
      const width = 360
      setPos({ left: Math.max(8, r.right - width), top: r.bottom + 8 })
    }
    if (open) {
      updatePos()
      window.addEventListener('resize', updatePos)
      window.addEventListener('scroll', updatePos, true)
      return () => {
        window.removeEventListener('resize', updatePos)
        window.removeEventListener('scroll', updatePos, true)
      }
    }
  }, [open])

  const current = value
  const toggle = () => setOpen((o) => !o)
  const select = (v: TimeframeValue) => { onChange(v); setOpen(false) }

  return (
    <div className="relative" ref={rootRef}>
      <button ref={btnRef} type="button" className="btn btn-outline" onClick={toggle} aria-haspopup="listbox" aria-expanded={open}>
        Interval: {current}
      </button>
      {/* Overlay */}
      {open && <div className="fixed inset-0 bg-overlay backdrop-blur-lg z-900" onClick={() => setOpen(false)} />}
      {open && (
        <div className="fixed bg-glass rounded-lg glass-shadow z-1000 fade-in" style={{ width: 360, left: pos.left, top: pos.top, border: '1px solid rgba(255,255,255,0.4)' }} role="listbox">
          {/* Tabs */}
          <div className="flex border-b p-2 gap-2" style={{ borderColor: 'rgba(255,255,255,0.4)' }}>
            {GROUPS.map((g) => (
              <button
                key={g.key}
                className={`px-3 py-2 rounded-lg text-sm ${activeTab === g.key ? 'btn-active' : 'btn-ghost'}`}
                onClick={() => setActiveTab(g.key)}
              >
                {g.label}
              </button>
            ))}
          </div>
          {/* Options */}
          <div className="max-h-64 overflow-auto p-2">
            {GROUPS.filter((g) => g.key === activeTab).map((g) => (
              <div key={g.key} className="grid grid-cols-4 gap-2">
                {g.options.map((opt) => (
                  <div
                    key={opt.value}
                    className={`p-2 text-center rounded-lg cursor-pointer ${current === opt.value ? 'btn-active' : 'hover:bg-gray-50'}`}
                    onClick={() => select(opt.value)}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}