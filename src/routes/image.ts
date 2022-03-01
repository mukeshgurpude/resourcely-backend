import { Router } from 'express'
import store_file, { combine_name_time } from '@src/middlewares/store-file'
import uploader from '@utils/uploader'
import { ImageModel } from '@models'
import { save_metadata } from '@src/middlewares/metadata'
import { hash, compare } from '@utils/hash'
import { EXPIRE_TIME } from '@utils/constants'

const imageRouter = Router()

imageRouter.route('/')
  .get((_, res) => res.status(200).end())
  .post(uploader.any(), save_metadata, (req, res, next) => {
    res.locals.delete_file = true
    res.locals.delete_array = []

    if (req.files.length === 0) {
      res.status(400).json({error: 'No file uploaded'})
      return next()
    }
    const uploaded_file = req.files[0]
    if (uploaded_file.fieldname !== 'image' || !uploaded_file.mimetype.startsWith('image/')) {
      res.status(400).json({error: 'No image file uploaded'})
      for (let i = 0; i < req.files.length; i++)
        res.locals.delete_array.push(req.files[i].path)
      return next()
    }

    const { password } = req.body
    const hashed_password = password ? hash(password) : null
    const expire_time = new Date(Date.now() + EXPIRE_TIME)

    res.locals.after_upload = {
      old_filename: uploaded_file.path,
      new_filename: combine_name_time(uploaded_file.path, expire_time.getTime())
    }

    return ImageModel.create({
      ...res.locals.resource_metadata,
      password: hashed_password,
      image_path: res.locals.after_upload.new_filename,
      expires_at: expire_time
    }).then(({shortcode}) => {
      res.status(201).json({ shortcode })
      res.locals.delete_file = false
    }).catch(error => {
      res.status(500).json({ error })
      res.locals.delete_file = true
      res.locals.delete_array = [req.file.path]
    }).finally(next)
  }, store_file)

imageRouter.get('/:shortcode', async (req, res) => {
  const { shortcode } = req.params
  const { meta } = req.query
  const doc = await ImageModel.findOne({shortcode})
  if (!doc) {
    return res.status(404).json({ error: 'Image not found' })
  }

  let allowed = false
  if (doc.password === null) allowed = true
  else {
    const { password } = req.headers
    if (!password) return res.status(401).json({ error: 'Missing password' })
    allowed = compare((password as string), doc.password)
  }
  if (allowed) {
    if (meta) {
      return res.json({title: doc.title, description: doc.description})
    }
    return res.sendFile(doc.image_path, {root: '.'})
  }
  return res.status(401).json({ error: 'Wrong password' })
})

export default imageRouter
