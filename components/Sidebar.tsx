"use client"
import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import Link from 'next/link'
import { Card, CardBody, CardHeader } from './ui/Card'

type PopularTag = { id: string; name: string; slug: string; count: number }
type Category = { id: string; name: string; slug: string; count: number }
type Author = { id: string; username: string; count: number }

type SidebarData = {
  popularTags: PopularTag[]
  categories: Category[]
  topAuthors: Author[]
  announcements: { id: string; title: string; url: string }[]
}

export default function Sidebar() {
  const [data, setData] = useState<SidebarData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await api<SidebarData>(`/stats/sidebar`)
        setData(res)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return (
    <div className="space-y-4">
      <Card><CardHeader>Announcements</CardHeader><CardBody><div className="text-sm text-slate-500">Loading...</div></CardBody></Card>
      <Card><CardHeader>Categories</CardHeader><CardBody><div className="text-sm text-slate-500">Loading...</div></CardBody></Card>
      <Card><CardHeader>Popular Tags</CardHeader><CardBody><div className="text-sm text-slate-500">Loading...</div></CardBody></Card>
      <Card><CardHeader>Top Contributors</CardHeader><CardBody><div className="text-sm text-slate-500">Loading...</div></CardBody></Card>
    </div>
  )

  if (!data) return null

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><div className="font-semibold">Announcements</div></CardHeader>
        <CardBody>
          <ul className="space-y-2 text-sm">
            {data.announcements.map(a => (
              <li key={a.id}><Link className="underline" href={a.url}>{a.title}</Link></li>
            ))}
          </ul>
        </CardBody>
      </Card>

      <Card>
        <CardHeader><div className="font-semibold">Categories</div></CardHeader>
        <CardBody>
          <ul className="space-y-2 text-sm">
            {data.categories.map(c => (
              <li key={c.id} className="flex items-center justify-between">
                <Link className="underline" href={`/categories/${c.slug}`}>{c.name}</Link>
                <span className="text-xs text-slate-500">{c.count}</span>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      <Card>
        <CardHeader><div className="font-semibold">Popular Tags</div></CardHeader>
        <CardBody>
          <div className="flex flex-wrap gap-2">
            {data.popularTags.map(t => (
              <Link key={t.id} href={`/tags/${t.slug}`} className="rounded-full border px-2 py-0.5 text-xs">#{t.name}</Link>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader><div className="font-semibold">Top Contributors</div></CardHeader>
        <CardBody>
          <ul className="space-y-2 text-sm">
            {data.topAuthors.map(u => (
              <li key={u.id} className="flex items-center justify-between">
                <Link className="underline" href={`/profile/${u.username}`}>@{u.username}</Link>
                <span className="text-xs text-slate-500">{u.count}</span>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </div>
  )
}
