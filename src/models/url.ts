import { model, models } from 'mongoose'
import IUrl from '@ctypes/url'
import schema_factory from './base'
import { SHORTCODE_PREFIXES } from '@src/utils/constants'

const urlSchema = schema_factory<IUrl>({
  original_url: { type: String, required: true }
}, {}, SHORTCODE_PREFIXES.url)

// If model already exists, don't recreate it (for testing)
const Url = models.Url || model<IUrl>('Url', urlSchema)

export default Url
