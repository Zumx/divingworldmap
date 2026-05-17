import Link from 'next/link'
import { site } from '@/lib/site'

export default function SiteNav() {
  return (
    <nav
      style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'var(--c-primary)',
        borderBottom: '2px solid var(--c-accent)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.8rem 1.5rem',
      }}
    >
      <Link
        href="/"
        style={{
          fontFamily: 'var(--font-serif)', color: 'var(--c-accent)',
          fontSize: '1.2rem', fontWeight: 600, textDecoration: 'none',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
        }}
      >
        <span>{site.emoji}</span>
        <span>{site.name}</span>
      </Link>
      <div style={{ display: 'flex', gap: '1.4rem', fontFamily: 'var(--font-sans)', fontSize: '0.92rem' }}>
        <Link href="/" style={{ color: 'rgba(255,255,255,0.82)', textDecoration: 'none' }}>Home</Link>
        <Link href="/map" style={{ color: 'rgba(255,255,255,0.82)', textDecoration: 'none' }}>Open map</Link>
        <Link href="/blog" style={{ color: 'rgba(255,255,255,0.82)', textDecoration: 'none' }}>Blog</Link>
      </div>
    </nav>
  )
}
