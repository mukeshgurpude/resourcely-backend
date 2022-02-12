import { connect, connection } from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import Url from './url'


export async function mock_db() {
  return MongoMemoryServer.create()
    .then(async (instance) => {
      // Connect only if not already connected
      if (connection.readyState === 0) {
        await connect(instance.getUri(), {dbName: 'resourcely-test'})
      }
    })
}

export { Url as UrlModel }
