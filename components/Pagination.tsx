"use client"
import { useRouter, useSearchParams } from 'next/navigation'

export default function Pagination({ page, hasMore }: { page: number; hasMore: boolean }) {
  const router = useRouter()
  const params = useSearchParams()
  const move = (delta: number) => {
    const q = new URLSearchParams(params.toString())
    const next = Math.max(1, page + delta)
    q.set('page', String(next))
    router.push(`?${q.toString()}`)
  }
  return (
    <div className="mt-4 flex items-center gap-2">
      <button onClick={() => move(-1)} disabled={page <= 1} className="rounded border px-2 py-1 text-xs">Prev</button>
      <span className="text-xs">Page {page}</span>
      <button onClick={() => move(1)} disabled={!hasMore} className="rounded border px-2 py-1 text-xs">Next</button>
    </div>
  )
}
