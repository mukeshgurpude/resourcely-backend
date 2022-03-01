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
  const parts = file.split('-')
  if (parts.length === 4 && name_to_date(file) > Date.now()) return
  unlink(`${folder}/${file}`, (err) => err && console.log(err))
}

/**
 * Decode a filename to its expiry timestamp.
 * @param {string} filename
 * @returns {number} unix timestamp
 */
function name_to_date(filename) {
  const [end,] = filename.split('-').reverse()
  const [timestamp,] = end.split('.')
  return Number(timestamp)
}

export { folder, name_to_date, remove_if_expired }
