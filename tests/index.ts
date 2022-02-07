import app from '../src/app'
import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'

chai.use(chaiHttp)

suite('Server sets up successfully', () => {
  test('Server is running', done => {
    chai
      .request(app)
      .get('/status')
      .then(res => {
        assert.ok(res)
        assert.strictEqual(res.status, 200)
        assert.strictEqual(res.text, 'Ok')
      })
      .then(done)
      .catch(done)
  })
})
