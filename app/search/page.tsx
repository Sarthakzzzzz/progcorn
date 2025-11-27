"use client"
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { api } from '../../lib/api'
import ResourceCard, { type Resource } from '../../components/ResourceCard'
import SearchBar from '../../components/SearchBar'

export default function SearchPage() {
  const params = useSearchParams()
  const [results, setResults] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const q = params.get('q') || ''
    const tag = params.get('tag') || ''
    const category = params.get('category') || ''
    const sort = params.get('sort') || ''
    ;(async () => {
      try {
        const data = await api<{ results: Resource[] }>(`/search?query=${encodeURIComponent(q)}&tag=${encodeURIComponent(tag)}&category=${encodeURIComponent(category)}&sort=${encodeURIComponent(sort)}`)
        setResults(data.results)
      } catch (e: any) { setError(e?.message || 'Failed to search') } finally { setLoading(false) }
    })()
  }, [params])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Search</h1>
      <SearchBar />
      {loading && <div className="text-sm text-gray-500">Loading...</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div className="space-y-3">
        {results.map((r) => <ResourceCard key={r.id} resource={r} />)}
      </div>
    </div>
  )
}
