/*
  See https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html
  Source: https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/File_Upload_Cheat_Sheet.md
*/

import multer, { diskStorage, FileFilterCallback } from 'multer'
import { Request } from 'express'
import { config } from 'dotenv'
import generate_id from './random'
import separate_extension from './name'
import { HARMFUL_EXTENSIONS, HARMFUL_MIMETYPES } from '@utils/constants'
config()

// Storage configuration
const storage = diskStorage({
  destination: process.env.UPLOAD_FOLDER || 'uploads/',

  filename: function(_, file, cb) {
    const { ext, name } = separate_extension(file.originalname)
    const timestamp = Date.now()
    const id = generate_id()  // Random id, as to tackle potential collisions

    // Format -> name-timestamp-id.ext --> Universally unique identifier
    cb(null, `${name}-${timestamp}-${id}.${ext}`)
  }
})

const fileFilter: IFileFilter = function(_, file, cb) {
  const { ext } = separate_extension(file.originalname)
  if (HARMFUL_EXTENSIONS.includes(ext)) return cb(new Error('Invalid file extension'))
  if (HARMFUL_MIMETYPES.includes(file.mimetype)) return cb(new Error('Invalid file type'))
  cb(null, true)
}

const uploader = multer({ fileFilter, storage, limits: {
  fileSize: parseInt(process.env.MAX_FILE_SIZE) || 1024*1024*5, // 5 MB
  files: 1 // Only one file at a time
}})
export default uploader


interface IFileFilter {
  (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void
}
