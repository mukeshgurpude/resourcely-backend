// TODO: Setup module aliases
import app from '../src/app'
import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'
import BASE_PATHS from '../src/utils/base_paths'

chai.use(chaiHttp)

type Path = {
  path: string
  message: string
  text ?: string
  json ?: object
}

suite('Check status of servers', () => {
  const paths: Path[] = [{
    path: '/status',
    message: 'Server is up and running',
    text: 'Ok'
  }, {
    path: `/api/v1${BASE_PATHS.shortner}`,
    message: 'Url shortner is responding'
  }]

  paths.forEach(p => {
    test(p.message, async () => {
      return chai.request(app)
        .get(p.path)
        .then(res => {
          assert.ok(res)
          assert.strictEqual(res.status, 200)
          p.text && assert.strictEqual(res.text, p.text)
          p.json && assert.deepEqual(res.body, p.json)
        })
    })
  })
})
