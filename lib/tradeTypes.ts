export type TradeSide = 'buy' | 'sell'

export interface TradeEvent {
  id: string
  timestamp: number // ms epoch
  symbol: string // e.g. SOL, RAY
  side: TradeSide
  quantity: number
  priceUsd: number
  feeUsd: number
}

export interface TradeSummary {
  totalTrades: number
  winRate: number // 0..1
  realizedPnlUsd: number
  feesUsd: number
  averageHoldHours: number
  topSymbolsByPnl: Array<{ symbol: string; pnlUsd: number }>
}






