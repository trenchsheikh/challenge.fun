'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { generateMockTrades, summarizeTrades } from '../lib/tradeMock'
import { ArrowUp } from 'lucide-react'

export default function AIChat() {
  const [message, setMessage] = useState('')
  const trades = useMemo(() => generateMockTrades(7), [])
  const summary = useMemo(() => summarizeTrades(trades), [trades])
  const [messages, setMessages] = useState<{ role: 'assistant' | 'user'; text: string }[]>([
    { role: 'assistant', text: 'Welcome to Challenge.fun. I am Challenger, your on chain AI. Ask me about PnL, badges, and Solana trades.' },
    { role: 'assistant', text: `Summary: trades ${summary.totalTrades}, win rate ${(summary.winRate * 100).toFixed(0)}%, realized PnL $${summary.realizedPnlUsd}, fees $${summary.feesUsd}, average hold ${summary.averageHoldHours}h.` },
  ])

  const scrollRef = useRef<HTMLDivElement | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)
  useEffect(() => {
    const el = scrollRef.current
    if (el) {
      // Keep within the chat box; scroll only the inner container, not the page
      el.scrollTop = el.scrollHeight
    }
  }, [messages.length])

  const getReply = (text: string): string => {
    const q = text.toLowerCase()
    if (q.includes('pnl') || q.includes('summary')) {
      return `PnL summary: trades ${summary.totalTrades}, win rate ${(summary.winRate * 100).toFixed(0)}%, realized $${summary.realizedPnlUsd}, fees $${summary.feesUsd}, average hold ${summary.averageHoldHours}h. Top symbols: ${summary.topSymbolsByPnl.map(s => s.symbol).join(', ')}.`
    }
    if (q.includes('fee')) return `You paid about $${summary.feesUsd} in fees across ${summary.totalTrades} trades.`
    if (q.includes('best') || q.includes('top')) return `Top symbols by realized PnL: ${summary.topSymbolsByPnl.map(s => `${s.symbol} ($${s.pnlUsd})`).join(', ')}.`
    if (q.includes('badge')) return 'Earn 1 of 1 badges by completing verified challenges and maintaining top streaks shared on X.'
    return 'Got it. I will analyze that soon. Live on chain analysis is coming next.'
  }

  const handleSend = () => {
    const text = message.trim()
    if (!text) return
    setMessage('')
    setMessages((msgs) => [...msgs, { role: 'user', text }, { role: 'assistant', text: getReply(text) }])
  }

  return (
    <div
      className="h-full bg-white rounded-xl p-0 shadow flex flex-col overflow-hidden"
      style={{ border: '2px solid #86EFAC', boxShadow: '0 0 12px rgba(134,239,172,0.25)' }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ background: '#fff' }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full" />
          <div className="text-base font-bold text-deep-green">Challenger</div>
          <span className="text-xs text-gray-600">AI for your Solana portfolio</span>
        </div>
        <div className="text-xs text-gray-600">Beta</div>
      </div>

      <div
        ref={scrollRef}
        className={`flex-1 p-4 min-h-0 max-h-full chat-scroll ${messages.length > 3 ? 'overflow-auto' : 'overflow-hidden'}`}
        style={{ background: '#ffffff', scrollBehavior: 'smooth' }}
      >
        {messages.map((m, idx) => (
          <div key={idx} className={`mb-3 flex ${m.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
            <div
              className={`${m.role === 'assistant' ? 'bg-white border border-gray-100' : 'bg-brand-primary'} max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm`}
              style={{ color: m.role === 'assistant' ? '#0f172a' : '#064e3b' }}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div
        className="p-3"
        style={{
          position: 'sticky',
          bottom: 0,
          background: 'rgba(255,255,255,0.98)',
          backdropFilter: 'blur(8px)',
          borderTop: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 -4px 10px rgba(0,0,0,0.03)'
        }}
      >
        <div className="flex items-center gap-2 justify-between">
          <div
            className="flex-1 px-3 py-2 rounded-lg text-center min-w-0"
            style={{
              background: 'linear-gradient(180deg, rgba(240,253,244,0.9), rgba(240,253,244,0.8))',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.06)',
              border: '1px solid rgba(134,239,172,0.35)'
            }}
          >
            <input
              className="w-full bg-transparent text-sm focus:outline-none text-center"
              placeholder="Ask Challenger…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
              }}
            />
          </div>
          {/* Upload button */}
          <input ref={fileRef} type="file" className="hidden" onChange={() => { /* handle in future */ }} />
          <button
            onClick={() => fileRef.current?.click()}
            aria-label="Upload"
            className="flex items-center justify-center shrink-0"
            style={{
              borderRadius: '12px',
              background: '#A7F3D0',
              color: '#064e3b',
              padding: '0.45rem 0.6rem',
              border: '2px solid #86EFAC',
              boxShadow: '0 0 8px rgba(134,239,172,0.35)'
            }}
          >
            <ArrowUp size={16} />
          </button>
          {/* Enter/Send button */}
          <button
            onClick={handleSend}
            aria-label="Enter"
            className="flex items-center justify-center font-semibold shrink-0"
            style={{
              borderRadius: '12px',
              background: '#A7F3D0',
              color: '#064e3b',
              padding: '0.45rem 0.75rem',
              border: '2px solid #86EFAC',
              boxShadow: '0 0 8px rgba(134,239,172,0.35)'
            }}
          >
            Enter
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-600" style={{ opacity: 0.8 }}>Try: “Analyze my PnL”, “Show best/worst trades”, “Fees breakdown”.</div>
      </div>
    </div>
  )
}