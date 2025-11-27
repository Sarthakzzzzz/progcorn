"use client"
import { useEffect, useState } from 'react'
import { api } from '../../lib/api'

type Resource = {
  id: string
  title: string
  url: string
  description: string
  author: { id: string; username: string }
  category: { id: string; name: string }
  tags: { tag: { id: string; name: string } }[]
  createdAt: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
}

export default function AdminPage() {
  const [tab, setTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING')
  const [items, setItems] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api<{ resources: Resource[] }>(`/admin/resources?status=${tab}`, { auth: true })
      setItems(data.resources)
    } catch (e: any) { setError(e?.message || 'Failed to load') } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [tab])

  const act = async (id: string, action: 'approve' | 'reject') => {
    await api(`/admin/resource/${id}/${action}`, { method: 'POST', auth: true })
    await load()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="mb-4 flex gap-2">
        {(['PENDING','APPROVED','REJECTED'] as const).map(s => (
          <button key={s} onClick={() => setTab(s)} className={`rounded border px-3 py-1 text-sm ${tab===s?'bg-black text-white':''}`}>{s}</button>
        ))}
      </div>
      {loading && <div className="text-sm text-gray-500">Loading...</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div className="space-y-3">
        {items.map(r => (
          <div key={r.id} className="rounded border p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-semibold">{r.title}</div>
                <a href={r.url} target="_blank" className="text-xs underline" rel="noreferrer">{r.url}</a>
                <div className="text-xs text-gray-600">by @{r.author.username} • {r.category.name}</div>
                <p className="mt-2 text-sm max-w-3xl">{r.description}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {r.tags.map(t => <span key={t.tag.id} className="rounded bg-gray-100 px-2 py-0.5 text-xs">#{t.tag.name}</span>)}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {r.status === 'PENDING' && (
                  <>
                    <button onClick={() => act(r.id, 'approve')} className="rounded bg-green-600 text-white px-3 py-1 text-xs">Approve</button>
                    <button onClick={() => act(r.id, 'reject')} className="rounded bg-red-600 text-white px-3 py-1 text-xs">Reject</button>
                  </>
                )}
                {r.status !== 'PENDING' && <span className="text-xs">Status: {r.status}</span>}
              </div>
            </div>
          </div>
        ))}
        {!loading && items.length === 0 && <div className="text-sm text-gray-500">No items.</div>}
      </div>
    </div>
  )
}
