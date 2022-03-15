import { Router } from 'express'
import urlRouter from './url'
import textRouter from './text'
import imageRouter from './image'
import fileRouter from './file'
import { BASE_PATHS } from '@utils/constants'

const apiRouter = Router()

apiRouter.use(BASE_PATHS.shortener, urlRouter)
apiRouter.use(BASE_PATHS.text, textRouter)
apiRouter.use(BASE_PATHS.image, imageRouter)
apiRouter.use(BASE_PATHS.file, fileRouter)

export default apiRouter
