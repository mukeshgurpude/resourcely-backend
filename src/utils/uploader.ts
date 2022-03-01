import multer, { diskStorage } from 'multer'
import { config } from 'dotenv'
import generate_id from './random'
config()

// Storage configuration
const storage = diskStorage({
  destination: process.env.UPLOAD_FOLDER || 'uploads/',

  filename: function(_, file, cb) {
    // Word after last dot is file extension, others contribute to name
    const [ext, ...rest] = file.originalname.split('.').reverse()
    const name = rest.reverse().join('.') // Reverse to get original order
    const timestamp = Date.now()
    const id = generate_id()  // Random id, as to tackle potential collisions

    // Format -> name-timestamp-id.ext --> Universally unique identifier
    cb(null, `${name}-${timestamp}-${id}.${ext}`)
  }
})

const uploader = multer({ storage })
export default uploader
