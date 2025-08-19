'use client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

import React from 'react'
import PnlTopMovers, { Trade } from '../../components/PnlTopMovers'

export default function PnlPage() {
  const mock: Trade[] = [
    { tokenName: "FrogCoin", tokenSymbol: "FROG", logoUrl: "/frog.png", entryMcap: 3_200_000, exitMcap: 7_850_000, pnlPct: 145.3 },
    { tokenName: "DogeLite", tokenSymbol: "DLT", logoUrl: "/dlt.png", entryMcap: 12_000_000, exitMcap: 8_400_000, pnlPct: -30.0 },
    { tokenName: "LoopToken", tokenSymbol: "LOOP", logoUrl: "/loop.png", entryMcap: 5_000_000, exitMcap: 5_150_000, pnlPct: 3.0, roundTrip: true },
    { tokenName: "Solana", tokenSymbol: "SOL", logoUrl: "/sol.png", entryMcap: 10_000_000, exitMcap: 9_500_000, pnlPct: -5.0 },
    { tokenName: "Bonk", tokenSymbol: "BONK", logoUrl: "/bonk.png", entryMcap: 1_000_000, exitMcap: 1_030_000, pnlPct: 3.0, roundTrip: true },
    { tokenName: "Jupiter", tokenSymbol: "JUP", logoUrl: "/jup.png", entryMcap: 2_000_000, exitMcap: 1_800_000, pnlPct: -10.0 },
    { tokenName: "Pyth Network", tokenSymbol: "PYTH", logoUrl: "/pyth.png", entryMcap: 4_000_000, exitMcap: 4_080_000, pnlPct: 2.0, roundTrip: true },
  ]

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-deep-green mb-2">Portfolio Performance</h1>
        <p className="text-gray-600">Track your trading performance and discover your top movers</p>
      </div>
      
      
      <div className="bg-glass rounded-2xl border border-green/30 shadow-neon p-6">
        <h2 className="text-xl font-semibold text-deep-green mb-6">PnL Top Movers</h2>
        <PnlTopMovers trades={mock} />
      </div>
    </div>
  )
}