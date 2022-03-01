import { RequestHandler } from 'express'
import { rename } from 'fs'
import separate_extension from '@utils/name'

/** Middleware to upload files in specific format */
const store_file: RequestHandler = function(_, res, next) {
  const { filename, expire_time } = res.locals.after_upload
  const { ext, name } = separate_extension(filename)

  const expire_time_ms = to_unix(expire_time)

  // Append expire_time to filename
  const new_name = `${name}-${expire_time_ms}.${ext}`
  rename(filename, new_name, next)
}

/** Convert date or string to UNIX Timestamp */
function to_unix(time: Date|number|string): number {
  if (time instanceof Date ) return time.getTime()
  return Number(time)
}

export default store_file
export { to_unix }
