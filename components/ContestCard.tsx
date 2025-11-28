"use client"
import React from 'react'


export default function ContestCard({ contest }: { contest: any }) {
  return (
    <div className="rounded border p-3">
      <div className="font-semibold">{contest.name}</div>
      <div className="text-xs text-muted-foreground">
        {new Date(contest.startAt).toLocaleString()} — {contest.endAt ? new Date(contest.endAt).toLocaleString() : 'TBA'}
      </div>
      {contest.platform && <div className="text-xs mt-1">Platform: {contest.platform}</div>}
      {contest.url && <a className="text-sm underline block mt-2" href={contest.url} target="_blank" rel="noreferrer">Open contest</a>}
    </div>
  )
}
