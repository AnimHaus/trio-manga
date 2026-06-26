'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { getUserMangas } from '@/lib/storage'
import type { UserManga } from '@/lib/storage'
import { mangaPlusEntries } from '@/lib/manga-plus-updates-html'
import type { MangaPlusEntry } from '@/lib/manga-plus-updates-html'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faBookOpen, faUser, faLayerGroup, faTag, faClock, faCartShopping, faCrown } from '@fortawesome/free-solid-svg-icons'
import TransitionLink from '@/components/TransitionLink'
import { useCart } from '@/components/CartProvider'
import { useAuth } from '@/components/AuthProvider'

const trioVolumes = [
  {
    slug: 'volume-1',
    image: '/volume_1.png',
    title: 'TRIO — Volume 1',
    author: 'Vaibhavi Studios',
    chapters: 6,
    chapterRange: 'Chapters 1–6',
    genre: 'Action / Adventure',
    description:
      'The story begins. Three unlikely heroes are thrown together by fate in a world on the edge of collapse. Volume 1 lays the foundation of the TRIO universe — their first meeting, first fight, and the spark of an unbreakable bond.',
    date: '2 days ago',
  },
  {
    slug: 'volume-2',
    image: '/volume_2.png',
    title: 'TRIO — Volume 2',
    author: 'Vaibhavi Studios',
    chapters: 6,
    chapterRange: 'Chapters 7–12',
    genre: 'Action / Adventure',
    description:
      'The trio faces their first true enemy. Tensions rise as secrets are revealed and the world grows more dangerous. Volume 2 dives deeper into each character\'s past and sets the stage for an explosive confrontation.',
    date: '1 week ago',
  },
  {
    slug: 'volume-3',
    image: '/volume_3.png',
    title: 'TRIO — Volume 3',
    author: 'Vaibhavi Studios',
    chapters: 6,
    chapterRange: 'Chapters 13–18',
    genre: 'Action / Adventure',
    description:
      'Alliances are forged and broken. As the trio ventures into unknown territory, they must decide who to trust. Volume 3 marks a turning point that will change the series forever.',
    date: '2 weeks ago',
  },
  {
    slug: 'volume-4',
    image: '/volume_4.png',
    title: 'TRIO — Volume 4',
    author: 'Vaibhavi Studios',
    chapters: 6,
    chapterRange: 'Chapters 19–24',
    genre: 'Action / Adventure',
    description:
      'The stakes have never been higher. With enemies closing in from all sides, the trio must push beyond their limits. Volume 4 delivers the series\' most intense battles yet.',
    date: '3 weeks ago',
  },
  {
    slug: 'volume-5',
    image: '/volume_5.png',
    title: 'TRIO — Volume 5',
    author: 'Vaibhavi Studios',
    chapters: 6,
    chapterRange: 'Chapters 25–30',
    genre: 'Action / Adventure',
    description:
      'The latest chapter in the TRIO saga. Everything has been building to this. Volume 5 pushes the story to its boldest, most emotional heights yet — a must-read for every fan.',
    date: '1 month ago',
  },
]

type TrioVolume = (typeof trioVolumes)[0]

export default function MangaDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [userManga, setUserManga] = useState<UserManga | null>(null)
  const [loaded, setLoaded] = useState(false)
  const { addItem, items } = useCart()
  const { user } = useAuth()
  const [addedToCart, setAddedToCart] = useState<string | null>(null)

  const trioVolume: TrioVolume | undefined = trioVolumes.find((v) => v.slug === slug)
  const mangaPlusEntry: MangaPlusEntry | undefined = !trioVolume
    ? mangaPlusEntries.find((e) => e.href.endsWith(slug))
    : undefined

  useEffect(() => {
    if (!trioVolume && !mangaPlusEntry) {
      const mangas = getUserMangas()
      const found = mangas.find((m) => m.id === slug)
      setUserManga(found ?? null)
    }
    setLoaded(true)
  }, [slug, trioVolume, mangaPlusEntry])

  if (!loaded) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!trioVolume && !mangaPlusEntry && !userManga) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="font-display text-3xl font-black text-white">Not Found</h1>
        <p className="text-muted/60">This manga doesn&apos;t exist or may have been removed.</p>
        <TransitionLink
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-bg hover:bg-primary/90 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3" />
          Back to Browse
        </TransitionLink>
      </div>
    )
  }

  const isOfficial = !!trioVolume
  const isMangaPlus = !!mangaPlusEntry

  const title = isOfficial ? trioVolume!.title : isMangaPlus ? mangaPlusEntry!.title : userManga!.title
  const author = isOfficial ? trioVolume!.author : isMangaPlus ? mangaPlusEntry!.author : userManga!.author
  const coverImage = isOfficial ? trioVolume!.image : isMangaPlus ? mangaPlusEntry!.image : userManga!.coverImage
  const genre = isOfficial ? trioVolume!.genre : isMangaPlus ? 'Manga' : userManga!.genre
  const description = isOfficial
    ? trioVolume!.description
    : isMangaPlus
    ? `${mangaPlusEntry!.chapter}${mangaPlusEntry!.chapterTitle ? ` · ${mangaPlusEntry!.chapterTitle}` : ''} — ${mangaPlusEntry!.views} views`
    : userManga!.description
  const chapterLabel = isOfficial ? trioVolume!.chapterRange : isMangaPlus ? mangaPlusEntry!.chapter : `${userManga!.chapters.length} chapter${userManga!.chapters.length !== 1 ? 's' : ''}`
  const uploadedBy = isOfficial ? 'Vaibhavi Studios' : isMangaPlus ? mangaPlusEntry!.author : userManga!.uploadedBy
  const updatedAt = isOfficial ? trioVolume!.date : isMangaPlus ? mangaPlusEntry!.date : new Date(userManga!.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

  return (
    <div className="min-h-screen bg-bg">
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative flex min-h-[55vh] items-end pb-10 sm:pb-14">
        <div className="absolute inset-0">
          {coverImage ? (
            <Image src={coverImage} alt="" fill className="object-cover opacity-30" priority />
          ) : (
            <div className="h-full w-full bg-card/20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <TransitionLink
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-xs text-muted/60 hover:text-primary transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3" />
            Back to Browse
          </TransitionLink>
          {isOfficial && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">Official Release</p>
          )}
          {isMangaPlus && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">MangaPlus</p>
          )}
          {!isOfficial && !isMangaPlus && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">Community</p>
          )}
          <h1 className="font-display text-4xl font-black text-white sm:text-5xl md:text-6xl leading-none">
            {title}
          </h1>
          <p className="mt-2 text-sm text-muted/60">by {author}</p>
        </div>
      </section>

      {/* ── Details ───────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
          {/* ── Cover ─────────────────────────────────────── */}
          <motion.div
            className="flex-shrink-0 lg:w-56 xl:w-64"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-white/5 shadow-2xl">
              {coverImage ? (
                <Image src={coverImage} alt={title} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted/30 leading-relaxed">
                  {title}
                </div>
              )}
            </div>
          </motion.div>

          {/* ── Info ──────────────────────────────────────── */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Meta pills */}
            <div className="mb-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted/70">
                <FontAwesomeIcon icon={faBookOpen} className="h-3 w-3 text-primary" />
                {chapterLabel}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted/70">
                <FontAwesomeIcon icon={faTag} className="h-3 w-3 text-primary" />
                {genre}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted/70">
                <FontAwesomeIcon icon={faUser} className="h-3 w-3 text-primary" />
                {uploadedBy}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted/70">
                <FontAwesomeIcon icon={faClock} className="h-3 w-3 text-primary" />
                {updatedAt}
              </span>
            </div>

            {/* Description */}
            <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-muted/60">Synopsis</h2>
            <p className="text-sm leading-7 text-muted/80 max-w-2xl">{description}</p>

            {/* CTA */}
            <div className="mt-8 flex flex-wrap gap-3">
              {isOfficial && (
                <>
                  {/* Read online — requires subscription */}
                  {user ? (
                    <TransitionLink
                      href={`/manga/${slug}/read`}
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-bg transition-colors hover:bg-primary/90"
                    >
                      <FontAwesomeIcon icon={faBookOpen} className="h-3.5 w-3.5" />
                      Read Online
                    </TransitionLink>
                  ) : (
                    <a
                      href={`${process.env.NEXT_PUBLIC_DASHBOARD_URL ?? 'http://localhost:3001'}/login`}
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-bg transition-colors hover:bg-primary/90"
                    >
                      <FontAwesomeIcon icon={faCrown} className="h-3.5 w-3.5" />
                      Subscribe to Read
                    </a>
                  )}

                  {/* Add subscription to cart */}
                  <button
                    onClick={() => {
                      addItem({ id: 'subscription-monthly', type: 'subscription', title: 'Monthly Subscription — All Trio Volumes', image: '/logo.webp', price: 29900 })
                      setAddedToCart('sub')
                      setTimeout(() => setAddedToCart(null), 2000)
                    }}
                    disabled={!!items.find((i) => i.id === 'subscription-monthly')}
                    className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-7 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 disabled:opacity-50"
                  >
                    <FontAwesomeIcon icon={faCrown} className="h-3.5 w-3.5" />
                    {items.find((i) => i.id === 'subscription-monthly') ? 'In Cart' : addedToCart === 'sub' ? 'Added!' : '₹299/mo'}
                  </button>

                  {/* Hard copy */}
                  <button
                    onClick={() => {
                      addItem({ id: `hardcopy-${slug}`, type: 'hardcopy', title: title, image: coverImage || '', price: 49900 })
                      setAddedToCart('hc')
                      setTimeout(() => setAddedToCart(null), 2000)
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    <FontAwesomeIcon icon={faCartShopping} className="h-3.5 w-3.5" />
                    {addedToCart === 'hc' ? 'Added!' : 'Buy Hard Copy — ₹499'}
                  </button>
                </>
              )}

              {!isOfficial && (
                <TransitionLink
                  href={`/manga/${slug}/read`}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-bg transition-colors hover:bg-primary/90"
                >
                  <FontAwesomeIcon icon={faBookOpen} className="h-3.5 w-3.5" />
                  Read Now
                </TransitionLink>
              )}

              <TransitionLink
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <FontAwesomeIcon icon={faLayerGroup} className="h-3.5 w-3.5" />
                Browse More
              </TransitionLink>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
