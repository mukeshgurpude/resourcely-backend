import { connect } from 'mongoose'
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
export { Url as UrlModel }
