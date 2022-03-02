import { config } from 'dotenv'
config()

const BASE_PATHS = {
  shortener: '/shortener',
  text: '/text',
  image: '/image',
  file: '/file'
}

const SHORTCODE_PREFIXES = { url: 'u', text: 't', image: 'i', file: 'f' }

// Expire after 5 minutes (5m * 60s * 1000ms)
const EXPIRE_TIME = 1000*60*5

const HARMFUL_MIMETYPES = []
const HARMFUL_EXTENSIONS = []

/* istanbul ignore next */
const UPLOAD_FOLDER = process.env.UPLOAD_FOLDER || 'uploads'

export { BASE_PATHS, EXPIRE_TIME, HARMFUL_EXTENSIONS, HARMFUL_MIMETYPES, SHORTCODE_PREFIXES, UPLOAD_FOLDER }
