'use client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

import React from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useConnection } from '@solana/wallet-adapter-react'
import { useState, useEffect } from 'react'
import { formatNumber, shortenAddress } from '../lib/format'
import PortfolioChart from '../components/PortfolioChart'
import TokensList from '../components/TokensList'
import AIChat from '../components/AIChat'
import TimeframeSelect, { TimeframeValue } from '../components/TimeframeSelect'
import ConnectWalletButton from '../components/ConnectWalletButton'

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-lg p-4 shadow-sm border border-gray-100 ${className}`}>{children}</div>
}

export default function Home() {
  const { publicKey } = useWallet()
  const { connection } = useConnection()
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [tf, setTf] = useState<TimeframeValue>('1h')

  useEffect(() => {
    if (publicKey && connection) {
      fetchBalance()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey, connection])

  const fetchBalance = async () => {
    if (!publicKey || !connection) return
    setLoading(true)
    try {
      const lamports = await connection.getBalance(publicKey)
      setBalance(lamports / 1e9)
    } catch (error) {
      console.error('Error fetching balance:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!publicKey) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-2xl text-center">
          <span className="badge mb-3">Challenge.fun • Solana Challenges</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Challenge your portfolio</h1>
          <p className="text-gray-700 mb-2">Join on-chain trading challenges, earn 1-of-1 badges, and verify your wins on X. Built to spotlight the best traders and help newcomers learn faster.</p>
          <p className="text-gray-600 mb-6">Connect your wallet to track performance, compete on leaderboards, and showcase verified streaks.</p>
          <div className="inline-flex space-x-2">
            <ConnectWalletButton />
          </div>
        </div>
      </div>
    )
  }

  // Connected dashboard: optimized grid layout, full width
  return (
    <div className="min-h-screen">
      <div className="w-full">
        {/* Header removed for cleaner top; content begins immediately below sticky header */}

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-stretch min-h-0">
          {/* Left Column - Chart and Tokens */}
          <div className="xl:col-span-2 grid grid-rows-2 gap-4 min-h-0">
            {/* Portfolio Chart */}
            <Card>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900">Portfolio Performance</h2>
                <TimeframeSelect value={tf} onChange={setTf} />
              </div>
              <div style={{ height: '180px' }}>
                <PortfolioChart fillParent timeframe={tf} />
              </div>
            </Card>

            {/* Token Holdings */}
            <Card>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900">Token Holdings</h2>
                <div className="text-sm text-gray-700">Real-time</div>
              </div>
              <div className="overflow-hidden">
                <TokensList />
              </div>
            </Card>
          </div>

          {/* Right Column - AI Chat */}
          <div className="grid grid-rows-1 h-full min-h-0">
            <Card className="flex flex-col overflow-hidden h-full min-h-0">
              <AIChat />
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}