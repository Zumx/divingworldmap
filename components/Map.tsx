'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { site } from '@/lib/site'
import type { PoiFeature } from '@/lib/data'

interface MapProps {
  features: PoiFeature[]
  onSelect: (f: PoiFeature) => void
  /** Pan/zoom + pulse target set after a search-result pick. */
  focus: { lat: number; lng: number; zoom?: number } | null
}

const M = site.marker

function poiIcon() {
  return L.divIcon({
    className: '',
    html: `<div style="position:relative;width:16px;height:16px;cursor:pointer;">
      <div style="position:absolute;inset:0;background:${M.dot};opacity:0.35;border-radius:50%;filter:blur(3px);"></div>
      <div style="position:absolute;inset:3px;background:${M.dot};border:2px solid ${M.ring};border-radius:50%;box-shadow:0 1px 3px rgba(8,30,45,0.4);"></div>
    </div>`,
    iconSize: [16, 16], iconAnchor: [8, 8],
  })
}

function clusterIcon(cluster: { getChildCount: () => number }) {
  const n = cluster.getChildCount()
  let size = 34
  let bg = M.cluster1
  if (n >= 100) { size = 52; bg = M.cluster3 }
  else if (n >= 20) { size = 42; bg = M.cluster2 }
  return L.divIcon({
    className: '',
    html: `<div style="width:${size}px;height:${size}px;background:${bg};border:2px solid ${M.ring};border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-family:var(--font-sans);font-size:${size >= 42 ? 14 : 12}px;font-weight:700;box-shadow:0 0 10px ${bg};">${n}</div>`,
    iconSize: [size, size], iconAnchor: [size / 2, size / 2],
  })
}

export default function MapView({ features, onSelect, focus }: MapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const clusterRef = useRef<L.LayerGroup | null>(null)
  const onSelectRef = useRef(onSelect)
  useEffect(() => { onSelectRef.current = onSelect }, [onSelect])

  // One-time map init.
  useEffect(() => {
    if (mapRef.current) return
    const map = L.map('map-container', {
      center: [30, 10], zoom: 3, zoomControl: false,
      worldCopyJump: true, preferCanvas: true,
    })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19, attribution: '© OpenStreetMap contributors',
    }).addTo(map)
    L.control.zoom({ position: 'bottomright' }).addTo(map)
    mapRef.current = map
    return () => { map.remove(); mapRef.current = null }
  }, [])

  // (Re)build the clustered marker layer when the feature set changes.
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (clusterRef.current) { map.removeLayer(clusterRef.current); clusterRef.current = null }

    const cluster = (L as unknown as {
      markerClusterGroup: (o: object) => L.LayerGroup
    }).markerClusterGroup({
      chunkedLoading: true,
      showCoverageOnHover: false,
      maxClusterRadius: 60,
      disableClusteringAtZoom: 11,
      spiderfyOnMaxZoom: true,
      zoomToBoundsOnClick: true,
      iconCreateFunction: clusterIcon,
    })

    for (const f of features) {
      const [lng, lat] = f.geometry.coordinates
      if (typeof lat !== 'number' || typeof lng !== 'number') continue
      const m = L.marker([lat, lng], { icon: poiIcon() })
      m.bindTooltip(f.properties.name, { className: 'wm-tooltip', direction: 'top' })
      m.on('click', () => onSelectRef.current(f))
      cluster.addLayer(m)
    }
    cluster.addTo(map)
    clusterRef.current = cluster
  }, [features])

  // Search-result focus: fly there and flash a pulse ring.
  const pulseRef = useRef<L.Marker | null>(null)
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (pulseRef.current) { map.removeLayer(pulseRef.current); pulseRef.current = null }
    if (!focus) return
    map.flyTo([focus.lat, focus.lng], focus.zoom ?? 11, { duration: 1.2 })
    const ring = L.divIcon({
      className: '',
      html: `<div class="wm-search-pulse"><span></span><span></span></div>`,
      iconSize: [40, 40], iconAnchor: [20, 20],
    })
    const mk = L.marker([focus.lat, focus.lng], { icon: ring, interactive: false, keyboard: false, zIndexOffset: 800 })
    mk.addTo(map)
    pulseRef.current = mk
    const t = setTimeout(() => { if (pulseRef.current) { map.removeLayer(pulseRef.current); pulseRef.current = null } }, 4500)
    return () => clearTimeout(t)
  }, [focus])

  return <div id="map-container" style={{ width: '100%', height: '100%' }} />
}
