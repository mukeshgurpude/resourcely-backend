import { RequestHandler } from 'express'
import { rename, unlink } from 'fs'
import separate_extension from '@utils/name'

/** Middleware to upload files in specific format */
const store_file: RequestHandler = function(_, res, next) {
  if (res.locals.delete_file) {
    return res.locals.delete_array.forEach((file:string) => unlink(file, err => err && console.error(err)))
  }
  const { new_filename, old_filename } = res.locals.after_upload
  rename(old_filename, new_filename, next)
}

/** Convert date or string to UNIX Timestamp */
function to_unix(time: Date|number|string): number {
  if (time instanceof Date ) return time.getTime()
  return Number(time)
}

function combine_name_time(filename:string, expire_time:number) {
  const { ext, name } = separate_extension(filename)
  return `${name}-${expire_time}.${ext}`
}

export default store_file
export { combine_name_time, to_unix }
