// Single source of per-site variation. See skiworldmap for the template.
// DIVING: deep-ocean teal.

export interface SiteConfig {
  key: string
  name: string
  shortName: string
  emoji: string
  url: string
  tagline: string
  heroKicker: string
  heroTitleA: string
  heroTitleEm: string
  heroSub: (count: string, countries: string) => string
  metaTitle: string
  metaDescription: string
  mapTitle: string
  mapDescription: string
  itemSingular: string
  itemPlural: string
  dataCredit: string
  dataCreditUrl: string
  marker: { dot: string; ring: string; cluster1: string; cluster2: string; cluster3: string; pulse: string }
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://divingworldmap.vercel.app')

export const site: SiteConfig = {
  key: 'diving',
  name: 'Diving World Map',
  shortName: 'Diving World Map',
  emoji: '🤿',
  url: SITE_URL,
  tagline: 'Every dive site on Earth, on one map',
  heroKicker: 'The underwater world, mapped',
  heroTitleA: 'Every reef, wreck and dive centre,',
  heroTitleEm: 'one map.',
  heroSub: (count, countries) =>
    `Browse ${count} dive sites and dive centres across ${countries} countries — coral walls, wrecks, cenotes and quarry lakes. Pan the globe, search a site, plan your next descent.`,
  metaTitle: 'Diving World Map — Interactive Map of Dive Sites Worldwide',
  metaDescription:
    'Explore dive sites and dive centres worldwide on one interactive map. Search by name, see depth and location, and plan your next dive.',
  mapTitle: 'Interactive Diving Map — Every Dive Site Worldwide | Diving World Map',
  mapDescription:
    'Pan and zoom a world map of dive sites and dive centres. Click any marker for depth, location and website.',
  itemSingular: 'dive site',
  itemPlural: 'dive sites',
  dataCredit: 'OpenStreetMap contributors',
  dataCreditUrl: 'https://www.openstreetmap.org/copyright',
  marker: {
    dot: '#1191a4',
    ring: '#e0f7fa',
    cluster1: 'rgba(0,180,198,0.85)',
    cluster2: 'rgba(17,145,164,0.9)',
    cluster3: 'rgba(4,39,51,0.92)',
    pulse: '#00b4c6',
  },
}
