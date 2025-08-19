'use client'

import React from 'react'

export type Trade = {
  tokenName: string
  tokenSymbol: string
  logoUrl: string
  entryMcap: number
  exitMcap: number
  pnlPct: number
  roundTrip?: boolean
}

type Props = {
  trades: Trade[]
}

function formatCurrencyCompact(n: number): string {
  const abs = Math.abs(n)
  const sign = n < 0 ? '-' : ''
  if (abs >= 1_000_000_000) return `${sign}$${(abs / 1_000_000_000).toFixed(1)}B`
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(1)}K`
  return `${sign}$${abs.toFixed(1)}`
}

function pickBiggestWin(trades: Trade[]): Trade | undefined {
  let best: Trade | undefined
  for (const t of trades) {
    if (t.pnlPct > 0) {
      if (!best || t.pnlPct > best.pnlPct || (t.pnlPct === best.pnlPct)) {
        best = t
      }
    }
  }
  return best
}

function pickBiggestFumble(trades: Trade[]): Trade | undefined {
  let worst: Trade | undefined
  for (const t of trades) {
    if (t.pnlPct < 0) {
      if (!worst || t.pnlPct < worst.pnlPct || (t.pnlPct === worst.pnlPct)) {
        worst = t
      }
    }
  }
  return worst
}

function isRoundTrip(t: Trade): boolean {
  if (t.roundTrip) return true
  if (t.entryMcap === 0) return false
  const rel = Math.abs(t.exitMcap - t.entryMcap) / t.entryMcap
  return rel <= 0.05
}

function pickBiggestRoundTrip(trades: Trade[]): Trade | undefined {
  let best: Trade | undefined
  let bestSwing = -1
  for (const t of trades) {
    if (isRoundTrip(t)) {
      const swing = Math.abs(t.pnlPct)
      if (swing > bestSwing || swing === bestSwing) {
        best = t
        bestSwing = swing
      }
    }
  }
  return best
}

function PnlValue({ value }: { value: number }) {
  const color = value > 0 ? 'text-emerald-600' : value < 0 ? 'text-rose-600' : 'text-slate-600'
  const sign = value > 0 ? '+' : value < 0 ? '' : ''
  return <div className={`text-4xl font-bold ${color}`}>{`${sign}${value.toFixed(1)}%`}</div>
}

function StatLabel({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-sm text-slate-600">
      <span className="font-medium text-slate-700">{label}: </span>
      <span className="text-slate-800 font-semibold">{value}</span>
    </div>
  )
}

function Card({ title, trade }: { title: string; trade?: Trade }) {
  const hasTrade = Boolean(trade)
  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 ease-out transform-gpu hover:-translate-y-1 hover:scale-[1.01] h-full overflow-hidden">
      <div className="p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm font-semibold bg-slate-100 text-slate-700 rounded-full px-3 py-1.5 border border-slate-200">{title}</span>
        </div>

        {hasTrade ? (
          <>
            {/* Token Info */}
            <div className="mb-6">
              <div className="text-lg font-bold text-slate-900 mb-1">{trade!.tokenName}</div>
              <div className="text-sm text-slate-500">{trade!.tokenSymbol}</div>
            </div>

            {/* PnL Display */}
            <div className="mb-6">
              <PnlValue value={trade!.pnlPct} />
            </div>

            {/* Stats */}
            <div className="mt-auto pt-4 border-t border-slate-100 space-y-2">
              <StatLabel label="Entry Mcap" value={formatCurrencyCompact(trade!.entryMcap)} />
              <StatLabel label="Exit Mcap" value={formatCurrencyCompact(trade!.exitMcap)} />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-slate-400 text-sm">No qualifying trades yet</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function PnlTopMovers({ trades }: Props) {
  const biggestWin = pickBiggestWin(trades)
  const biggestFumble = pickBiggestFumble(trades)
  const biggestRoundTrip = pickBiggestRoundTrip(trades)

  return (
    <section aria-labelledby="top-movers-heading" className="w-full">
      <h2 id="top-movers-heading" className="sr-only">PnL Top Movers</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        <Card title="Biggest Wins" trade={biggestWin} />
        <Card title="Biggest Fumbles" trade={biggestFumble} />
        <Card title="Biggest Round Trips" trade={biggestRoundTrip} />
      </div>
    </section>
  )
}

export { formatCurrencyCompact }


