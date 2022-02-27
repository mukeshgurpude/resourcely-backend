import { Router } from 'express'
import { hash, compare } from '@utils/hash'
import { TextModel } from '@models'
import { EXPIRE_TIME } from '@utils/constants'
import { save_metadata } from '@src/middlewares/metadata'

const textRouter = Router()

textRouter.route('/')
  .get((_, res) => res.status(200).end())
  .post(save_metadata, (req, res) => {
    const { language, text, password } = req.body
    if (!text) {
      return res.status(400).json({error: 'Missing text content'})
    }
    const hashed_password = password ? hash(password) : null
    return TextModel.create({
      ...res.locals.resource_metadata,
      password: hashed_password,
      text, language,
      expires_at: new Date(new Date().getTime() + EXPIRE_TIME)
    })
      .then(({shortcode}) => res.status(201).json({ shortcode }))
      .catch(error => res.status(500).json({ error }))
  })

textRouter.get('/:code', async (req, res) => {
  const { code } = req.params

  const doc = await TextModel.findOne({shortcode: code})
  if (!doc) {
    return res.status(404).json({
      error: 'URL not found'
    })
  }
  let allowed = false
  if (doc.password === null) allowed = true
  else {
    const { password } = req.headers
    if (!password) return res.status(401).json({ error: 'Missing password' })
    allowed = compare((password as string), doc.password)
  }

  if (allowed) {
    return res.status(200).json({text: doc.text, language: doc.language})
  }

  // Not allowed: Wrong password
  return res.status(401).json({ error: 'Wrong password' })
})

export default textRouter
