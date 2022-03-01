#!/usr/bin/env node
import { config } from 'dotenv'
import { readdirSync } from 'fs'
import { folder, remove_if_expired } from './utils.mjs'
config()

let files = readdirSync(folder, { withFileTypes: true, encoding: 'utf8' }) // Read folder contents
  .filter(f => f.isFile())
  .map(f => f.name)
console.log(`Found ${files.length} files...`)

files.forEach(remove_if_expired)
// TODO: Count number of removed files
