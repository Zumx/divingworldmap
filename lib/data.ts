// Shared point schema across all three world-map sites. The static
// GeoJSON in public/data/points.geojson is fetched client-side by the
// map (kept out of the JS bundle — it's ~2 MB) and read server-side for
// home-page counts.

export interface PoiProperties {
  id: string
  name: string
  country: string | null
  countryCode: string | null
  region: string | null
  locality: string | null
  website: string | null
  /** Short type label, e.g. "Ski area" / "Golf course" / "Dive site". */
  badge: string
  /** One-line human stat, e.g. "42 km of runs" / "18 holes". */
  stat: string
  /** Free-form attribute chips. */
  tags: string[]
}

export interface PoiFeature {
  type: 'Feature'
  geometry: { type: 'Point'; coordinates: [number, number] }
  properties: PoiProperties
}

export interface PoiCollection {
  type: 'FeatureCollection'
  features: PoiFeature[]
}

import { promises as fs } from 'fs'
import path from 'path'

let _cache: PoiCollection | null = null

// Server-side read — used by the home page for the headline counts.
// Cached in module scope so repeat renders don't re-parse 2 MB.
export async function loadPoints(): Promise<PoiCollection> {
  if (_cache) return _cache
  const file = path.join(process.cwd(), 'public', 'data', 'points.geojson')
  const raw = await fs.readFile(file, 'utf8')
  _cache = JSON.parse(raw) as PoiCollection
  return _cache
}

export async function getStats() {
  const { features } = await loadPoints()
  const countries = new Set<string>()
  for (const f of features) {
    if (f.properties.country) countries.add(f.properties.country)
  }
  return { total: features.length, countries: countries.size }
}
