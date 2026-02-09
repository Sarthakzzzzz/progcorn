"use client"
import React, { useEffect, useState } from 'react'
import ContestCard from '../../components/ContestCard'

export default function ContestsPage() {
  const [contests, setContests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchContests = async () => {
    try {
      setLoading(true)
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'
      const res = await fetch(`${base}/contests`)
      const json = await res.json()
      setContests(json.contests || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContests()
  }, [])

  const handleRefresh = async () => {
    try {
      setLoading(true)
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'
      const token = localStorage.getItem('token')

      if (!token) {
        alert('Please login to refresh contests')
        // Even if not logged in, we might want to just re-fetch the public list
        // but the Refresh endpoint requires Auth, so we stop here or standard fetch
        // fallback to just re-fetching public data if personal refresh fails?
        // For now, let's just re-fetch public data if they cancel or aren't logged in
        await fetchContests()
        return
      }

      const res = await fetch(`${base}/contests/refresh`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      const json = await res.json()

      if (res.ok && json.ok) {
        if (json.skipped) {
          alert('Contests are already up to date (updates allowed every 5 mins)')
        } else {
          alert('Contests updated successfully')
        }
        await fetchContests()
      } else {
        alert('Failed to refresh contests: ' + (json.message || res.statusText))
      }
    } catch (err) {
      console.error('Refresh failed', err)
      alert('Error refreshing contests')
    } finally {
      setLoading(false)
    }
  }

  if (loading && contests.length === 0) return <div>Loading...</div>

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Upcoming Contests</h1>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh Now'}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contests.map(c => <ContestCard key={c.id} contest={c} />)}
      </div>
      {contests.length === 0 && !loading && <div>No contests found</div>}
    </div>
  )
}