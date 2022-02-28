import express from 'express'
import helmet from 'helmet'
import { connectLogger } from 'log4js'
import apiRouter from '@routes/index'
import { config } from 'dotenv'
import logger from '@utils/logger'

config()

const app = express()

app.use(connectLogger(logger, {level: 'auto'}))
/* istanbul ignore if */
if (process.env.NODE_ENV === 'production') app.use(helmet())
app.use(express.text())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/api/v1', apiRouter)
app.get('/status', (req, res) => {
  res.status(200).send('Ok')
})

export default app
