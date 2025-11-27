import { Router } from 'express'
import auth from './modules/auth'
import resources from './modules/resources'
import tags from './modules/tags'
import categories from './modules/categories'
import collections from './modules/collections'
import admin from './modules/admin'
import search from './modules/search'
import stats from './modules/stats'

export const router = Router()

router.use('/auth', auth)
router.use('/resources', resources)
router.use('/tags', tags)
router.use('/categories', categories)
router.use('/collections', collections)
router.use('/admin', admin)
router.use('/search', search)
router.use('/stats', stats)
