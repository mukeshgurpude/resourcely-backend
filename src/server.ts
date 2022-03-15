import connect_db from '@models'
import app from './app'
import { logger } from '@utils/index'


logger.debug('Connecting to MongoDB...')
connect_db()
  .then(() => {
    logger.debug('Connected to MongoDB --> Starting server...')
    app.listen(process.env.PORT || 3000, function() {
      logger.info(`Server is running on port ${this.address().port}`)
    })
  })
