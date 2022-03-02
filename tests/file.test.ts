import { readdirSync } from 'fs'
import { before } from 'mocha'
import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'
import { BASE_PATHS, UPLOAD_FOLDER } from '@utils/constants'
import { mock_db } from '@models'
import app from '@src/app'

const password = '123456'

chai.use(chaiHttp)
const url = `/api/v1${BASE_PATHS.file}`
suite('File uploader API', () => {
  before(mock_db)
  suite('Malformed requests', () => {
    test('Title is required', async () => {
      return chai.request(app)
        .post(url)
        .attach('file', 'tests/assets/test.pdf')
        .then(res => {
          assert.ok(res)
          assert.isTrue(res.badRequest)
        })
    })

    test('No files', async() => {
      return chai.request(app)
        .post(url)
        .field('title', 'test')
        .then(res => {
          assert.ok(res)
          assert.isTrue(res.badRequest)
        })
    })

    test('Invalid file input', async () => {
      const initial = valid_uploads()
      return chai.request(app)
        .post(url)
        .field('title', 'test')
        .attach('image', 'tests/assets/test.pdf')
        .then(res => {
          assert.ok(res)
          assert.isTrue(res.badRequest)
          assert.strictEqual(initial, valid_uploads())
        })
    })

    test('Non existent file',async () => {
      return chai.request(app)
        .get(`${url}/non-existent`)
        .then(res => {
          assert.isTrue(res.notFound)
          assert.property(res, 'error')
        })
    })

  })

  suite('Unencrypted upload', () => {
    let shortcode!: string
    test('Upload file', async () => {
      const initial = valid_uploads()
      return chai.request(app)
        .post(url)
        .field('title', 'test file')
        .attach('file', 'tests/assets/test.pdf')
        .then(res => {
          assert.isTrue(res.ok)
          assert.strictEqual(initial + 1, valid_uploads())
          assert.property(res.body, 'shortcode')
          shortcode = res.body.shortcode
        })
    })
    test('File is served properly', async () => {
      return chai.request(app)
        .get(`${url}/${shortcode}`)
        .then(res => {
          assert.ok(res)
          assert.strictEqual(res.type, 'application/pdf')
        })
    })
    test('Metadata is rendered properly', async () => {
      return chai.request(app)
        .get(`${url}/${shortcode}?meta=true`)
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
      const initial = valid_uploads()
      return chai.request(app)
        .post(url)
        .field('title', 'test')
        .field('password', password)
        .attach('file', 'tests/assets/test.pdf')
        .then(res => {
          assert.ok(res)
          assert.strictEqual(initial + 1, valid_uploads())
          assert.property(res.body, 'shortcode')
          shortcode = res.body.shortcode
        })
    })
    test('File is protected', async () => {
      return chai.request(app)
        .get(`${url}/${shortcode}`)
        .then(res => {
          assert.ok(res)
          assert.isTrue(res.unauthorized)
        })
    })
    test('Rejects wrong password', async () => {
      return chai.request(app)
        .get(`${url}/${shortcode}`)
        .set('password', 'wrong')
        .then(res => {
          assert.ok(res)
          assert.isTrue(res.unauthorized)
        })
    })
    test('File is served properly', async () => {
      return chai.request(app)
        .get(`${url}/${shortcode}`)
        .set('password', password)
        .then(res => {
          assert.ok(res)
          assert.strictEqual(res.type, 'application/pdf')
        })
    })
    test('Metadata is rendered properly', async () => {
      return chai.request(app)
        .get(`${url}/${shortcode}?meta=true`)
        .set('password', password)
        .then(res => {
          assert.ok(res)
          assert.strictEqual(res.type, 'application/json')
          assert.property(res.body, 'title')
        })
    })
  })
})

// TODO: Move to a separate file
function valid_uploads() {
  const files = readdirSync(UPLOAD_FOLDER, {withFileTypes: true})
    .filter(dirent => dirent.isFile())
  return files.filter(file => file.name.split('-').length === 4).length
}
