'use client'

import { useId } from 'react'
import { motion } from 'framer-motion'

interface AreaChartProps {
  data: number[]
  labels?: string[]
  color?: string
  height?: number
  /** Format a value for the hover tooltip / axis */
  format?: (v: number) => string
}

/** Lightweight responsive area/line chart built with raw SVG. */
export function AreaChart({
  data,
  labels,
  color = '#9CFE08',
  height = 180,
  format = (v) => `${Math.round(v)}`,
}: AreaChartProps) {
  const gradId = useId()
  const W = 640
  const H = height
  const padY = 16

  if (data.length === 0) return null

  const max = Math.max(...data, 1)
  const min = Math.min(...data, 0)
  const range = max - min || 1
  const stepX = W / Math.max(1, data.length - 1)

  const pts = data.map((v, i) => {
    const x = i * stepX
    const y = H - padY - ((v - min) / range) * (H - padY * 2)
    return [x, y] as const
  })

  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')
  const area = `${line} L ${W} ${H} L 0 ${H} Z`

  const lastIdx = data.length - 1
  const tickEvery = Math.ceil(data.length / 6)

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }} preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* subtle gridlines */}
        {[0.25, 0.5, 0.75].map((g) => (
          <line
            key={g}
            x1={0}
            x2={W}
            y1={padY + g * (H - padY * 2)}
            y2={padY + g * (H - padY * 2)}
            stroke="#ffffff"
            strokeOpacity={0.05}
            strokeWidth={1}
          />
        ))}

        <motion.path
          d={area}
          fill={`url(#${gradId})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
        <motion.path
          d={line}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          vectorEffect="non-scaling-stroke"
        />
        {/* end dot */}
        <motion.circle
          cx={pts[lastIdx][0]}
          cy={pts[lastIdx][1]}
          r={4}
          fill={color}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: 'spring', stiffness: 300 }}
        />
      </svg>

      {labels && (
        <div className="mt-2 flex justify-between px-0.5 text-[10px] text-muted/40">
          {labels.map((l, i) =>
            i % tickEvery === 0 || i === labels.length - 1 ? <span key={i}>{l}</span> : null,
          )}
        </div>
      )}
      <span className="sr-only">Latest value {format(data[lastIdx])}</span>
    </div>
  )
}

interface BarChartProps {
  data: { label: string; value: number }[]
  color?: string
  height?: number
  format?: (v: number) => string
}

/** Horizontal comparison bars (e.g. revenue per manga). */
export function BarChart({ data, color = '#9CFE08', format = (v) => `${v}` }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="w-28 flex-shrink-0 truncate text-xs text-muted/60" title={d.label}>
            {d.label}
          </span>
          <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-white/5">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{ background: color }}
              initial={{ width: 0 }}
              animate={{ width: `${(d.value / max) * 100}%` }}
              transition={{ duration: 0.8, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <span className="w-20 flex-shrink-0 text-right text-xs font-semibold text-white tabular-nums">
            {format(d.value)}
          </span>
        </div>
      ))}
    </div>
  )
}
