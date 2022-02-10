import BASE_PATHS from '../src/utils/base_paths'
import app from '../src/app'
import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'

const original_url = 'http://localhost:8000'
const password = '12345678'
let shortcode !: string

const base_request = {
  url: `/api/v1${BASE_PATHS.shortner}`,
  status: 200,
  mode: 'json'
}

chai.use(chaiHttp)
suite('Url shortner tests', () => {
  suite('Passwordless urls', () => {
    test('Able to shorten urls without encryption', async () => {
      return chai.request(app)
        .post(`/api/v1${BASE_PATHS.shortner}`)
        .send({original_url})
        .then(res => {
          assert.ok(res)
          assert.propertyVal(res.body, 'original_url', original_url)
          assert.property(res.body, 'shortcode')
          shortcode = res.body.shortcode
        })
    })
    test('Get correct responses for passwordless urls',async () => {
      const requests = [
        base_request, {
          ...base_request,
          status: 302,
          mode: 'redirect'
        }, {
          ...base_request,
          mode: 'text'
        }]
      return Promise.all(
        requests.map(async request => {
          return chai.request(app)
            .get(`${request.url}/${shortcode}?mode=${request.mode}`)
            .then(res => {
              console.log(request.url + '/' + shortcode)
              assert.equal(res.status, request.status)
              console.log(request.mode, res.header)
              request.mode === 'redirect' && assert.equal(res.header.location, original_url)
              request.mode === 'text' && assert.equal(res.text, original_url)
              request.mode === 'json' && assert.equal(res.body.original_url, original_url)
            })
        })
      )
    })
  })
})
