import { model, models } from 'mongoose'
import schema_factory from './base'
import IFile from '@ctypes/file'
import { SHORTCODE_PREFIXES } from '@src/utils/constants'

const file_schema = schema_factory<IFile>({
  path: { type: String, required: true },
  name: String,
  type: { type: String, required: true }
}, SHORTCODE_PREFIXES.file)

const File = models.File || model<IFile>('File', file_schema)
export default File
