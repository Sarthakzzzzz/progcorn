import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import { json } from 'express'
import { router as apiRouter } from './routes'
import { errorHandler } from './middleware/error'

const app = express()
app.use(helmet())
app.use(cors({ origin: true, credentials: true }))
app.use(morgan('dev'))
app.use(json({ limit: '1mb' }))

app.get('/health', (_req, res) => res.json({ ok: true }))
app.use('/', apiRouter)
app.use(errorHandler)

const port = process.env.PORT ? Number(process.env.PORT) : 4000
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
})
