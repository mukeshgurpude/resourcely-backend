import app from './app'

app.listen(process.env.PORT || 3000, function() {
  console.log(`Server is running on port ${this.address().port}`)
})
