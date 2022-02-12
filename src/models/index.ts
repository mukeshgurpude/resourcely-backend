import { connect } from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import Url from './url'

export default async function connect_db() {
  return connect(process.env.MONGO_URL)
    .catch(err => {
      console.error('Error connecting to MongoDB... Find more details below')
      console.log('*'.repeat(50))
      console.error(err)
      console.log('*'.repeat(50))
      process.exit(1)
    })
}

export async function mock_db() {
  return MongoMemoryServer.create()
    .then(async (instance) => {
      await connect(instance.getUri(), {dbName: 'resourcely-test'})
    })
}

export { Url as UrlModel }
