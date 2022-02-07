import express from 'express'

const app = express()
app.use(express.text())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/status', (req, res) => {
  res.status(200).send('Ok')
})

export default app
