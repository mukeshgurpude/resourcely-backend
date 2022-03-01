import { RequestHandler } from 'express'
import { rename } from 'fs'
import separate_extension from '@src/utils/name'

const store_file: RequestHandler = function(_, res, next) {
  const { filename, expire_time } = res.locals.after_upload
  const { ext, name } = separate_extension(filename)
  const new_name = `${name}-${expire_time}.${ext}`

  rename(filename, new_name, next)
}

export default store_file
