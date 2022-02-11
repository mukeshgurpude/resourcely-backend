import { Router } from 'express'
import urlRouter from './url-shortner'
import BASE_PATHS from '@utils/base_paths'

const apiRouter = Router()

apiRouter.use(BASE_PATHS.shortner, urlRouter)

export default apiRouter
