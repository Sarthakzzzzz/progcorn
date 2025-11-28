// components/PlatfromCard.tsx (update)
"use client"
import React from 'react'

export default function PlatformCard({ platform }: { platform: any }) {
  const initials = (platform.name || "")
    .split(' ')
    .map((w: string) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="rounded border p-3">
      <div className="flex items-center gap-3">
        {/* Remove <img> and show initials */}
        <div className="h-8 w-8 rounded bg-slate-200 flex items-center justify-center text-sm font-semibold">
          {initials}
        </div>
        <div>
          <div className="font-semibold">{platform.name}</div>
          <div className="text-xs text-muted-foreground">{platform.short}</div>
        </div>
      </div>
      <div className="mt-2 text-xs">Contests: {platform.nContests ?? '-'}</div>
      <div className="text-xs">Accounts: {platform.nAccounts ?? '-'}</div>
    </div>
  )
}