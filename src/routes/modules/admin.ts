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

export default router
