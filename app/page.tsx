'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { getUserMangas } from '@/lib/storage'
import type { UserManga } from '@/lib/storage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faPlus } from '@fortawesome/free-solid-svg-icons'
import TransitionLink from '@/components/TransitionLink'
import { mangaPlusEntries } from '@/lib/manga-plus-updates-html'
import type { MangaPlusEntry } from '@/lib/manga-plus-updates-html'

const hottestMangas = [
  { title: 'One Piece', author: 'Eiichiro Oda', views: '335,743', image: 'https://jumpg-assets.tokyo-cdn.com/secure/title/100020/title_thumbnail_portrait_list/326439.jpg?hash=61qqSDl8HuepoLLvk4uBwQ&expires=2145884400', href: 'https://mangaplus.shueisha.co.jp/titles/100020' },
  { title: 'Boruto: Two Blue Vortex', author: 'Masashi Kishimoto / Mikio Ikemoto', views: '226,885', image: 'https://jumpg-assets.tokyo-cdn.com/secure/title/100269/title_thumbnail_portrait_list/311890.jpg?hash=MbYAXkqNhxzvDfsJ1JYHWg&expires=2145884400', href: 'https://mangaplus.shueisha.co.jp/titles/100269' },
  { title: 'Dandadan', author: 'Yukinobu Tatsu', views: '167,815', image: 'https://jumpg-assets.tokyo-cdn.com/secure/title/100171/title_thumbnail_portrait_list/312235.jpg?hash=ov0SDV1k1eVUfWumGcn1zw&expires=2145884400', href: 'https://mangaplus.shueisha.co.jp/titles/100171' },
  { title: 'SPY x FAMILY', author: 'Tatsuya Endo', views: '150,027', image: 'https://jumpg-assets.tokyo-cdn.com/secure/title/100056/title_thumbnail_portrait_list/313744.jpg?hash=ktoQqLjO4TO9hZz8kWFCvQ&expires=2145884400', href: 'https://mangaplus.shueisha.co.jp/titles/100056' },
  { title: 'Kagurabachi', author: 'Takeru Hokazono', views: '116,287', image: 'https://jumpg-assets.tokyo-cdn.com/secure/title/100274/title_thumbnail_portrait_list/401607.jpg?hash=0HsgO8u7g6CZPpuEB98p_g&expires=2145884400', href: 'https://mangaplus.shueisha.co.jp/titles/100274' },
  { title: 'SAKAMOTO DAYS', author: 'Yuto Suzuki', views: '111,187', image: 'https://jumpg-assets.tokyo-cdn.com/secure/title/100127/title_thumbnail_portrait_list/313621.jpg?hash=0HpK9-UWS7urxNciRiGxQQ&expires=2145884400', href: 'https://mangaplus.shueisha.co.jp/titles/100127' },
  { title: 'Ichi the Witch', author: 'Osamu Nishi / Shiro Usazaki', views: '84,900', image: 'https://jumpg-assets.tokyo-cdn.com/secure/title/100348/title_thumbnail_portrait_list/371494.jpg?hash=532nnlAxLgYd4wc2IyxxLA&expires=2145884400', href: 'https://mangaplus.shueisha.co.jp/titles/100348' },
  { title: 'Lunolita', author: 'Kinoshi Wata', views: '82,362', image: 'https://jumpg-assets.tokyo-cdn.com/secure/title/100757/title_thumbnail_portrait_list/603626.jpg?hash=RaoTGVVAfg0ISLp4O1zVBQ&expires=2145884400', href: 'https://mangaplus.shueisha.co.jp/titles/100757' },
  { title: 'Hal Formula', author: 'Kento Terasaka', views: '76,066', image: 'https://jumpg-assets.tokyo-cdn.com/secure/title/100767/title_thumbnail_portrait_list/604970.jpg?hash=410vAuplMiGEz-fN4MluYA&expires=2145884400', href: 'https://mangaplus.shueisha.co.jp/titles/100767' },
  { title: 'Centuria', author: 'Tohru Kuramori', views: '68,181', image: 'https://jumpg-assets.tokyo-cdn.com/secure/title/100314/title_thumbnail_portrait_list/344818.jpg?hash=pnjSV_8tRl1tnVfA2iEJpQ&expires=2145884400', href: 'https://mangaplus.shueisha.co.jp/titles/100314' },
  { title: 'World Wide Web MIKO!', author: 'Kogattuo / Ichika Kino', views: '66,451', image: 'https://jumpg-assets.tokyo-cdn.com/secure/title/100756/title_thumbnail_portrait_list/603242.jpg?hash=k2Q3o_xYOXXU-EX6_EixHw&expires=2145884400', href: 'https://mangaplus.shueisha.co.jp/titles/100756' },
  { title: 'Hey! Devil Girl!', author: 'Zao Fukatsu', views: '66,364', image: 'https://jumpg-assets.tokyo-cdn.com/secure/title/100758/title_thumbnail_portrait_list/604271.jpg?hash=zKaSaJkJV4ez-kN1E0oYKQ&expires=2145884400', href: 'https://mangaplus.shueisha.co.jp/titles/100758' },
  { title: 'Hitoner', author: 'Tomohiro Yagi', views: '63,639', image: 'https://jumpg-assets.tokyo-cdn.com/secure/title/100742/title_thumbnail_portrait_list/483590.jpg?hash=Q2todNe2Lpn_e5cDGIvo4w&expires=2145884400', href: 'https://mangaplus.shueisha.co.jp/titles/100742' },
  { title: 'Twilight Blade', author: 'Chiyoko Maruume / Tokegoro', views: '62,499', image: 'https://jumpg-assets.tokyo-cdn.com/secure/title/100766/title_thumbnail_portrait_list/604445.jpg?hash=ma6P0BIAB92dQ2kopAsiuw&expires=2145884400', href: 'https://mangaplus.shueisha.co.jp/titles/100766' },
  { title: 'Animal Signal', author: 'Robinson Haruhara / Taishi Tsutsui', views: '59,491', image: 'https://jumpg-assets.tokyo-cdn.com/secure/title/100759/title_thumbnail_portrait_list/604301.jpg?hash=oRHp7rVemMKJN648KbQaqg&expires=2145884400', href: 'https://mangaplus.shueisha.co.jp/titles/100759' },
  { title: 'Blue Box', author: 'Kouji Miura', views: '52,620', image: 'https://jumpg-assets.tokyo-cdn.com/secure/title/100157/title_thumbnail_portrait_list/311824.jpg?hash=OTZjVcorf8e8XMfat0p0bg&expires=2145884400', href: 'https://mangaplus.shueisha.co.jp/titles/100157' },
  { title: 'RuriDragon', author: 'Masaoki Shindo', views: '51,832', image: 'https://jumpg-assets.tokyo-cdn.com/secure/title/100196/title_thumbnail_portrait_list/313570.jpg?hash=rx4_NfijYDvzGCvOIlkmTQ&expires=2145884400', href: 'https://mangaplus.shueisha.co.jp/titles/100196' },
  { title: 'MAD', author: 'Yusuke Otori', views: '50,649', image: 'https://jumpg-assets.tokyo-cdn.com/secure/title/100328/title_thumbnail_portrait_list/357406.jpg?hash=-ThfCxlmR46hL4JZIldFHA&expires=2145884400', href: 'https://mangaplus.shueisha.co.jp/titles/100328' },
  { title: "So you weren't into me?!", author: 'Wakame Konbu', views: '44,698', image: 'https://jumpg-assets.tokyo-cdn.com/secure/title/100685/title_thumbnail_portrait_list/472748.jpg?hash=d5GAn4KwnZt79q1Og79usg&expires=2145884400', href: 'https://mangaplus.shueisha.co.jp/titles/100685' },
  { title: 'Dream Partner', author: 'KAZUKI NONAKA', views: '43,819', image: 'https://jumpg-assets.tokyo-cdn.com/secure/title/100761/title_thumbnail_portrait_list/603224.jpg?hash=OM4muCVi6JLjoS2IyEZeKw&expires=2145884400', href: 'https://mangaplus.shueisha.co.jp/titles/100761' },
  { title: 'WITCHRIV', author: 'Hakuri', views: '43,289', image: 'https://jumpg-assets.tokyo-cdn.com/secure/title/100604/title_thumbnail_portrait_list/453292.jpg?hash=Wad1JblG1QvcDulHKAGPwg&expires=2145884400', href: 'https://mangaplus.shueisha.co.jp/titles/100604' },
  { title: 'Make the Exorcist Fall in Love', author: 'Aruma Arima / Masuku Fukayama', views: '42,084', image: 'https://jumpg-assets.tokyo-cdn.com/secure/title/100198/title_thumbnail_portrait_list/313057.jpg?hash=N3u9B7wCplsbA0qFJpBDdw&expires=2145884400', href: 'https://mangaplus.shueisha.co.jp/titles/100198' },
  { title: 'MARRIAGETOXIN', author: 'Joumyaku / Mizuki Yoda', views: '41,741', image: 'https://jumpg-assets.tokyo-cdn.com/secure/title/100190/title_thumbnail_portrait_list/481664.jpg?hash=aBzzn6uALDie3KJuiiPYdA&expires=2145884400', href: 'https://mangaplus.shueisha.co.jp/titles/100190' },
  { title: "Asura's Verdict", author: 'Utsugi Unohana', views: '41,553', image: 'https://jumpg-assets.tokyo-cdn.com/secure/title/100405/title_thumbnail_portrait_list/387797.jpg?hash=th13NqsIsGY59earAcneEg&expires=2145884400', href: 'https://mangaplus.shueisha.co.jp/titles/100405' },
  { title: "Hope You're Happy, Lemon", author: 'Mizuki Kishikawa', views: '41,110', image: 'https://jumpg-assets.tokyo-cdn.com/secure/title/100280/title_thumbnail_portrait_list/317512.jpg?hash=ZcpiFHzWAw1lOJExtQ5U6Q&expires=2145884400', href: 'https://mangaplus.shueisha.co.jp/titles/100280' },
]

const trioVolumes = [
  { slug: 'volume-1', image: '/volume_1.png', title: 'Volume 1', chapters: 'Chapters 1–6', date: '2 days ago' },
  { slug: 'volume-2', image: '/volume_2.png', title: 'Volume 2', chapters: 'Chapters 7–12', date: '1 week ago' },
  { slug: 'volume-3', image: '/volume_3.png', title: 'Volume 3', chapters: 'Chapters 13–18', date: '2 weeks ago' },
  { slug: 'volume-4', image: '/volume_4.png', title: 'Volume 4', chapters: 'Chapters 19–24', date: '3 weeks ago' },
  { slug: 'volume-5', image: '/volume_5.png', title: 'Volume 5', chapters: 'Chapters 25–30', date: '1 month ago' },
]

const featured = trioVolumes[4]

function MangaCard({ slug, image, title, chapters, date, index }: typeof trioVolumes[0] & { index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <TransitionLink href={`/manga/${slug}`} className="group block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-white/5">
          <Image src={image} alt={title} fill sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,20vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
        </div>
        <div className="mt-3">
          <h3 className="font-display text-sm font-bold text-white group-hover:text-primary transition-colors">{title}</h3>
          <p className="mt-0.5 text-xs text-muted/50">{chapters}</p>
          <p className="mt-0.5 text-[11px] text-muted/40">{date}</p>
        </div>
      </TransitionLink>
    </motion.div>
  )
}

function MangaPlusCard({ entry, index }: { entry: MangaPlusEntry; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 20) * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <TransitionLink href={`/manga/${entry.href.split('/').pop()}`} className="group block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-white/5">
          <Image src={entry.image} alt={entry.title} fill sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,20vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
        </div>
        <div className="mt-3">
          <h3 className="font-display text-sm font-bold text-white group-hover:text-primary transition-colors">{entry.title}</h3>
          <p className="mt-0.5 text-xs text-muted/50">{entry.author}</p>
          <p className="mt-0.5 text-[11px] text-muted/40">{entry.chapter}{entry.chapterTitle ? ` · ${entry.chapterTitle}` : ''}</p>
          <p className="mt-0.5 text-[11px] text-muted/40">{entry.date} · {entry.views}</p>
        </div>
      </TransitionLink>
    </motion.div>
  )
}

function UserMangaCard({ manga, index }: { manga: UserManga; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <a href="#" className="group block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-white/5">
          {manga.coverImage ? (
            <img src={manga.coverImage} alt={manga.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className="flex h-full items-center justify-center text-muted/30 text-sm p-4 text-center leading-relaxed">
              {manga.title}
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
        </div>
        <div className="mt-3">
          <h3 className="font-display text-sm font-bold text-white group-hover:text-primary transition-colors">{manga.title}</h3>
          <p className="mt-0.5 text-xs text-muted/50">by {manga.author}</p>
          <p className="mt-0.5 text-[11px] text-muted/40">{manga.chapters.length} chapter{manga.chapters.length !== 1 ? 's' : ''}</p>
        </div>
      </a>
    </motion.div>
  )
}

export default function MangaPage() {
  const [userMangas, setUserMangas] = useState<UserManga[]>([])

  useEffect(() => {
    setUserMangas(getUserMangas())
  }, [])

  const allMangas = [...userMangas].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  const latestUserManga = allMangas.length > 0 ? allMangas[0] : null

  return (
    <div className="min-h-screen bg-bg">
      {/* ── Featured Hero ─────────────────────────────────── */}
      <section className="relative flex min-h-[70vh] items-end pb-10 sm:pb-14 md:pb-20">
        <div className="absolute inset-0">
          <Image
            src={featured.image}
            alt=""
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary mb-3">Featured — Latest Release</p>
          <h1 className="font-display text-4xl font-black text-white sm:text-5xl md:text-7xl leading-none">
            {featured.title}
          </h1>
          <p className="mt-3 max-w-lg text-sm text-muted/70 leading-relaxed">
            {featured.chapters} &middot; Updated {featured.date}
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <TransitionLink href={`/manga/${featured.slug}`} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-primary/90">
              Read Now <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" />
            </TransitionLink>
            {latestUserManga && (
              <a href="#community" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                Latest from Community <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ── TRIO Volumes ──────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">TRIO</h2>
            <p className="mt-1 text-sm text-muted/60">Official manga volumes</p>
          </div>
          <a href="#" className="hidden text-xs text-primary hover:underline sm:block">View all &rarr;</a>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {trioVolumes.map((v, i) => (
            <MangaCard key={v.image} {...v} index={i} />
          ))}
        </div>
      </section>

      {/* ── Community Mangas ──────────────────────────────── */}
      <section id="community" className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">Community</h2>
              <p className="mt-1 text-sm text-muted/60">Mangas uploaded by our creators</p>
            </div>
            <a
              href={`${process.env.NEXT_PUBLIC_DASHBOARD_URL ?? 'http://localhost:3001'}/dashboard/upload`}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-bg transition-colors hover:bg-primary/90"
            >
              <FontAwesomeIcon icon={faPlus} className="h-3 w-3" />
              Upload
            </a>
          </div>

          <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
            {/* ── Manga Grid ───────────────────────────────── */}
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4">
                {allMangas.map((m, i) => (
                  <UserMangaCard key={m.id} manga={m} index={i} />
                ))}
                {mangaPlusEntries.map((entry, i) => (
                  <MangaPlusCard key={entry.readerHref} entry={entry} index={allMangas.length + i} />
                ))}
              </div>
            </div>

            {/* ── Hot Sidebar ──────────────────────────────── */}
            <div className="w-full flex-shrink-0 lg:w-64 xl:w-72">
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">Hottest</h3>
                </div>
                <div className="space-y-1">
                  {hottestMangas.map((m, i) => (
                    <a
                      key={m.href}
                      href={m.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-white/5"
                    >
                      <span className={`w-5 text-center text-xs font-bold leading-none ${i < 3 ? 'text-primary' : 'text-muted/40'}`}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="relative h-10 w-7 flex-shrink-0 overflow-hidden rounded bg-white/5">
                        <img src={m.image} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-white/80 text-md font-medium">{m.title}</p>
                        <p className="text-sm text-muted/40">{m.views} views</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}