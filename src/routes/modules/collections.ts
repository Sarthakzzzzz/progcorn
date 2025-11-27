import { Router } from 'express'
import { prisma } from '../../services/db'
import { requireAuth } from '../../middleware/auth'
import { z } from 'zod'

const router = Router()

router.get('/', requireAuth, async (req: any, res) => {
  const collections = await prisma.collection.findMany({ where: { userId: req.user.id }, include: { items: true } })
  res.json({ collections })
})

router.post('/', requireAuth, async (req: any, res, next) => {
  try {
    const schema = z.object({ name: z.string().min(1), description: z.string().optional() })
    const data = schema.parse(req.body)
    const created = await prisma.collection.create({ data: { name: data.name, description: data.description, userId: req.user.id } })
    res.status(201).json({ collection: created })
  } catch (e) { next(e) }
})

router.get('/:id', requireAuth, async (req: any, res) => {
  const collection = await prisma.collection.findFirst({ where: { id: req.params.id, userId: req.user.id }, include: { items: { include: { resource: true } } } })
  if (!collection) return res.status(404).json({ error: 'Not found' })
  res.json({ collection })
})

router.post('/:id/add/:resourceId', requireAuth, async (req: any, res) => {
  await prisma.collectionItem.create({ data: { collectionId: req.params.id, resourceId: req.params.resourceId } })
  res.status(201).json({ ok: true })
})

export default router
