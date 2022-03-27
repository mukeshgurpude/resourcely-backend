import { connect, connection } from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { logger } from '@utils/index'
import Url from './url'
import Text from './text'
import Image from './image'
import File from './file'


export async function mock_db() {
  return MongoMemoryServer.create()
    .then(async (instance) => {
      /* istanbul ignore else */
      if (connection.readyState === 0) { // Connect only if not already connected
        await connect(instance.getUri(), {dbName: 'resourcely-test'})
      }
    })
}

/* istanbul ignore next */
export default async function connect_db() {
  return connect(process.env.MONGO_URL)
    .catch(err => {
      logger.error('Error connecting to MongoDB... Find more details below')
      logger.info('*'.repeat(50))
      logger.error(err)
      logger.info('*'.repeat(50))
      process.exit(1)
    })
}

export { File as FileModel, Image as ImageModel, Text as TextModel, Url as UrlModel }
