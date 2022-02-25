import { Router } from 'express'
import urlRouter from './url'
import { BASE_PATHS } from '@src/utils/constants'

const apiRouter = Router()

apiRouter.use(BASE_PATHS.shortener, urlRouter)

export default apiRouter
