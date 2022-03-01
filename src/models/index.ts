import { connect, connection } from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import Url from './url'
import Text from './text'
import Image from './image'


export async function mock_db() {
  return MongoMemoryServer.create()
    .then(async (instance) => {
      /* istanbul ignore else */
      if (connection.readyState === 0) { // Connect only if not already connected
        await connect(instance.getUri(), {dbName: 'resourcely-test'})
      }
    })
}

export { Image as ImageModel, Text as TextModel, Url as UrlModel }
