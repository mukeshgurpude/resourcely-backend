import express from 'express'
import helmet from 'helmet'
import apiRouter from './routes'
import { config } from 'dotenv'

config()

const app = express()

if (process.env.NODE_ENV === 'production') app.use(helmet())
app.use(express.text())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/api', apiRouter)
app.get('/status', (req, res) => {
  res.status(200).send('Ok')
})

export default app
