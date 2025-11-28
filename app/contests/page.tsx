// ...existing code...
"use client"
import React, { useEffect, useState } from 'react'
import ContestCard from '../../components/ContestCard'

export default function ContestsPage() {
  const [contests, setContests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'
        const res = await fetch(`${base}/contests`)
        const json = await res.json()
        setContests(json.contests || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Upcoming Contests</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contests.map(c => <ContestCard key={c.id} contest={c} />)}
      </div>
      {contests.length === 0 && <div>No contests found</div>}
    </div>
  )
}
// ...existing code...