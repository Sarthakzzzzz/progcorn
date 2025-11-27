import { Router } from 'express'
import { prisma } from '../../services/db'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { requireAuth } from '../../middleware/auth'

const router = Router()

const registerSchema = z.object({
  username: z.string().min(3).max(32),
  email: z.string().email(),
  password: z.string().min(8),
})

router.post('/register', async (req, res, next) => {
  try {
    const parsed = registerSchema.parse(req.body)
    const exists = await prisma.user.findFirst({ where: { OR: [{ email: parsed.email }, { username: parsed.username }] } })
    if (exists) return res.status(409).json({ error: 'User already exists' })
    const passwordHash = await bcrypt.hash(parsed.password, 10)
    const user = await prisma.user.create({ data: { username: parsed.username, email: parsed.email, passwordHash } })
    const token = jwt.sign({ id: user.id, role: user.role, username: user.username }, process.env.JWT_SECRET || 'dev', { expiresIn: '7d' })
    res.status(201).json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } })
  } catch (e) { next(e) }
})

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(8) })

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body)
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
    const token = jwt.sign({ id: user.id, role: user.role, username: user.username }, process.env.JWT_SECRET || 'dev', { expiresIn: '7d' })
    res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } })
  } catch (e) { next(e) }
})

router.get('/me', requireAuth, async (req: any, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { id: true, username: true, email: true, role: true } })
  res.json({ user })
})

export default router
