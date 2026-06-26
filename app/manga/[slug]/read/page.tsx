'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { getUserMangas } from '@/lib/storage'
import type { UserManga } from '@/lib/storage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faChevronLeft,
  faChevronRight,
  faExpand,
  faCompress,
  faListUl,
  faBook,
} from '@fortawesome/free-solid-svg-icons'
import TransitionLink from '@/components/TransitionLink'

export default function MangaReaderPage() {
  const { slug } = useParams<{ slug: string }>()
  const [manga, setManga] = useState<UserManga | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [mode, setMode] = useState<'scroll' | 'single'>('scroll')
  const [selectedChapterIdx, setSelectedChapterIdx] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const found = getUserMangas().find((m) => m.id === slug)
    setManga(found ?? null)
    setLoaded(true)
  }, [slug])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (mode !== 'single' || !chapterPages.length) return
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown')
        setCurrentPage((p) => Math.min(p + 1, chapterPages.length - 1))
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')
        setCurrentPage((p) => Math.max(p - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mode, manga, chapterPages])

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setFullscreen(true)
    } else {
      document.exitFullscreen()
      setFullscreen(false)
    }
  }

  useEffect(() => {
    function onFullscreenChange() {
      setFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])

  if (!loaded) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!manga) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="font-display text-3xl font-black text-white">Not Found</h1>
        <p className="text-muted/60">This manga doesn&apos;t exist.</p>
        <TransitionLink href="/" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-bg hover:bg-primary/90 transition-colors">
          <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3" />
          Back to Browse
        </TransitionLink>
      </div>
    )
  }

  const chapterPages = (manga?.chapters ?? [])[selectedChapterIdx]?.pages ?? []
  const pages = chapterPages
  const hasPages = pages.length > 0

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* ── Toolbar ───────────────────────────────────────── */}
      <div className="sticky top-0 z-50 flex items-center justify-between gap-4 border-b border-white/5 bg-bg/90 backdrop-blur-md px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3 min-w-0">
          <TransitionLink
            href={`/manga/${slug}`}
            className="flex items-center gap-1.5 text-xs text-muted/60 hover:text-primary transition-colors flex-shrink-0"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3" />
            Back
          </TransitionLink>
          <span className="text-white/20 hidden sm:block">|</span>
          <p className="hidden sm:block truncate text-sm font-semibold text-white">{manga.title}</p>
          {manga.chapters.length > 1 && (
            <select
              value={selectedChapterIdx}
              onChange={(e) => { setSelectedChapterIdx(Number(e.target.value)); setCurrentPage(0) }}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white outline-none"
            >
              {manga.chapters.map((ch, i) => (
                <option key={i} value={i} className="bg-[#0a0a0a]">Chapter {ch.number}</option>
              ))}
            </select>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Mode toggle */}
          <div className="flex items-center rounded-full border border-white/10 bg-white/5 p-0.5">
            <button
              onClick={() => setMode('scroll')}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                mode === 'scroll' ? 'bg-primary text-bg' : 'text-muted/60 hover:text-white'
              }`}
            >
              <FontAwesomeIcon icon={faListUl} className="h-3 w-3" />
              <span className="hidden sm:inline">Scroll</span>
            </button>
            <button
              onClick={() => setMode('single')}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                mode === 'single' ? 'bg-primary text-bg' : 'text-muted/60 hover:text-white'
              }`}
            >
              <FontAwesomeIcon icon={faBook} className="h-3 w-3" />
              <span className="hidden sm:inline">Page</span>
            </button>
          </div>

          {mode === 'single' && hasPages && (
            <span className="text-xs text-muted/50 tabular-nums">
              {currentPage + 1} / {pages.length}
            </span>
          )}

          <button
            onClick={toggleFullscreen}
            className="rounded-full border border-white/10 bg-white/5 p-2 text-muted/60 hover:text-primary transition-colors"
            aria-label="Toggle fullscreen"
          >
            <FontAwesomeIcon icon={fullscreen ? faCompress : faExpand} className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────── */}
      {!hasPages ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center py-20">
          <p className="text-4xl">📖</p>
          <h2 className="font-display text-xl font-bold text-white">No pages uploaded yet</h2>
          <p className="text-sm text-muted/50 max-w-sm">
            The creator hasn&apos;t uploaded any scans for this manga yet. Check back later.
          </p>
          <TransitionLink
            href={`/manga/${slug}`}
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-bg hover:bg-primary/90 transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3" />
            Back to Details
          </TransitionLink>
        </div>
      ) : mode === 'scroll' ? (
        /* ── Scroll mode ─────────────────────────────────── */
        <div className="flex flex-col items-center gap-0 pb-20">
          {pages.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Page ${i + 1}`}
              className="w-full max-w-2xl select-none"
              loading={i < 3 ? 'eager' : 'lazy'}
            />
          ))}
          <div className="mt-10 flex flex-col items-center gap-3 text-center">
            <p className="text-sm text-muted/40">End of chapter</p>
            <TransitionLink
              href={`/manga/${slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3" />
              Back to Details
            </TransitionLink>
          </div>
        </div>
      ) : (
        /* ── Single page mode ────────────────────────────── */
        <div className="flex flex-1 flex-col">
          <div className="relative flex flex-1 items-center justify-center px-4 py-4">
            {/* Prev area */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
              disabled={currentPage === 0}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white transition-opacity hover:bg-black/70 disabled:opacity-20"
              aria-label="Previous page"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4" />
            </button>

            <img
              key={currentPage}
              src={pages[currentPage]}
              alt={`Page ${currentPage + 1}`}
              className="max-h-[80vh] max-w-full object-contain select-none rounded shadow-2xl"
            />

            {/* Next area */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, pages.length - 1))}
              disabled={currentPage === pages.length - 1}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white transition-opacity hover:bg-black/70 disabled:opacity-20"
              aria-label="Next page"
            >
              <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" />
            </button>
          </div>

          {/* Page strip */}
          <div className="flex justify-center gap-1 pb-4 overflow-x-auto px-4 no-scrollbar">
            {pages.map((src, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`flex-shrink-0 h-12 w-9 overflow-hidden rounded transition-all ${
                  i === currentPage ? 'ring-2 ring-primary' : 'opacity-50 hover:opacity-80'
                }`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
