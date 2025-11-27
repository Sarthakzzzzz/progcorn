"use client"
import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import ResourceCard, { type Resource } from './ResourceCard'

export default function Section({ title, endpoint }: { title: string; endpoint: string }) {
  const [items, setItems] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const data = await api<any>(endpoint)
        const resources: Resource[] = data.resources || data.results || []
        setItems(resources)
      } catch (e: any) { setError(e?.message || 'Failed to load') } finally { setLoading(false) }
    })()
  }, [endpoint])

  return (
    <section>
      <div className="mb-2 flex items-end justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      {loading && <div className="text-sm text-gray-500">Loading...</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div className="space-y-3">
        {items.map((r) => <ResourceCard key={r.id} resource={r} />)}
      </div>
    </section>
  )
}
