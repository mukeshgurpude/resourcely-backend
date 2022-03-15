import { before } from 'mocha'
import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'
import app from '@src/app'
import { mock_db } from '@models'
import { BASE_PATHS } from '@utils/constants'

const text = `
import sys

if __name__ == '__main__':
  print('Arguments', ' '.join(sys.argv[1:]))
`
const language = 'python'
const password = '12345678'
const title = 'Sample title'
const base_request = { url: `/api/v1${BASE_PATHS.text}`, status: 200 }

chai.use(chaiHttp)

suite('Text content tests', () => {
  before(mock_db)
  suite('Invalid requests', () => {
    test('Malformed text content', async () => {
      return chai.request(app)
        .post(base_request.url)
        .send({ title })
        .then(res => {
          assert.ok(res)
          assert.isTrue(res.badRequest)
          assert.property(res.body, 'error')
        })
    })
    test('Title is required', async () => {
      return chai.request(app)
        .post(base_request.url)
        .send({ text })
        .then(res => {
          assert.isTrue(res.badRequest, 'Should reject requests with no title')
        })
    })
    test('Non existent resource', async () => {
      return chai.request(app)
        .get(`${base_request.url}/non-existent`)
        .then(res => {
          assert.ok(res)
          assert.isTrue(res.notFound)
        })
    })
  })
  suite('Passwordless text uploader', () => {
    let shortcode !: string
    test('Able to upload text without encryption', async () => {
      return chai.request(app)
        .post(base_request.url)
        .send({ text, language, title })
        .then(res => {
          assert.ok(res)
          assert.property(res.body, 'shortcode')
          shortcode = res.body.shortcode
        })
    })
    test('Details are stored correctly', async () => {
      return chai.request(app)
        .get(`${base_request.url}/${shortcode}`)
        .then(res => {
          assert.ok(res)
          assert.propertyVal(res.body, 'text', text)
          assert.propertyVal(res.body, 'language', language)
        })
    })
  })

  suite('Passworded text uploader', () => {
    let shortcode !: string
    test('Able to upload text with encryption', async () => {
      return chai.request(app)
        .post(base_request.url)
        .send({ text, language, password, title })
        .then(res => {
          assert.ok(res)
          assert.property(res.body, 'shortcode')
          shortcode = res.body.shortcode
        })
    })
    test('Rejects request with no password', async () => {
      return chai.request(app)
        .get(`${base_request.url}/${shortcode}`)
        .then(res => {
          assert.ok(res)
          assert.isTrue(res.unauthorized)
        })
    })
    test('Rejects incorrect password', async () => {
      return chai.request(app)
        .get(`${base_request.url}/${shortcode}`)
        .set('password', 'wrong_password')
        .then(res => {
          assert.ok(res)
          assert.isTrue(res.unauthorized)
        })
    })
    test('Details are stored correctly', async () => {
      return chai.request(app)
        .get(`${base_request.url}/${shortcode}`)
        .set('password', password)
        .then(res => {
          assert.ok(res)
          assert.propertyVal(res.body, 'text', text)
          assert.propertyVal(res.body, 'language', language)
        })
    })
  })
})
