import { connect, connection } from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import Url from './url'
import Text from './text'


export async function mock_db() {
  return MongoMemoryServer.create()
    .then(async (instance) => {
      // Connect only if not already connected
      if (connection.readyState === 0) {
        await connect(instance.getUri(), {dbName: 'resourcely-test'})
      }
    })
}

export { Text as TextModel, Url as UrlModel }
