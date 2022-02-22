import { Router } from 'express'
import urlRouter from './url-shortner'
import { BASE_PATHS } from '@src/utils/constants'

const apiRouter = Router()

apiRouter.use(BASE_PATHS.shortner, urlRouter)

export default apiRouter
