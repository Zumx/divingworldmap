'use client'

import type { PoiFeature } from '@/lib/data'

export default function InfoPanel({ feature, onClose }: { feature: PoiFeature | null; onClose: () => void }) {
  if (!feature) return null
  const p = feature.properties
  const place = [p.locality, p.region, p.country].filter(Boolean).join(', ')

  return (
    <div
      className="wm-info-panel"
      style={{
        position: 'absolute', bottom: 24, right: 24, width: 300, zIndex: 1000,
        borderRadius: 12, padding: '1.25rem',
        background: 'var(--c-panel)', border: '1px solid var(--c-line)',
        backdropFilter: 'blur(16px)', boxShadow: '0 12px 32px -10px rgba(8,30,45,0.35)',
      }}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        style={{ position: 'absolute', top: 10, right: 14, fontSize: 20, lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-mute)' }}
      >
        ×
      </button>
      <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--c-mute)', marginBottom: 4 }}>
        {p.badge}
      </div>
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--c-primary)', marginBottom: 8, fontWeight: 600 }}>
        {p.name}
      </h2>
      {place && (
        <div style={{ fontSize: '0.85rem', color: 'var(--c-warm)', marginBottom: 10 }}>
          📍 {place}
        </div>
      )}
      <div style={{ fontSize: '0.9rem', color: 'var(--c-ink)', marginBottom: p.tags.length ? 12 : 14 }}>
        {p.stat}
      </div>
      {p.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          {p.tags.map(t => (
            <span key={t} style={{ fontSize: '0.72rem', padding: '2px 9px', borderRadius: 999, background: 'var(--c-chip-bg)', border: '1px solid var(--c-chip-border)', color: 'var(--c-warm)' }}>
              {t}
            </span>
          ))}
        </div>
      )}
      {p.website && (
        <a
          href={p.website}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-block', fontSize: '0.82rem', padding: '0.5rem 0.9rem', borderRadius: 8, background: 'var(--c-primary)', color: 'var(--c-accent)', textDecoration: 'none', fontWeight: 500 }}
        >
          Visit website ↗
        </a>
      )}
    </div>
  )
}
