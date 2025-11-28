import { Router } from 'express'
import { prisma } from '../../services/db'
import { requireAdmin, requireAuth } from '../../middleware/auth'

const router = Router()

router.use(requireAuth, requireAdmin)

router.get('/resources', async (req, res) => {
  const status = (req.query.status as string) || 'PENDING'
  const resources = await prisma.resource.findMany({
    where: { status: status as any },
    include: { reports: true, category: true, tags: { include: { tag: true } }, author: { select: { id: true, username: true } } },
    orderBy: { createdAt: 'desc' }
  })
  res.json({ resources })
})

router.delete('/resource/:id', async (req, res) => {
  await prisma.resource.update({ where: { id: req.params.id }, data: { deletedAt: new Date() } })
  await prisma.adminAction.create({ data: { adminId: (req as any).user.id, action: 'DELETE_RESOURCE', targetId: req.params.id } })
  res.json({ ok: true })
})

router.get('/reports', async (_req, res) => {
  const reports = await prisma.report.findMany({ where: { status: 'PENDING' }, include: { resource: true, user: true } })
  res.json({ reports })
})

router.post('/resource/:id/approve', async (req, res) => {
  const updated = await prisma.resource.update({ where: { id: req.params.id }, data: { status: 'APPROVED', approvedAt: new Date(), approvedBy: (req as any).user.id } })
  await prisma.adminAction.create({ data: { adminId: (req as any).user.id, action: 'APPROVE_RESOURCE', targetId: req.params.id } })
  res.json({ resource: updated })
})

router.post('/resource/:id/reject', async (req, res) => {
  const updated = await prisma.resource.update({ where: { id: req.params.id }, data: { status: 'REJECTED', approvedAt: null, approvedBy: (req as any).user.id } })
  await prisma.adminAction.create({ data: { adminId: (req as any).user.id, action: 'REJECT_RESOURCE', targetId: req.params.id } })
  res.json({ resource: updated })
})

// Announcements CRUD
router.get('/announcements', async (_req, res) => {
  const items = await prisma.announcement.findMany({ orderBy: { createdAt: 'desc' } })
  res.json({ announcements: items })
})

router.post('/announcements', async (req, res) => {
  const { title, url, published } = req.body || {}
  if (!title) return res.status(400).json({ error: 'title required' })
  const created = await prisma.announcement.create({ data: { title, url: url ? url : null, published: !!published } })
  await prisma.adminAction.create({ data: { adminId: (req as any).user.id, action: 'CREATE_ANNOUNCEMENT', targetId: created.id } })
  res.status(201).json({ announcement: created })
})

router.put('/announcements/:id', async (req, res) => {
  const { title, url, published } = req.body || {}
  const updated = await prisma.announcement.update({ where: { id: req.params.id }, data: { title, url: url === '' ? null : url, published } })
  await prisma.adminAction.create({ data: { adminId: (req as any).user.id, action: 'UPDATE_ANNOUNCEMENT', targetId: req.params.id } })
  res.json({ announcement: updated })
})

router.delete('/announcements/:id', async (req, res) => {
  await prisma.announcement.delete({ where: { id: req.params.id } })
  await prisma.adminAction.create({ data: { adminId: (req as any).user.id, action: 'DELETE_ANNOUNCEMENT', targetId: req.params.id } })
  res.json({ ok: true })
})

// Categories CRUD
router.get('/categories', async (_req, res) => {
  const items = await prisma.category.findMany({ orderBy: { name: 'asc' } })
  res.json({ categories: items })
})

router.post('/categories', async (req, res) => {
  const { name, slug } = req.body || {}
  if (!name || !slug) return res.status(400).json({ error: 'name and slug required' })
  try {
    const created = await prisma.category.create({ data: { name, slug } })
    await prisma.adminAction.create({ data: { adminId: (req as any).user.id, action: 'CREATE_CATEGORY', targetId: created.id } })
    return res.status(201).json({ category: created })
  } catch (e: any) {
    if (e?.code === 'P2002') return res.status(409).json({ error: 'Category name or slug must be unique' })
    throw e
  }
})

router.put('/categories/:id', async (req, res) => {
  const { name, slug } = req.body || {}
  try {
    const updated = await prisma.category.update({ where: { id: req.params.id }, data: { name, slug } })
    await prisma.adminAction.create({ data: { adminId: (req as any).user.id, action: 'UPDATE_CATEGORY', targetId: req.params.id } })
    return res.json({ category: updated })
  } catch (e: any) {
    if (e?.code === 'P2002') return res.status(409).json({ error: 'Category name or slug must be unique' })
    throw e
  }
})

router.delete('/categories/:id', async (req, res) => {
  await prisma.category.delete({ where: { id: req.params.id } })
  await prisma.adminAction.create({ data: { adminId: (req as any).user.id, action: 'DELETE_CATEGORY', targetId: req.params.id } })
  res.json({ ok: true })
})

// Tags CRUD
router.get('/tags', async (_req, res) => {
  const items = await prisma.tag.findMany({ orderBy: { name: 'asc' } })
  res.json({ tags: items })
})

router.post('/tags', async (req, res) => {
  const { name, slug } = req.body || {}
  if (!name || !slug) return res.status(400).json({ error: 'name and slug required' })
  try {
    const created = await prisma.tag.create({ data: { name, slug } })
    await prisma.adminAction.create({ data: { adminId: (req as any).user.id, action: 'CREATE_TAG', targetId: created.id } })
    return res.status(201).json({ tag: created })
  } catch (e: any) {
    if (e?.code === 'P2002') return res.status(409).json({ error: 'Tag name or slug must be unique' })
    throw e
  }
})

router.put('/tags/:id', async (req, res) => {
  const { name, slug } = req.body || {}
  try {
    const updated = await prisma.tag.update({ where: { id: req.params.id }, data: { name, slug } })
    await prisma.adminAction.create({ data: { adminId: (req as any).user.id, action: 'UPDATE_TAG', targetId: req.params.id } })
    return res.json({ tag: updated })
  } catch (e: any) {
    if (e?.code === 'P2002') return res.status(409).json({ error: 'Tag name or slug must be unique' })
    throw e
  }
})

// Bulk actions for resources (support both /resources/bulk and /resource/bulk)
router.post(['/resources/bulk','/resource/bulk'], async (req, res) => {
  const { ids, action } = req.body || {}
  if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: 'ids required' })
  if (!['APPROVE','REJECT','DELETE'].includes(String(action))) return res.status(400).json({ error: 'invalid action' })
  if (action === 'DELETE') {
    await prisma.resource.updateMany({ where: { id: { in: ids } }, data: { deletedAt: new Date() } })
    await prisma.adminAction.create({ data: { adminId: (req as any).user.id, action: 'BULK_DELETE_RESOURCE', meta: JSON.stringify({ ids }) } })
  } else if (action === 'APPROVE') {
    await prisma.resource.updateMany({ where: { id: { in: ids } }, data: { status: 'APPROVED', approvedAt: new Date(), approvedBy: (req as any).user.id } })
    await prisma.adminAction.create({ data: { adminId: (req as any).user.id, action: 'BULK_APPROVE_RESOURCE', meta: JSON.stringify({ ids }) } })
  } else if (action === 'REJECT') {
    await prisma.resource.updateMany({ where: { id: { in: ids } }, data: { status: 'REJECTED', approvedAt: null, approvedBy: (req as any).user.id } })
    await prisma.adminAction.create({ data: { adminId: (req as any).user.id, action: 'BULK_REJECT_RESOURCE', meta: JSON.stringify({ ids }) } })
  }
  res.json({ ok: true })
})

router.delete('/tags/:id', async (req, res) => {
  await prisma.tag.delete({ where: { id: req.params.id } })
  await prisma.adminAction.create({ data: { adminId: (req as any).user.id, action: 'DELETE_TAG', targetId: req.params.id } })
  res.json({ ok: true })
})

export default router
