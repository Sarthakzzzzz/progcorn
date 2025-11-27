"use client"
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { api } from '../../../lib/api'
import CommentSection from '../../../components/CommentSection'

export default function ResourceDetailPage() {
  const params = useParams<{ id: string }>()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const id = params?.id

  useEffect(() => {
    ;(async () => {
      try {
        if (!id) return
        const r = await api<{ resource: any }>(`/resources/${id}`)
        setData(r.resource)
      } catch (e: any) { setError(e?.message || 'Failed to load') } finally { setLoading(false) }
    })()
  }, [id])

  const report = async () => {
    const reason = prompt('Reason for report?') || ''
    if (!reason) return
    try {
      await api(`/resources/${id}/report`, { method: 'POST', body: JSON.stringify({ reason }), auth: true })
      alert('Reported')
    } catch (e: any) { alert(e?.message || 'Failed to report') }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-600">{error}</div>
  if (!data) return <div>Not found</div>

  return (
    <div>
      <h1 className="text-2xl font-bold">{data.title}</h1>
      <a href={data.url} target="_blank" className="text-sm underline" rel="noreferrer">{data.url}</a>
      <p className="mt-3 text-sm">{data.description}</p>
      <div className="mt-3">
        <button onClick={report} className="rounded border px-3 py-1 text-xs">Report</button>
      </div>
      <CommentSection resourceId={id!} />
    </div>
  )
}
