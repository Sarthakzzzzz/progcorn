"use client"
import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SearchBar() {
  const params = useSearchParams()
  const router = useRouter()
  const [q, setQ] = useState(params.get('q') || '')

  useEffect(() => {
    setQ(params.get('q') || '')
  }, [params])

  const debouncedPush = useMemo(() => {
    let t: any
    return (value: string) => {
      clearTimeout(t)
      t = setTimeout(() => {
        const search = new URLSearchParams(params.toString())
        if (value) search.set('q', value); else search.delete('q')
        router.push(`/search?${search.toString()}`)
      }, 350)
    }
  }, [params, router])

  return (
    <div className="mb-4">
      <input
        placeholder="Search resources..."
        className="w-full rounded border px-3 py-2 text-sm"
        value={q}
        onChange={(e) => { setQ(e.target.value); debouncedPush(e.target.value) }}
      />
    </div>
  )
}
