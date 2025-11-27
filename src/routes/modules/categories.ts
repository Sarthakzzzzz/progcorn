import { Router } from 'express'
import { prisma } from '../../services/db'

const router = Router()

router.get('/', async (_req, res) => {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })
  res.json({ categories })
})

router.get('/:name', async (req, res) => {
  const category = await prisma.category.findFirst({ where: { slug: req.params.name } })
  if (!category) return res.status(404).json({ error: 'Not found' })
  const resources = await prisma.resource.findMany({ where: { deletedAt: null, status: 'APPROVED', categoryId: category.id }, include: { category: true, tags: { include: { tag: true } }, _count: { select: { upvotes: true, comments: true } } }, orderBy: { createdAt: 'desc' } })
  res.json({ category, resources })
})

export default router
