import { Router } from 'express'
import store_file, { combine_name_time } from '@src/middlewares/store-file'
import uploader from '@utils/uploader'
import { ImageModel } from '@models'
import { save_metadata } from '@src/middlewares/metadata'
import { hash } from '@utils/hash'
import { EXPIRE_TIME } from '@utils/constants'
import logger from '@src/utils/logger'

const imageRouter = Router()

imageRouter.route('/')
  .get((_, res) => res.status(200).end())
  .post(uploader.any(), save_metadata, (req, res, next) => {
    if (!req.files.length) {
      return res.status(400).json({error: 'No file uploaded'})
    }
    let uploaded_file = req.files[0]

    for (let i = 0; i < req.files.length; i++) {
      if (req.files[i].fieldname === 'image') {
        uploaded_file = req.files[i]
        break
      }
    }
    if (uploaded_file.fieldname !== 'image' || !uploaded_file.mimetype.startsWith('image/')) {
      return res.status(400).json({error: 'No image file uploaded'})
    }

    const { password } = req.body
    if (!uploaded_file) {
      res.status(400).json({ error: 'Missing image' })
      return next()
    }
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
    })
      .then(({shortcode}) => void res.status(201).json({ shortcode }))
      .catch(error => {
        res.status(500).json({ error })
        res.locals.after_upload.new_filename = combine_name_time(req.file.path, Date.now())
      })
      .finally(next)
  }, store_file)

export default imageRouter
