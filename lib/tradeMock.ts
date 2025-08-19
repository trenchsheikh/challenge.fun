import { TradeEvent, TradeSummary } from './tradeTypes'

export function generateMockTrades(seed = 1): TradeEvent[] {
  const symbols = ['SOL', 'RAY', 'JUP', 'ORCA']
  let x = seed
  const rand = () => (x = (x * 9301 + 49297) % 233280) / 233280
  const now = Date.now()
  const events: TradeEvent[] = []
  for (let i = 0; i < 80; i++) {
    const symbol = symbols[Math.floor(rand() * symbols.length)]
    const side = rand() > 0.5 ? 'buy' : 'sell'
    const quantity = Math.max(0.1, Number((rand() * 10).toFixed(2)))
    const price = Number((5 + rand() * 200).toFixed(2))
    const fee = Number((price * quantity * 0.002).toFixed(2))
    const ts = now - i * 3600 * 1000 * (0.5 + rand() * 24)
    events.push({ id: String(i), timestamp: ts, symbol, side, quantity, priceUsd: price, feeUsd: fee })
  }
  events.sort((a, b) => a.timestamp - b.timestamp)
  return events
}

export function summarizeTrades(trades: TradeEvent[]): TradeSummary {
  let realizedPnlUsd = 0
  let wins = 0
  let fees = 0
  const stacks: Record<string, { qty: number; cost: number }> = {}
  const holds: number[] = []
  const pnlBySymbol: Record<string, number> = {}

  for (const t of trades) {
    fees += t.feeUsd
    pnlBySymbol[t.symbol] ??= 0
    if (t.side === 'buy') {
      const s = (stacks[t.symbol] ??= { qty: 0, cost: 0 })
      s.qty += t.quantity
      s.cost += t.quantity * t.priceUsd
    } else {
      const s = (stacks[t.symbol] ??= { qty: 0, cost: 0 })
      const avg = s.qty > 0 ? s.cost / s.qty : t.priceUsd
      const qty = Math.min(s.qty, t.quantity)
      const pnl = (t.priceUsd - avg) * qty
      realizedPnlUsd += pnl
      pnlBySymbol[t.symbol] += pnl
      if (pnl > 0) wins++
      s.qty = Math.max(0, s.qty - qty)
      s.cost = Math.max(0, s.cost - avg * qty)
      holds.push(2 + Math.random() * 48) // mock holding hours
    }
  }

  const topSymbols = Object.entries(pnlBySymbol)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([symbol, pnlUsd]) => ({ symbol, pnlUsd: Number(pnlUsd.toFixed(2)) }))

  return {
    totalTrades: trades.length,
    winRate: trades.length ? wins / Math.max(1, trades.filter(t => t.side === 'sell').length) : 0,
    realizedPnlUsd: Number(realizedPnlUsd.toFixed(2)),
    feesUsd: Number(fees.toFixed(2)),
    averageHoldHours: Number((holds.reduce((a, b) => a + b, 0) / Math.max(1, holds.length)).toFixed(1)),
    topSymbolsByPnl: topSymbols,
  }
}






