import { readdirSync } from 'fs'
import { before } from 'mocha'
import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'
import { BASE_PATHS, UPLOAD_FOLDER } from '@utils/constants'
import { mock_db } from '@models'
import app from '@src/app'

const password = '123456'

chai.use(chaiHttp)
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
      const initial = valid_uploads()
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

    test('Non existent file',async () => {
      return chai.request(app)
        .get(`/api/v1${BASE_PATHS.image}/non-existent`)
        .then(res => {
          assert.isTrue(res.notFound)
          assert.property(res, 'error')
        })
    })
  })

  suite('Unencrypted upload', () => {
    let shortcode!: string
    test('Upload image', async () => {
      let initial = valid_uploads()
      return chai.request(app)
        .post(`/api/v1${BASE_PATHS.image}`)
        .field('title', 'test')
        .attach('image', 'tests/assets/test.png')
        .then(res => {
          assert.ok(res)
          assert.strictEqual(++initial, valid_uploads())
          assert.property(res.body, 'shortcode')
          shortcode = res.body.shortcode
        })
    })
    test('File is served properly', async () => {
      return chai.request(app)
        .get(`/api/v1${BASE_PATHS.image}/${shortcode}`)
        .then(res => {
          assert.ok(res)
          assert.strictEqual(res.type, 'image/png')
        })
    })
    test('Metadata is rendered properly', async () => {
      return chai.request(app)
        .get(`/api/v1${BASE_PATHS.image}/${shortcode}?meta=true`)
        .then(res => {
          assert.ok(res)
          assert.strictEqual(res.type, 'application/json')
          assert.property(res.body, 'title')
        })
    })
  })

  suite('Encrypted upload', () => {
    let shortcode!: string
    test('Upload image', async () => {
      let initial = valid_uploads()
      return chai.request(app)
        .post(`/api/v1${BASE_PATHS.image}`)
        .field('title', 'test')
        .field('password', password)
        .attach('image', 'tests/assets/test.png')
        .then(res => {
          assert.ok(res)
          assert.strictEqual(++initial, valid_uploads())
          assert.property(res.body, 'shortcode')
          shortcode = res.body.shortcode
        })
    })
    test('File is protected', async () => {
      return chai.request(app)
        .get(`/api/v1${BASE_PATHS.image}/${shortcode}`)
        .then(res => {
          assert.ok(res)
          assert.isTrue(res.unauthorized)
        })
    })
    test('Rejects wrong password', async () => {
      return chai.request(app)
        .get(`/api/v1${BASE_PATHS.image}/${shortcode}`)
        .set('password', 'wrong')
        .then(res => {
          assert.ok(res)
          assert.isTrue(res.unauthorized)
        })
    })
    test('File is served properly', async () => {
      return chai.request(app)
        .get(`/api/v1${BASE_PATHS.image}/${shortcode}`)
        .set('password', password)
        .then(res => {
          assert.ok(res)
          assert.strictEqual(res.type, 'image/png')
        })
    })
    test('Metadata is rendered properly', async () => {
      return chai.request(app)
        .get(`/api/v1${BASE_PATHS.image}/${shortcode}?meta=true`)
        .set('password', password)
        .then(res => {
          assert.ok(res)
          assert.strictEqual(res.type, 'application/json')
          assert.property(res.body, 'title')
        })
    })
  })
})

function valid_uploads() {
  const files = readdirSync(UPLOAD_FOLDER, {withFileTypes: true})
    .filter(dirent => dirent.isFile())
  return files.filter(file => file.name.split('-').length === 4).length
}
