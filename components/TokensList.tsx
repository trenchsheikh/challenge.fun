'use client'

import React, { useMemo } from 'react'
import { TokenHolding, mockTokens } from '../lib/portfolioMock'

interface TokenRowProps {
  symbol: string
  amount: number
  price: number
}

function TokenRow({ symbol, amount, price }: TokenRowProps) {
  const value = amount * price
  return (
    <div className="flex justify-between items-center py-1">
      <div className="font-bold text-gray-800 text-sm">{symbol}</div>
      <div className="text-gray-600 text-sm">{amount.toFixed(3)}</div>
      <div className="text-gray-600 text-sm">${value.toFixed(2)}</div>
    </div>
  )
}

export default function TokensList({ tokens }: { tokens?: TokenHolding[] }) {
  const list = tokens ?? mockTokens

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-600 pb-1 border-b">
        <span>Token</span>
        <span>Amount</span>
        <span>Value</span>
      </div>
      <div className="space-y-1">
        {list.map((t) => (
          <TokenRow key={t.symbol} {...t} />
        ))}
      </div>
    </div>
  )
}