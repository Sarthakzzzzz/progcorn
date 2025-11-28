import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const BASE = 'https://clist.by/api/v2/resource/'

function parseIntOrNull(v: any) {
  const n = Number(v)
  return Number.isNaN(n) ? null : n
}

export async function fetchAndUpsertClistResources({ limit = 100 } = {}) {
  const username = process.env.CLIST_USERNAME
  const apiKey = process.env.CLIST_API_KEY
  if (!username || !apiKey) throw new Error('CLIST_USERNAME and CLIST_API_KEY required')

  const url = new URL(BASE)
  url.searchParams.set('limit', String(limit))
  url.searchParams.set('username', username)
  url.searchParams.set('api_key', apiKey)

  let nextUrl: string | null = url.toString()
  let fetched = 0
  let upserted = 0
  while (nextUrl) {
    const res = await fetch(nextUrl as string)
    if (!res.ok) throw new Error(`Clist resource fetch failed: ${res.status} ${res.statusText}`)
    const body: any = await res.json()
    const objects = body?.objects || []
    fetched += objects.length

    for (const item of objects) {
      const externalId = Number(item.id)
      if (!externalId) continue
      const name = item.name || item.title || 'Unknown'
      const short = item.short || null
      const nAccounts = parseIntOrNull(item.n_accounts)
      const nContests = parseIntOrNull(item.n_contests)
      let icon: string | null = item.icon || null
      if (icon && icon.startsWith('/')) icon = `https://clist.by${icon}`

      await prisma.platform.upsert({
        where: { externalId },
        create: { externalId, name, short, nAccounts, nContests, icon },
        update: { name, short, nAccounts, nContests, icon }
      })
      upserted++
    }

    nextUrl = null
    const metaNext: string | undefined = body?.meta?.next
    if (metaNext) {
      nextUrl = metaNext.startsWith('http') ? metaNext : new URL(metaNext, BASE).toString()
    }
  }
  return { fetched, upserted }
}