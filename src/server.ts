import { connect } from 'mongoose'
import app from './app'


console.debug('Connecting to MongoDB...')
connect_db()
  .then(() => {
    console.debug('Connected to MongoDB\nStarting server...')
    app.listen(process.env.PORT || 3000, function() {
      console.log(`Server is running on port ${this.address().port}`)
    })
  })
  .catch(() => {
    // Directly exit if we can't connect to Database
    process.exit(1)
  })

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
