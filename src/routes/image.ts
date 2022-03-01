import { Router } from 'express'

const imageRouter = Router()

imageRouter.route('/')
  .get((req, res) => {
    res.status(200).end()
  })

export default imageRouter
