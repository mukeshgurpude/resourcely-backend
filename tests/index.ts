// TODO: Setup module aliases
import app from '../src/app'
import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'

chai.use(chaiHttp)

suite('Check status of servers', () => {
  test('Server is running', async () => {
    return chai
      .request(app)
      .get('/status')
      .then(res => {
        assert.ok(res)
        assert.strictEqual(res.status, 200)
        assert.strictEqual(res.text, 'Ok')
      })
  })
  test('Url shortner is active', async () => {
    return chai
      .request(app)
      .get('/api/shortner')
      .then(res => {
        assert.ok(res)
        assert.strictEqual(res.status, 200)
      })
  })
})
