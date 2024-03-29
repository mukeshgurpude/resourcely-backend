import { model, models } from 'mongoose'
import { SHORTCODE_PREFIXES } from '@utils/constants'
import IImage from '@ctypes/image'
import schema_factory from './base'

const image_schema = schema_factory<IImage>({
  image_path: { type: String, required: true }
}, SHORTCODE_PREFIXES.image)

const Image = models.Image || model<IImage>('Image', image_schema)
export default Image
