import type { UserManga } from "./storage"

export interface DailyPoint {
  /** ISO date (yyyy-mm-dd) */
  date: string
  /** Short label e.g. "Jun 3" */
  label: string
  views: number
  reads: number
  revenue: number
}

export interface MangaAnalytics {
  mangaId: string
  views: number
  reads: number
  likes: number
  followers: number
  /** 0 – 5 */
  avgRating: number
  /** 0 – 1 */
  completionRate: number
  /** Lifetime earnings */
  revenue: number
  /** Earnings in the trailing 30-day window */
  revenueThisMonth: number
  /** Unpaid balance awaiting the next payout */
  pendingPayout: number
  /** Revenue per 1,000 reads (INR) */
  rpm: number
  /** % change in views, last 15 days vs previous 15 */
  viewsChange: number
  /** % change in revenue, last 15 days vs previous 15 */
  revenueChange: number
  daily: DailyPoint[]
}

export interface AggregateAnalytics {
  views: number
  reads: number
  likes: number
  followers: number
  avgRating: number
  revenue: number
  revenueThisMonth: number
  pendingPayout: number
  viewsChange: number
  revenueChange: number
  daily: DailyPoint[]
  topManga: { id: string; revenue: number } | null
}

const DAYS = 30
const MS_DAY = 86_400_000

/** FNV-1a hash → 32-bit unsigned int, used to seed the RNG. */
function hashString(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Deterministic PRNG so analytics stay stable for a given manga id. */
function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shortLabel(d: Date): string {
  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric" })
}

function pctChange(recent: number, previous: number): number {
  if (previous <= 0) return recent > 0 ? 100 : 0
  return ((recent - previous) / previous) * 100
}

export function getMangaAnalytics(manga: UserManga): MangaAnalytics {
  const rand = mulberry32(hashString(manga.id))

  // How long the title has been live (drives lifetime totals).
  const createdMs = new Date(manga.createdAt).getTime()
  const ageDays = Math.max(0, (Date.now() - createdMs) / MS_DAY)
  const monthsActive = Math.max(1, ageDays / 30)

  const chapterBoost = 1 + manga.chapters * 0.07
  const baseDaily = 60 + Math.floor(rand() * 380) // base daily views
  const growth = 0.4 + rand() * 1.1 // total growth across the window
  const rpm = 110 + Math.floor(rand() * 240) // ₹ per 1,000 reads

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const daily: DailyPoint[] = []
  for (let d = 0; d < DAYS; d++) {
    const date = new Date(today.getTime() - (DAYS - 1 - d) * MS_DAY)
    const trend = 1 + (d / DAYS) * growth
    const weekly = 1 + 0.22 * Math.sin((d / 7) * Math.PI * 2)
    const noise = 0.7 + rand() * 0.65
    const views = Math.max(0, Math.round(baseDaily * chapterBoost * trend * weekly * noise))
    const reads = Math.round(views * (0.42 + rand() * 0.26))
    const revenue = (reads / 1000) * rpm
    daily.push({ date: date.toISOString().slice(0, 10), label: shortLabel(date), views, reads, revenue })
  }

  const sum = (key: "views" | "reads" | "revenue") =>
    daily.reduce((acc, p) => acc + p[key], 0)

  const monthViews = sum("views")
  const monthReads = sum("reads")
  const revenueThisMonth = sum("revenue")

  // Lifetime ≈ monthly run-rate scaled by how long it has been live.
  const lifetimeFactor = 0.6 + monthsActive * 0.9
  const views = Math.round(monthViews * lifetimeFactor)
  const reads = Math.round(monthReads * lifetimeFactor)
  const revenue = revenueThisMonth * lifetimeFactor

  const likes = Math.round(reads * (0.05 + rand() * 0.07))
  const followers = Math.round(likes * (0.3 + rand() * 0.35))
  const avgRating = Math.min(5, 3.5 + rand() * 1.4)
  const completionRate = 0.4 + rand() * 0.45

  const half = Math.floor(DAYS / 2)
  const recentViews = daily.slice(half).reduce((a, p) => a + p.views, 0)
  const prevViews = daily.slice(0, half).reduce((a, p) => a + p.views, 0)
  const recentRev = daily.slice(half).reduce((a, p) => a + p.revenue, 0)
  const prevRev = daily.slice(0, half).reduce((a, p) => a + p.revenue, 0)

  // Current unpaid cycle (this month, minus an already-settled slice).
  const pendingPayout = revenueThisMonth * (0.55 + rand() * 0.35)

  return {
    mangaId: manga.id,
    views,
    reads,
    likes,
    followers,
    avgRating,
    completionRate,
    revenue,
    revenueThisMonth,
    pendingPayout,
    rpm,
    viewsChange: pctChange(recentViews, prevViews),
    revenueChange: pctChange(recentRev, prevRev),
    daily,
  }
}

export function aggregateAnalytics(items: MangaAnalytics[]): AggregateAnalytics {
  const empty: AggregateAnalytics = {
    views: 0,
    reads: 0,
    likes: 0,
    followers: 0,
    avgRating: 0,
    revenue: 0,
    revenueThisMonth: 0,
    pendingPayout: 0,
    viewsChange: 0,
    revenueChange: 0,
    daily: [],
    topManga: null,
  }
  if (items.length === 0) return empty

  const views = items.reduce((a, m) => a + m.views, 0)
  const reads = items.reduce((a, m) => a + m.reads, 0)
  const likes = items.reduce((a, m) => a + m.likes, 0)
  const followers = items.reduce((a, m) => a + m.followers, 0)
  const revenue = items.reduce((a, m) => a + m.revenue, 0)
  const revenueThisMonth = items.reduce((a, m) => a + m.revenueThisMonth, 0)
  const pendingPayout = items.reduce((a, m) => a + m.pendingPayout, 0)

  // Read-weighted average rating.
  const avgRating =
    reads > 0
      ? items.reduce((a, m) => a + m.avgRating * m.reads, 0) / reads
      : items.reduce((a, m) => a + m.avgRating, 0) / items.length

  // Merge the per-day series (all arrays share the same dates/labels).
  const len = items[0].daily.length
  const daily: DailyPoint[] = Array.from({ length: len }, (_, i) => ({
    date: items[0].daily[i].date,
    label: items[0].daily[i].label,
    views: items.reduce((a, m) => a + m.daily[i].views, 0),
    reads: items.reduce((a, m) => a + m.daily[i].reads, 0),
    revenue: items.reduce((a, m) => a + m.daily[i].revenue, 0),
  }))

  const recentViews = daily.slice(len / 2).reduce((a, p) => a + p.views, 0)
  const prevViews = daily.slice(0, len / 2).reduce((a, p) => a + p.views, 0)
  const recentRev = daily.slice(len / 2).reduce((a, p) => a + p.revenue, 0)
  const prevRev = daily.slice(0, len / 2).reduce((a, p) => a + p.revenue, 0)

  const top = items.reduce(
    (best, m) => (m.revenue > best.revenue ? { id: m.mangaId, revenue: m.revenue } : best),
    { id: items[0].mangaId, revenue: items[0].revenue },
  )

  return {
    views,
    reads,
    likes,
    followers,
    avgRating,
    revenue,
    revenueThisMonth,
    pendingPayout,
    viewsChange: pctChange(recentViews, prevViews),
    revenueChange: pctChange(recentRev, prevRev),
    daily,
    topManga: top,
  }
}

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
})

const inr2 = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatCurrency(value: number, decimals = false): string {
  return (decimals ? inr2 : inr).format(value)
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 1 }).format(value)
}

/** First day of next month — the scheduled payout date. */
export function nextPayoutDate(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth() + 1, 1)
}
