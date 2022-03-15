import { config } from 'dotenv'
import { configure, getLogger, Logger } from 'log4js'
import is_test_env from 'is-test-env'

config()

// Type of log4js.Logger
configure({
  appenders: {
    console: { type: 'console' },
    file: { type: 'file', filename: 'logs/log.log' }
  },
  categories: {
    default: { appenders: ['console', 'file'], level: 'ALL' },
    file_logger: { appenders: ['file'], level: 'ALL' }
  }
})

let logger!: Logger
/* istanbul ignore next */
if (process.env.NODE_ENV === 'production' || is_test_env()) {
  logger = getLogger('file_logger') // Use file logger in production and mocha tests
} else {
  logger = getLogger('default') // In development log to console and file both
}

export default logger
