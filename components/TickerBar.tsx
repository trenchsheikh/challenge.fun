import React from 'react'
import { fetchTopSolanaDex, fetchSolPriceUsd } from '../lib/defillama'
import { formatNumber } from '../lib/format'

export default async function TickerBar() {
  const [topDex, solPrice] = await Promise.all([
    fetchTopSolanaDex(),
    fetchSolPriceUsd(),
  ])
  const dexText = topDex
    ? `DeX of the Day: ${topDex.name} ($${formatNumber(topDex.volume24h, 0)} 24h)`
    : 'DeX of the Day: Loading…'
  const priceText = typeof solPrice === 'number' ? `$${formatNumber(solPrice, 2)}` : 'Loading…'
  // Repeat the content more times to ensure seamless flow without visible gaps
  const segment = `Meta of The Day: "ZEUS"  •  ${dexText}  •  Price of SOL: ${priceText}  •  `
  const headline = segment.repeat(6)

  return (
    <div className="w-full border-y-2 border-green shadow-neon corners-square" style={{ margin: 0, overflow: 'hidden' }} data-ticker>
      <div className="marquee">
        <div className="marquee-track text-ticker-color ticker-glow tracking-wide font-semibold text-sm py-2">
          <span className="px-12">{headline}</span>
        </div>
      </div>
    </div>
  )
}
