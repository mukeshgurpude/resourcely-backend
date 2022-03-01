import multer, { diskStorage } from 'multer'
import { config } from 'dotenv'
import generate_id from './random'
import separate_extension from './name'
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

const uploader = multer({ storage })
export default uploader
