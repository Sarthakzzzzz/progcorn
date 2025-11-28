"use client"
import React, { useEffect, useState } from 'react'
import PlatformCard from '../../components/PlatformCard'

type SortField = 'name' | 'contests' | 'accounts'
type SortOrder = 'asc' | 'desc'

export default function PlatformsPage() {
  const [platforms, setPlatforms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState<SortField>('contests') // default
  const [order, setOrder] = useState<SortOrder>('desc')

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'
        const res = await fetch(`${base}/platforms?sort=${encodeURIComponent(sort)}&order=${encodeURIComponent(order)}`)
        const json = await res.json()
        setPlatforms(json.platforms || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    })()
  }, [sort, order])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Platforms</h1>
        <div className="flex gap-2 items-center">
          <select value={sort} onChange={(e) => setSort(e.target.value as SortField)} className="rounded border px-2 py-1 text-sm">
            <option value="contests">Contests</option>
            <option value="accounts">Accounts</option>
            <option value="name">Name</option>
          </select>
          <button onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')} className="rounded border px-2 py-1 text-sm">
            {order === 'asc' ? 'Asc' : 'Desc'}
          </button>
        </div>
      </div>

      {loading ? <div>Loading...</div> : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {platforms.map((p) => <PlatformCard key={p.id} platform={p} />)}
          </div>
          {platforms.length === 0 && <div>No platforms found</div>}
        </>
      )}
    </div>
  )
}