"use client"
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { api } from '../../../lib/api'
import ResourceCard, { type Resource } from '../../../components/ResourceCard'

export default function TagPage() {
  const { tag } = useParams<{ tag: string }>()
  const [items, setItems] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        if (!tag) return
        const data = await api<{ tag: any; resources: Resource[] }>(`/tags/${tag}`)
        setItems(data.resources)
      } catch (e: any) { setError(e?.message || 'Failed to load') } finally { setLoading(false) }
    })()
  }, [tag])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">#{tag}</h1>
      {loading && <div className="text-sm text-slate-500">Loading...</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div className="space-y-3">
        {items.map((r) => <ResourceCard key={r.id} resource={r} />)}
      </div>
    </div>
  )
}
