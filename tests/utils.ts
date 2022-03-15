import { readdirSync } from 'fs'
import { UPLOAD_FOLDER } from '@utils/constants'

export function valid_uploads() {
  const files = readdirSync(UPLOAD_FOLDER, {withFileTypes: true})
    .filter(dirent => dirent.isFile())
  return files.filter(file => file.name.split('-').length === 4).length
}
