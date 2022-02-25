const BASE_PATHS = {
  shortner: '/shortner'
}

const SHORTCODE_PREFIXES = {
  url: 'u',
  text: 't'
}

// Expire after 5 minutes (5m * 60s * 1000ms)
const EXPIRE_TIME = 1000*60*5

export { BASE_PATHS, EXPIRE_TIME, SHORTCODE_PREFIXES }
