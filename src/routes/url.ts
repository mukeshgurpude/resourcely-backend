import { Router } from 'express'
import { hash, compare } from '@utils/hash'
import { UrlModel } from '@models'
import { EXPIRE_TIME } from '@utils/constants'


const urlRouter = Router()

urlRouter.route('/')
  .get((_, res) => {
    res.status(200).send('Url shortener function')
  })
  .post((req, res) => {
    const { original_url, password } = req.body
    if (!original_url) {
      return res.status(400).json({error: 'Missing original_url'})
    }
    const hashed_password = password ? hash(password) : null

    return UrlModel.create({
      ...res.locals.resource_metadata,
      password: hashed_password,
      original_url,
      expires_at: new Date(new Date().getTime() + EXPIRE_TIME)
    }).then(response => {
      return res.status(201).json({
        original_url: response.original_url,
        shortcode: response.shortcode
      })
    }).catch(error => res.status(500).json({ error }))
  })

urlRouter.get('/:code', async (req, res) => {
  const { code } = req.params
  const { mode } = req.query

  const url = await UrlModel.findOne({shortcode: code})
  if (!url) {
    return res.status(404).json({ error: 'URL not found' })
  }
  let allowed = false
  if (url.password === null) allowed = true
  else {
    const { password } = req.headers
    if (!password) return res.status(401).json({ error: 'Missing password' })
    allowed = compare((password as string), url.password)
  }

  if (allowed) {
    switch(mode) {
    case 'redirect':
      return res.status(302).redirect(url.original_url)
    case 'text':
      return res.status(200).send(url.original_url)
    default:
      return res.status(200).json({ original_url: url.original_url })
    }
  }
  // Not allowed: Wrong password
  return res.status(401).json({ error: 'Wrong password' })
})

export default urlRouter
