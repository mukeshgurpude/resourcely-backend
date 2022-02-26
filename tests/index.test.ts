import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'
import app from '@src/app'
import { BASE_PATHS } from '@utils/constants'

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
  }, ...Object.keys(BASE_PATHS).map(path => {
    return {
      path: `/api/v1${BASE_PATHS[path]}`,
      message: `${path} is up and running`
    }
  })]

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
