'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { site } from '@/lib/site'
import type { PoiFeature, PoiCollection } from '@/lib/data'
import InfoPanel from '@/components/InfoPanel'

// Leaflet touches `window` at import time — keep it off the server.
const MapView = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-accent)', background: 'var(--c-primary-deep)', fontFamily: 'var(--font-serif)' }}>
      Loading map…
    </div>
  ),
})

export default function MapPageClient() {
  const searchParams = useSearchParams()
  const countryParam = searchParams.get('country')

  const [all, setAll] = useState<PoiFeature[]>([])
  const [loaded, setLoaded] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<PoiFeature | null>(null)
  const [focus, setFocus] = useState<{ lat: number; lng: number; zoom?: number } | null>(null)
  const focusedCountryRef = useRef<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/data/points.geojson')
      .then(r => r.json())
      .then((fc: PoiCollection) => {
        if (cancelled) return
        setAll(fc.features)
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
    return () => { cancelled = true }
  }, [])

  // Optional country filter via /map?country=Name (from the home page).
  const features = useMemo(() => {
    if (!countryParam) return all
    return all.filter(f => f.properties.country === countryParam)
  }, [all, countryParam])

  // When arriving with a country filter, fit to that country's centroid once.
  useEffect(() => {
    if (!countryParam || features.length === 0) return
    if (focusedCountryRef.current === countryParam) return
    focusedCountryRef.current = countryParam
    let sx = 0, sy = 0
    for (const f of features) { sx += f.geometry.coordinates[0]; sy += f.geometry.coordinates[1] }
    setFocus({ lng: sx / features.length, lat: sy / features.length, zoom: 5 })
  }, [countryParam, features])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 2) return []
    const out: PoiFeature[] = []
    for (const f of all) {
      if (f.properties.name.toLowerCase().includes(q)) {
        out.push(f)
        if (out.length >= 12) break
      }
    }
    return out
  }, [query, all])

  const pick = useCallback((f: PoiFeature) => {
    setSelected(f)
    setQuery('')
    setFocus({ lng: f.geometry.coordinates[0], lat: f.geometry.coordinates[1], zoom: 12 })
  }, [])

  return (
    <main style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Floating control bar */}
      <div style={{ position: 'absolute', top: 14, left: 14, zIndex: 1001, display: 'flex', flexDirection: 'column', gap: 8, width: 320, maxWidth: 'calc(100vw - 28px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--c-chrome)', border: '1px solid var(--c-chrome-border)', borderRadius: 8, padding: '0.55rem 0.8rem', backdropFilter: 'blur(8px)' }}>
          <Link href="/" style={{ color: 'var(--c-accent)', textDecoration: 'none', fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '0.95rem', whiteSpace: 'nowrap' }}>
            {site.emoji} {site.shortName}
          </Link>
        </div>
        <div style={{ position: 'relative' }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={`Search ${site.itemPlural}…`}
            style={{
              width: '100%', padding: '0.6rem 0.85rem', borderRadius: 8,
              border: '1px solid var(--c-chrome-border)', background: 'var(--c-chrome)',
              color: 'var(--c-chrome-ink)', fontFamily: 'var(--font-sans)', fontSize: '0.9rem',
              outline: 'none', backdropFilter: 'blur(8px)',
            }}
          />
          {results.length > 0 && (
            <ul style={{ listStyle: 'none', margin: '6px 0 0', padding: 4, position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--c-chrome)', border: '1px solid var(--c-chrome-border)', borderRadius: 8, maxHeight: 320, overflowY: 'auto', backdropFilter: 'blur(8px)' }}>
              {results.map(f => (
                <li key={f.properties.id}>
                  <button
                    onClick={() => pick(f)}
                    style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', color: 'var(--c-chrome-ink)', padding: '0.5rem 0.6rem', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '0.86rem', borderRadius: 6 }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--c-chip-bg)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                  >
                    <div style={{ fontWeight: 600 }}>{f.properties.name}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--c-chrome-mute)' }}>
                      {[f.properties.locality, f.properties.country].filter(Boolean).join(', ')}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {countryParam && (
          <Link href="/map" style={{ background: 'var(--c-chrome)', border: '1px solid var(--c-chrome-border)', borderRadius: 8, padding: '0.4rem 0.7rem', color: 'var(--c-accent)', textDecoration: 'none', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', backdropFilter: 'blur(8px)' }}>
            ← {countryParam} · show all {site.itemPlural}
          </Link>
        )}
      </div>

      {/* Count badge */}
      <div style={{ position: 'absolute', bottom: 16, left: 16, zIndex: 1001, background: 'var(--c-chrome)', border: '1px solid var(--c-chrome-border)', borderRadius: 6, padding: '5px 11px', color: 'var(--c-chrome-ink)', fontFamily: 'var(--font-sans)', fontSize: 11, backdropFilter: 'blur(6px)' }}>
        {loaded
          ? `${features.length.toLocaleString('en-US')} ${site.itemPlural}${countryParam ? ` in ${countryParam}` : ' worldwide'}`
          : 'Loading…'}
      </div>

      <MapView features={features} onSelect={setSelected} focus={focus} />
      <InfoPanel feature={selected} onClose={() => setSelected(null)} />
    </main>
  )
}
