export type TopDex = {
  name: string
  volume24h: number
}

// Fetch top Solana DEX by daily volume from DefiLlama
export async function fetchTopSolanaDex(): Promise<TopDex | null> {
  try {
    const url =
      'https://api.llama.fi/overview/dexs/solana?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true&dataType=dailyVolume'
    const res = await fetch(url, { next: { revalidate: 900 } })
    if (!res.ok) return null
    const data = await res.json()
    const protocols: any[] = Array.isArray(data?.protocols) ? data.protocols : []
    if (!protocols.length) return null
    // total24h is a string or number in some responses; coerce to number
    protocols.sort((a, b) => (Number(b.total24h || 0) || 0) - (Number(a.total24h || 0) || 0))
    const top = protocols[0]
    return {
      name: top?.name || 'Unknown',
      volume24h: Number(top?.total24h || 0) || 0,
    }
  } catch (e) {
    return null
  }
}

export async function fetchSolPriceUsd(): Promise<number | null> {
  try {
    const url =
      'https://coins.llama.fi/prices/current/solana:So11111111111111111111111111111111111111112'
    const res = await fetch(url, { next: { revalidate: 60 } })
    if (!res.ok) return null
    const data = await res.json()
    const key = 'solana:So11111111111111111111111111111111111111112'
    const price = data?.coins?.[key]?.price
    return typeof price === 'number' ? price : null
  } catch (e) {
    return null
  }
}


