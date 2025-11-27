import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface JwtUser { id: string; role: 'USER' | 'ADMIN'; username: string }

export function requireAuth(req: Request & { user?: JwtUser }, res: Response, next: NextFunction) {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' })
  const token = auth.slice(7)
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev') as JwtUser
    req.user = payload
    return next()
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

export function requireAdmin(req: Request & { user?: JwtUser }, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' })
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' })
  next()
}
