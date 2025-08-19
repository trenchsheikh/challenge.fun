"use client"

import React, { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend,
  TimeScale,
} from 'chart.js'
import 'chartjs-adapter-date-fns'
import { enUS } from 'date-fns/locale'
import { TimeframeValue } from './TimeframeSelect'
import { mockTokens, generatePortfolioSeries } from '../lib/portfolioMock'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, Legend, TimeScale)

function getTimeUnit(tf: TimeframeValue): 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year' {
  if (tf.endsWith('s')) return 'second'
  if (tf.endsWith('m')) return 'minute'
  if (tf.endsWith('h')) return 'hour'
  if (tf.endsWith('D')) return 'day'
  if (tf.endsWith('W') || tf.endsWith('M')) return 'month'
  return 'year'
}

function parseTimeframe(tf: TimeframeValue): { spanDays: number; points: number } {
  // Heuristic mapping for a pleasant density
  if (tf.endsWith('s')) return { spanDays: 0.25, points: 120 } // ~6 hours
  if (tf.endsWith('m')) return { spanDays: 0.5, points: 90 } // ~12 hours
  if (tf.endsWith('h')) {
    const h = parseInt(tf)
    return { spanDays: Math.max(1, (h * 6) / 24), points: 60 } // 6x selected hours
  }
  if (tf.endsWith('D')) {
    const d = parseInt(tf)
    return { spanDays: Math.max(3, d), points: 40 }
  }
  if (tf.endsWith('W')) {
    const w = parseInt(tf)
    return { spanDays: w * 7, points: 36 }
  }
  if (tf.endsWith('M')) {
    const m = parseInt(tf)
    return { spanDays: m * 30, points: 36 }
  }
  // Years
  const y = parseInt(tf)
  return { spanDays: y * 365, points: 48 }
}

export default function PortfolioChart({ fillParent = false, height = 260, timeframe }: { fillParent?: boolean; height?: number; timeframe: TimeframeValue }) {
  const cfg = useMemo(() => parseTimeframe(timeframe), [timeframe])

  const series = useMemo(() => generatePortfolioSeries(mockTokens, cfg.points, cfg.spanDays), [cfg.points, cfg.spanDays])

  const data = useMemo(() => {
    return {
      datasets: [
        {
          label: 'Portfolio Value',
          data: series.map((p) => ({ x: p.date.getTime(), y: p.valueUsd })),
          fill: true,
          borderColor: '#059669',
          backgroundColor: (ctx: any) => {
            const chart = ctx.chart
            const { ctx: c } = chart
            const gradient = c.createLinearGradient(0, 0, 0, chart.height)
            gradient.addColorStop(0, 'rgba(134,239,172,0.35)')
            gradient.addColorStop(1, 'rgba(134,239,172,0.0)')
            return gradient
          },
          tension: 0.25,
          pointRadius: 0,
          borderWidth: 2,
        },
      ],
    }
  }, [series])

  const options = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx: any) => `$${Number(ctx.parsed.y).toFixed(2)}`,
          },
        },
      },
      scales: {
        x: {
          type: 'time' as const,
          time: {
            unit: getTimeUnit(timeframe),
          },
          grid: { display: false },
          ticks: {
            source: 'auto',
            maxRotation: 0,
            autoSkip: true,
          },
        },
        y: {
          beginAtZero: false,
          grid: { color: '#eef2f7' },
          ticks: {
            callback: (v: any) => `$${Number(v).toFixed(v >= 1000 ? 0 : 2)}`,
          },
        },
      },
      locale: enUS as unknown as string,
    }
  }, [timeframe])

  return (
    <div className={fillParent ? 'w-full h-full' : 'w-full'} style={fillParent ? undefined : { height: `${height}px` }}>
      <Line options={options as any} data={data} />
    </div>
  )
}