"use client"
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { api } from '../lib/api'
import { useAuth } from '../lib/auth'

type Tag = { id: string; name: string; slug: string }
export type Resource = {
  id: string
  title: string
  url: string
  description: string
  imageUrl?: string | null
  category: { id: string; name: string; slug: string }
  tags: { tag: Tag }[]
  _count?: { upvotes: number; comments: number }
}

export default function ResourceCard({ resource }: { resource: Resource }) {
  const { user } = useAuth()
  const [count, setCount] = useState(resource._count?.upvotes || 0)
  const [loading, setLoading] = useState(false)
  const [upvoted, setUpvoted] = useState(false)

  const upvote = async () => {
    if (!user) return (window.location.href = '/login')
    if (loading) return
    setLoading(true)
    // optimistic update
    const prev = { count, upvoted }
    const nextUp = !upvoted
    setUpvoted(nextUp)
    setCount((c) => c + (nextUp ? 1 : -1))
    try {
      const res = await api<{ upvoted: boolean; count: number }>(`/resources/${resource.id}/upvote`, { method: 'POST', auth: true })
      setUpvoted(res.upvoted)
      setCount(res.count)
    } catch (e) {
      // rollback on network/API error
      setUpvoted(prev.upvoted)
      setCount(prev.count)
      console.error(e)
    } finally { setLoading(false) }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 flex gap-4">
      <div className="flex flex-col items-center">
        <button onClick={upvote} disabled={loading} className={`rounded-md border border-slate-300 bg-white px-2 py-1 text-xs hover:bg-slate-50 ${upvoted ? 'text-orange-600' : ''}`}>▲</button>
        <span className="text-sm mt-1 text-slate-700">{count}</span>
      </div>
      <div className="flex-1">
        <a href={resource.url} target="_blank" rel="noreferrer" className="text-base md:text-lg font-semibold hover:underline">{resource.title}</a>
        <div className="mt-0.5 text-xs text-slate-500">in <Link href={`/categories/${resource.category.slug}`} className="underline">{resource.category.name}</Link></div>
        <p className="mt-2 text-sm text-slate-800">{resource.description}</p>
        {resource.imageUrl && (
          <div className="mt-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={resource.imageUrl} alt="thumbnail" className="max-h-44 rounded border border-slate-200" />
          </div>
        )}
        <div className="mt-2 flex flex-wrap gap-2">
          {resource.tags?.map((t) => (
            <Link key={t.tag.id} href={`/tags/${t.tag.slug}`} className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-xs">#{t.tag.name}</Link>
          ))}
        </div>
        <div className="mt-2 text-xs text-slate-600">
          <Link href={`/resources/${resource.id}`} className="underline">{resource._count?.comments || 0} comments</Link>
        </div>
      </div>
    </div>
  )
}
