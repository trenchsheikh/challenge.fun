export type TokenHolding = {
  symbol: string
  amount: number
  price: number // current price USD
}

export const mockTokens: TokenHolding[] = [
  { symbol: 'SOL', amount: 3.245, price: 145.12 },
  { symbol: 'USDC', amount: 520.0, price: 1.0 },
  { symbol: 'BONK', amount: 1_250_000, price: 0.000024 },
]

export type PortfolioPoint = { date: Date; valueUsd: number }

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

// Generate mock acquisition events and a resulting portfolio value curve
export function generatePortfolioSeries(finalHoldings: TokenHolding[], points = 16, baseSpanDays = 60): PortfolioPoint[] {
  // Sum current value
  const finalValue = finalHoldings.reduce((sum, t) => sum + t.amount * t.price, 0)

  const start = new Date()
  start.setDate(start.getDate() - baseSpanDays)

  const series: PortfolioPoint[] = []
  for (let i = 0; i < points; i++) {
    const d = new Date(start.getTime() + (i / (points - 1)) * (baseSpanDays * 24 * 60 * 60 * 1000))
    // Simulate progressive accumulation towards final value with slight variability
    const progress = i / (points - 1)
    const drift = Math.sin(i / 3) * 0.03 + randomBetween(-0.015, 0.02)
    const value = Math.max(0, finalValue * (0.2 + progress * 0.8 + drift))
    series.push({ date: d, valueUsd: value })
  }
  return series
}