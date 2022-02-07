import express from 'express'

const app = express()

app.get('/status', (req, res) => {
  res.status(200).send('Ok')
})

export default app
