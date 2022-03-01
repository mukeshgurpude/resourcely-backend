import { config } from 'dotenv'
import { unlink } from 'fs'
config()


const folder = process.env.UPLOAD_FOLDER || 'uploads'

/**
   * Remove a file, if it has expired.
   * @param {string} file path to file
   */
function remove_if_expired(file) {
  if (!file) return
  if (name_to_date(file) < Date.now()) {
    unlink(`${folder}/${file}`, (err) => {
      if (err) console.log('Error removing file', err)
    })
  }
}

/**
 * Decode a filename to its expiry timestamp.
 * @param {string} filename
 * @returns {number} unix timestamp
 */
function name_to_date(filename) {
  const [, end] = filename.split('-')
  const [timestamp,] = end.split('.')
  return Number(timestamp)
}

export { folder, name_to_date, remove_if_expired }
