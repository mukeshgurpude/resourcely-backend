import connect_db from './models'
import app from './app'

console.debug('Connecting to MongoDB...')
connect_db()
  .then(() => {
    console.debug('Connected to MongoDB\nStarting server...')
    app.listen(process.env.PORT || 3000, function() {
      console.log(`Server is running on port ${this.address().port}`)
    })
  })
