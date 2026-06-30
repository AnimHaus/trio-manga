'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCube,
  faPenNib,
  faFilm,
  faLayerGroup,
  faVideo,
  faBullhorn,
  faArrowRight,
  faChevronDown,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

interface Role {
  title: string
  icon: IconDefinition
  type: string
  location: string
  description: string
  requirements: string[]
  niceToHave?: string[]
}

const roles: Role[] = [
  {
    title: '3D Animator',
    icon: faCube,
    type: 'Full-time / Contract',
    location: 'Remote · India',
    description:
      "Bring Trio's characters and action sequences to life with dynamic 3D animation. You will work closely with the director and storyboard artists to translate manga panels into fluid, expressive motion.",
    requirements: [
      '3+ years of 3D animation experience (character & action)',
      'Proficiency in Blender or Maya; familiarity with rigging pipelines',
      'Strong understanding of timing, weight, and body mechanics',
      'Ability to work from animatics and storyboards',
      'Portfolio demonstrating action-oriented or stylised animation',
    ],
    niceToHave: [
      'Experience with anime-style 3D (NPR shading, toon workflows)',
      'Prior work on short films, games, or web series',
    ],
  },
  {
    title: '2D Animator',
    icon: faFilm,
    type: 'Full-time / Contract',
    location: 'Remote · India',
    description:
      'Craft frame-by-frame 2D animation for promotional content, opening sequences, and social clips. Your work will define the visual identity of the Trio brand across platforms.',
    requirements: [
      '2+ years of 2D animation experience',
      'Proficiency in Clip Studio EX, Adobe Animate, or TVPaint',
      'Solid grasp of animation principles (squash & stretch, anticipation, follow-through)',
      'Clean line work and ability to maintain on-model consistency',
    ],
    niceToHave: [
      'Experience with cut-out / rigged 2D workflows',
      'Familiarity with animating to music or audio cues',
    ],
  },
  {
    title: 'Mangaka / Manga Artist',
    icon: faPenNib,
    type: 'Full-time / Freelance',
    location: 'Remote · Worldwide',
    description:
      "Join the creative team behind India's first original manga series. You will contribute pages, chapter covers, and special artwork that expand the Trio universe.",
    requirements: [
      'Strong manga-style illustration with clean inking',
      'Proficiency in Clip Studio Paint',
      'Ability to work within an established visual style and character sheet',
      'Experience completing multi-page sequential art',
      'Reliable delivery on deadlines',
    ],
    niceToHave: [
      'Background in action / shonen storytelling',
      'Experience with toning, screentones, and CMYK print preparation',
    ],
  },
  {
    title: 'Compositor',
    icon: faLayerGroup,
    type: 'Full-time / Contract',
    location: 'Remote · India',
    description:
      'Combine CG elements, VFX, colour grading, and motion graphics into polished final frames for trailers, episodes, and promotional content.',
    requirements: [
      '3+ years in compositing for animation or film',
      'Expert-level After Effects and/or Nuke',
      'Experience with colour grading and LUT workflows',
      'Understanding of alpha channels, depth passes, and multi-pass rendering',
    ],
    niceToHave: [
      'Experience compositing anime-style 3D renders',
      'Familiarity with DaVinci Resolve for final delivery',
    ],
  },
  {
    title: 'Video Editor',
    icon: faVideo,
    type: 'Full-time',
    location: 'Remote · India',
    description:
      "Cut trailers, episode previews, behind-the-scenes content, and social-first clips that showcase the Trio world. You'll own the edit from rough cut to final deliverable.",
    requirements: [
      '2+ years of professional video editing experience',
      'Expert in Adobe Premiere Pro or DaVinci Resolve',
      'Strong sense of pacing and narrative rhythm',
      'Ability to edit to music and sound design',
      'Experience delivering for multiple aspect ratios (16:9, 9:16, 1:1)',
    ],
    niceToHave: [
      'Motion graphics experience in After Effects',
      'Familiarity with anime / animation production pipelines',
    ],
  },
  {
    title: 'Social Media Marketing',
    icon: faBullhorn,
    type: 'Full-time',
    location: 'Remote · India',
    description:
      'Grow and engage the Trio community across Instagram, YouTube, X, and emerging platforms. You will devise campaigns, create content calendars, and translate studio milestones into shareable moments.',
    requirements: [
      '2+ years managing social media for a brand or media property',
      'Proven track record of audience growth and engagement',
      'Strong written communication — captions, threads, community replies',
      'Data-driven: comfortable reading analytics and iterating on strategy',
      'Deep passion for anime, manga, or pop culture',
    ],
    niceToHave: [
      'Experience with creator / influencer partnerships',
      'Graphic design or basic video editing skills for quick content turnarounds',
    ],
  },
]

function RoleCard({ role, index }: { role: Role; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden"
    >
      {/* Header row */}
      <button
        className="w-full text-left px-6 py-5 flex items-center gap-4 hover:bg-white/4 transition-colors"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <FontAwesomeIcon icon={role.icon} className="h-4 w-4" />
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-base font-bold text-white leading-tight">{role.title}</h3>
          <p className="mt-0.5 text-xs text-muted/50">
            {role.type} &middot; {role.location}
          </p>
        </div>
        <FontAwesomeIcon
          icon={open ? faChevronUp : faChevronDown}
          className="h-3.5 w-3.5 text-muted/40 flex-shrink-0 transition-transform"
        />
      </button>

      {/* Expanded body */}
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-6 pt-1 border-t border-white/6">
          <p className="mt-4 text-sm text-muted/70 leading-relaxed">{role.description}</p>

          <div className="mt-5">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Requirements</h4>
            <ul className="space-y-2">
              {role.requirements.map((req) => (
                <li key={req} className="flex items-start gap-2.5 text-sm text-muted/80">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary/60" />
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {role.niceToHave && role.niceToHave.length > 0 && (
            <div className="mt-5">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted/40 mb-3">Nice to Have</h4>
              <ul className="space-y-2">
                {role.niceToHave.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-muted/50">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/20" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <a
            href={`mailto:careers@vaibhavistudios.com?subject=Application — ${encodeURIComponent(role.title)}`}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-bg transition-colors hover:bg-primary/90"
          >
            Apply Now <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" />
          </a>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function CareersPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const heroInView = useInView(heroRef, { once: true })

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* subtle green glow */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        <div ref={heroRef} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs font-semibold uppercase tracking-[0.3em] text-primary mb-4"
          >
            Vaibhavi Studios
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-5xl font-black text-white sm:text-6xl md:text-7xl leading-none"
          >
            Join the Studio
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 max-w-xl mx-auto text-base text-muted/60 leading-relaxed"
          >
            We're building India's first original manga universe. If you live for great storytelling and want your work seen by thousands, we want to hear from you.
          </motion.p>
        </div>
      </section>

      {/* Open Roles */}
      <section className="pb-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.25em] text-muted/40 mb-8">
            Open Positions — {roles.length} roles
          </h2>
          <div className="space-y-4">
            {roles.map((role, i) => (
              <RoleCard key={role.title} role={role} index={i} />
            ))}
          </div>

          {/* General application */}
          <div className="mt-14 rounded-2xl border border-primary/20 bg-primary/5 px-6 py-8 text-center">
            <h3 className="font-display text-lg font-bold text-white">Don't see your role?</h3>
            <p className="mt-2 text-sm text-muted/60 leading-relaxed max-w-md mx-auto">
              We're always open to talented people. Send us your portfolio and tell us what you do best.
            </p>
            <a
              href="mailto:careers@vaibhavistudios.com?subject=General Application"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-primary/90"
            >
              Get in Touch <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
