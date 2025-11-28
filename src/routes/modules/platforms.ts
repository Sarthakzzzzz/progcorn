import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { fetchAndUpsertClistResources } from '../../services/clist-resources'
import { requireAuth, requireAdmin } from '../../middleware/auth'

const prisma = new PrismaClient()
const router = Router()

router.get('/', async (req, res, next) => {
  try {
    // parse query string
    const sortParam = String(req.query.sort || 'name').toLowerCase()
    const orderParam = String(req.query.order || 'desc').toLowerCase()
    const order = orderParam === 'asc' ? 'asc' : 'desc' // safe fallback

    // map public query names to Prisma fields
    const allowed: Record<string, string> = {
      contests: 'nContests',
      accounts: 'nAccounts',
      name: 'name'
    }
    const orderByField = (allowed[sortParam] ?? 'name')

    // build orderBy object for Prisma
    const orderBy: any = {}
    orderBy[orderByField] = order

    const platforms = await prisma.platform.findMany({
      orderBy: orderBy
    })

    res.json({ platforms })
  } catch (e) { next(e) }
})

export default router
