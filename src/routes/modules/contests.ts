import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { fetchAndUpsertClistContests } from '../../services/clist'
import { requireAuth, requireAdmin } from '../../middleware/auth'

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

router.post('/refresh', requireAuth, requireAdmin, async (_req: any, res, next) => {
  try {
    const result = await fetchAndUpsertClistContests({ upcoming: true, limit: 200 })
    res.json({ ok: true, ...result })
  } catch (e) { next(e) }
})

export default router
