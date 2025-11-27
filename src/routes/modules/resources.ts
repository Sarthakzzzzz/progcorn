import { Router } from 'express'
import { prisma } from '../../services/db'
import { z } from 'zod'
import { requireAuth } from '../../middleware/auth'

const router = Router()

const resourceCreate = z.object({
  title: z.string().min(3),
  url: z.string().url(),
  description: z.string().min(10),
  categoryId: z.string(),
  imageUrl: z.string().url().optional().or(z.literal('').transform(() => undefined)),
  tags: z.array(z.string()).default([])
})

router.get('/', async (req, res) => {
  const { q, tag, categoryId, sort } = req.query as any
  const where: any = { deletedAt: null, status: 'APPROVED' }
  if (q) where.OR = [
    { title: { contains: q, mode: 'insensitive' } },
    { description: { contains: q, mode: 'insensitive' } }
  ]
  if (categoryId) where.categoryId = String(categoryId)
  if (tag) where.tags = { some: { tag: { slug: String(tag) } } }
  const orderBy: any = sort === 'newest' ? { createdAt: 'desc' } : { upvotes: { _count: 'desc' } }
  const resources = await prisma.resource.findMany({
    where,
    orderBy,
    include: { category: true, tags: { include: { tag: true } }, _count: { select: { upvotes: true, comments: true } } }
  })
  res.json({ resources })
})

router.get('/:id', async (req: any, res) => {
  const r = await prisma.resource.findUnique({ where: { id: req.params.id }, include: { category: true, tags: { include: { tag: true } }, _count: { select: { upvotes: true, comments: true } } } })
  if (!r || r.deletedAt) return res.status(404).json({ error: 'Not found' })
  // Check user upvote status if auth
  let userUpvoted = false
  if (req.user?.id) {
    const up = await prisma.upvote.findFirst({ where: { resourceId: r.id, userId: req.user.id } })
    userUpvoted = !!up
  }
  res.json({ resource: r, userUpvoted })
})

router.post('/', requireAuth, async (req: any, res, next) => {
  try {
    const data = resourceCreate.parse(req.body)
    const created = await prisma.resource.create({
      data: {
        title: data.title,
        url: data.url,
        description: data.description,
        authorId: req.user.id,
        categoryId: data.categoryId,
        // imageUrl is added in a later migration; cast to any to avoid type issues pre-migrate
        ...(data.imageUrl ? ({ imageUrl: data.imageUrl } as any) : {}),
        status: 'PENDING',
        tags: { create: data.tags.map((t) => ({ tag: { connect: { id: t } } })) }
      }
    })
    res.status(201).json({ resource: created })
  } catch (e) { next(e) }
})

router.put('/:id', requireAuth, async (req: any, res, next) => {
  try {
    const data = resourceCreate.partial().parse(req.body)
    const updated = await prisma.resource.update({ where: { id: req.params.id }, data: data as any })
    res.json({ resource: updated })
  } catch (e) { next(e) }
})

router.delete('/:id', requireAuth, async (req: any, res) => {
  await prisma.resource.update({ where: { id: req.params.id }, data: { deletedAt: new Date() } })
  res.json({ ok: true })
})

// Toggle upvote: if exists -> remove; else -> create
router.post('/:id/upvote', requireAuth, async (req: any, res, next) => {
  try {
    const where = { resourceId: req.params.id, userId: req.user.id }
    const existing = await prisma.upvote.findFirst({ where })
    if (existing) {
      await prisma.upvote.deleteMany({ where })
      const c = await prisma.upvote.count({ where: { resourceId: req.params.id } })
      return res.json({ upvoted: false, count: c })
    } else {
      await prisma.upvote.create({ data: where })
      const c = await prisma.upvote.count({ where: { resourceId: req.params.id } })
      return res.json({ upvoted: true, count: c })
    }
  } catch (e) { next(e) }
})

router.get('/:id/comments', async (req, res) => {
  const comments = await prisma.comment.findMany({ where: { resourceId: req.params.id }, include: { user: { select: { id: true, username: true } } }, orderBy: { createdAt: 'asc' } })
  res.json({ comments })
})

router.post('/:id/comments', requireAuth, async (req: any, res, next) => {
  try {
    const schema = z.object({ content: z.string().min(1) })
    const { content } = schema.parse(req.body)
    const comment = await prisma.comment.create({ data: { content, userId: req.user.id, resourceId: req.params.id } })
    res.status(201).json({ comment })
  } catch (e) { next(e) }
})

router.post('/:id/report', requireAuth, async (req: any, res, next) => {
  try {
    const schema = z.object({ reason: z.string().min(3) })
    const { reason } = schema.parse(req.body)
    const report = await prisma.report.create({ data: { reason, userId: req.user.id, resourceId: req.params.id } })
    res.status(201).json({ report })
  } catch (e) { next(e) }
})

export default router
