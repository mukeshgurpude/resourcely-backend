import IUrl from '@ctypes/url'
import { model, models } from 'mongoose'
import schema_factory from './base'

const urlSchema = schema_factory<IUrl>({
  original_url: { type: String, required: true }
})

// If model already exists, don't recreate it (for testing)
const Url = models.Url || model<IUrl>('Url', urlSchema)

export default Url
