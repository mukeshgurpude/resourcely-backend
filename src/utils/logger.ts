import { config } from 'dotenv'
import { configure, getLogger, Logger } from 'log4js'

config()

// Type of log4js.Logger
configure({
  appenders: {
    console: { type: 'console' },
    file_logger: { type: 'file', filename: 'logs/log.log' }
  },
  categories: {
    default: { appenders: ['console'], level: 'ALL' },
    file_logger: { appenders: ['file_logger'], level: 'ALL' }
  }
})

let logger!: Logger
/* istanbul ignore next */
if (process.env.NODE_ENV === 'production' || is_mocha_env()) {
  logger = getLogger('file_logger') // Use file logger in production and mocha tests
} else {
  logger = getLogger('default') // In development log to console
}

export default logger

/* istanbul ignore next */
export function is_mocha_env(): boolean {
  // Check if we're running in TEST or CI environment
  if (process.env.NODE_ENV) return process.env.NODE_ENV === 'test'
  try {
    // Mocha defines global suite function
    if (typeof suite === 'function') return true
  } catch {
    return false
  }
}
