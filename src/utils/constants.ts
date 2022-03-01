const BASE_PATHS = {
  shortener: '/shortener',
  text: '/text',
  image: '/image'
}

const SHORTCODE_PREFIXES = { url: 'u', text: 't', image: 'i' }

// Expire after 5 minutes (5m * 60s * 1000ms)
const EXPIRE_TIME = 1000*60*5

const HARMFUL_MIMETYPES = []
const HARMFUL_EXTENSIONS = []

export { BASE_PATHS, EXPIRE_TIME, HARMFUL_EXTENSIONS, HARMFUL_MIMETYPES, SHORTCODE_PREFIXES }
