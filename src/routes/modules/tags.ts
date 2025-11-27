import { Router } from 'express'
import { prisma } from '../../services/db'

const router = Router()

router.get('/', async (_req, res) => {
  const tags = await prisma.tag.findMany({ orderBy: { name: 'asc' } })
  res.json({ tags })
})

router.get('/:name', async (req, res) => {
  const tag = await prisma.tag.findFirst({ where: { slug: req.params.name } })
  if (!tag) return res.status(404).json({ error: 'Not found' })
  const resources = await prisma.resource.findMany({ where: { deletedAt: null, status: 'APPROVED', tags: { some: { tagId: tag.id } } }, include: { category: true, tags: { include: { tag: true } }, _count: { select: { upvotes: true, comments: true } } }, orderBy: { createdAt: 'desc' } })
  res.json({ tag, resources })
})

export default router
