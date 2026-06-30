import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLinkedin, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import TransitionLink from '@/components/TransitionLink'

config.autoAddCss = false

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-black/50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 grid-cols-2 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.5fr]">
          <div>
            <Image src="/trio.png" alt="Trio Manga" width={120} height={36} className="h-8 w-auto" />
            <p className="mt-3 text-xs text-muted/50 leading-relaxed max-w-[180px]">
              India&apos;s first original manga series by Vaibhavi Studios.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">Read</h4>
            <ul className="space-y-2 text-sm text-muted/70">
              <li><TransitionLink href="/" className="hover:text-primary transition-colors">Browse Manga</TransitionLink></li>
              <li><TransitionLink href="/" className="hover:text-primary transition-colors">Latest Releases</TransitionLink></li>
              <li><a href={`${process.env.NEXT_PUBLIC_DASHBOARD_URL ?? 'http://localhost:3001'}/dashboard/upload`} className="hover:text-primary transition-colors">Upload Your Work</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">Studio</h4>
            <ul className="space-y-2 text-sm text-muted/70">
              <li><a href={`${process.env.NEXT_PUBLIC_DASHBOARD_URL ?? 'http://localhost:3001'}/dashboard`} className="hover:text-primary transition-colors">Dashboard</a></li>
              <li><a href="https://trioanime.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Trio Anime</a></li>
              <li><TransitionLink href="/careers" className="hover:text-primary transition-colors">Careers</TransitionLink></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">Connect</h4>
            <div className="flex gap-4 mb-4">
              <a href="https://www.linkedin.com/in/vaibhavi-studios-2008b0209/" target="_blank" rel="noopener noreferrer" className="text-muted/70 hover:text-primary transition-colors" aria-label="LinkedIn">
                <FontAwesomeIcon icon={faLinkedin} className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/trioanimee/" target="_blank" rel="noopener noreferrer" className="text-muted/70 hover:text-primary transition-colors" aria-label="Instagram">
                <FontAwesomeIcon icon={faInstagram} className="h-5 w-5" />
              </a>
              <a href="https://www.youtube.com/@trio.officialanimation" target="_blank" rel="noopener noreferrer" className="text-muted/70 hover:text-primary transition-colors" aria-label="YouTube">
                <FontAwesomeIcon icon={faYoutube} className="h-5 w-5" />
              </a>
            </div>
            <div className="flex gap-2 flex-wrap">
              <a href="https://apps.apple.com/in/app/trio-vaibhavi-studios/id6751782028" target="_blank" rel="noopener noreferrer">
                <img src="https://pub-936a2a79cb9b473fabc46e4ad35a3e2e.r2.dev/apple-store.webp" alt="Download on the App Store" className="h-10 w-auto" />
              </a>
              <a href="https://play.google.com/store/apps/details?id=com.vaibhavistudios.app" target="_blank" rel="noopener noreferrer">
                <img src="https://pub-936a2a79cb9b473fabc46e4ad35a3e2e.r2.dev/app-store.webp" alt="Get it on Google Play" className="h-14.5 w-auto -mt-2" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/5 pt-6 flex justify-between items-center gap-1 text-xs text-muted/50">
          <span>&copy; {new Date().getFullYear()} Vaibhavi Studios. All rights reserved.</span>
          <span>Developed by <a href="https://animhaus.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">AnimHaus</a></span>
        </div>
      </div>
    </footer>
  )
}