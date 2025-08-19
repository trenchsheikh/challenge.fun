'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useAnimation, useAnimationFrame, useMotionValue } from 'framer-motion'

export type Trade = {
  tokenName: string
  tokenSymbol: string
  logoUrl: string
  entryMcap: number
  exitMcap: number
  pnlPct: number
  roundTrip?: boolean
}

export function formatMcap(num: number): string {
  const abs = Math.abs(num)
  const sign = num < 0 ? '-' : ''
  if (abs >= 1_000_000_000) return `${sign}$${(abs / 1_000_000_000).toFixed(1)}B`
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(1)}K`
  return `${sign}$${abs.toFixed(1)}`
}

function PnlPct({ value }: { value: number }) {
  const color = value > 0 ? 'text-green-500' : value < 0 ? 'text-red-500' : 'text-gray-300'
  const sign = value > 0 ? '+' : value < 0 ? '' : ''
  return <div className={`text-xl font-bold ${color}`}>{`${sign}${value.toFixed(1)}%`}</div>
}

type CardProps = { trade: Trade; idx: number }
function CarouselCard({ trade, idx }: CardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 })

  function handleMove(e: React.MouseEvent) {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    const ry = (px - 0.5) * 10 // rotateY
    const rx = -(py - 0.5) * 10 // rotateX
    setTilt({ rx, ry })
  }

  function handleLeave() {
    setTilt({ rx: 0, ry: 0 })
  }

  return (
    <motion.div
      ref={cardRef}
      role="article"
      aria-label={`${trade.tokenName} ${trade.tokenSymbol}`}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: idx * 0.08, ease: 'easeOut' }}
      whileHover={{ y: -10, scale: 1.03, boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        transformStyle: 'preserve-3d',
        rotateX: tilt.rx,
        rotateY: tilt.ry,
      }}
      className="flex-shrink-0 basis-5/6 md:basis-1/3 lg:basis-1/4 mx-2"
    >
      <motion.div
        className="rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-md p-4 h-full"
        animate={{ y: [0, -1.5, 0, 1.5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="flex items-center gap-3 mb-3">
          <img
            src={trade.logoUrl}
            alt={`${trade.tokenName} logo`}
            className="w-12 h-12 rounded-full object-cover bg-white/20"
          />
          <div>
            <div className="text-sm font-semibold text-white">{trade.tokenName}</div>
            <div className="text-xs text-white/70">{trade.tokenSymbol}</div>
          </div>
        </div>
        <div className="flex items-end justify-between">
          <PnlPct value={trade.pnlPct} />
          <div className="text-right">
            <div className="text-xs text-white/80"><span className="text-white/70">Entry</span> {formatMcap(trade.entryMcap)}</div>
            <div className="text-xs text-white/80"><span className="text-white/70">Exit</span> {formatMcap(trade.exitMcap)}</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

type CarouselProps = { trades: Trade[]; speedPxPerSec?: number }

export default function PnlCarousel({ trades, speedPxPerSec = 50 }: CarouselProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const x = useMotionValue(0)
  const [paused, setPaused] = useState(false)
  const [cardWidth, setCardWidth] = useState(0)
  const [setWidth, setSetWidth] = useState(0)

  const items = useMemo(() => (trades?.length ? [...trades, ...trades] : []), [trades])

  useEffect(() => {
    const firstCard = trackRef.current?.querySelector<HTMLElement>('[data-card]')
    if (firstCard) {
      const width = firstCard.offsetWidth + 16 /* mx-2 gaps approx */
      setCardWidth(width)
    }
  }, [trades])

  useEffect(() => {
    if (!cardWidth) return
    const logicalSetWidth = cardWidth * (trades?.length ?? 0)
    setSetWidth(logicalSetWidth)
  }, [cardWidth, trades])

  useAnimationFrame((_, delta) => {
    if (paused || !setWidth) return
    const deltaPx = (speedPxPerSec * delta) / 1000
    let next = x.get() - deltaPx
    if (-next >= setWidth) {
      next += setWidth // reset seamlessly when one logical set has scrolled
    }
    x.set(next)
  })

  function onDragStart() {
    setPaused(true)
  }
  function onDragEnd() {
    // snap to nearest card multiple for a tidy rest position
    if (cardWidth > 0) {
      const current = x.get()
      const snapped = Math.round(current / cardWidth) * cardWidth
      controls.start({ x: snapped, transition: { type: 'spring', stiffness: 300, damping: 30 } }).then(() => {
        setPaused(false)
      })
    } else {
      setPaused(false)
    }
  }

  const controls = useAnimation()

  useEffect(() => {
    controls.set({ x: x.get() })
    const unsub = x.on('change', (v) => controls.set({ x: v }))
    return () => { unsub() }
  }, [controls, x])

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ perspective: '1000px' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <motion.div
        ref={trackRef as any}
        className="flex items-stretch"
        drag="x"
        dragConstraints={{ left: -Infinity, right: Infinity }}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        animate={controls}
        style={{ x }}
      >
        {items.map((t, i) => (
          <div key={`${t.tokenSymbol}-${i}`} data-card>
            <CarouselCard trade={t} idx={i % (trades.length || 1)} />
          </div>
        ))}
      </motion.div>

      {/* Mobile swipe hint: 1.2 cards visible via basis-5/6; snap is simulated by drag-end snapping above */}
    </div>
  )
}




