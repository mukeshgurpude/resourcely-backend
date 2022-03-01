#!/usr/bin/env node
import { config } from 'dotenv'
import { readdirSync, unlink } from 'fs'
config()

let count = 0

/**
 * Remove a file, if it has expired.
 * @param {string} file path to file
 */
function remove_if_expired(file) {
  if (name_to_date(file) < Date.now()) {
    unlink(`${folder}/${file}`, (err) => {
      if (err) console.error('Error removing file', err)
      else count += 1
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

const folder = process.env.UPLOAD_FOLDER || 'uploads'
const files = readdirSync(folder)

files.forEach(remove_if_expired)
console.log(`Removed ${count} files`)
