import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import { json } from 'express'
import { router as apiRouter } from './routes'
import { errorHandler } from './middleware/error'
import cron from 'node-cron'
import { fetchAndUpsertClistContests } from './services/clist'
import { fetchAndUpsertClistResources } from './services/clist-resources'
const app = express()
app.use(helmet())
app.use(cors({ origin: true, credentials: true }))
app.use(morgan('dev'))
app.use(json({ limit: '1mb' }))

app.get('/health', (_req, res) => res.json({ ok: true }))
app.use('/', apiRouter)
app.use(errorHandler)

const port = process.env.PORT ? Number(process.env.PORT) : 4000

app.listen(port, async () => {
  console.log(`API listening on http://localhost:${port}`)
  if (process.env.NODE_ENV !== 'test' && process.env.CLIST_DISABLE_SCHEDULER !== 'true' &&
      process.env.CLIST_USERNAME && process.env.CLIST_API_KEY) {
      try {await fetchAndUpsertClistResources({limit : 500})} catch (err) {console.warn('Platform import failed', err)}
      cron.schedule('0 * * * *', async () => {
        try {
          const res = await fetchAndUpsertClistResources({ limit: 500 })
          console.log('Clist platforms scheduled refresh done', res)
        } catch (err) {
          console.warn('Clist platforms scheduled refresh failed', err)
        }
      })
    try {
      const res = await fetchAndUpsertClistContests({ upcoming: true, limit: 200 })
      console.log('Clist initial import complete', res)
    } catch (err) {
      console.warn('Clist initial import failed', err)
    }
    cron.schedule('0 * * * *', async () => {
      try {
        const res = await fetchAndUpsertClistContests({ upcoming: true, limit: 200 })
        console.log('Clist scheduled refresh done', res)
      } catch (err) {
        console.warn('Clist scheduled refresh failed', err)
      }
    })
  }
})
