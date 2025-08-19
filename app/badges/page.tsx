'use client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

import React from 'react'
import Link from 'next/link'

export default function ChallengesPage() {
  const stakes = Array.from({ length: 10 }, (_, i) => i + 1)

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <h1 className="text-xl font-bold text-deep-green mb-4">Challenges</h1>

      <section aria-labelledby="sol-stakes" className="mb-8">
        <h2 id="sol-stakes" className="text-sm font-semibold text-deep-green mb-3">SOL Stake Challenges</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stakes.map((s) => (
            <div key={s} className="rounded-2xl bg-glass glass-shadow border border-green shadow-neon p-4 flex flex-col">
              <div className="flex items-center justify-between">
                <div className="text-base font-semibold text-gray-900">{s} SOL Challenge</div>
              </div>
              <p className="text-sm text-gray-700 mt-2">Trade Solana tokens, track PnL, and earn 1-of-1 badges.</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-gray-600">Stake: {s} SOL</div>
                <button
                  type="button"
                  className="wallet-btn text-sm"
                  onClick={() => {
                    window.location.hash = `enter-${s}`
                  }}
                >
                  Enter
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="crypto-themes">
        <h2 id="crypto-themes" className="text-sm font-semibold text-deep-green mb-3">Crypto-Themed Challenges</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[{t:'DEX Scalper',d:'High-frequency trades on Solana DEXs for 24h.'},{t:'Airdrop Speedrun',d:'Bridge, swap, and stake to qualify for ecosystem airdrops.'},{t:'Meme Rush',d:'Find and trade trending meme tokens, manage risk smartly.'}].map((c) => (
            <div key={c.t} className="rounded-2xl bg-glass glass-shadow border border-green shadow-neon p-4 flex items-center justify-between">
              <div>
                <div className="text-base font-semibold text-gray-900">{c.t}</div>
                <p className="text-sm text-gray-700 mt-1">{c.d}</p>
              </div>
              <button
                type="button"
                className="wallet-btn text-sm"
                onClick={() => { window.location.hash = `enter-${c.t.replace(/\s+/g,'-').toLowerCase()}` }}
              >
                Enter
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}