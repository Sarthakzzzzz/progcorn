import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { fetchAndUpsertClistContests } from '../../services/clist'
import { requireAuth } from '../../middleware/auth'

const prisma = new PrismaClient()
const router = Router()

router.get('/', async (_req, res, next) => {
  try {
    const upcoming = await prisma.contest.findMany({
      where: { endAt: { gt: new Date() } },
      orderBy: { startAt: 'asc' }
    })
    res.json({ contests: upcoming })
  } catch (e) { next(e) }
})


// Variable to track the last refresh timestamp in memory (simple rate limiting)
let lastRefreshTime = 0
const REFRESH_COOLDOWN_MS = 5 * 60 * 1000 // 5 minutes

router.post('/refresh', requireAuth, async (_req, res, next) => {
  try {
    const now = Date.now()
    if (now - lastRefreshTime < REFRESH_COOLDOWN_MS) {
      // Too soon, return cached/current data without hitting external API
      return res.json({ ok: true, skipped: true, message: 'Refresh cooldown active' })
    }

    lastRefreshTime = now
    const result = await fetchAndUpsertClistContests({ upcoming: true, limit: 200 })
    res.json({ ok: true, ...result })
  } catch (e) { next(e) }
})

export default router
