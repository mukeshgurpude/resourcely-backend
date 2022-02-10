import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'
import BASE_PATHS from '@utils/base_paths'
import app from '@src/app'

const original_url = 'http://localhost:8000'
const password = '12345678'
let shortcode1 !: string, shortcode2 !: string

const base_request = {
  url: `/api/v1${BASE_PATHS.shortner}`,
  status: 200,
  mode: 'json'
}

chai.use(chaiHttp)
suite('Url shortner tests', () => {
  suite('Invalid requests', () => {
    test('Malformed url shortening', async () => {
      return chai.request(app)
        .post(base_request.url)
        .send({})
        .then(res => {
          assert.ok(res)
          assert.isTrue(res.badRequest)
          assert.property(res.body, 'error')
        })
    })
    test('Non-existent',async () => {
      return chai.request(app)
        .get(`${base_request.url}/non-existens`)
        .then(res => {
          assert.ok(res)
          assert.isTrue(res.notFound)
        })
    })
  })
  suite('Passwordless urls', () => {
    test('Able to shorten urls without encryption', async () => {
      return chai.request(app)
        .post(`/api/v1${BASE_PATHS.shortner}`)
        .send({ original_url })
        .then(res => {
          assert.ok(res)
          assert.propertyVal(res.body, 'original_url', original_url)
          assert.property(res.body, 'shortcode')
          shortcode1 = res.body.shortcode
        })
    })
    test('Get correct responses for passwordless urls',async () => {
      const requests = [
        base_request,
        {...base_request, status: 302, mode: 'redirect'},
        {...base_request, mode: 'text'}
      ]
      return Promise.all(
        requests.map(async request => {
          return chai.request(app)
            .get(`${request.url}/${shortcode1}?mode=${request.mode}`)
            .redirects(0)
            .then(res => {
              assert.equal(res.status, request.status)
              request.mode === 'redirect' && assert.equal(res.header.location, original_url)
              request.mode === 'text' && assert.equal(res.text, original_url)
              request.mode === 'json' && assert.equal(res.body.original_url, original_url)
            })
        })
      )
    })
  })

  suite('Encrypted urls', () => {
    test('Able to shorten urls with password', async () => {
      return chai.request(app)
        .post(`/api/v1${BASE_PATHS.shortner}`)
        .send({ original_url, password })
        .then(res => {
          assert.ok(res)
          assert.propertyVal(res.body, 'original_url', original_url)
          assert.property(res.body, 'shortcode')
          shortcode2 = res.body.shortcode
        })
    })
    test('Fails to get resource without password', async () => {
      return chai.request(app)
        .get(`${base_request.url}/${shortcode2}`)
        .then(res => {
          assert.isTrue(res.unauthorized)
        })
    })
    test('Handles wrong password', async () => {
      return chai.request(app)
        .get(`${base_request.url}/${shortcode2}`)
        .set('password', 'wrong_password')
        .then(res => {
          assert.ok(res)
          assert.isTrue(res.unauthorized)
        })
    })
    test('Sends data for correct password', async () => {
      return chai.request(app)
        .get(`${base_request.url}/${shortcode2}`)
        .set('password', password)
        .then(res => {
          assert.ok(res)
          assert.equal(res.status, 200)
        })
    })
  })
})
