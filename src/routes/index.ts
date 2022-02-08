import { Router } from 'express'
import urlRouter from './url-shortner'

const apiRouter = Router()

apiRouter.use('/shortner', urlRouter)

export default apiRouter
