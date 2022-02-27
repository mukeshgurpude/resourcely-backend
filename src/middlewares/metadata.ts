import { RequestHandler } from 'express'

export const save_metadata: RequestHandler = function(req, res, next) {
  const { title, description } = req.body

  if (!title) {
    return res.status(400).json({error: 'Title is required'})
  }

  res.locals.resource_metadata = { title, description }
  next()
}
