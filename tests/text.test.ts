import { before } from 'mocha'
import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'
import app from '@src/app'
import { mock_db } from '@models'
import { BASE_PATHS } from '@src/utils/constants'

const text = `
import sys

if __name__ == '__main__':
  print('Arguments', ' '.join(sys.argv[1:]))
`
const password = '12345678'
const base_request = { url: `/api/v1${BASE_PATHS.text}`, status: 200}

chai.use(chaiHttp)

suite('Text content tests', () => {
  before(mock_db)
  suite('Invalid requests', () => {
    test('Malformed text content', async () => {
      return chai.request(app)
        .post(base_request.url)
        .send({})
        .then(res => {
          assert.ok(res)
          assert.isTrue(res.badRequest)
          assert.property(res.body, 'error')
        })
    })
  })
})
