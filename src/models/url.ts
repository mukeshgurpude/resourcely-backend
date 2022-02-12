import IUrl from '@ctypes/url'
import { model } from 'mongoose'
import schema_factory from './base'

const urlSchema = schema_factory<IUrl>({
  original_url: { type: String, required: true }
})

const Url = model<IUrl>('Url', urlSchema)

export default Url
