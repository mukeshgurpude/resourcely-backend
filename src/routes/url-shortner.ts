import { Router } from 'express'
import UrlModel from '../../types/url'
import { hash, compare } from '../utils/hash'

// TODO: Temparily use array to store the data
const urls: UrlModel[] = []

const urlRouter = Router()

urlRouter.route('/')
  .get((req, res) => {
    res.status(200).send('Url shortner function')
  })
  .post((req, res) => {
    const { original_url, password } = req.body
    if (!original_url) {
      return res.status(400).send('Missing original_url')
    }
    const hashed_password = password ? hash(password) : null
    const id = new Date().getTime().toString()
    urls.push({
      _id: id,
      password: hashed_password,
      original_url,
      shortcode: id
    })
    return res.status(201).json({
      original_url,
      shortcode: id
    })
  })

urlRouter.get('/:code', (req, res) => {
  const { code } = req.params
  const { mode } = req.query
  const url = urls.find(u => u.shortcode === code)
  if (!url) {
    return res.status(404).json({
      error: 'URL not found'
    })
  }
  let allowed = false
  if (url.password === null) allowed = true
  else {
    console.log(req.headers)
    const { password } = req.headers
    if (!password) return res.status(401).json({
      error: 'Missing password'
    })
    allowed = compare((password as string), url.password)
  }
  
  if (allowed) {
    switch(mode) {
    case 'redirect':
      return res.status(302).redirect(url.original_url)
    case 'text':
      return res.status(200).send(url.original_url)
    default:
      return res.status(200).json({
        original_url: url.original_url
      })
    }
  }
  // Not allowed: Wrong password
  return res.status(401).json({
    error: 'Wrong password'
  })

})

export default urlRouter
