import type { Request, Response, NextFunction } from 'express'
import type { ZodSchema } from 'zod'

export function validate(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = ['POST', 'PUT', 'PATCH'].includes(req.method) ? req.body : req.query
    const result = schema.safeParse(data)
    if (!result.success) {
      return res.status(400).json({ error: 'Invalid payload', issues: result.error.issues })
    }
    next()
  }
}
