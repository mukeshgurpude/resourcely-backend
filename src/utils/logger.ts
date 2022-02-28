import { config } from 'dotenv'
import { configure, getLogger, Logger } from 'log4js'

config()

configure({
  appenders: {
    console: {type: 'console'},
    file_logger: {type: 'file', filename: 'logs/log.log'}
  },
  categories: {
    default: {appenders: ['console'], level: 'ALL'},
    file_logger: {appenders: ['file_logger'], level: 'ALL'}
  }
})

let logger!: Logger
/* istanbul ignore next */
if (process.env.NODE_ENV === 'production' || is_mocha_env()) {
  logger = getLogger('file_logger')
} else {
  logger = getLogger('default')
}

export default logger

/* istanbul ignore next */
export function is_mocha_env(): boolean {
  if (process.env.NODE_ENV) return process.env.NODE_ENV === 'test'
  try {
    if (typeof suite === 'function') return true
  } catch {
    return false
  }
}
