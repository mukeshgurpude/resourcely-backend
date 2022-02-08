import { Router } from 'express'

const urlRouter = Router()

urlRouter
  .route('/')
  .get((req, res) => {
    res.status(200).send('Url shortner function')
  })

export default urlRouter
