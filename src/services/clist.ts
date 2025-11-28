// ...existing code...
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const BASE = 'https://clist.by/api/v2/contest/'

function parseDate(s?: string) {
  if (!s) return null
  const d = new Date(s)
  return Number.isNaN(d.getTime()) ? null : d
}
function parseIntOrNull(v: any) {
  const n = Number(v)
  return Number.isNaN(n) ? null : n
}

export async function fetchAndUpsertClistContests({ upcoming = true, limit = 100 } = {}) {
  const username = process.env.CLIST_USERNAME
  const apiKey = process.env.CLIST_API_KEY
  if (!username || !apiKey) throw new Error('CLIST_USERNAME and CLIST_API_KEY required')

  const url = new URL(BASE)
  url.searchParams.set('limit', String(limit))
  if (upcoming) url.searchParams.set('upcoming', 'true')
  url.searchParams.set('username', username)
  url.searchParams.set('api_key', apiKey)

  let fetched = 0
  let upserted = 0
  let nextUrl: string | null = url.toString()

  while (nextUrl) {
    const res = await fetch(nextUrl as string)
    if (!res.ok) {
      throw new Error(`Clist fetch failed: ${res.status} ${res.statusText}`)
    }
    const body: any = await res.json()
    const objects = body?.objects || []
    fetched += objects.length

    for (const item of objects) {
      const externalId = Number(item.id)
      if (!externalId || !item.start) continue
      const name = item.event || item.name || item.title || 'Untitled'
      const href = item.href || item.url || null
      const startAt = parseDate(item.start)
      const endAt = parseDate(item.end)
      const platform = (Array.isArray(item.resource) ? (item.resource[0]?.name || item.resource[0]?.resource) : item.resource) || item.host || null
      const parsedAt = parseDate(item.parsed_at)
      const duration = parseIntOrNull(item.duration)
      const nProblems = parseIntOrNull(item.n_problems)
      const nStatistics = parseIntOrNull(item.n_statistics)
      const resourceId = parseIntOrNull(item.resource_id)

      if (!startAt) continue
      await prisma.contest.upsert({
        where: { externalId },
        update: {
          name,
          url: href,
          platform: platform || undefined,
          host: item.host || undefined,
          startAt,
          endAt,
          duration,
          nProblems,
          nStatistics,
          parsedAt,
          resourceId
        },
        create: {
          externalId,
          name,
          url: href,
          platform: platform || undefined,
          host: item.host || undefined,
          startAt,
          endAt,
          duration,
          nProblems,
          nStatistics,
          parsedAt,
          resourceId
        }
      })
      upserted++
    }

    // pagination (Clist returns meta.next)
    nextUrl = null
    const metaNext: string | undefined = body?.meta?.next
    if (metaNext) {
      // absolute link or relative; build full URL if needed
      nextUrl = metaNext.startsWith('http') ? metaNext : (new URL(metaNext, BASE)).toString()
    }
  }

  return { fetched, upserted }
}
// ...existing code...