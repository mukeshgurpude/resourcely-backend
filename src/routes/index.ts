import { Router } from 'express'
import urlRouter from './url'
import textRouter from './text'
import imageRouter from './image'
import { BASE_PATHS } from '@src/utils/constants'

const apiRouter = Router()

apiRouter.use(BASE_PATHS.shortener, urlRouter)
apiRouter.use(BASE_PATHS.text, textRouter)
apiRouter.use(BASE_PATHS.image, imageRouter)

export default apiRouter
