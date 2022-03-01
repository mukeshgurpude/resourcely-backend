import { readdirSync } from 'fs'
import { before } from 'mocha'
import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'
import { BASE_PATHS, UPLOAD_FOLDER } from '@utils/constants'
import { mock_db } from '@models'
import app from '@src/app'

const password = '123456'

chai.use(chaiHttp)
let initial = valid_uploads()
suite('Image uploader API', () => {
  before(mock_db)
  suite('Malformed requests', () => {
    test('Title is required', async () => {
      return chai.request(app)
        .post(`/api/v1${BASE_PATHS.image}`)
        .attach('image', 'tests/assets/test.png')
        .then(res => {
          assert.ok(res)
          assert.isTrue(res.badRequest)
        })
    })

    test('No files', async() => {
      return chai.request(app)
        .post(`/api/v1${BASE_PATHS.image}`)
        .field('title', 'test')
        .then(res => {
          assert.ok(res)
          assert.isTrue(res.badRequest)
        })
    })

    test('Invalid file input', async () => {
      return chai.request(app)
        .post(`/api/v1${BASE_PATHS.image}`)
        .field('title', 'test')
        .attach('file', 'tests/assets/test.png')
        .then(res => {
          assert.ok(res)
          assert.isTrue(res.badRequest)
          assert.strictEqual(initial, valid_uploads())
        })
    })
  })

  suite('Unencrypted upload', () => {
    let shortcode!: string
    test('Upload image', async () => {
      return chai.request(app)
        .post(`/api/v1${BASE_PATHS.image}`)
        .field('title', 'test')
        .attach('image', 'tests/assets/test.png')
        .then(res => {
          assert.ok(res)
          assert.isTrue(res.ok)
          assert.strictEqual(++initial, valid_uploads())
          assert.property(res.body, 'shortcode')
          shortcode = res.body.shortcode
        })
    })
  })

  suite('Encrypted upload', () => {
    let shortcode!: string
    test('Upload image', async () => {
      return chai.request(app)
        .post(`/api/v1${BASE_PATHS.image}`)
        .field('title', 'test')
        .field('password', password)
        .attach('image', 'tests/assets/test.png')
        .then(res => {
          assert.ok(res)
          assert.isTrue(res.ok)
          assert.strictEqual(++initial, valid_uploads())
          assert.property(res.body, 'shortcode')
          shortcode = res.body.shortcode
        })
    })
  })
})

function valid_uploads() {
  const files = readdirSync(UPLOAD_FOLDER, {withFileTypes: true})
    .filter(dirent => dirent.isFile())
  return files.filter(file => file.name.split('-').length === 4).length
}
